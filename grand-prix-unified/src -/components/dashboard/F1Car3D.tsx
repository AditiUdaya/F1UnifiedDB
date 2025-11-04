import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export const F1Car3D = () => {
  const carRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (carRef.current) {
      carRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      carRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Car Body */}
      <mesh ref={carRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.4, 0.8]} />
        <meshStandardMaterial color="#DC0000" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Front Wing */}
      <mesh position={[1.2, -0.1, 0]}>
        <boxGeometry args={[0.3, 0.05, 1.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rear Wing */}
      <mesh position={[-1.1, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.4, 1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wheels */}
      {[
        [0.7, -0.2, 0.5],
        [0.7, -0.2, -0.5],
        [-0.7, -0.2, 0.5],
        [-0.7, -0.2, -0.5],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Cockpit */}
      <mesh position={[0.2, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.6]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.7} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};
