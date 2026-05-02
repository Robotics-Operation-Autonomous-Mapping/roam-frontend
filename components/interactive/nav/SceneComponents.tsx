"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { CP, type Cell } from "./types";
import { toWorld } from "./pathfinding";

// ─── Glowing path line ────────────────────────────────────────────────────────

export const GlowPath: React.FC<{ points: [number, number, number][] }> = ({ points }) => {
  if (points.length < 2) return null;
  const v3 = useMemo(() => points.map((p) => new THREE.Vector3(...p)), [points]);
  return (
    <>
      <Line points={v3} color={CP.cyan} lineWidth={3} />
      <Line points={v3} color={CP.cyan} lineWidth={8} transparent opacity={0.12} />
      <Line points={v3} color="#ffffff" lineWidth={1} transparent opacity={0.5} />
    </>
  );
};

// ─── Rover ────────────────────────────────────────────────────────────────────
// Stable rendering: only resets on actual path data change (stringified key),
// NOT on shouldRun toggling. No useEffect dependency on shouldRun prevents
// the "teleport back to start" flicker when pressing Start.

export const Rover: React.FC<{
  points: [number, number, number][];
  shouldRun: boolean;
  speed: number;
}> = ({ points, shouldRun, speed }) => {
  const roverRef = useRef<THREE.Group>(null);
  const segRef   = useRef(0);
  const progRef  = useRef(0);
  // Track the path identity so we only reset when the path actually changes
  const pathKey  = useRef("");

  useFrame((_, delta) => {
    if (!roverRef.current || points.length < 2) return;

    // Detect actual path change safely by hashing the full array of coordinates
    const newKey = points.map(p => `${p[0]},${p[2]}`).join('|');
    if (newKey !== pathKey.current) {
      pathKey.current = newKey;
      segRef.current  = 0;
      progRef.current = 0;
      roverRef.current.position.set(...points[0]);
      
      // Also snap rotation to the first segment initially so it faces the right way
      const dx = points[1][0] - points[0][0];
      const dz = points[1][2] - points[0][2];
      roverRef.current.rotation.y = Math.atan2(dx, dz);
      return; 
    }

    if (!shouldRun) return;

    const maxSeg = points.length - 1;
    let seg = Math.min(segRef.current, maxSeg - 1);

    progRef.current += delta * speed;
    if (progRef.current >= 1) {
      progRef.current -= 1; // keep fractional overflow for perfectly smooth speed
      seg = (seg + 1) < maxSeg ? seg + 1 : 0;
      segRef.current = seg;
    }

    const a = new THREE.Vector3(...points[seg]);
    const b = new THREE.Vector3(...points[seg + 1]);

    // Position interpolation (linear)
    const pos = a.clone().lerp(b, progRef.current);
    roverRef.current.position.set(pos.x, pos.y, pos.z);

    // Rotation interpolation (smooth shortest-path angular dampening)
    const targetRot = Math.atan2(b.x - a.x, b.z - a.z);
    let diff = targetRot - roverRef.current.rotation.y;
    // Normalize to [-PI, PI] to ensure it turns the shortest way around
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI)  diff -= Math.PI * 2;
    
    // Smoothly interpolate rotation. The 10 multiplier determines turn speed.
    roverRef.current.rotation.y += diff * Math.min(delta * 12 * speed, 1);
  });

  return (
    <group ref={roverRef} position={points[0] ?? [0, 0.2, 0]}>
      {/* Main body — dark brushed aluminium */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.52, 0.18, 0.82]} />
        <meshStandardMaterial color="#1c2530" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Cab / sensor pod */}
      <mesh position={[0, 0.32, -0.08]} castShadow>
        <boxGeometry args={[0.32, 0.14, 0.38]} />
        <meshStandardMaterial color="#111820" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Cab glass */}
      <mesh position={[0, 0.32, 0.06]}>
        <boxGeometry args={[0.28, 0.1, 0.01]} />
        <meshPhysicalMaterial color="#4488aa" transmission={0.6} roughness={0.05} metalness={0.1} />
      </mesh>

      {/* Front bumper — accent stripe */}
      <mesh position={[0, 0.12, 0.42]}>
        <boxGeometry args={[0.5, 0.06, 0.04]} />
        <meshStandardMaterial color="#2a3d4a" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Headlights */}
      {([-0.16, 0.16] as const).map((x) => (
        <mesh key={x} position={[x, 0.14, 0.43]}>
          <boxGeometry args={[0.06, 0.04, 0.01]} />
          <meshStandardMaterial color="#e8f0ff" emissive="#c8d8ff" emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* Taillights */}
      {([-0.16, 0.16] as const).map((x) => (
        <mesh key={x} position={[x, 0.14, -0.42]}>
          <boxGeometry args={[0.06, 0.04, 0.01]} />
          <meshStandardMaterial color="#ff4422" emissive="#ff2200" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Roof LiDAR spinner */}
      <mesh position={[0, 0.42, -0.08]}>
        <cylinderGeometry args={[0.06, 0.06, 0.06, 12]} />
        <meshStandardMaterial color="#2a3d50" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// ─── Rover position tracker (drives minimap, no React state) ──────────────────

export const RoverTracker: React.FC<{
  points: [number, number, number][];
  shouldRun: boolean;
  speed: number;
  onPosUpdate: (pos: { x: number; z: number }) => void;
}> = ({ points, shouldRun, speed, onPosUpdate }) => {
  const segRef  = useRef(0);
  const progRef = useRef(0);
  const pathKey = useRef("");

  useFrame((_, delta) => {
    if (!shouldRun || points.length < 2) return;

    // Detect actual path change safely by hashing the full array of coordinates
    const newKey = points.map(p => `${p[0]},${p[2]}`).join('|');
    if (newKey !== pathKey.current) {
      pathKey.current = newKey;
      segRef.current  = 0;
      progRef.current = 0;
      return;
    }

    const maxSeg = points.length - 1;
    let seg = Math.min(segRef.current, maxSeg - 1);

    progRef.current += delta * speed;
    if (progRef.current >= 1) {
      progRef.current -= 1;
      seg = (seg + 1) < maxSeg ? seg + 1 : 0;
      segRef.current = seg;
    }

    const a = new THREE.Vector3(...points[seg]);
    const b = new THREE.Vector3(...points[seg + 1]);

    const pos = a.clone().lerp(b, progRef.current);
    onPosUpdate({ x: pos.x, z: pos.z });
  });

  return null;
};
