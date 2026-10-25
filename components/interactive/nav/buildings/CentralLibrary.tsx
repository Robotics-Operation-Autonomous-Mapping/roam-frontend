"use client";

import React from "react";
import { type Obstacle } from "../types";
import { TEX_LIBRARY, TEX_LIBRARY_GLOW } from "./calgaryTextures";

// Repeat the hexagons round the building so they aren't stretched
TEX_LIBRARY.repeat.set(4, 1);
TEX_LIBRARY_GLOW.repeat.set(4, 1);

/**
 * Calgary Central Library: a long rounded building wrapped in white
 * hexagon panels, many of them glowing windows, sitting on a dark glass
 * ground floor.
 *
 * The oval shape is a cylinder squashed into an ellipse with `scale`.
 */
export const CentralLibrary: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  const groundFloor = obs.h * 0.28;
  const upper = obs.h - groundFloor;
  const ellipse: [number, number, number] = [obs.w / 2, 1, obs.d / 2];

  return (
    <group position={[obs.x, 0, obs.z]}>
      {/* Dark glass ground floor, set back a little */}
      <mesh position={[0, groundFloor / 2, 0]} scale={[ellipse[0] * 0.92, 1, ellipse[2] * 0.9]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, groundFloor, 48]} />
        <meshStandardMaterial color="#1a1f26" emissive="#ffb35c" emissiveIntensity={0.08} metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Hexagon facade (open-ended so the texture only goes round the sides) */}
      <mesh position={[0, groundFloor + upper / 2, 0]} scale={ellipse} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, upper, 64, 1, true]} />
        <meshStandardMaterial
          map={TEX_LIBRARY}
          emissiveMap={TEX_LIBRARY_GLOW}
          emissive="#ffffff"
          emissiveIntensity={0.6}
          roughness={0.6}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, obs.h, 0]} scale={ellipse} castShadow>
        <cylinderGeometry args={[1, 1, 0.04, 64]} />
        <meshStandardMaterial color="#b9bcbd" roughness={0.8} />
      </mesh>
    </group>
  );
};
