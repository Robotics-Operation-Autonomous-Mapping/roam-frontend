"use client";

import React, { useMemo, useRef } from "react";
import { OrbitControls, Sky, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { GRID_SIZE, type Cell, type Obstacle } from "./types";
import { toWorld, toCell } from "./pathfinding";
import { Building } from "./Buildings";
import {
  GlowPath,
  Rover,
  RoverTracker,
} from "./SceneComponents";

interface NavSceneProps {
  start:       Cell | null;
  end:         Cell | null;
  path:        Cell[];
  visited:     Cell[];
  obstacles:   Obstacle[];
  shouldRun:   boolean;
  speed:       number;
  onSelect:    (cell: Cell) => void;
  onRoverPos:  (pos: { x: number; z: number }) => void;
}

// ─── Subtle ground grid that reads in daylight ────────────────────────────────
const DaylightGrid: React.FC = () => {
  const ref = useRef<THREE.GridHelper>(null);
  return (
    <gridHelper
      ref={ref}
      args={[GRID_SIZE, GRID_SIZE, "#334455", "#1a2a35"]}
      position={[0, 0.003, 0]}
    />
  );
};

// ─── Wet-asphalt ground ───────────────────────────────────────────────────────
const Ground: React.FC = () => (
  <>
    {/* Base asphalt */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[GRID_SIZE, GRID_SIZE, 32, 32]} />
      <meshStandardMaterial
        color="#18222e"
        roughness={0.55}
        metalness={0.08}
        envMapIntensity={0.6}
      />
    </mesh>
    {/* Thin puddle reflection layer — slightly lighter, high metalness */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
      <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
      <meshStandardMaterial
        color="#1e2d3d"
        roughness={0.12}
        metalness={0.7}
        transparent
        opacity={0.45}
        envMapIntensity={1.2}
      />
    </mesh>
    {/* Baked contact shadows under buildings */}
    <ContactShadows
      position={[0, 0.01, 0]}
      scale={GRID_SIZE}
      blur={2.5}
      far={4}
      opacity={0.55}
      color="#000a14"
    />
  </>
);

export const NavScene: React.FC<NavSceneProps> = ({
  start,
  end,
  path,
  obstacles,
  shouldRun,
  speed,
  onSelect,
  onRoverPos,
}) => {
  const worldPath = useMemo(() => path.map((c) => toWorld(c)), [path]);
  
  // Create a round-trip path so the rover drives to the end and returns seamlessly
  const pingPongPath = useMemo(() => {
    if (worldPath.length < 2) return worldPath;
    const reversed = [...worldPath].reverse().slice(1);
    return [...worldPath, ...reversed];
  }, [worldPath]);

  return (
    <>
      {/* ── Physical sky ─────────────────────────────────────────────────────
          @react-three/drei <Sky> uses a Preetham atmosphere model.
          azimuth  : 0.18  = slightly south-west sun (cinematic cross-light)
          inclination: 0.52 = low afternoon sun, long shadows, warm cast
          turbidity: 8     = urban haze / slight overcast feel
          rayleigh: 0.8    = realistic scattering, not overly deep blue
      ─────────────────────────────────────────────────────────────────────── */}
      <Sky
        distance={4500}
        sunPosition={[1, 0.28, -0.6]}   // low, slightly west — golden hour
        inclination={0.52}
        azimuth={0.18}
        turbidity={8}
        rayleigh={0.8}
        mieCoefficient={0.006}
        mieDirectionalG={0.82}
      />

      {/* ── Image-based lighting (HDR environment map) ───────────────────────
          "city" preset gives realistic reflections on metallic buildings —
          windows catch the sky, glass pyramids catch warm light.
          intensity kept at 0.5 so it doesn't wash out the directional key.
      ─────────────────────────────────────────────────────────────────────── */}
      <Environment preset="city" environmentIntensity={0.5} />

      {/* ── Sun — directional key light ──────────────────────────────────────
          Match sunPosition above. Warm golden-hour tint (#ffd580).
          castShadow ON with a well-sized shadow map.
      ─────────────────────────────────────────────────────────────────────── */}
      <directionalLight
        position={[8, 5, -6]}
        intensity={2.8}
        color="#ffd090"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0005}
      />

      {/* ── Sky fill — soft blue from above ─────────────────────────────────
          Simulates light bouncing from the sky dome onto rooftops.
          Kept faint: sky fill should never compete with the sun key.
      ─────────────────────────────────────────────────────────────────────── */}
      <directionalLight
        position={[0, 12, 0]}
        intensity={0.35}
        color="#a8c8f0"
      />

      {/* ── Bounce fill — warm light from opposite side of sun ───────────────
          Low-angle bounce from the ground / warm buildings.
      ─────────────────────────────────────────────────────────────────────── */}
      <directionalLight
        position={[-6, 1.5, 5]}
        intensity={0.22}
        color="#ff9955"
      />

      {/* ── Ambient — absolute minimum ───────────────────────────────────────
          Just enough to fill shadow terminator without flattening the scene.
          This is the "wrap" light — very dark, slightly cool.
      ─────────────────────────────────────────────────────────────────────── */}
      <ambientLight intensity={0.12} color="#2a3d55" />

      {/* ── Subtle city glow from below (street level) ───────────────────────
          Faint upward point light simulates reflected light from streets.
          NOT neon — keep intensity very low.
      ─────────────────────────────────────────────────────────────────────── */}
      <pointLight position={[0, -0.5, 0]} intensity={0.18} color="#ffeedd" distance={20} />

      {/* ── Ground ───────────────────────────────────────────────────────────── */}
      <Ground />
      <DaylightGrid />

      {/* ── Click-capture plane ──────────────────────────────────────────────── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onSelect(toCell(e.point));
        }}
      >
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* ── Buildings ────────────────────────────────────────────────────────── */}
      {obstacles.map((obs, i) => (
        <Building key={`${obs.type ?? "dyn"}-${i}`} obs={obs} />
      ))}

      {/* ── Start / End markers ──────────────────────────────────────────────── */}
      {start && (
        <mesh position={toWorld(start)} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#00FF88" emissive="#00FF88" emissiveIntensity={0.6} roughness={0.3} metalness={0.4} />
        </mesh>
      )}
      {end && (
        <mesh position={toWorld(end)} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={0.6} roughness={0.3} metalness={0.4} />
        </mesh>
      )}

      {/* ── Path + Rover ─────────────────────────────────────────────────────── */}
      {worldPath.length > 1 && <GlowPath points={worldPath} />}
      {pingPongPath.length > 1 && (
        <Rover points={pingPongPath} shouldRun={shouldRun} speed={speed} />
      )}
      {pingPongPath.length > 1 && (
        <RoverTracker
          points={pingPongPath}
          shouldRun={shouldRun}
          speed={speed}
          onPosUpdate={onRoverPos}
        />
      )}

      {/* ── Camera ───────────────────────────────────────────────────────────── */}
      <OrbitControls
        enablePan={false}
        minDistance={11}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2.15}
      />
    </>
  );
};
