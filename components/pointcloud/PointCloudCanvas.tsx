"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { gsap } from "@/lib/gsap";
import { usePointCloud } from "./usePointCloud";

// ─── Constants ──────────────────────────────────────────────────────────────
const POINT_COUNT = 8000;

// ─── Inner scene component ───────────────────────────────────────────────────
const PointCloudScene: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const autoRotateTimer = useRef<number>(0);

  const { positions, colors } = usePointCloud(POINT_COUNT);

  useEffect(() => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    geometry.setDrawRange(0, 0);

    // SLAM-like sweep: reveal sorted points left -> right via drawRange.
    const proxy = { visibleCount: 0 };
    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        visibleCount: POINT_COUNT,
        duration: 2.2,
        ease: "power1.inOut",
        onUpdate: () => {
          geometry.setDrawRange(0, Math.floor(proxy.visibleCount));
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // Auto-rotate for 3 seconds, then stop
  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (controls) {
      autoRotateTimer.current += delta;
      controls.autoRotate = autoRotateTimer.current < 3;
      controls.update();
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    const pts = pointsRef.current;
    return () => {
      if (pts) {
        pts.geometry.dispose();
        (pts.material as THREE.PointsMaterial).dispose();
      }
    };
  }, []);

  return (
    <>
      <color attach="background" args={["#0A0A0B"]} />
      <fog attach="fog" args={["#0A0A0B", 15, 42]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 20, 0]} intensity={0.7} color="#F5ECD7" />

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={POINT_COUNT}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={POINT_COUNT}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.92}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        enablePan
        enableZoom
        maxDistance={35}
        minDistance={5}
        maxPolarAngle={Math.PI / 1.8}
        autoRotateSpeed={0.8}
      />
    </>
  );
};

// ─── Exported Canvas wrapper ─────────────────────────────────────────────────
export default function PointCloudCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 12, 20], fov: 55 }}
        dpr={
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1
        }
        gl={{ antialias: false }}
        aria-label="Interactive 3D LiDAR point cloud simulation of outdoor terrain"
      >
        <PointCloudScene />
      </Canvas>
    </div>
  );
}
