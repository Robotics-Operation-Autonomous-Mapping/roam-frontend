"use client";

import React, { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PETALS } from "./constants";
import { TREES } from "./world";

const SEEN_ENOUGH = 25; // map points a tree needs before its petals start falling
const HIDDEN = -1000; // petals of unseen trees wait far below the ground

/**
 * Pink petals drifting down from the cherry trees. Each petal belongs to one
 * tree, and only falls once the LiDAR has scanned that tree, so the blossom
 * comes alive as the rover passes.
 */
export const CherryPetals: React.FC<{ seenTrees: Uint32Array; dot: THREE.Texture }> = ({ seenTrees, dot }) => {
  const petals = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PETALS * 3).fill(HIDDEN);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    return {
      geometry,
      positions,
      tree: Uint16Array.from({ length: PETALS }, () => Math.floor(Math.random() * TREES.length)),
      speed: Float32Array.from({ length: PETALS }, () => 0.4 + Math.random() * 0.6), // m/s down
      phase: Float32Array.from({ length: PETALS }, () => Math.random() * Math.PI * 2), // for the sway
    };
  }, []);

  useEffect(() => () => petals.geometry.dispose(), [petals]);

  /** Put petal i back at a random spot in its tree's crown. */
  function respawn(i: number) {
    const t = TREES[petals.tree[i]];
    const [x, y, z, r] = t.crowns[Math.floor(Math.random() * t.crowns.length)];
    petals.positions[i * 3] = x + (Math.random() - 0.5) * r * 1.6;
    petals.positions[i * 3 + 1] = y + (Math.random() - 0.5) * r;
    petals.positions[i * 3 + 2] = z + (Math.random() - 0.5) * r * 1.6;
  }

  useFrame(({ clock }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const time = clock.getElapsedTime();
    const p = petals.positions;
    for (let i = 0; i < PETALS; i++) {
      const seen = seenTrees[petals.tree[i]] >= SEEN_ENOUGH;
      if (!seen) continue;
      if (p[i * 3 + 1] <= HIDDEN + 1 || p[i * 3 + 1] < 0) {
        respawn(i);
        continue;
      }
      // Fall, sway side to side, and drift with a gentle breeze towards +x
      const sway = Math.sin(time * 1.3 + petals.phase[i]);
      p[i * 3] += (0.35 + sway * 0.5) * dt;
      p[i * 3 + 1] -= petals.speed[i] * dt;
      p[i * 3 + 2] += Math.cos(time * 0.9 + petals.phase[i]) * 0.3 * dt;
    }
    petals.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points geometry={petals.geometry} frustumCulled={false}>
      <pointsMaterial size={0.16} map={dot} color="#FFC2DC" sizeAttenuation transparent opacity={0.9} depthWrite={false} />
    </points>
  );
};
