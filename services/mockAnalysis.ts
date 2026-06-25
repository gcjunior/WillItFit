import { normalizeAnalysisResult } from '../utils/analysis';
import { AnalysisResult } from '../types/analysis';

const MOCK_RESULT: AnalysisResult = {
  bubbleWrapItems: ['Glass vase', 'TV', 'Picture frames', 'Ceramic lamp'],
  recommendedTruck: {
    name: '10ft Box Truck',
    width: 6,
    height: 6,
    depth: 10,
  },
  requiredBoxes: [
    {
      id: 'box-1',
      label: 'Living room — large',
      w: 2,
      h: 1.5,
      d: 1.5,
      position: [0, 0, 0],
    },
    {
      id: 'box-2',
      label: 'Kitchen — medium',
      w: 1.5,
      h: 1.5,
      d: 1.5,
      position: [2, 0, 0],
    },
    {
      id: 'box-3',
      label: 'Bedroom — tall',
      w: 1.5,
      h: 2,
      d: 1.5,
      position: [0, 1.5, 0],
    },
    {
      id: 'box-4',
      label: 'Office — small',
      w: 1.5,
      h: 1,
      d: 1.5,
      position: [3.5, 0, 0],
    },
  ],
};

export async function getMockAnalysis(): Promise<AnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return normalizeAnalysisResult(MOCK_RESULT);
}
