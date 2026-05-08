"use client";

import React from "react";
import type { Mats } from "../useMats";

interface Props { mats: Mats; isActive: boolean; }

export const EstopMesh: React.FC<Props> = ({ mats, isActive }) => (
  <group>
    <mesh material={mats.whitePanelMat}><boxGeometry args={[0.55, 0.15, 0.22]} /></mesh>
    {[-0.15, 0, 0.15].map((x, i) => (
      <mesh key={i} position={[x, 0.1, 0]} material={i === 1 ? mats.accentMat : mats.darkMat}>
        <boxGeometry args={[0.1, 0.06, 0.18]} />
      </mesh>
    ))}
    {[-0.22, -0.11, 0, 0.11, 0.22].map((x, i) => (
      <mesh key={i} position={[x, -0.06, 0.12]} material={mats.goldMat}><boxGeometry args={[0.04, 0.04, 0.04]} /></mesh>
    ))}
    <mesh position={[0, -0.1, -0.06]} material={mats.chassisMat}><boxGeometry args={[0.5, 0.04, 0.08]} /></mesh>
    <mesh position={[0, 0.12, 0.112]} material={isActive ? mats.accentMat : mats.ledMat}>
      <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
    </mesh>
  </group>
);
