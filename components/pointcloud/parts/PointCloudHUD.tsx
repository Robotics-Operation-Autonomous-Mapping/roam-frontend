"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const PointCloudHUD: React.FC<{
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
