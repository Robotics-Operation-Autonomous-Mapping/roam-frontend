"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { BG, IS_MOBILE } from "./parts/constants";
import { LidarScene, type CameraMode, type ColorMode, type LidarStats } from "./parts/LidarScene";
import { LidarHUD } from "./parts/LidarHUD";

export default function PointCloudCanvas() {
  const [cameraMode, setCameraMode] = useState<CameraMode>("chase");
  const [colorMode, setColorMode] = useState<ColorMode>("height");
  const [resetKey, setResetKey] = useState(0);

  // The scene writes live numbers here; the HUD reads them
  const stats = useRef<LidarStats>({
    mapPoints: 0, pointsPerSec: 0, x: 0, z: 0, heading: 0, distance: 0, lap: 0,
  });

  // Pause the simulation while it's scrolled off screen
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full h-full" style={{ background: BG }}>
      <Canvas
        frameloop={onScreen ? "always" : "never"}
        camera={{ position: [0, 40, -45], fov: 55, near: 0.1, far: 200 }}
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, IS_MOBILE ? 1 : 2) : 1}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        aria-label="Simulated rover driving a loop while its spinning LiDAR builds a 3D point cloud map"
      >
        <LidarScene stats={stats} cameraMode={cameraMode} colorMode={colorMode} resetKey={resetKey} />
      </Canvas>

      <LidarHUD
        stats={stats}
        cameraMode={cameraMode}
        setCameraMode={setCameraMode}
        colorMode={colorMode}
        setColorMode={setColorMode}
        onReset={() => setResetKey((k) => k + 1)}
      />
    </div>
  );
}
