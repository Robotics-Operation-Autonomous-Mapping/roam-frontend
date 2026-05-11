"use client";

import React from "react";
import type { Mats } from "../useMats";

interface Props {
  mats: Mats;
}

export const BatteryMesh: React.FC<Props> = ({ mats }) => (
  <group>
    {/* Main casing */}
    <mesh material={mats.whitePanelMat}>
      <boxGeometry args={[1.4, 0.38, 0.85]} />
    </mesh>
    {/* Gold foil thermal blanket */}
    <mesh position={[0, 0.192, 0]} material={mats.goldFoilMat}>
      <boxGeometry args={[1.2, 0.005, 0.75]} />
    </mesh>
    {/* Cell dividers visible on side */}
    {Array.from({ length: 7 }).map((_, i) => (
      <mesh
        key={i}
        position={[-0.55 + i * 0.18, 0, 0.428]}
        material={mats.greyMat}
      >
        <boxGeometry args={[0.006, 0.35, 0.01]} />
      </mesh>
    ))}
    {/* BMS module */}
    <mesh position={[0.55, 0, -0.43]} material={mats.darkMat}>
      <boxGeometry args={[0.25, 0.25, 0.02]} />
    </mesh>
    {/* Positive terminal */}
    <mesh position={[-0.55, 0.22, 0]} material={mats.goldMat}>
      <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
    </mesh>
    {/* Negative terminal */}
    <mesh position={[-0.4, 0.22, 0]} material={mats.darkMat}>
      <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
    </mesh>
    {/* Handle recesses */}
    <mesh position={[0.6, 0.1, 0]} material={mats.greyMat}>
      <boxGeometry args={[0.08, 0.12, 0.84]} />
    </mesh>
    <mesh position={[-0.6, 0.1, 0]} material={mats.greyMat}>
      <boxGeometry args={[0.08, 0.12, 0.84]} />
    </mesh>
    {/* Warning label strip */}
    <mesh position={[0, 0, 0.428]} material={mats.accentMat}>
      <boxGeometry args={[0.4, 0.06, 0.005]} />
    </mesh>
  </group>
);
