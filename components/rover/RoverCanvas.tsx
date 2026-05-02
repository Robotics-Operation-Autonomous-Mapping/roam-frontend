"use client";

import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { RoverScene, RoverSceneHandle } from "./RoverScene";
import { useRoverScroll } from "./useRoverScroll";

interface RoverCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const RoverCanvasComponent: React.FC<RoverCanvasProps> = ({ containerRef }) => {
  const sceneRef = useRef<RoverSceneHandle | null>(null);

  // Wire up GSAP scroll trigger
  useRoverScroll(sceneRef, containerRef);

  return (
    <div className="rover-canvas-wrapper absolute inset-0 pointer-events-none w-full h-full z-10">
      <Canvas
        camera={{ position: [8, 5, 8], fov: 45 }}
        dpr={
          typeof window !== "undefined"
            ? window.innerWidth < 768
              ? 1
              : Math.min(window.devicePixelRatio, 2)
            : 1
        }
        gl={{
          antialias: typeof window !== "undefined" && window.innerWidth > 768,
        }}
        frameloop="always" // Use always since we animate via GSAP directly modifying position over time
        aria-label="Interactive 3D rover assembly scene"
      >
        <RoverScene ref={sceneRef} />
      </Canvas>
    </div>
  );
};

export default RoverCanvasComponent;
