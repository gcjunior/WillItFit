import { RecommendedTruck } from '../../types/analysis';

type TruckContainerProps = {
  truck: RecommendedTruck;
};

export function TruckContainer({ truck }: TruckContainerProps) {
  const { width, height, depth } = truck;

  return (
    <group>
      <mesh position={[depth / 2, height / 2, width / 2]}>
        <boxGeometry args={[depth, height, width]} />
        <meshBasicMaterial color="#94A3B8" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh position={[depth / 2, 0.01, width / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[depth, width]} />
        <meshBasicMaterial color="#CBD5E1" transparent opacity={0.25} />
      </mesh>
      <gridHelper args={[Math.max(depth, width), 10, '#64748B', '#E2E8F0']} position={[depth / 2, 0, width / 2]} />
    </group>
  );
}
