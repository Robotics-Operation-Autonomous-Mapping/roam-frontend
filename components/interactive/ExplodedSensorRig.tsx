"use client";

import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CATEGORY_COLOR, CATEGORY_LABEL, PARTS } from "./rig/constants";
import { Scene } from "./rig/Scene";
import { MissionClock } from "./rig/MissionClock";
import { motion, AnimatePresence } from "framer-motion";

export const ExplodedSensorRig: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activePart = PARTS.find((p) => p.id === activeId) ?? null;
  const catColor = activePart
    ? CATEGORY_COLOR[activePart.category]
    : "var(--color-muted)";

  const catCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    PARTS.forEach((p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
    });
    return acc;
  }, []);

  return (
    <div className="w-full my-16 bg-bg border border-border font-mono text-cream select-none overflow-hidden rounded-sm shadow-2xl">
      {/* ── Header Area ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 border-b border-border bg-surface/30 backdrop-blur-sm">
        <div className="space-y-1">
          <div className="text-[10px] tracking-[0.4em] text-primary font-bold uppercase">
            System Visualization // 01
          </div>
          <div className="text-sm tracking-[0.15em] text-cream/90 uppercase font-bold">
            ATLAS-1 Exploded Assembly
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-8">
          <MissionClock />
          <div className="h-8 w-[1px] bg-border hidden md:block" />
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {Object.entries(CATEGORY_LABEL).map(([cat, label]) => (
              <div key={cat} className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: CATEGORY_COLOR[cat] }}
                />
                <span className="text-[9px] text-muted tracking-widest uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Information Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border bg-surface/10 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Module ID */}
        <div className="p-6">
          <div className="text-[9px] tracking-[0.3em] text-muted mb-4 uppercase">
            {activePart
              ? `${CATEGORY_LABEL[activePart.category]} · ${activePart.partNumber}`
              : "Identification"}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId || "none"}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-lg text-cream tracking-wider font-bold"
            >
              {activePart?.label ?? "SELECT MODULE"}
            </motion.div>
          </AnimatePresence>
          {activePart && (
            <div
              className="inline-block mt-3 px-2 py-0.5 text-[9px] tracking-[0.2em] border"
              style={{
                color: catColor,
                borderColor: `${catColor}40`,
                background: `${catColor}10`,
              }}
            >
              {CATEGORY_LABEL[activePart.category]}
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="p-6">
          <div className="text-[9px] tracking-[0.3em] text-muted mb-4 uppercase">
            Specifications
          </div>
          {activePart ? (
            <div className="space-y-4">
              <div className="text-xs text-primary/80 tracking-wide leading-relaxed">
                {activePart.spec}
              </div>
              <div className="flex gap-8">
                {activePart.voltage && (
                  <div>
                    <div className="text-[8px] text-muted tracking-[0.2em] mb-1">
                      VOLTAGE
                    </div>
                    <div className="text-xs text-cream/80">
                      {activePart.voltage}
                    </div>
                  </div>
                )}
                {activePart.freq && (
                  <div>
                    <div className="text-[8px] text-muted tracking-[0.2em] mb-1">
                      FREQ / RATE
                    </div>
                    <div className="text-xs text-cream/80">
                      {activePart.freq}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted/30 italic">
              No module selected
            </div>
          )}
        </div>

        {/* Subsystem Notes */}
        <div className="p-6">
          <div className="text-[9px] tracking-[0.3em] text-muted mb-4 uppercase">
            Subsystem Notes
          </div>
          <div className="text-[11px] text-cream/50 leading-relaxed tracking-wide">
            {activePart?.details ??
              "Interact with the 3D model to inspect detailed engineering specifications, communication protocols, and subsystem integration notes."}
          </div>
        </div>
      </div>

      {/* ── 3D Viewport ── */}
      <div className="h-[500px] relative bg-gradient-to-b from-bg to-surface-2/20">
        <Canvas
          camera={{ position: [5.8, 5.4, 5.8], fov: 46 }}
          dpr={
            typeof window !== "undefined"
              ? Math.min(window.devicePixelRatio, 2)
              : 1
          }
          onPointerMissed={() => setActiveId(null)}
          className="cursor-grab active:cursor-grabbing"
        >
          <Scene activeId={activeId} setActiveId={setActiveId} />
        </Canvas>

        {/* Corner Decor */}
        {["top-left", "top-right", "bottom-left", "bottom-right"].map(
          (corner) => (
            <div
              key={corner}
              className={`absolute w-4 h-4 border-primary/40 ${
                corner.includes("top") ? "top-4" : "bottom-4"
              } ${corner.includes("left") ? "left-4" : "right-4"} ${
                corner.includes("top") ? "border-t" : "border-b"
              } ${corner.includes("left") ? "border-l" : "border-r"}`}
            />
          ),
        )}

        {/* Navigation Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-bg/80 backdrop-blur-md border border-border text-[9px] tracking-[0.3em] text-muted uppercase">
          {activeId
            ? "Orbiting: Module Lock"
            : "Drag to Orbit · Click to Inspect"}
        </div>
      </div>

      {/* ── Footer / Status ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-t border-border bg-surface/30">
        <div className="flex flex-wrap gap-x-6 gap-y-2 px-2">
          {Object.entries(catCounts).map(([cat, count]) => (
            <span
              key={cat}
              className="text-[9px] text-muted tracking-widest uppercase flex items-center gap-1.5"
            >
              <span style={{ color: CATEGORY_COLOR[cat] }}>●</span> {count}{" "}
              {CATEGORY_LABEL[cat]}
            </span>
          ))}
        </div>
        <div className="text-[9px] text-muted tracking-[0.25em] uppercase px-2 font-bold">
          {PARTS.length} SUBSYSTEMS INSTALLED // REV 2.4.B
        </div>
      </div>
    </div>
  );
};
