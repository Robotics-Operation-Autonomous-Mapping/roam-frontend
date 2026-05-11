"use client";

import React from "react";
import type { Mats } from "../useMats";

interface Props {
  mats: Mats;
}

export const EscMesh: React.FC<Props> = ({ mats }) => (
  <group>
    {/* Heatsink extrusion */}
    <mesh material={mats.greyMat}>
      <boxGeometry args={[0.7, 0.2, 0.45]} />
    </mesh>
    {/* Fins */}
    {Array.from({ length: 10 }).map((_, i) => (
      <mesh
        key={i}
        position={[-0.32 + i * 0.07, 0.14, 0]}
        material={mats.greyMat}
      >
        <boxGeometry args={[0.022, 0.1, 0.42]} />
      </mesh>
    ))}
    {/* PCB visible end */}
    <mesh position={[0, 0, 0.228]} material={mats.pcbMat}>
      <boxGeometry args={[0.68, 0.18, 0.01]} />
    </mesh>
    {/* 4× capacitors */}
    {[-0.25, -0.08, 0.08, 0.25].map((x, i) => (
      <mesh
        key={i}
        position={[x, 0.02, 0.28]}
        material={mats.accentMat}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
      </mesh>
    ))}
    {/* CAN connector */}
    <mesh position={[0.3, -0.06, -0.228]} material={mats.darkMat}>
      <boxGeometry args={[0.08, 0.06, 0.01]} />
    </mesh>
    {/* Gold power leads */}
    {[-0.15, 0, 0.15].map((z, i) => (
      <mesh key={i} position={[-0.37, 0.04, z]} material={mats.goldMat}>
        <boxGeometry args={[0.03, 0.06, 0.05]} />
      </mesh>
    ))}
    {/* Status LEDs */}
    {[0, 1, 2, 3].map((i) => (
      <mesh
        key={i}
        position={[-0.25 + i * 0.16, -0.05, 0.23]}
        material={mats.ledMat}
      >
        <sphereGeometry args={[0.01, 8, 8]} />
      </mesh>
    ))}
  </group>
);
