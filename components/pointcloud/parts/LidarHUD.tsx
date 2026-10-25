"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BLOSSOM, CHANNELS, HEIGHT_MAX, HEIGHT_RAMP, KIND_COLORS, LOCATION, SPIN_HZ, VOXEL_SIZE } from "./constants";
import { ORIGIN } from "./world";
import type { CameraMode, ColorMode, LidarStats } from "./LidarScene";

/** A row of buttons where one is selected. */
function Toggle<T extends string>({
  label, options, value, onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/30 hidden sm:inline">{label}</span>
      <div className="flex border border-white/10">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "px-2 py-1 uppercase transition-colors",
              o === value ? "bg-[#E8512A] text-black" : "text-white/50 hover:text-white",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export const LidarHUD: React.FC<{
  stats: React.MutableRefObject<LidarStats>;
  cameraMode: CameraMode;
  setCameraMode: (m: CameraMode) => void;
  colorMode: ColorMode;
  setColorMode: (m: ColorMode) => void;
  onReset: () => void;
}> = ({ stats, cameraMode, setCameraMode, colorMode, setColorMode, onReset }) => {
  // Copy the live numbers into React state 5 times a second (not 60),
  // so the HUD doesn't slow the 3D scene down.
  const [s, setS] = useState<LidarStats>({ ...stats.current });
  const [loopFlash, setLoopFlash] = useState(false);
  const lastLap = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const now = { ...stats.current };
      setS(now);
      if (now.lap > lastLap.current) {
        lastLap.current = now.lap;
        setLoopFlash(true);
        setTimeout(() => setLoopFlash(false), 2500);
      }
    }, 200);
    return () => clearInterval(id);
  }, [stats]);

  const heading = Math.round(s.heading).toString().padStart(3, "0");

  return (
    <div className="absolute inset-0 pointer-events-none z-10 font-mono text-[8px] md:text-[10px] tracking-[0.18em] uppercase p-4 md:p-6">
      {/* ── Top left: system status ── */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 leading-[1.9] text-white/40">
        <div className="flex items-center gap-2 text-[#E8512A] font-bold">
          <span className="block w-1.5 h-1.5 rounded-full bg-[#E8512A] animate-pulse" />
          Live · SLAM Mapping
        </div>
        <div>Map: {s.mapPoints.toLocaleString()} pts</div>
        <div>Scan: {Math.round(s.pointsPerSec / 1000)}k pts/s</div>
        <div className="hidden sm:block text-white/25">
          {CHANNELS} ch · {SPIN_HZ} Hz · voxel {VOXEL_SIZE} m
        </div>
        <div className="hidden sm:block text-white/25">
          {LOCATION} · {ORIGIN.lat.toFixed(4)}° N {Math.abs(ORIGIN.lon).toFixed(4)}° W
        </div>
      </div>

      {/* ── Top right: rover pose ── */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 leading-[1.9] text-white/40 text-right">
        <div className="font-bold text-white/60">Rover Pose</div>
        <div>X {s.x.toFixed(1).padStart(6, " ")} m</div>
        <div>Y {(-s.z).toFixed(1).padStart(6, " ")} m</div>
        <div>HDG {heading}°</div>
        <div className="hidden sm:block text-white/25">Odom {s.distance.toFixed(0)} m · Lap {s.lap + 1}</div>
      </div>

      {/* ── Centre: loop closure flash ── */}
      <AnimatePresence>
        {loopFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[18%] left-1/2 -translate-x-1/2 border border-[#3DDC84]/50 bg-black/60 backdrop-blur-sm px-4 py-2 text-[#3DDC84] font-bold whitespace-nowrap"
          >
            ↻ Loop closure detected
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom left: legend ── */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white/40 bg-black/30 backdrop-blur-sm p-2 border-l border-white/10">
        {colorMode === "height" ? (
          <div className="w-28 md:w-40">
            <div className="mb-1">Elevation</div>
            <div
              className="h-1.5 w-full"
              style={{ background: `linear-gradient(to right, ${HEIGHT_RAMP.join(",")})` }}
            />
            <div className="flex justify-between mt-1 text-white/30">
              <span>Ground</span>
              <span>+{HEIGHT_MAX} m</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="block w-1.5 h-1.5 rounded-full" style={{ background: BLOSSOM[0] }} />
              Cherry blossom
            </div>
          </div>
        ) : (
          <div className="leading-[1.9] grid grid-cols-2 gap-x-4">
            {Object.entries(KIND_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                {name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom right: controls ── */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col items-end gap-2 pointer-events-auto bg-black/40 backdrop-blur-sm p-2">
        <Toggle label="View" options={["chase", "orbit", "top"] as CameraMode[]} value={cameraMode} onChange={setCameraMode} />
        <Toggle label="Color" options={["height", "class"] as ColorMode[]} value={colorMode} onChange={setColorMode} />
        <button
          type="button"
          onClick={onReset}
          className="px-2 py-1 border border-white/10 text-white/50 hover:text-white uppercase"
        >
          Clear map
        </button>
      </div>

      {/* ── Corner brackets ── */}
      {[
        "top-2 left-2 border-t border-l",
        "top-2 right-2 border-t border-r",
        "bottom-2 left-2 border-b border-l",
        "bottom-2 right-2 border-b border-r",
      ].map((cls) => (
        <div key={cls} className={cn("absolute w-4 h-4 border-[#E8512A]/30", cls)} />
      ))}
    </div>
  );
};
