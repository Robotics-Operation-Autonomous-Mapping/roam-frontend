"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";

import { gsap } from "@/lib/gsap";
import {
  IS_MOBILE,
  POINT_COUNT,
  SCAN_DURATION,
  INTRO_HOLD,
} from "./parts/constants";
import { PointCloudScene } from "./parts/PointCloudScene";
import { PointCloudHUD } from "./parts/PointCloudHUD";

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
            ? Math.min(window.devicePixelRatio, IS_MOBILE ? 1 : 2)
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

      <PointCloudHUD
        scanProgress={scanProgress}
        scanDone={scanDone}
        pointCount={POINT_COUNT}
        userControl={userControl}
      />
    </div>
  );
}
