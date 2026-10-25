"use client";

import React from "react";
import { type Obstacle } from "../types";
import { TEX_OFFICE, TEX_OFFICE_GLOW } from "./calgaryTextures";

// Smaller windows: repeat the pattern on each face
TEX_OFFICE.repeat.set(1.5, 2.5);
TEX_OFFICE_GLOW.repeat.set(1.5, 2.5);

/** A plain downtown office tower with some windows lit, to fill out the skyline. */
export const OfficeTower: React.FC<{ obs: Obstacle }> = ({ obs }) => (
  <group position={[obs.x, 0, obs.z]}>
    <mesh position={[0, obs.h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[obs.w, obs.h, obs.d]} />
      <meshStandardMaterial
        map={TEX_OFFICE}
        emissiveMap={TEX_OFFICE_GLOW}
        emissive="#ffffff"
        emissiveIntensity={0.4}
        metalness={0.3}
        roughness={0.35}
      />
    </mesh>
    {/* Rooftop plant room */}
    <mesh position={[0, obs.h + 0.12, 0]} castShadow>
      <boxGeometry args={[obs.w * 0.5, 0.24, obs.d * 0.5]} />
      <meshStandardMaterial color="#3d3f44" roughness={0.8} />
    </mesh>
  </group>
);
