"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * A name tag that floats above a building and bobs gently.
 * <Html> puts normal HTML (styled with Tailwind) at a 3D position.
 */
export const BuildingLabel: React.FC<{ text: string; x: number; y: number; z: number }> = ({ text, x, y, z }) => {
  const ref = useRef<THREE.Group>(null);

  // Bob up and down. Each label starts at a different point (x + z) so they don't move in sync.
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = y + Math.sin(clock.getElapsedTime() * 1.5 + x + z) * 0.12;
  });

  return (
    <group ref={ref} position={[x, y, z]}>
      <Html center wrapperClass="pointer-events-none" zIndexRange={[10, 0]}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <span className="whitespace-nowrap font-mono text-[10px] tracking-[0.2em] uppercase text-white bg-black/60 border border-[#E8512A]/60 px-2 py-1 backdrop-blur-sm">
            {text}
          </span>
          <span className="block w-px h-4 bg-[#E8512A]/60" />
        </div>
      </Html>
    </group>
  );
};
