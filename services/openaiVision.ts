import * as ImageManipulator from 'expo-image-manipulator';

import { IMAGE_MAX_WIDTH, OPENAI_MODEL } from '../constants/config';
import { AnalysisResult } from '../types/analysis';
import { normalizeAnalysisResult } from '../utils/analysis';

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
1. List every fragile item that needs bubble wrap in bubbleWrapItems.
2. Estimate how many cardboard boxes are needed; for each box provide label, dimensions (w, h, d in feet), and a suggested packing position [x, y, z] inside the truck cargo area (origin = back-left-bottom, stack back to front).
3. Recommend a rental truck in recommendedTruck with name (e.g. "10ft Box Truck") and interior cargo width, height, depth in feet.`;

async function compressImage(base64: string): Promise<string> {
  const uri = `data:image/jpeg;base64,${base64}`;
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: IMAGE_MAX_WIDTH } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );

  if (!result.base64) {
    return base64;
  }

  return result.base64;
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
              text: 'Analyze these room photos and return the moving plan JSON.',
            },
            ...compressedImages.map((image) => ({
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
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
