import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { F1Car3D } from "./F1Car3D";

export const F1CarScene = () => {
  return (
    <div className="h-[400px] w-full rounded-lg border border-border bg-gradient-metallic">
      <Canvas>
        <PerspectiveCamera makeDefault position={[5, 2, 5]} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, 5, -5]} intensity={0.5} color="#DC0000" />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#DC0000" />
        
        <F1Car3D />
        
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};
