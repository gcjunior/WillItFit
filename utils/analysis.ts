import { BOX_COLORS } from '../constants/config';
import { AnalysisResult, RequiredBox } from '../types/analysis';

export function assignBoxColors(boxes: RequiredBox[]): RequiredBox[] {
  return boxes.map((box, index) => ({
    ...box,
    color: box.color ?? BOX_COLORS[index % BOX_COLORS.length],
  }));
}

export function clampBoxPositions(result: AnalysisResult): AnalysisResult {
  const { width, height, depth } = result.recommendedTruck;

  return {
    ...result,
    requiredBoxes: result.requiredBoxes.map((box) => ({
      ...box,
      position: [
        Math.max(0, Math.min(box.position[0], depth - box.d)),
        Math.max(0, Math.min(box.position[1], height - box.h)),
        Math.max(0, Math.min(box.position[2], width - box.w)),
      ] as [number, number, number],
    })),
  };
}

export function normalizeAnalysisResult(result: AnalysisResult): AnalysisResult {
  const clamped = clampBoxPositions(result);
  return {
    ...clamped,
    requiredBoxes: assignBoxColors(clamped.requiredBoxes),
  };
}
