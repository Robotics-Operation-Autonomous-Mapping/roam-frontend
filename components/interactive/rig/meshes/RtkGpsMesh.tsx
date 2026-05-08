"use client";

import React from "react";
import type { Mats } from "../useMats";

interface Props {
  mats: Mats;
}

export const RtkGpsMesh: React.FC<Props> = ({ mats }) => (
  <group>
    {/* Antenna dome */}
    <mesh position={[0, 0.08, 0]} material={mats.whitePanelMat}>
      <cylinderGeometry args={[0.12, 0.16, 0.12, 32]} />
    </mesh>
    {/* Radome cap */}
    <mesh position={[0, 0.16, 0]} material={mats.greyMat}>
      <sphereGeometry args={[0.12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
    </mesh>
    {/* Base plate */}
    <mesh position={[0, 0, 0]} material={mats.chassisMat}>
      <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
    </mesh>
    {/* Mast */}
    <mesh position={[0, -0.28, 0]} material={mats.darkMat}>
      <cylinderGeometry args={[0.025, 0.025, 0.5, 16]} />
    </mesh>
    {/* Gold foil around base */}
    <mesh position={[0, 0.04, 0]} material={mats.goldFoilMat}>
      <cylinderGeometry args={[0.165, 0.165, 0.02, 32, 1, true]} />
    </mesh>
    {/* LED indicator */}
    <mesh position={[0.1, 0.01, 0.1]} material={mats.ledMat}>
      <sphereGeometry args={[0.01, 8, 8]} />
    </mesh>
  </group>
);
