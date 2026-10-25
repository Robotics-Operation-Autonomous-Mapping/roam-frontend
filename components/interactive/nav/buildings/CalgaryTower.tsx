"use client";

import React from "react";
import { type Obstacle } from "../types";

/**
 * Calgary Tower: a tall tapered concrete shaft with the round observation
 * pod on top (cream underside, red band with a strip of windows, gold dome
 * and the torch on the very top).
 */
export const CalgaryTower: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  const shaftHeight = obs.h * 0.78;
  const podY = shaftHeight; // the pod sits on top of the shaft

  return (
    <group position={[obs.x, 0, obs.z]}>
      {/* Base plinth */}
      <mesh position={[0, 0.06, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.62, 0.7, 0.12, 32]} />
        <meshStandardMaterial color="#8d8a84" roughness={0.9} />
      </mesh>

      {/* Shaft: wider at the bottom, narrower at the top */}
      <mesh position={[0, shaftHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.34, shaftHeight, 32]} />
        <meshStandardMaterial color="#cfc8ba" roughness={0.75} />
      </mesh>

      {/* Pod underside: flares out like a cup, lit warm from below */}
      <mesh position={[0, podY + 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.22, 0.3, 32]} />
        <meshStandardMaterial color="#f4ead6" emissive="#ffdca0" emissiveIntensity={0.45} roughness={0.6} />
      </mesh>

      {/* Red band */}
      <mesh position={[0, podY + 0.43, 0]} castShadow>
        <cylinderGeometry args={[0.74, 0.74, 0.28, 32]} />
        <meshStandardMaterial color="#b3242c" roughness={0.45} metalness={0.1} />
      </mesh>

      {/* Observation windows (thin dark ring in the middle of the red band) */}
      <mesh position={[0, podY + 0.43, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.08, 32]} />
        <meshStandardMaterial color="#141820" metalness={0.8} roughness={0.15} />
      </mesh>

      {/* Cream rim and roof */}
      <mesh position={[0, podY + 0.61, 0]} castShadow>
        <cylinderGeometry args={[0.56, 0.74, 0.08, 32]} />
        <meshStandardMaterial color="#efe6d2" roughness={0.6} />
      </mesh>

      {/* Gold dome */}
      <mesh position={[0, podY + 0.65, 0]} castShadow>
        <sphereGeometry args={[0.32, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e3a948" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Torch: thin mast with a glowing tip */}
      <mesh position={[0, podY + 1.12, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.04, 0.7, 8]} />
        <meshStandardMaterial color="#d9d4c8" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, podY + 1.5, 0]}>
        <coneGeometry args={[0.05, 0.12, 8]} />
        <meshStandardMaterial color="#ff8a3d" emissive="#ff6b1a" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};
