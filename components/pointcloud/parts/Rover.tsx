"use client";

import React, { forwardRef, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ACCENT, SPIN_HZ } from "./constants";

/** Where the LiDAR sits on the rover, in the rover's own coordinates. */
export const SENSOR_OFFSET = new THREE.Vector3(0, 1.45, -0.25);

const WHEELS: [number, number][] = [
  [-0.8, -0.7], [0.8, -0.7],
  [-0.8, 0], [0.8, 0],
  [-0.8, 0.7], [0.8, 0.7],
];

/**
 * A simple six-wheeled rover built from basic shapes. It faces +Z, so
 * `rover.lookAt(point)` points its nose at that point.
 */
export const Rover = forwardRef<THREE.Group>(function Rover(_, ref) {
  const headRef = useRef<THREE.Group>(null);

  // Spin the LiDAR head at the real spin rate
  useFrame((_, delta) => {
    if (headRef.current) headRef.current.rotation.y += delta * SPIN_HZ * Math.PI * 2;
  });

  return (
    <group ref={ref}>
      {/* Body */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.3, 0.45, 2]} />
        <meshStandardMaterial color="#2A2A2E" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Orange top plate */}
      <mesh position={[0, 0.8, 0.1]}>
        <boxGeometry args={[1.15, 0.06, 1.5]} />
        <meshStandardMaterial color={ACCENT} roughness={0.4} />
      </mesh>

      {/* Wheels */}
      {WHEELS.map(([x, z]) => (
        <mesh key={`${x},${z}`} position={[x, 0.3, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.22, 16]} />
          <meshStandardMaterial color="#141416" roughness={0.9} />
        </mesh>
      ))}

      {/* Mast */}
      <mesh position={[0, 1.1, -0.25]}>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshStandardMaterial color="#3A3A40" />
      </mesh>

      {/* LiDAR head (spins) */}
      <group ref={headRef} position={SENSOR_OFFSET.toArray()}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.16, 24]} />
          <meshStandardMaterial color="#1A1A1D" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.155]}>
          <boxGeometry args={[0.12, 0.05, 0.02]} />
          <meshBasicMaterial color={ACCENT} />
        </mesh>
      </group>
    </group>
  );
});
