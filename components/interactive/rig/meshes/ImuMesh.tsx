"use client";

import React from "react";
import type { Mats } from "../useMats";

interface Props { mats: Mats; }

export const ImuMesh: React.FC<Props> = ({ mats }) => (
  <group>
    <mesh material={mats.whitePanelMat}><boxGeometry args={[0.22, 0.06, 0.22]} /></mesh>
    <mesh position={[0, 0.035, 0]} material={mats.pcbMat}><boxGeometry args={[0.18, 0.005, 0.18]} /></mesh>
    <mesh position={[0, -0.045, 0]} material={mats.chassisMat}><boxGeometry args={[0.28, 0.02, 0.28]} /></mesh>
    {[[-0.1, 0.1], [-0.1, -0.1], [0.1, 0.1], [0.1, -0.1]].map(([x, z], i) => (
      <mesh key={i} position={[x, -0.04, z]} material={mats.goldMat}><cylinderGeometry args={[0.012, 0.012, 0.025, 12]} /></mesh>
    ))}
    <mesh position={[0.12, 0.02, 0]} material={mats.darkMat} rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[0.04, 0.06, 0.05]} /></mesh>
    <mesh position={[0, 0.038, 0.05]} material={mats.accentMat}><boxGeometry args={[0.005, 0.002, 0.06]} /></mesh>
    <mesh position={[0.05, 0.038, 0]} material={mats.accentMat}><boxGeometry args={[0.06, 0.002, 0.005]} /></mesh>
  </group>
);
