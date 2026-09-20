"use client";

import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { gsap } from "@/lib/gsap";
import { INTRO_HOLD, SCAN_DURATION } from "./constants";

// ─── Scan plane (animated horizontal slice) ───────────────────────────────────
export const ScanPlane: React.FC<{ progress: number }> = ({ progress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !ringRef.current) return;
    // Plane pulses opacity as it sweeps
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    const rmat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.06 + Math.sin(clock.getElapsedTime() * 8) * 0.025;
    rmat.opacity = 0.55 + Math.sin(clock.getElapsedTime() * 6) * 0.2;
  });

  if (progress <= 0 || progress >= 1) return null;

  // Map progress (0→1) to world X (-15 → +15)
  const xPos = (progress - 0.5) * 30;

  return (
    <group position={[xPos, 0, 0]}>
      {/* Vertical scan slab */}
      <mesh ref={meshRef} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[14, 0.12]} />
        <meshBasicMaterial
          color="#E8512A"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Leading edge line */}
      <mesh ref={ringRef}>
        <planeGeometry args={[0.015, 14]} />
        <meshBasicMaterial
          color="#E8512A"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// ─── Pulse rings (emitted from origin after scan completes) ───────────────────
export const PulseRings: React.FC<{ active: boolean }> = ({ active }) => {
  const ringsRef = useRef<THREE.Group>(null);
  const rings = useRef<{ mesh: THREE.Mesh; born: number }[]>([]);
  const lastSpawn = useRef(0);

  useFrame(({ clock }) => {
    if (!active || !ringsRef.current) return;
    const t = clock.getElapsedTime();

    // Spawn a new ring every 1.4s
    if (t - lastSpawn.current > 1.4) {
      lastSpawn.current = t;
      const geo = new THREE.RingGeometry(0.1, 0.18, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: "#E8512A",
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      ringsRef.current.add(mesh);
      rings.current.push({ mesh, born: t });
    }

    // Animate & cull rings
    for (let i = rings.current.length - 1; i >= 0; i--) {
      const { mesh, born } = rings.current[i];
      const age = t - born;
      const lifespan = 2.8;
      if (age > lifespan) {
        ringsRef.current.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        rings.current.splice(i, 1);
        continue;
      }
      const p = age / lifespan;
      const r = p * 16;
      const geo = new THREE.RingGeometry(r, r + 0.09, 64);
      mesh.geometry.dispose();
      mesh.geometry = geo;
      (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.5;
    }
  });

  return <group ref={ringsRef} position={[0, -0.3, 0]} />;
};

// ─── Cinematic intro camera ───────────────────────────────────────────────────
export const IntroCamera: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { camera } = useThree();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    // Start high and swoop down to eye level
    camera.position.set(0, 28, 8);
    camera.lookAt(0, 1, 0);

    const tl = gsap.timeline({
      onComplete: onDone,
    });

    tl.to(camera.position, {
      x: 0,
      y: 14,
      z: 22,
      duration: INTRO_HOLD + SCAN_DURATION * 0.6,
      ease: "power2.inOut",
      onUpdate: () => camera.lookAt(0, 1, 0),
    });
  }, [camera, onDone]);

  return null;
};
