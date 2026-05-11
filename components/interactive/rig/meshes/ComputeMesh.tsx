"use client";

import React from "react";
import type { Mats } from "../useMats";

interface Props {
  mats: Mats;
  isActive: boolean;
}

export const ComputeMesh: React.FC<Props> = ({ mats }) => (
  <group>
    {/* Main housing */}
    <mesh material={mats.whitePanelMat}>
      <boxGeometry args={[0.7, 0.55, 0.9]} />
    </mesh>
    {/* Panel lines */}
    <mesh position={[0, 0.22, 0.455]} material={mats.greyMat}>
      <boxGeometry args={[0.68, 0.005, 0.005]} />
    </mesh>
    <mesh position={[0, -0.22, 0.455]} material={mats.greyMat}>
      <boxGeometry args={[0.68, 0.005, 0.005]} />
    </mesh>
    {/* Gold foil thermal strip top */}
    <mesh position={[0, 0.278, 0]} material={mats.goldFoilMat}>
      <boxGeometry args={[0.5, 0.002, 0.7]} />
    </mesh>
    {/* Heatsink fins */}
    {Array.from({ length: 12 }).map((_, i) => (
      <mesh
        key={i}
        position={[-0.27 + i * 0.05, 0.32, 0]}
        material={mats.greyMat}
      >
        <boxGeometry args={[0.018, 0.08, 0.75]} />
      </mesh>
    ))}
    {/* IO panel front */}
    <mesh position={[0, -0.1, 0.455]} material={mats.darkMat}>
      <boxGeometry args={[0.55, 0.2, 0.01]} />
    </mesh>
    {/* USB-C ports */}
    {[-0.18, -0.06, 0.06].map((x, i) => (
      <mesh key={i} position={[x, -0.1, 0.462]} material={mats.chassisMat}>
        <boxGeometry args={[0.04, 0.02, 0.01]} />
      </mesh>
    ))}
    {/* Ethernet */}
    <mesh position={[0.2, -0.1, 0.462]} material={mats.chassisMat}>
      <boxGeometry args={[0.06, 0.03, 0.01]} />
    </mesh>
    {/* Status LEDs */}
    {[0, 1, 2].map((i) => (
      <mesh
        key={i}
        position={[-0.32 + i * 0.06, 0.12, 0.46]}
        material={mats.ledMat}
      >
        <boxGeometry args={[0.02, 0.008, 0.005]} />
      </mesh>
    ))}
    {/* Fan grille marks */}
    <mesh position={[0, 0, -0.455]} material={mats.greyMat}>
      <boxGeometry args={[0.3, 0.3, 0.005]} />
    </mesh>
    {Array.from({ length: 5 }).map((_, i) => (
      <mesh
        key={i}
        position={[-0.1 + i * 0.05, 0, -0.46]}
        material={mats.darkMat}
      >
        <boxGeometry args={[0.01, 0.28, 0.005]} />
      </mesh>
    ))}
    {/* Corner standoffs */}
    {[
      [-0.32, -0.28],
      [-0.32, 0.28],
      [0.32, -0.28],
      [0.32, 0.28],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, -0.305, z]} material={mats.goldMat}>
        <cylinderGeometry args={[0.018, 0.018, 0.055, 12]} />
      </mesh>
    ))}
  </group>
);
