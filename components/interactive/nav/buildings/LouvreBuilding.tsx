"use client";

import React from "react";
import { type Obstacle } from "../types";
import { concreteMat, pyramidGlass, TEX_LOUVRE } from "./materials";

export const LouvreBuilding: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  return (
    <group position={[obs.x, 0, obs.z]}>
      {/* Main wing */}
      <mesh
        position={[0, obs.h * 0.3, -obs.d * 0.25]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[obs.w, obs.h * 0.6, obs.d * 0.5]} />
        <meshStandardMaterial
          map={TEX_LOUVRE}
          metalness={0.0}
          roughness={0.88}
        />
      </mesh>
      {/* Side wings */}
      <mesh
        position={[-obs.w * 0.35, obs.h * 0.3, obs.d * 0.25]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[obs.w * 0.3, obs.h * 0.6, obs.d * 0.5]} />
        <meshStandardMaterial
          map={TEX_LOUVRE}
          metalness={0.0}
          roughness={0.88}
        />
      </mesh>
      <mesh
        position={[obs.w * 0.35, obs.h * 0.3, obs.d * 0.25]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[obs.w * 0.3, obs.h * 0.6, obs.d * 0.5]} />
        <meshStandardMaterial
          map={TEX_LOUVRE}
          metalness={0.0}
          roughness={0.88}
        />
      </mesh>
      {/* Glass pyramid */}
      <mesh
        position={[0, obs.h * 0.38, obs.d * 0.1]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <coneGeometry args={[0.72, 0.82, 4]} />
        {pyramidGlass()}
      </mesh>
      {/* Courtyard paving */}
      <mesh position={[0, 0.01, obs.d * 0.08]} receiveShadow>
        <boxGeometry args={[obs.w * 0.7, 0.02, obs.d * 0.55]} />
        {concreteMat("#b0a890")}
      </mesh>
    </group>
  );
};
