"use client";

import React from "react";
import * as THREE from "three";

// ─── Procedural window-grid texture ──────────────────────────────────────────
// Creates a DataTexture with dark-glass grid — no external file needed.
// windowColor: the colour of glass panes (usually darker than facade).
// groutColor:  the structural frame lines between panes.

export function makeWindowTex(
  cols: number,
  rows: number,
  windowColor: [number, number, number],
  groutColor: [number, number, number],
  texSize = 256,
): THREE.DataTexture {
  const data = new Uint8Array(texSize * texSize * 4);
  const cw = texSize / cols; // cell width in px
  const ch = texSize / rows; // cell height in px
  const grout = 3; // grout line thickness in px

  for (let py = 0; py < texSize; py++) {
    for (let px = 0; px < texSize; px++) {
      const inGroutX = px % cw < grout;
      const inGroutY = py % ch < grout;
      const [r, g, b] = inGroutX || inGroutY ? groutColor : windowColor;
      const i = (py * texSize + px) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }

  const tex = new THREE.DataTexture(data, texSize, texSize, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

// ─── Material helpers (no emissive — light from sky, not from buildings) ──────

export const concreteMat = (color = "#5a6070") => (
  <meshStandardMaterial color={color} metalness={0.02} roughness={0.88} />
);
export const titaniumMat = (color = "#7a8fa0") => (
  <meshStandardMaterial color={color} metalness={0.92} roughness={0.18} />
);
export const pyramidGlass = () => (
  <meshPhysicalMaterial
    color="#88b8c8"
    metalness={0.05}
    roughness={0.04}
    transmission={0.72}
    transparent
    opacity={1}
    ior={1.52}
    envMapIntensity={1.8}
    reflectivity={0.9}
  />
);

// ─── Pre-built facade textures (module-level — created once, shared) ─────────
export const TEX_EMPIRE_BASE = makeWindowTex(6, 12, [28, 38, 52], [185, 175, 155]);
export const TEX_EMPIRE_MID = makeWindowTex(4, 8, [28, 38, 52], [185, 175, 155]);
export const TEX_LOUVRE = makeWindowTex(8, 4, [38, 34, 24], [205, 192, 160]);
export const TEX_WILLIS = makeWindowTex(4, 16, [18, 26, 22], [28, 36, 32]);
export const TEX_TAIPEI = makeWindowTex(5, 8, [22, 46, 65], [30, 55, 75]);
