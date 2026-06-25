export type RequiredBox = {
  id: string;
  label: string;
  w: number;
  h: number;
  d: number;
  position: [number, number, number];
  color?: string;
};

export type RecommendedTruck = {
  name: string;
  width: number;
  height: number;
  depth: number;
};

export type AnalysisResult = {
  bubbleWrapItems: string[];
  recommendedTruck: RecommendedTruck;
  requiredBoxes: RequiredBox[];
};
