import { Canvas } from '@react-three/fiber/native';
import { StyleSheet, View } from 'react-native';

import { AnalysisResult } from '../../types/analysis';
import { PackingBox } from './PackingBox';
import { TruckContainer } from './TruckContainer';
import { useOrbitControls } from './useOrbitControls';

type TruckCanvasProps = {
  result: AnalysisResult;
  currentStep: number;
};

function Scene({ result, currentStep }: TruckCanvasProps) {
  const { recommendedTruck, requiredBoxes } = result;

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <TruckContainer truck={recommendedTruck} />
      {requiredBoxes.map((box, index) => (
        <PackingBox
          key={box.id}
          box={box}
          stepIndex={index}
          currentStep={currentStep}
          truckDepth={recommendedTruck.depth}
          truckWidth={recommendedTruck.width}
        />
      ))}
    </>
  );
}

export function TruckCanvas({ result, currentStep }: TruckCanvasProps) {
  const [OrbitControls, events] = useOrbitControls();
  const maxDimension = Math.max(
    result.recommendedTruck.width,
    result.recommendedTruck.height,
    result.recommendedTruck.depth,
  );

  return (
    <View style={styles.container} {...events}>
      <Canvas
        camera={{
          position: [maxDimension * 1.2, maxDimension, maxDimension * 1.5],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <OrbitControls />
        <Scene result={result} currentStep={currentStep} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
