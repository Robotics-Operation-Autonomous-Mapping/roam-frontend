"use client";

import { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Resize, Stage, useGLTF } from "@react-three/drei";
import { PointCloudBackdrop } from "./PointCloudBackdrop";

type MaterialOverride = {
  color?: string;     // new colour
  roughness?: number; // 0 = mirror-shiny, 1 = completely matte
  metalness?: number; // 0 = plastic, 1 = metal
};

// Model materials to restyle: material name → changes
const MATERIAL_OVERRIDES: Record<string, MaterialOverride> = {
  "ABS (White).001": { color: "#E8512A" },                                         // handles, lettering → ROAM orange
  "Plastic - Matte (Black)": { color: "#2A2A2E", roughness: 0.2, metalness: 0.3 }, // LiDAR body → darker, shiny
  "Plastic - Glossy (Green)": { color: "#1F6B3A" },                                // Raspberry Pi boards → darker green
};

// Every model is resized so its longest side is this many units,
// so the point cloud backdrop always fits around it.
const MODEL_SIZE = 4;

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const material = obj.material;
      const change = MATERIAL_OVERRIDES[material.name];
      if (!change) return;

      if (change.color) material.color.set(change.color);
      if (material instanceof THREE.MeshStandardMaterial) {
        if (change.roughness !== undefined) material.roughness = change.roughness;
        if (change.metalness !== undefined) material.metalness = change.metalness;
      }
    }
  });

  // <Resize> shrinks or grows the model so its longest side is 1, then scale makes it MODEL_SIZE
  return (
    <Resize scale={MODEL_SIZE}>
      <primitive object={scene} rotation={[-Math.PI / 2, 0, 0]} />
    </Resize>
  );
}

export default function ModelViewer({ url }: { url: string }) {
  return (
    <Canvas flat camera={{ position: [5, 1.5, 0], fov: 45 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <PointCloudBackdrop />
      <Suspense fallback={null}>
        <Stage environment={null} intensity={0.3} adjustCamera>
          <Model url={url} />
        </Stage>
      </Suspense>
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  );
}
