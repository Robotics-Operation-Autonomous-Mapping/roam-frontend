"use client";

import React from "react";
import type { Mats } from "../useMats";

interface Props {
  mats: Mats;
}

export const CommsMesh: React.FC<Props> = ({ mats }) => (
  <group>
    <mesh material={mats.whitePanelMat}>
      <boxGeometry args={[0.38, 0.1, 0.26]} />
    </mesh>
    <mesh position={[0, 0, -0.132]} material={mats.goldFoilMat}>
      <boxGeometry args={[0.36, 0.09, 0.005]} />
    </mesh>
    {[-0.1, 0.1].map((x, i) => (
      <mesh
        key={i}
        position={[x, 0.06, 0]}
        material={mats.goldMat}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.018, 0.018, 0.04, 16]} />
      </mesh>
    ))}
    {[-0.1, 0.1].map((x, i) => (
      <group
        key={i}
        position={[x, 0.1, 0]}
        rotation={[0, 0, i === 0 ? -0.2 : 0.2]}
      >
        <mesh position={[0, 0.28, 0]} material={mats.darkMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.55, 12]} />
        </mesh>
        <mesh position={[0, 0.56, 0]} material={mats.goldMat}>
          <sphereGeometry args={[0.018, 12, 12]} />
        </mesh>
      </group>
    ))}
    <mesh position={[0.16, 0, 0.132]} material={mats.ledMat}>
      <sphereGeometry args={[0.01, 8, 8]} />
    </mesh>
    <mesh position={[-0.14, -0.02, 0.132]} material={mats.darkMat}>
      <boxGeometry args={[0.06, 0.04, 0.01]} />
    </mesh>
  </group>
);
