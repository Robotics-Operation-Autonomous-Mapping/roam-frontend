"use client";

import React from "react";
import { type Obstacle } from "../types";
import { TEX_EMPIRE_BASE, TEX_EMPIRE_MID } from "./materials";

export const EmpireBuilding: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  return (
    <group position={[obs.x, 0, obs.z]}>
      {/* Base block */}
      <mesh position={[0, obs.h * 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[obs.w, obs.h * 0.4, obs.d]} />
        <meshStandardMaterial
          map={TEX_EMPIRE_BASE}
          metalness={0.02}
          roughness={0.8}
        />
      </mesh>
      {/* Mid setback */}
      <mesh position={[0, obs.h * 0.6, 0]} castShadow>
        <boxGeometry args={[obs.w * 0.7, obs.h * 0.4, obs.d * 0.7]} />
        <meshStandardMaterial
          map={TEX_EMPIRE_MID}
          metalness={0.02}
          roughness={0.8}
        />
      </mesh>
      {/* Upper crown */}
      <mesh position={[0, obs.h * 0.9, 0]} castShadow>
        <boxGeometry args={[obs.w * 0.3, obs.h * 0.2, obs.d * 0.3]} />
        <meshStandardMaterial
          color="#c8bfaa"
          metalness={0.02}
          roughness={0.82}
        />
      </mesh>
      {/* Mooring mast */}
      <mesh position={[0, obs.h * 1.12, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.055, obs.h * 0.32, 12]} />
        <meshStandardMaterial
          color="#d0d8e0"
          metalness={0.85}
          roughness={0.18}
        />
      </mesh>
      {/* Floor cornice rings — give it a stepped look */}
      {[0.38, 0.78].map((y, i) => (
        <mesh key={i} position={[0, obs.h * y, 0]}>
          <boxGeometry
            args={[
              obs.w * (i === 0 ? 1.04 : 0.74),
              0.04,
              obs.d * (i === 0 ? 1.04 : 0.74),
            ]}
          />
          <meshStandardMaterial
            color="#b8b0a0"
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};
