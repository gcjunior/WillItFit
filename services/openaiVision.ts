import * as ImageManipulator from 'expo-image-manipulator';

import { IMAGE_MAX_WIDTH, OPENAI_MODEL } from '../constants/config';
import { AnalysisResult } from '../types/analysis';
import { normalizeAnalysisResult } from '../utils/analysis';
import { formatScaleContextForPrompt, getImageScaleAtDistance } from '../utils/cameraScale';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const ANALYSIS_JSON_SCHEMA = {
  type: 'object',
  properties: {
    bubbleWrapItems: {
      type: 'array',
      items: { type: 'string' },
    },
    recommendedTruck: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        width: { type: 'number' },
        height: { type: 'number' },
        depth: { type: 'number' },
      },
      required: ['name', 'width', 'height', 'depth'],
      additionalProperties: false,
    },
    requiredBoxes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
          w: { type: 'number' },
          h: { type: 'number' },
          d: { type: 'number' },
          position: {
            type: 'array',
            items: { type: 'number' },
            minItems: 3,
            maxItems: 3,
          },
        },
        required: ['id', 'label', 'w', 'h', 'd', 'position'],
        additionalProperties: false,
      },
    },
  },
  required: ['bubbleWrapItems', 'recommendedTruck', 'requiredBoxes'],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `Analyze these images of household items. Return JSON only matching the schema.
Photos are taken from a fixed subject distance of 1 meter. You will receive per-image scale data (feet per pixel) derived from that distance and the camera field of view.
1. Measure each item's pixel width, height, and depth cues in the images.
2. Convert pixel extents to feet using the provided scale (feet per pixel). Depth estimates may use relative proportions when only one face is visible.
3. List every fragile item that needs bubble wrap in bubbleWrapItems.
4. Estimate how many cardboard boxes are needed; for each box provide label, dimensions (w, h, d in feet), and a suggested packing position [x, y, z] inside the truck cargo area (origin = back-left-bottom, stack back to front).
5. Recommend a rental truck in recommendedTruck with name (e.g. "10ft Box Truck") and interior cargo width, height, depth in feet.`;

type CompressedImage = {
  base64: string;
  width: number;
  height: number;
};

async function compressImage(base64: string): Promise<CompressedImage> {
  const uri = `data:image/jpeg;base64,${base64}`;
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: IMAGE_MAX_WIDTH } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );

  return {
    base64: result.base64 ?? base64,
    width: result.width,
    height: result.height,
  };
}

export async function analyzeRoomPhotos(base64Images: string[]): Promise<AnalysisResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OpenAI API key. Add EXPO_PUBLIC_OPENAI_API_KEY to your .env file.');
  }

  if (base64Images.length === 0) {
    throw new Error('Add at least one photo before analyzing.');
  }

  const compressedImages = await Promise.all(base64Images.map(compressImage));
  const scaleContexts = compressedImages.map((image) =>
    getImageScaleAtDistance(image.width, image.height),
  );
  const scalePrompt = formatScaleContextForPrompt(scaleContexts);

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze these room photos and return the moving plan JSON.\n\n${scalePrompt}`,
            },
            ...compressedImages.map((image) => ({
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image.base64}`,
              },
            })),
          ],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'moving_analysis',
          strict: true,
          schema: ANALYSIS_JSON_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI returned an empty response.');
  }

  const parsed = JSON.parse(content) as AnalysisResult;
  return normalizeAnalysisResult(parsed);
}
