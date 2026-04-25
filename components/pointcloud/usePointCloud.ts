import { useMemo } from "react";
import * as THREE from "three";

// ─── Constants ──────────────────────────────────────────────────────────────
const COLOR_LOW = new THREE.Color("#1A4A6B");  // deep blue
const COLOR_MID = new THREE.Color("#F5ECD7");  // cream
const COLOR_HIGH = new THREE.Color("#E8512A"); // coral

function heightToColor(y: number, minY: number, maxY: number): THREE.Color {
  const t = Math.max(0, Math.min(1, (y - minY) / (maxY - minY)));
  if (t < 0.5) {
    return COLOR_LOW.clone().lerp(COLOR_MID, t * 2);
  } else {
    return COLOR_MID.clone().lerp(COLOR_HIGH, (t - 0.5) * 2);
  }
}

// Structural clusters — 4 box-like groupings simulating walls/corners
const CLUSTERS = [
  { cx: 5, cz: 3, baseY: 0, height: 4, spread: 1.5 },
  { cx: -6, cz: -4, baseY: 0, height: 3, spread: 1.2 },
  { cx: 3, cz: -7, baseY: 0, height: 5, spread: 1 },
  { cx: -4, cz: 6, baseY: 0, height: 2.5, spread: 1.8 },
];

/**
 * Generate procedural terrain point cloud data.
 * Returns positions, colors, and per-point alpha arrays.
 * Points are sorted by X for left→right sweep animation.
 */
export function generateTerrain(count: number): {
  positions: Float32Array;
  colors: Float32Array;
} {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  let minY = Infinity,
    maxY = -Infinity;
  const rawPositions: [number, number, number][] = [];

  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    let x: number, y: number, z: number;

    if (rand < 0.7) {
      // Ground plane with terrain noise
      x = (Math.random() - 0.5) * 30;
      z = (Math.random() - 0.5) * 30;
      const base = Math.sin(x * 0.25) * 1.5 + Math.cos(z * 0.3) * 1.2;
      const detail = Math.sin(x * 1.2 + z * 0.8) * 0.3;
      y = base + detail + (Math.random() - 0.5) * 0.15;
    } else if (rand < 0.9) {
      // Gaussian scatter around a random cluster
      const cl = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
      x = cl.cx + (Math.random() - 0.5) * cl.spread * 2;
      z = cl.cz + (Math.random() - 0.5) * cl.spread * 2;
      y = cl.baseY + Math.random() * cl.height;
    } else {
      // Random floating points
      x = (Math.random() - 0.5) * 28;
      z = (Math.random() - 0.5) * 28;
      y = Math.random() * 1.5;
    }

    rawPositions.push([x, y, z]);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  // Sort by X for sweep animation (left → right)
  rawPositions.sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < count; i++) {
    const [x, y, z] = rawPositions[i];
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const col = heightToColor(y, minY, maxY);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  return { positions, colors };
}

/**
 * Hook: generate point cloud terrain data, memoised.
 */
export function usePointCloud(count: number) {
  const terrain = useMemo(() => generateTerrain(count), [count]);
  return terrain;
}
