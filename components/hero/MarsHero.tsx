"use client";

import React, { useRef } from "react";
import { useAnimation } from "framer-motion";
import { MarsHeroHUD } from "./parts/MarsHeroHUD";
import { MarsHeroContent } from "./parts/MarsHeroContent";
import { useMarsHeroCanvas } from "./parts/useMarsHeroCanvas";

export interface MarsHeroProps {
  onRoverArrived?: () => void;
}

export const MarsHero: React.FC<MarsHeroProps> = ({ onRoverArrived }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });
  const arrivedRef = useRef(false);
  const uiControls = useAnimation();

  useMarsHeroCanvas({
    canvasRef,
    wrapRef,
    rafRef,
    mouseRef,
    arrivedRef,
    uiControls,
    onRoverArrived,
  });

  return (
    <div
      ref={wrapRef}
      className="relative w-full min-h-screen overflow-hidden bg-bg"
      style={{ cursor: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      />

      <MarsHeroHUD />
      <MarsHeroContent controls={uiControls} />

      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, transparent 45%, rgba(10,10,11,0.55) 100%)",
        }}
      />
    </div>
  );
};

export default MarsHero;
