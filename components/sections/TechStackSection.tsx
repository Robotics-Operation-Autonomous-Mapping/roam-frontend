"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { SectionLabel } from "@/components/ui/SectionLabel";

const ExplodedSensorRig = dynamic(
  () =>
    import("@/components/interactive/ExplodedSensorRig").then(
      (m) => m.ExplodedSensorRig,
    ),
  { ssr: false },
);

const TECH_SPECS = [
  { component: "IR Camera", desc: "Thermal / Environment Sensing" },
  { component: "Dual RGB Cameras", desc: "Stereo Vision Pipeline" },
  { component: "NVIDIA Jetson Orin ×2", desc: "Onboard AI Compute" },
  { component: "Raspberry Pi", desc: "Control & Integration Hub" },
  { component: "LiFePO4 Battery", desc: "Reliable Mobile Power" },
  { component: "Dual LiDAR Sensors", desc: "High-Precision 3D Mapping" },
  { component: '16" Wheels', desc: "All-Terrain Mobility" },
  { component: "Custom Chassis", desc: "Modular Electronics Platform" },
];

export const TechStackSection = () => {
  return (
    <section className="relative w-full py-24 z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left: Specs */}
        <div className="pointer-events-auto">
          <SectionLabel>CORE TECHNOLOGY</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl text-cream mb-12">
            ENGINEERED FOR THE EDGE
          </h2>

          <div className="flex flex-col gap-4">
            {TECH_SPECS.map((spec, i) => (
              <motion.div
                key={spec.component}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border-b border-border/50 pb-4"
              >
                <span className="font-mono text-primary min-w-[220px]">
                  {spec.component}
                </span>
                <span className="font-mono text-sm text-cream/70 hidden sm:inline">
                  —
                </span>
                <span className="font-mono text-sm text-cream/90">
                  {spec.desc}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: SVG System Diagram */}
        <div className="hidden md:flex flex-col justify-center pointer-events-auto relative">
          {/* We will build a purely CSS/SVG schematic node graph here */}
          <div className="w-full h-full min-h-[400px] border border-border bg-surface-2/30 relative overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full opacity-80">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity="0.5"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-bg)"
                    stopOpacity="0"
                  />
                </radialGradient>
              </defs>

              {/* Connections */}
              <motion.path
                d="M200 200 L100 100 M200 200 L300 100 M200 200 L100 300 M200 200 L300 300 M200 200 L200 50 M200 200 L50 200"
                stroke="var(--color-border)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Central Node */}
              <motion.circle
                cx="200"
                cy="200"
                r="20"
                fill="var(--color-surface)"
                stroke="var(--color-primary)"
                strokeWidth="2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              />
              <motion.circle
                cx="200"
                cy="200"
                r="40"
                fill="url(#glow)"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />

              {/* Peripheral Nodes */}
              {[
                { cx: 100, cy: 100 },
                { cx: 300, cy: 100 },
                { cx: 100, cy: 300 },
                { cx: 300, cy: 300 },
                { cx: 200, cy: 50 },
                { cx: 50, cy: 200 },
              ].map((pos, i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  <circle
                    cx={pos.cx}
                    cy={pos.cy}
                    r="12"
                    fill="var(--color-surface)"
                    stroke="var(--color-border)"
                    strokeWidth="2"
                  />
                  <circle
                    cx={pos.cx}
                    cy={pos.cy}
                    r="4"
                    fill="var(--color-cream)"
                  />
                </motion.g>
              ))}
            </svg>

            <div className="absolute bottom-4 left-4 font-mono text-xs text-muted">
              [ SYSTEM ARCHITECTURE VISUALIZATION ]
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pointer-events-auto">
        <ExplodedSensorRig />
      </div>
    </section>
  );
};
