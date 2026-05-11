"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { gsap } from "@/lib/gsap";
import { usePointCloud } from "./usePointCloud";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────
const POINT_COUNT = 10_000;
const SCAN_DURATION = 3.2; // seconds for the sweep
const INTRO_HOLD = 1.2; // seconds of cinematic camera before handoff

// ─── Scan plane (animated horizontal slice) ───────────────────────────────────
const ScanPlane: React.FC<{ progress: number }> = ({ progress }) => {
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
const PulseRings: React.FC<{ active: boolean }> = ({ active }) => {
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
const IntroCamera: React.FC<{ onDone: () => void }> = ({ onDone }) => {
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

// ─── Main scene ───────────────────────────────────────────────────────────────
const PointCloudScene: React.FC<{
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

// ─── HUD overlay ──────────────────────────────────────────────────────────────
const HUD: React.FC<{
  scanProgress: number;
  scanDone: boolean;
  pointCount: number;
  userControl: boolean;
}> = ({ scanProgress, scanDone, pointCount, userControl }) => {
  const pct = Math.floor(scanProgress * 100);
  const visible = Math.floor(scanProgress * pointCount);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 font-mono p-4 md:p-6 overflow-hidden">
      {/* ── TOP HUD BAR ── */}
      <div className="flex justify-between items-start w-full gap-4 relative z-20">
        {/* Left: Scan Status */}
        <div className="text-[7px] md:text-[9px] tracking-[0.22em] uppercase leading-[1.8] text-white/30 max-w-[48%]">
          <div
            className={cn(
              "font-bold",
              scanDone ? "text-[#E8512A]/70" : "text-[#E8512A]",
            )}
          >
            {scanDone ? "● Scan Complete" : `● Scanning  ${pct}%`}
          </div>
          <div className="opacity-80">
            Visible: {visible.toLocaleString()} Pts
          </div>
          <div className="hidden sm:block opacity-60">
            System: LiDAR Terrestrial
          </div>
        </div>

        {/* Right: Coordinates */}
        <div className="text-[7px] md:text-[9px] tracking-[0.22em] uppercase leading-[1.8] text-white/25 text-right max-w-[48%]">
          <div className="font-bold">53.5461° N 113.4938° W</div>
          <div className="opacity-80">Alt: 645M · Edmonton AB</div>
          <div className="hidden sm:block opacity-60">
            Sensor: ROAM-LIDAR-01
          </div>
        </div>
      </div>

      {/* ── BOTTOM HUD BAR ── */}
      <div className="absolute bottom-6 md:bottom-8 left-4 md:left-6 right-4 md:right-6 flex justify-between items-end gap-2 md:gap-4 z-20">
        {/* Left: Legend */}
        <AnimatePresence>
          {scanDone && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[7px] md:text-[8px] tracking-[0.18em] uppercase leading-[2] text-white/25 bg-black/20 backdrop-blur-sm p-2 border-l border-white/5"
            >
              <div className="flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-[#0D2B1F]" />
                Ground
              </div>
              <div className="flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-[#2A5C3F]" />
                Moss
              </div>
              <div className="flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-[#8A7B5C]" />
                Rock
              </div>
              <div className="flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-[#E8512A]" />
                Coral
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Hint */}
        <AnimatePresence>
          {scanDone && !userControl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-[7px] md:text-[9px] tracking-[0.22em] uppercase text-[#E8512A]/60 text-right leading-[1.8] pr-1"
            >
              <div className="flex items-center justify-end gap-2">
                <span className="block w-3 h-px bg-[#E8512A]/30" />
                Drag to Explore
              </div>
              <div className="hidden sm:block opacity-70">Scroll to Zoom</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Scan progress bar ── */}
      <AnimatePresence>
        {!scanDone && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white/5"
          >
            <motion.div
              className="h-full bg-[#E8512A]"
              style={{ width: `${pct}%` }}
              transition={{ ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Corner brackets ── */}
      {[
        "top-4 left-4 border-t border-l",
        "top-4 right-4 border-t border-r",
        "bottom-4 left-4 border-b border-l",
        "bottom-4 right-4 border-b border-r",
      ].map((cls) => (
        <div
          key={cls}
          className={cn(
            "absolute w-4 h-4 border-[#E8512A]/20 transition-opacity duration-700",
            scanDone ? "opacity-10" : "opacity-30",
            cls,
          )}
        />
      ))}
    </div>
  );
};

// ─── Exported wrapper ─────────────────────────────────────────────────────────
export default function PointCloudCanvas() {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanDone, setScanDone] = useState(false);

  const [userControl, setUserControl] = useState(false);
  const rafScan = useRef<gsap.core.Tween | null>(null);

  // Start scan sweep as soon as canvas mounts
  useEffect(() => {
    const proxy = { p: 0 };
    rafScan.current = gsap.to(proxy, {
      p: 1,
      duration: SCAN_DURATION,
      ease: "power1.inOut",
      delay: 0.5,
      onUpdate: () => setScanProgress(proxy.p),
      onComplete: () => {
        setScanDone(true);
        // After the scan + intro camera hold, hand off to user
        setTimeout(() => setUserControl(true), (INTRO_HOLD + 0.8) * 1000);
      },
    });
    return () => {
      rafScan.current?.kill();
    };
  }, []);

  const handleIntroComplete = useCallback(() => {}, []);

  return (
    <div
      className="relative w-full h-full bg-[#080909]"
      onPointerDown={() => {
        if (scanDone) setUserControl(true);
      }}
    >
      <Canvas
        camera={{ position: [0, 28, 8], fov: 52 }}
        dpr={
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1
        }
        gl={{ antialias: false, powerPreference: "high-performance" }}
        aria-label="Interactive 3D LiDAR point cloud of Earth terrain — forest, rock outcrops and path"
      >
        <PointCloudScene
          scanProgress={scanProgress}
          scanDone={scanDone}
          userControl={userControl}
          onIntroComplete={handleIntroComplete}
        />
      </Canvas>

      <HUD
        scanProgress={scanProgress}
        scanDone={scanDone}
        pointCount={POINT_COUNT}
        userControl={userControl}
      />
    </div>
  );
}
