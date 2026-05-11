"use client";

import React from "react";
import type { Mats } from "../useMats";

interface Props {
  mats: Mats;
}

export const StereoCamMesh: React.FC<Props> = ({ mats }) => (
  <group>
    {/* Main housing */}
    <mesh material={mats.whitePanelMat}>
      <boxGeometry args={[0.95, 0.18, 0.22]} />
    </mesh>
    {/* Front bezel */}
    <mesh position={[0, 0, 0.115]} material={mats.darkMat}>
      <boxGeometry args={[0.97, 0.2, 0.01]} />
    </mesh>
    {/* Left lens barrel */}
    <mesh
      position={[-0.28, 0, 0.14]}
      material={mats.greyMat}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <cylinderGeometry args={[0.055, 0.06, 0.05, 24]} />
    </mesh>
    <mesh
      position={[-0.28, 0, 0.165]}
      material={mats.lensMat}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <cylinderGeometry args={[0.045, 0.045, 0.01, 24]} />
    </mesh>
    {/* Right lens barrel */}
    <mesh
      position={[0.28, 0, 0.14]}
      material={mats.greyMat}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <cylinderGeometry args={[0.055, 0.06, 0.05, 24]} />
    </mesh>
    <mesh
      position={[0.28, 0, 0.165]}
      material={mats.lensMat}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <cylinderGeometry args={[0.045, 0.045, 0.01, 24]} />
    </mesh>
    {/* Center IR projector */}
    <mesh
      position={[0, 0, 0.13]}
      material={mats.accentMat}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
    </mesh>
    {/* Sunshield top */}
    <mesh position={[0, 0.12, 0.08]} material={mats.greyMat}>
      <boxGeometry args={[0.97, 0.04, 0.18]} />
    </mesh>
    {/* Gold foil thermal strip */}
    <mesh position={[0, 0, -0.115]} material={mats.goldFoilMat}>
      <boxGeometry args={[0.7, 0.06, 0.01]} />
    </mesh>
    {/* Side mounting rails */}
    <mesh position={[-0.5, 0, 0]} material={mats.chassisMat}>
      <boxGeometry args={[0.04, 0.24, 0.28]} />
    </mesh>
    <mesh position={[0.5, 0, 0]} material={mats.chassisMat}>
      <boxGeometry args={[0.04, 0.24, 0.28]} />
    </mesh>
  </group>
);
