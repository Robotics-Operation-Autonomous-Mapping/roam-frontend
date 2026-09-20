"use client";

import React from "react";
import { type Obstacle } from "../types";
import { concreteMat, TEX_TAIPEI } from "./materials";

export const TaipeiBuilding: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  const r = Math.min(obs.w, obs.d);
  return (
    <group position={[obs.x, 0, obs.z]}>
      {/* Base podium */}
      <mesh position={[0, obs.h * 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[obs.w * 0.82, obs.h * 0.2, obs.d * 0.82]} />
        {concreteMat("#3a4550")}
      </mesh>
      {/* 4 pagoda sections */}
      {[1, 2, 3, 4].map((i) => {
        const yOff = obs.h * 0.1 + i * (obs.h * 0.18);
        const scale = 1 - i * 0.06;
        return (
          <group key={i} position={[0, yOff, 0]}>
            {/* Main section — octagonal with window texture */}
            <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
              <cylinderGeometry
                args={[r * 0.5 * scale, r * 0.42 * scale, obs.h * 0.16, 8]}
              />
              <meshStandardMaterial
                map={TEX_TAIPEI}
                metalness={0.82}
                roughness={0.2}
              />
            </mesh>
            {/* Projecting eave — gives the pagoda step look */}
            <mesh position={[0, -obs.h * 0.078, 0]}>
              <boxGeometry
                args={[r * 0.78 * scale, 0.03, r * 0.78 * scale]}
              />
              <meshStandardMaterial
                color="#2a3d50"
                metalness={0.85}
                roughness={0.15}
              />
            </mesh>
            {/* Eave underside — slightly lighter */}
            <mesh position={[0, -obs.h * 0.079, 0]}>
              <boxGeometry
                args={[r * 0.76 * scale, 0.01, r * 0.76 * scale]}
              />
              <meshStandardMaterial
                color="#3d5060"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}
      {/* Transmission spire */}
      <mesh position={[0, obs.h * 0.93, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.048, obs.h * 0.24, 12]} />
        <meshStandardMaterial
          color="#2a3d48"
          metalness={0.85}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
};
