"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({ url }: { url: string }) {
  return (
    <Canvas camera={{ position: [4, 3, 4], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Suspense fallback={null}>
        <Stage environment="sunset" intensity={0.6} adjustCamera>
          <Model url={url} />
        </Stage>
      </Suspense>
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  );
}