"use client";

import React from "react";
import * as THREE from "three";
import { type Obstacle } from "./types";

// ─── Procedural window-grid texture ──────────────────────────────────────────
// Creates a DataTexture with dark-glass grid — no external file needed.
// windowColor: the colour of glass panes (usually darker than facade).
// groutColor:  the structural frame lines between panes.

function makeWindowTex(
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

const concreteMat = (color = "#5a6070") => (
  <meshStandardMaterial color={color} metalness={0.02} roughness={0.88} />
);
const titaniumMat = (color = "#7a8fa0") => (
  <meshStandardMaterial color={color} metalness={0.92} roughness={0.18} />
);
const pyramidGlass = () => (
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
const TEX_EMPIRE_BASE = makeWindowTex(6, 12, [28, 38, 52], [185, 175, 155]);
const TEX_EMPIRE_MID = makeWindowTex(4, 8, [28, 38, 52], [185, 175, 155]);
const TEX_LOUVRE = makeWindowTex(8, 4, [38, 34, 24], [205, 192, 160]);
const TEX_WILLIS = makeWindowTex(4, 16, [18, 26, 22], [28, 36, 32]);
const TEX_TAIPEI = makeWindowTex(5, 8, [22, 46, 65], [30, 55, 75]);

// ─── Building component ───────────────────────────────────────────────────────

export const Building: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  // ── Guggenheim Bilbao ──────────────────────────────────────────────────────
  if (obs.type === "guggenheim") {
    return (
      <group position={[obs.x, 0, obs.z]}>
        <mesh
          position={[0, obs.h * 0.22, 0]}
          rotation={[0, 0.4, 0.12]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry
            args={[obs.w * 0.55, obs.w * 0.62, obs.h * 0.44, 7, 1]}
          />
          {titaniumMat("#8a9daa")}
        </mesh>
        <mesh
          position={[obs.w * 0.18, obs.h * 0.5, obs.d * 0.08]}
          rotation={[0.18, -0.28, 0.08]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry
            args={[obs.w * 0.38, obs.w * 0.48, obs.h * 0.52, 6, 1]}
          />
          {titaniumMat("#7f94a5")}
        </mesh>
        <mesh
          position={[-obs.w * 0.22, obs.h * 0.58, -obs.d * 0.08]}
          rotation={[-0.08, 0.5, -0.08]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry
            args={[obs.w * 0.28, obs.w * 0.4, obs.h * 0.48, 8, 1]}
          />
          {titaniumMat("#92a5b2")}
        </mesh>
        {/* Glass atrium lid */}
        <mesh position={[0, obs.h * 0.9, 0]} castShadow>
          <boxGeometry args={[obs.w * 0.75, 0.04, obs.d * 0.75]} />
          {pyramidGlass()}
        </mesh>
        {/* Concrete plinth */}
        <mesh position={[0, obs.h * 0.04, 0]} receiveShadow>
          <boxGeometry args={[obs.w * 1.15, obs.h * 0.08, obs.d * 1.15]} />
          {concreteMat("#4a5560")}
        </mesh>
      </group>
    );
  }

  // ── Sagrada Família ────────────────────────────────────────────────────────
  if (obs.type === "sagrada") {
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
  }

  // ── Empire State Building ──────────────────────────────────────────────────
  if (obs.type === "empire") {
    return (
      <group position={[obs.x, 0, obs.z]}>
        {/* Base block */}
        <mesh position={[0, obs.h * 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[obs.w, obs.h * 0.4, obs.d]} />
          <meshStandardMaterial
            map={TEX_EMPIRE_BASE}
            metalness={0.02}
            roughness={0.8}
          />
        </mesh>
        {/* Mid setback */}
        <mesh position={[0, obs.h * 0.6, 0]} castShadow>
          <boxGeometry args={[obs.w * 0.7, obs.h * 0.4, obs.d * 0.7]} />
          <meshStandardMaterial
            map={TEX_EMPIRE_MID}
            metalness={0.02}
            roughness={0.8}
          />
        </mesh>
        {/* Upper crown */}
        <mesh position={[0, obs.h * 0.9, 0]} castShadow>
          <boxGeometry args={[obs.w * 0.3, obs.h * 0.2, obs.d * 0.3]} />
          <meshStandardMaterial
            color="#c8bfaa"
            metalness={0.02}
            roughness={0.82}
          />
        </mesh>
        {/* Mooring mast */}
        <mesh position={[0, obs.h * 1.12, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.055, obs.h * 0.32, 12]} />
          <meshStandardMaterial
            color="#d0d8e0"
            metalness={0.85}
            roughness={0.18}
          />
        </mesh>
        {/* Floor cornice rings — give it a stepped look */}
        {[0.38, 0.78].map((y, i) => (
          <mesh key={i} position={[0, obs.h * y, 0]}>
            <boxGeometry
              args={[
                obs.w * (i === 0 ? 1.04 : 0.74),
                0.04,
                obs.d * (i === 0 ? 1.04 : 0.74),
              ]}
            />
            <meshStandardMaterial
              color="#b8b0a0"
              metalness={0.1}
              roughness={0.7}
            />
          </mesh>
        ))}
      </group>
    );
  }

  // ── The Pentagon ───────────────────────────────────────────────────────────
  if (obs.type === "pentagon") {
    // Generate a pentagon shape with a hole
    const rOuter = (Math.min(obs.w, obs.d) / 2) * 1.05;
    const rInner = rOuter * 0.45;

    const shape = new THREE.Shape();
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const px = Math.cos(angle) * rOuter;
      const py = Math.sin(angle) * rOuter;
      if (i === 0) shape.moveTo(px, py);
      else shape.lineTo(px, py);
    }
    shape.closePath();

    const hole = new THREE.Path();
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const px = Math.cos(angle) * rInner;
      const py = Math.sin(angle) * rInner;
      if (i === 0) hole.moveTo(px, py);
      else hole.lineTo(px, py);
    }
    hole.closePath();
    shape.holes.push(hole);
    const pentagonGeo = new THREE.ExtrudeGeometry(shape, {
      depth: obs.h,
      bevelEnabled: false,
    });

    return (
      <group position={[obs.x, 0, obs.z]}>
        {/* Extruded Pentagon with Hole */}
        <mesh
          rotation={[-Math.PI / 2, 0, Math.PI / 10]}
          position={[0, 0, 0]}
          castShadow
          receiveShadow
          geometry={pentagonGeo}
        >
          {concreteMat("#7a7868")}
        </mesh>

        {/* Courtyard ground (grass) */}
        <mesh
          position={[0, 0.05, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 10]}
        >
          <cylinderGeometry
            args={[
              (Math.min(obs.w, obs.d) / 2) * 0.45,
              (Math.min(obs.w, obs.d) / 2) * 0.45,
              0.01,
              5,
            ]}
          />
          <meshStandardMaterial color="#3d4a30" roughness={0.95} />
        </mesh>
      </group>
    );
  }

  // ── Louvre ─────────────────────────────────────────────────────────────────
  if (obs.type === "louvre") {
    return (
      <group position={[obs.x, 0, obs.z]}>
        {/* Main wing */}
        <mesh
          position={[0, obs.h * 0.3, -obs.d * 0.25]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[obs.w, obs.h * 0.6, obs.d * 0.5]} />
          <meshStandardMaterial
            map={TEX_LOUVRE}
            metalness={0.0}
            roughness={0.88}
          />
        </mesh>
        {/* Side wings */}
        <mesh
          position={[-obs.w * 0.35, obs.h * 0.3, obs.d * 0.25]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[obs.w * 0.3, obs.h * 0.6, obs.d * 0.5]} />
          <meshStandardMaterial
            map={TEX_LOUVRE}
            metalness={0.0}
            roughness={0.88}
          />
        </mesh>
        <mesh
          position={[obs.w * 0.35, obs.h * 0.3, obs.d * 0.25]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[obs.w * 0.3, obs.h * 0.6, obs.d * 0.5]} />
          <meshStandardMaterial
            map={TEX_LOUVRE}
            metalness={0.0}
            roughness={0.88}
          />
        </mesh>
        {/* Glass pyramid */}
        <mesh
          position={[0, obs.h * 0.38, obs.d * 0.1]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
        >
          <coneGeometry args={[0.72, 0.82, 4]} />
          {pyramidGlass()}
        </mesh>
        {/* Courtyard paving */}
        <mesh position={[0, 0.01, obs.d * 0.08]} receiveShadow>
          <boxGeometry args={[obs.w * 0.7, 0.02, obs.d * 0.55]} />
          {concreteMat("#b0a890")}
        </mesh>
      </group>
    );
  }

  // ── Willis Tower ───────────────────────────────────────────────────────────
  // 9 bundled steel tubes — each with a distinct window-grid on the facade.
  if (obs.type === "willis") {
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
  }

  // ── Taipei 101 ─────────────────────────────────────────────────────────────
  if (obs.type === "taipei") {
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
  }

  // ── Fallback ───────────────────────────────────────────────────────────────
  return (
    <mesh position={[obs.x, obs.h / 2, obs.z]} castShadow receiveShadow>
      <boxGeometry args={[obs.w, obs.h, obs.d]} />
      {concreteMat()}
    </mesh>
  );
};
