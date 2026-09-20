"use client";

import React from "react";
import { type Obstacle } from "../types";

export const SagradaBuilding: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  const SPIRE_H = [0.7, 0.55, 0.75, 0.6, 0.8, 0.62];
  const spires = Array.from({ length: 6 }, (_, i) => ({
    x: Math.cos((i / 6) * Math.PI * 2) * obs.w * 0.38,
    z: Math.sin((i / 6) * Math.PI * 2) * obs.w * 0.38,
    h: obs.h * SPIRE_H[i],
    r: obs.w * 0.13,
  }));
  const sandstone = (
    <meshStandardMaterial color="#b09870" metalness={0.0} roughness={0.95} />
  );
  const darkstone = (
    <meshStandardMaterial color="#8a7555" metalness={0.0} roughness={0.98} />
  );
  return (
    <group position={[obs.x, 0, obs.z]}>
      <mesh position={[0, obs.h * 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[obs.w * 0.52, obs.w * 0.58, obs.h * 0.3, 8]}
        />
        {sandstone}
      </mesh>
      {spires.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]}>
          <mesh position={[0, s.h / 2, 0]} castShadow>
            <cylinderGeometry args={[s.r * 0.28, s.r, s.h, 6]} />
            {i % 2 === 0 ? sandstone : darkstone}
          </mesh>
          <mesh position={[0, s.h + s.h * 0.1, 0]} castShadow>
            <coneGeometry args={[s.r * 0.28, s.h * 0.22, 6]} />
            <meshStandardMaterial
              color="#d4b88a"
              metalness={0.0}
              roughness={0.9}
            />
          </mesh>
          {/* Ceramic ring */}
          <mesh position={[0, s.h - s.h * 0.05, 0]}>
            <cylinderGeometry
              args={[s.r * 0.31, s.r * 0.31, s.h * 0.04, 6]}
            />
            <meshStandardMaterial
              color="#6a9060"
              metalness={0.15}
              roughness={0.5}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, obs.h * 0.55, 0]} castShadow>
        <cylinderGeometry
          args={[obs.w * 0.07, obs.w * 0.22, obs.h * 1.1, 8]}
        />
        {sandstone}
      </mesh>
      <mesh position={[0, obs.h * 1.18, 0]} castShadow>
        <coneGeometry args={[obs.w * 0.055, obs.h * 0.28, 8]} />
        <meshStandardMaterial
          color="#c8aa80"
          metalness={0.05}
          roughness={0.85}
        />
      </mesh>
    </group>
  );
};
