"use client";

import React from "react";
import { type Obstacle } from "../types";
import { TEX_WILLIS } from "./materials";

export const WillisBuilding: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  const tw = obs.w / 3;
  const td = obs.d / 3;
  return (
    <group position={[obs.x, 0, obs.z]}>
      {[-1, 0, 1].map((dx) =>
        [-1, 0, 1].map((dz) => {
          const hMult =
            dx === 0 && dz === 0 ? 1.0 : dx === 0 || dz === 0 ? 0.8 : 0.6;
          const h = obs.h * hMult;
          return (
            <group key={`${dx}-${dz}`} position={[dx * tw, 0, dz * td]}>
              {/* Core column */}
              <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[tw * 0.94, h, td * 0.94]} />
                <meshStandardMaterial
                  map={TEX_WILLIS}
                  metalness={0.88}
                  roughness={0.14}
                />
              </mesh>
              {/* Floor plates — thin horizontal bands every 20% height */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((frac, fi) =>
                frac <= hMult ? (
                  <mesh key={fi} position={[0, obs.h * frac, 0]}>
                    <boxGeometry args={[tw * 0.97, 0.025, td * 0.97]} />
                    <meshStandardMaterial
                      color="#383f48"
                      metalness={0.92}
                      roughness={0.1}
                    />
                  </mesh>
                ) : null,
              )}
              {/* Corner column edges — darker aluminium strip */}
              <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[tw * 0.96, h + 0.01, 0.025]} />
                <meshStandardMaterial
                  color="#1a2028"
                  metalness={0.95}
                  roughness={0.08}
                />
              </mesh>
            </group>
          );
        }),
      )}
      {/* Antenna on centre tube */}
      <mesh position={[0, obs.h + 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.04, obs.h * 0.18, 8]} />
        <meshStandardMaterial
          color="#a0aab8"
          metalness={0.9}
          roughness={0.12}
        />
      </mesh>
    </group>
  );
};
