"use client";

import React from "react";
import type { Mats } from "../useMats";

interface Props {
  mats: Mats;
}

export const PdbMesh: React.FC<Props> = ({ mats }) => (
  <group>
    {/* PCB */}
    <mesh material={mats.pcbMat}>
      <boxGeometry args={[0.6, 0.04, 0.45]} />
    </mesh>
    {/* DC-DC modules */}
    {[[-0.15, 0.05, 0.1], [0.05, 0.05, 0.1], [0.22, 0.05, 0.1]].map(([x, y, z], i) => (
      <mesh key={i} position={[x, y, z]} material={mats.whitePanelMat}>
        <boxGeometry args={[0.1, 0.06, 0.08]} />
      </mesh>
    ))}
    {/* Main fuses */}
    {[-0.1, 0, 0.1].map((z, i) => (
      <mesh key={i} position={[-0.25, 0.045, z]} material={mats.accentMat}>
        <boxGeometry args={[0.06, 0.05, 0.04]} />
      </mesh>
    ))}
    {/* Gold terminals */}
    {[-0.15, -0.05, 0.05, 0.15].map((z, i) => (
      <mesh key={i} position={[0.28, 0.04, z]} material={mats.goldMat}>
        <cylinderGeometry args={[0.018, 0.018, 0.06, 12]} />
      </mesh>
    ))}
    {/* Connector row */}
    {[-0.18, -0.06, 0.06, 0.18].map((x, i) => (
      <mesh key={i} position={[x, 0.04, -0.24]} material={mats.darkMat}>
        <boxGeometry args={[0.06, 0.05, 0.03]} />
      </mesh>
    ))}
    {/* Heat spreader */}
    <mesh position={[0.1, 0.07, -0.05]} material={mats.greyMat}>
      <boxGeometry args={[0.2, 0.06, 0.2]} />
    </mesh>
  </group>
);
