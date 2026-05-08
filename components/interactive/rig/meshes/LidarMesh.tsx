"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mats } from "../useMats";

interface Props {
  mats: Mats;
  isActive: boolean;
}

export const LidarMesh: React.FC<Props> = ({ mats }) => {
  const spinRef = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spinRef.current) spinRef.current.rotation.y += dt * 1.8;
  });

  return (
    <group>
      {/* Base mount ring */}
      <mesh position={[0, -0.22, 0]} material={mats.chassisMat}>
        <cylinderGeometry args={[0.26, 0.28, 0.08, 48]} />
      </mesh>
      {/* Gold foil thermal wrap */}
      <mesh position={[0, -0.08, 0]} material={mats.goldFoilMat}>
        <cylinderGeometry args={[0.245, 0.245, 0.08, 48]} />
      </mesh>
      {/* Main white housing */}
      <mesh position={[0, 0.06, 0]} material={mats.whitePanelMat}>
        <cylinderGeometry args={[0.235, 0.235, 0.28, 48]} />
      </mesh>
      {/* Spinning optical window ring */}
      <group ref={spinRef} position={[0, 0.06, 0]}>
        <mesh material={mats.lensMat}>
          <cylinderGeometry args={[0.24, 0.24, 0.16, 48, 1, true]} />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 0.24,
              0,
              Math.sin((i / 8) * Math.PI * 2) * 0.24,
            ]}
            rotation={[0, (-i / 8) * Math.PI * 2, 0]}
            material={mats.accentMat}
          >
            <boxGeometry args={[0.01, 0.005, 0.04]} />
          </mesh>
        ))}
      </group>
      {/* Top cap */}
      <mesh position={[0, 0.22, 0]} material={mats.darkMat}>
        <cylinderGeometry args={[0.14, 0.235, 0.06, 48]} />
      </mesh>
      {/* Status LED ring */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.22,
            -0.16,
            Math.sin((i / 6) * Math.PI * 2) * 0.22,
          ]}
          material={mats.ledMat}
        >
          <sphereGeometry args={[0.012, 8, 8]} />
        </mesh>
      ))}
    </group>
  );
};
