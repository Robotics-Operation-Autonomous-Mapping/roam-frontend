"use client";

import React from "react";
import type { Mats } from "../useMats";

interface Props {
  mats: Mats;
}

export const RadarMesh: React.FC<Props> = ({ mats }) => (
  <group>
    {/* Main radome */}
    <mesh material={mats.radarMat}>
      <boxGeometry args={[0.6, 0.1, 0.08]} />
    </mesh>
    {/* Emitter array dots */}
    {Array.from({ length: 5 }).map((_, i) => (
      <mesh key={i} position={[-0.2 + i * 0.1, 0, 0.045]} material={mats.accentMat}>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
      </mesh>
    ))}
    {/* Mounting bracket */}
    <mesh position={[0, -0.09, -0.02]} material={mats.chassisMat}>
      <boxGeometry args={[0.5, 0.06, 0.06]} />
    </mesh>
    {/* Connector tail */}
    <mesh position={[0.25, -0.06, -0.06]} material={mats.darkMat}>
      <boxGeometry args={[0.05, 0.04, 0.04]} />
    </mesh>
    {/* Gold contacts */}
    {Array.from({ length: 4 }).map((_, i) => (
      <mesh key={i} position={[0.22 + i * 0.015, -0.06, -0.08]} material={mats.goldMat}>
        <boxGeometry args={[0.006, 0.03, 0.005]} />
      </mesh>
    ))}
  </group>
);
