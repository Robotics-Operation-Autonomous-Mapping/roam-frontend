"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { usePointCloud } from "../usePointCloud";
import { POINT_COUNT } from "./constants";
import { ScanPlane, PulseRings, IntroCamera } from "./ScanEffects";

export const PointCloudScene: React.FC<{
  scanProgress: number;
  scanDone: boolean;
  userControl: boolean;
  onIntroComplete: () => void;
}> = ({ scanProgress, scanDone, userControl, onIntroComplete }) => {
  const pointsRef = useRef<THREE.Points>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const { positions, colors, scanPositions } = usePointCloud(POINT_COUNT);

  // Reveal points in sync with scanProgress (0→1)
  useEffect(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    geo.setDrawRange(0, 0);
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const visible = Math.floor(scanProgress * POINT_COUNT);
    pointsRef.current.geometry.setDrawRange(0, visible);
  });

  // Gently rotate after scan, stop when user grabs
  useFrame(() => {
    if (!controlsRef.current || !scanDone || userControl) return;
    controlsRef.current.autoRotate = true;
    controlsRef.current.autoRotateSpeed = 0.35;
    controlsRef.current.update();
  });

  // Cleanup
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
      <color attach="background" args={["#080909"]} />
      <fog attach="fog" args={["#080909", 18, 44]} />

      {/* Lighting — subtle warm key + cool fill */}
      <ambientLight intensity={0.15} color="#0a0f14" />
      <pointLight position={[0, 22, 0]} intensity={0.9} color="#F5ECD7" />
      <pointLight position={[-12, 8, -8]} intensity={0.4} color="#1A4A6B" />
      <pointLight position={[10, 4, 10]} intensity={0.3} color="#E8512A" />

      {/* ── Scan plane ── */}
      <ScanPlane progress={scanProgress} />

      {/* ── Ground grid (faint, appears after scan) ── */}
      {scanDone && (
        <gridHelper
          args={[32, 32, "#1a2a1a", "#111811"]}
          position={[0, -0.55, 0]}
        />
      )}

      {/* ── Pulse rings ── */}
      <PulseRings active={scanDone} />

      {/* ── Point cloud ── */}
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
          size={0.038}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ── Scan ring overlay ── */}
      {!scanDone && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={1800}
              array={scanPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            color="#E8512A"
            transparent
            opacity={0.25}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      )}

      {/* ── Intro camera (unmounts after done) ── */}
      {!userControl && <IntroCamera onDone={onIntroComplete} />}

      {/* ── User controls (enabled after intro) ── */}
      <OrbitControls
        ref={controlsRef}
        enabled={userControl}
        enableDamping
        dampingFactor={0.06}
        enablePan
        enableZoom
        maxDistance={38}
        minDistance={4}
        maxPolarAngle={Math.PI / 1.75}
      />
    </>
  );
};
