"use client";

import React from "react";
import * as THREE from "three";
import { type Obstacle } from "../types";

// ─── Sandstone wall with rows of tall windows ────────────────────────────────
// Drawn pixel by pixel: sandstone everywhere, with a dark window in the
// middle of each grid cell and faint lines between the stone blocks.
function makeSandstoneTex() {
  const W = 128, H = 64;
  const data = new Uint8Array(W * H * 4);
  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      const u = (px / W) * 8; // 8 windows across
      const v = (py / H) * 2; // 2 floors up
      const inWindow = u % 1 > 0.32 && u % 1 < 0.68 && v % 1 > 0.2 && v % 1 < 0.8;
      const blockLine = py % 6 === 0; // horizontal joints between stone blocks
      let c: [number, number, number] = [196, 166, 112]; // sandstone
      if (blockLine) c = [170, 140, 92];
      if (inWindow) c = [38, 44, 54];
      const i = (py * W + px) * 4;
      data.set([c[0], c[1], c[2], 255], i);
    }
  }
  const tex = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
const TEX_STONE = makeSandstoneTex();

const SANDSTONE = "#c4a670";
const RED_ROOF = "#b8473f";

/** A four-sided pointed roof (a cone with 4 sides, turned to line up with the walls). */
const Pyramid: React.FC<{ size: number; height: number; position: [number, number, number] }> = ({
  size, height, position,
}) => (
  <mesh position={position} rotation={[0, Math.PI / 4, 0]} castShadow>
    {/* A 4-sided cone of radius r has sides r × √2 long */}
    <coneGeometry args={[size / Math.SQRT2, height, 4]} />
    <meshStandardMaterial color={RED_ROOF} roughness={0.7} />
  </mesh>
);

/** A small round turret with a red cap, like the ones on the roof corners. */
const Turret: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.08, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.07, 0.16, 12]} />
      <meshStandardMaterial color={SANDSTONE} roughness={0.85} />
    </mesh>
    <mesh position={[0, 0.24, 0]} castShadow>
      <coneGeometry args={[0.09, 0.16, 12]} />
      <meshStandardMaterial color={RED_ROOF} roughness={0.7} />
    </mesh>
  </group>
);

/** A clock face: white disc, dark rim, two hands. Faces +z. */
const Clock: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({ position, rotationY = 0 }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.03, 24]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
    <mesh position={[0, 0, 0.017]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.17, 0.17, 0.01, 24]} />
      <meshStandardMaterial color="#f4f1e8" emissive="#fff6dd" emissiveIntensity={0.3} />
    </mesh>
    {/* Hands at about ten to two */}
    <mesh position={[-0.04, 0.04, 0.025]} rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.015, 0.12, 0.005]} />
      <meshBasicMaterial color="#111" />
    </mesh>
    <mesh position={[0.05, 0.03, 0.025]} rotation={[0, 0, -Math.PI / 3]}>
      <boxGeometry args={[0.015, 0.14, 0.005]} />
      <meshBasicMaterial color="#111" />
    </mesh>
  </group>
);

/**
 * Old Calgary City Hall: a sandstone hall with a red roof, and a clock tower
 * in the middle of the front with a tall red pointed roof.
 * The front (with the tower and entrance) faces +z.
 */
export const CityHall: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  const hallH = obs.h * 0.33; // main building walls
  const hallRoofH = obs.h * 0.12;
  const towerW = obs.w * 0.22;
  const towerH = obs.h * 0.62; // tower walls, up to the clock
  const towerZ = obs.d / 2 - towerW / 2; // tower sits on the front wall
  const spireH = obs.h * 0.3;
  const hallD = obs.d * 0.8;
  const hallZ = -obs.d * 0.1; // hall sits back a little so the tower sticks out

  return (
    <group position={[obs.x, 0, obs.z]}>
      {/* ── Main hall ── */}
      <mesh position={[0, hallH / 2, hallZ]} castShadow receiveShadow>
        <boxGeometry args={[obs.w, hallH, hallD]} />
        <meshStandardMaterial map={TEX_STONE} roughness={0.85} />
      </mesh>
      {/* Red hip roof: a 4-sided cone, cut flat on top, stretched to the hall's shape.
          The stretch is on the outer group so it happens AFTER the 45° turn;
          on the same mesh it would stretch first and skew into a diamond. */}
      <group position={[0, hallH + hallRoofH / 2, hallZ]} scale={[obs.w, 1, hallD]}>
        <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
          {/* Bottom radius 1/√2 makes a 1 × 1 square, which the group stretches */}
          <cylinderGeometry args={[0.4, 1 / Math.SQRT2, hallRoofH, 4]} />
          <meshStandardMaterial color={RED_ROOF} roughness={0.7} />
        </mesh>
      </group>
      {/* Gables at each front corner */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <Pyramid size={0.5} height={0.45} position={[side * (obs.w / 2 - 0.35), hallH + 0.2, hallZ + hallD / 2 - 0.25]} />
          <Turret position={[side * (obs.w / 2 - 0.35), hallH + 0.42, hallZ + hallD / 2 - 0.25]} />
        </group>
      ))}

      {/* ── Clock tower ── */}
      <mesh position={[0, towerH / 2, towerZ]} castShadow receiveShadow>
        <boxGeometry args={[towerW, towerH, towerW]} />
        <meshStandardMaterial color={SANDSTONE} roughness={0.85} />
      </mesh>
      {/* Stone band under the clock */}
      <mesh position={[0, towerH, towerZ]} castShadow>
        <boxGeometry args={[towerW * 1.12, 0.06, towerW * 1.12]} />
        <meshStandardMaterial color="#b0915c" roughness={0.85} />
      </mesh>
      {/* Clock faces on the front and the right side (the sides the camera sees) */}
      <Clock position={[0, towerH - 0.28, towerZ + towerW / 2 + 0.01]} />
      <Clock position={[towerW / 2 + 0.01, towerH - 0.28, towerZ]} rotationY={Math.PI / 2} />
      {/* Tall red pointed roof */}
      <Pyramid size={towerW * 1.05} height={spireH} position={[0, towerH + spireH / 2, towerZ]} />
      {/* Little turrets at the tower's corners */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sz]) => (
        <Turret key={`${sx},${sz}`} position={[sx * towerW * 0.5, towerH, towerZ + sz * towerW * 0.5]} />
      ))}
      {/* Flagpole on top */}
      <mesh position={[0, towerH + spireH + 0.2, towerZ]}>
        <cylinderGeometry args={[0.01, 0.015, 0.45, 6]} />
        <meshStandardMaterial color="#555" metalness={0.6} />
      </mesh>

      {/* ── Entrance ── */}
      <mesh position={[0, 0.18, obs.d / 2 + 0.005]}>
        <boxGeometry args={[towerW * 0.45, 0.36, 0.02]} />
        <meshStandardMaterial color="#2b1d14" emissive="#ffb35c" emissiveIntensity={0.25} />
      </mesh>
      {/* Steps */}
      <mesh position={[0, 0.03, obs.d / 2 + 0.1]} receiveShadow>
        <boxGeometry args={[towerW * 0.7, 0.06, 0.2]} />
        <meshStandardMaterial color="#8a5a48" roughness={0.9} />
      </mesh>
    </group>
  );
};
