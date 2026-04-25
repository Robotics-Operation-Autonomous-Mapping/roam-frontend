"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatCounter } from "@/components/ui/StatCounter";
import { CanvasErrorBoundary } from "@/components/ui/CanvasErrorBoundary";

// ─── Dynamic import — ssr:false mandatory for Three.js ──────────────────────
const PointCloudCanvas = dynamic(
  () => import("@/components/pointcloud/PointCloudCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-bg border border-border">
        <span className="font-mono text-sm text-primary animate-pulse">
          [ INITIALIZING POINT CLOUD SIMULATION... ]
        </span>
      </div>
    ),
  }
);

const AutoNavigationSimulation = dynamic(
  () =>
    import("@/components/interactive/AutoNavigationSimulation").then(
      (m) => m.AutoNavigationSimulation
    ),
  { ssr: false }
);

// ─── Content ─────────────────────────────────────────────────────────────────
const MILESTONES = [
  { label: "Rover concept & architecture",       status: "done" },
  { label: "Sensor placement design",            status: "done" },
  { label: "Compute stack selection",            status: "done" },
  { label: "Chassis CAD design",                 status: "active", note: "In progress" },
  { label: "Power distribution layout",          status: "upcoming" },
  { label: "Prototype chassis fabrication",      status: "upcoming" },
  { label: "Electronics integration",            status: "upcoming" },
  { label: "Sensor calibration",                 status: "upcoming" },
  { label: "First movement test",                status: "upcoming" },
  { label: "First autonomous navigation",        status: "upcoming" },
  { label: "First 3D digital twin generation",   status: "upcoming" },
];

const SYSTEM_STACK = [
  { component: "Dual LiDAR Sensors",      spec: "Ouster OS1-32",        status: "CONFIRMED" },
  { component: "NVIDIA Jetson Orin ×2",   spec: "Onboard AI Compute",   status: "CONFIRMED" },
  { component: "Raspberry Pi 4",          spec: "Control & I/O Hub",    status: "CONFIRMED" },
  { component: "Dual RGB Cameras",        spec: "Stereo Vision Pipeline",status: "CONFIRMED" },
  { component: "IR Camera",               spec: "Thermal Sensing",       status: "CONFIRMED" },
  { component: "LiFePO4 Battery",         spec: "24V 30Ah",             status: "PLANNED"   },
  { component: "ROS 2 Humble",            spec: "Autonomy Framework",    status: "CONFIRMED" },
  { component: "FAST-LIO2",               spec: "LiDAR SLAM",           status: "PLANNED"   },
];

// ─── Milestone dot ────────────────────────────────────────────────────────────
const MilestoneDot: React.FC<{ status: string }> = ({ status }) => {
  if (status === "done") {
    return <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-[5px]" />;
  }
  if (status === "active") {
    return (
      <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-[5px] animate-pulse shadow-[0_0_6px_var(--color-primary)]" />
    );
  }
  return <div className="w-3 h-3 rounded-full border border-border shrink-0 mt-[5px]" />;
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DemoPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-bg pt-24">

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionLabel className="mb-4">ROAM V1 — DESIGN & SYSTEMS PHASE</SectionLabel>
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] text-cream leading-[0.85] mb-6">
            PROTOTYPE SHOWCASE
          </h1>
          <p className="font-sans text-lg text-cream/80 max-w-2xl leading-relaxed">
            This page tracks our progress as we build the first autonomous rover prototype.
            We are currently in the design and planning phase.
          </p>
        </motion.div>
      </section>

      {/* ── STATUS BANNER ── */}
      <div className="max-w-7xl mx-auto px-6 w-full mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-l-4 border-primary bg-surface px-8 py-6 flex flex-col sm:flex-row gap-4 sm:gap-12"
        >
          <div>
            <p className="font-mono text-xs text-muted mb-1 uppercase tracking-widest">Current Status</p>
            <p className="font-mono text-primary font-bold tracking-wider">
              DESIGN & SYSTEMS PLANNING
            </p>
          </div>
          <div className="w-px bg-border hidden sm:block" />
          <div>
            <p className="font-mono text-xs text-muted mb-1 uppercase tracking-widest">Target</p>
            <p className="font-mono text-cream font-bold tracking-wider">
              FIRST AUTONOMOUS NAVIGATION TEST → Q4 2026
            </p>
          </div>
          <div className="sm:ml-auto flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs text-primary tracking-widest">ACTIVE</span>
          </div>
        </motion.div>
      </div>

      {/* ── LIVE METRICS ── */}
      <section className="max-w-7xl mx-auto px-6 w-full mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { end: 15,   label: "TEAM MEMBERS",     suffix: "",  prefix: "" },
            { end: 1,    label: "PROTOTYPE VERSION", suffix: "",  prefix: "V" },
            { end: 5,    label: "DEPARTMENTS",       suffix: "",  prefix: "" },
            { end: 2026, label: "TARGET YEAR",       suffix: "",  prefix: "" },
          ].map(({ end, label, suffix, prefix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border p-6 flex flex-col"
            >
              <span className="font-mono text-xs text-muted mb-2 tracking-widest">{label}</span>
              <span className="font-mono text-3xl text-primary font-bold inline-flex items-baseline">
                {prefix && <span>{prefix}</span>}
                <StatCounter end={end} label="" duration={1500} />
                {suffix && <span>{suffix}</span>}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── POINT CLOUD CANVAS ── */}
      <section className="max-w-7xl mx-auto px-6 w-full mb-6">
        <SectionLabel className="mb-4">LIVE POINT CLOUD SIMULATION</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl text-cream mb-8">
          3D TERRAIN VISUALIZATION
        </h2>
      </section>

      {/* Full-bleed canvas container */}
      <div className="relative w-full mb-2" style={{ height: "60vh", minHeight: "400px" }}>
        <CanvasErrorBoundary>
          <PointCloudCanvas />
        </CanvasErrorBoundary>

        {/* Canvas overlays */}
        <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
          {/* Top row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-2">
            <div className="bg-bg/80 backdrop-blur-sm border border-border px-4 py-2 flex items-center gap-3 w-full md:w-auto">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="font-mono text-xs text-primary tracking-widest truncate">
                SIMULATION ACTIVE
              </span>
            </div>
            <div className="bg-bg/80 backdrop-blur-sm border border-border px-4 py-2 w-full md:w-auto">
              <span className="font-mono text-[10px] md:text-xs text-muted tracking-widest break-words flex flex-wrap">
                8,000 pts &nbsp;|&nbsp; ~4 Hz scan rate &nbsp;|&nbsp; Simulated
              </span>
            </div>
          </div>
          {/* Bottom */}
          <div className="flex justify-center">
            <div className="bg-bg/80 backdrop-blur-sm border border-border px-4 py-2">
              <span className="font-mono text-xs text-muted tracking-widest">
                DRAG TO ORBIT · SCROLL TO ZOOM · CLICK TO RESET
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory paragraph */}
      <div className="max-w-7xl mx-auto px-6 w-full mb-24">
        <p className="font-sans text-cream/70 leading-relaxed max-w-3xl">
          Our rover will use dual LiDAR sensors to generate point clouds like this in real time,
          capturing the geometry of its surroundings and feeding it into a 3D digital twin pipeline.
          Each coloured point represents a LiDAR return — low elevations in blue, mid in cream, peaks in coral.
        </p>
      </div>

      <AutoNavigationSimulation />

      {/* ── MILESTONE TIMELINE ── */}
      <section className="max-w-7xl mx-auto px-6 w-full mb-24">
        <SectionLabel className="mb-4">BUILD PROGRESS</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl text-cream mb-12">
          PROGRESS TRACKER
        </h2>

        <div className="relative pl-10 flex flex-col gap-6 max-w-2xl">
          <div className="absolute left-[19px] top-0 w-[2px] h-full bg-border" />
          {/* Animated fill line */}
          <motion.div
            className="absolute left-[19px] top-0 w-[2px] bg-primary origin-top"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{ height: `${(3 / MILESTONES.length) * 100}%` }}
          />

          {MILESTONES.map((ms, i) => (
            <motion.div
              key={ms.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="relative flex items-start gap-4"
            >
              <div className="absolute -left-[26px] z-10">
                <MilestoneDot status={ms.status} />
              </div>
              <div>
                <p
                  className={`font-sans text-sm ${
                    ms.status === "done"
                      ? "text-cream/90 line-through decoration-primary/50"
                      : ms.status === "active"
                      ? "text-primary font-bold"
                      : "text-cream/40"
                  }`}
                >
                  {ms.label}
                </p>
                {ms.note && (
                  <p className="font-mono text-xs text-primary mt-1">[ {ms.note} ]</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PLANNED TECH STACK ── */}
      <section className="max-w-7xl mx-auto px-6 w-full mb-24">
        <SectionLabel className="mb-4">TECHNOLOGY</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl text-cream mb-12">
          PLANNED TECHNOLOGY STACK
        </h2>

        <div className="flex flex-col gap-0 border border-border">
          {SYSTEM_STACK.map((item, i) => (
            <motion.div
              key={item.component}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center justify-between border-b border-border last:border-b-0 px-6 py-4 hover:bg-surface transition-colors"
            >
              <div className="flex items-baseline gap-6 flex-1 min-w-0">
                <span className="font-mono text-sm text-primary shrink-0 w-[200px]">
                  {item.component}
                </span>
                <span className="font-mono text-xs text-muted hidden sm:block">—</span>
                <span className="font-mono text-sm text-cream/80 truncate">
                  {item.spec}
                </span>
              </div>
              <span
                className={`font-mono text-xs tracking-widest shrink-0 ml-6 px-3 py-1 border ${
                  item.status === "CONFIRMED"
                    ? "border-primary text-primary"
                    : "border-border text-muted"
                }`}
              >
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── IN PROGRESS / UPCOMING GRID ── */}
      <section className="max-w-7xl mx-auto px-6 w-full mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-primary bg-surface p-8">
            <h3 className="font-display text-2xl text-primary mb-6 border-b border-primary/30 pb-4">
              IN PROGRESS
            </h3>
            <ul className="space-y-3">
              {MILESTONES.filter((m) => m.status === "active").map((m) => (
                <li key={m.label} className="flex items-start gap-3 font-sans text-sm text-cream/90">
                  <span className="text-primary mt-1 shrink-0">●</span>
                  {m.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-surface p-8">
            <h3 className="font-display text-2xl text-muted mb-6 border-b border-border pb-4">
              UPCOMING
            </h3>
            <ul className="space-y-3">
              {MILESTONES.filter((m) => m.status === "upcoming").slice(0, 5).map((m) => (
                <li key={m.label} className="flex items-start gap-3 font-sans text-sm text-cream/50">
                  <span className="text-muted mt-1 shrink-0">○</span>
                  {m.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
