import { useFrame } from '@react-three/fiber/native';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { RequiredBox } from '../../types/analysis';

type PackingBoxProps = {
  box: RequiredBox;
  stepIndex: number;
  currentStep: number;
  truckDepth: number;
  truckWidth: number;
};

function getBoxCenter(box: RequiredBox): [number, number, number] {
  const [x, y, z] = box.position;
  return [x + box.d / 2, y + box.h / 2, z + box.w / 2];
}

function getStagingCenter(box: RequiredBox, truckDepth: number, truckWidth: number): [number, number, number] {
  return [truckDepth + 2 + box.d / 2, box.h / 2, truckWidth / 2];
}

export function PackingBox({ box, stepIndex, currentStep, truckDepth, truckWidth }: PackingBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const placedCenter = useMemo(() => new THREE.Vector3(...getBoxCenter(box)), [box]);
  const stagingCenter = useMemo(
    () => new THREE.Vector3(...getStagingCenter(box, truckDepth, truckWidth)),
    [box, truckDepth, truckWidth],
  );

  const isVisible = stepIndex < currentStep;
  const isAnimating = stepIndex === currentStep - 1;

  useFrame((_, delta) => {
    if (!meshRef.current || !isVisible) {
      return;
    }

    const target = isAnimating ? placedCenter : placedCenter;
    const start = isAnimating ? stagingCenter : placedCenter;

    if (meshRef.current.position.distanceTo(placedCenter) > 0.01 && isAnimating) {
      if (meshRef.current.position.distanceTo(stagingCenter) < 0.01) {
        meshRef.current.position.copy(stagingCenter);
      }
      meshRef.current.position.lerp(placedCenter, Math.min(delta * 3, 1));
    } else {
      meshRef.current.position.copy(target);
    }
  });

  if (!isVisible) {
    return null;
  }

  const initialPosition = isAnimating ? stagingCenter : placedCenter;

  return (
    <mesh ref={meshRef} position={[initialPosition.x, initialPosition.y, initialPosition.z]}>
      <boxGeometry args={[box.d, box.h, box.w]} />
      <meshStandardMaterial color={box.color ?? '#3498DB'} />
    </mesh>
  );
}
