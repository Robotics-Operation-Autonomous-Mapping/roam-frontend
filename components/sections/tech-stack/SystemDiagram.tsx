"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

// ─── Architecture Data ────────────────────────────────────────────────────────
const NODES = [
  { id: "core", label: "AUTONOMY CORE", detail: "High-Perf AI Compute", cx: 200, cy: 200, color: "#E8512A" },
  { id: "perc", label: "PERCEPTION",    detail: "LiDAR + Stereo",      cx: 200, cy: 85,  color: "#3A7BD5" },
  { id: "plan", label: "PLANNING",      detail: "RRT* / Lattice",      cx: 299.6, cy: 142.5, color: "#2ECC71" },
  { id: "ctrl", label: "CONTROL",       detail: "PID / MPC",           cx: 299.6, cy: 257.5, color: "#E8922A" },
  { id: "act",  label: "ACTUATION",     detail: "4× Hub Motor ESC",    cx: 200, cy: 315, color: "#D94040" },
  { id: "loc",  label: "LOCALIZE",      detail: "RTK-GPS + EKF",       cx: 100.4, cy: 257.5, color: "#D4A84B" },
  { id: "map",  label: "MAPPING",       detail: "3D OctoMap",          cx: 100.4, cy: 142.5, color: "#9B59B6" },
];

const EDGES = [
  { from: "perc", to: "core", dur: 1.60 },
  { from: "core", to: "plan", dur: 1.75 },
  { from: "plan", to: "ctrl", dur: 1.55 },
  { from: "ctrl", to: "act",  dur: 1.80 },
  { from: "core", to: "loc",  dur: 2.00 },
  { from: "loc",  to: "map",  dur: 1.90 },
  { from: "map",  to: "core", dur: 1.65 },
];

const NW = 76; // node rect width
const NH = 34; // node rect height

export const SystemDiagram = () => {
  const nodeMap = useMemo(() => Object.fromEntries(NODES.map(n => [n.id, n])), []);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const particleCount = isMobile ? [0] : [0, 0.5];

  return (
    <div className="flex flex-col justify-center pointer-events-auto relative h-full">
      <div className="w-full h-full min-h-[320px] md:min-h-[450px] border border-border bg-surface-2/20 relative overflow-hidden flex items-center justify-center rounded-sm">
        
        <svg viewBox="0 0 400 400" className="w-full h-full select-none" style={{ opacity: 0.95 }}>
          <defs>
            <pattern id="sd-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.6" fill="var(--color-border)" opacity="0.4" />
            </pattern>
            
            <radialGradient id="sd-cglow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E8512A" stopOpacity="0.12" />
              <stop offset="70%" stopColor="#E8512A" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#E8512A" stopOpacity="0" />
            </radialGradient>

          </defs>

          {/* Grid & Circles */}
          <rect width="400" height="400" fill="url(#sd-grid)" />
          {[60, 115, 170].map((r, i) => (
            <circle key={i} cx="200" cy="200" r={r}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="0.8"
              opacity={0.15 - i * 0.04}
              strokeDasharray={i === 2 ? "4 8" : "none"}
            />
          ))}
          <circle cx="200" cy="200" r="160" fill="url(#sd-cglow)" />


          {/* Edges */}
          {EDGES.map((edge, i) => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];
            if (!from || !to) return null;
            return (
              <g key={`edge-${i}`}>
                <path
                  d={`M${from.cx},${from.cy} L${to.cx},${to.cy}`}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="5 5"
                  opacity="0.3"
                />
                {/* Data Packet Animation - Responsive count */}
                {particleCount.map((offset) => (
                  <motion.circle
                    key={offset}
                    r="2"
                    fill={from.color}
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{
                      duration: edge.dur,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.2 + (offset * edge.dur)
                    }}
                    style={{
                      offsetPath: `path('M${from.cx},${from.cy} L${to.cx},${to.cy}')`,
                      motionPath: `path('M${from.cx},${from.cy} L${to.cx},${to.cy}')`
                    }}
                  />
                ))}
              </g>
            );
          })}

          {/* Peripheral Nodes */}
          {NODES.filter(n => n.id !== "core").map((node, i) => (
            <g key={node.id}>
              <rect
                x={node.cx - NW / 2} y={node.cy - NH / 2}
                width={NW} height={NH} rx="4"
                fill="var(--color-surface)"
                stroke={node.color}
                strokeWidth="1"
                opacity="0.9"
              />
              <rect
                x={node.cx - NW / 2} y={node.cy - NH / 2}
                width={NW} height="4" rx="2"
                fill={node.color}
                opacity="0.7"
              />
              <text
                x={node.cx} y={node.cy - 1}
                textAnchor="middle"
                fontSize="7"
                fontFamily="var(--font-mono)"
                fill="var(--color-cream)"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                {node.label}
              </text>
              <text
                x={node.cx} y={node.cy + 10}
                textAnchor="middle"
                fontSize="6"
                fontFamily="var(--font-mono)"
                fill={node.color}
                opacity="0.8"
              >
                {node.detail}
              </text>
              <motion.circle
                cx={node.cx + NW / 2 - 8} cy={node.cy - NH / 2 + 10}
                r="1.5" fill={node.color}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
            </g>
          ))}

          {/* Core Node */}
          <g>
            <motion.circle
              cx="200" cy="200" r="35"
              fill="none" stroke="#E8512A" strokeWidth="1"
              animate={{ r: [35, 42, 35], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <circle cx="200" cy="200" r="28" fill="var(--color-surface)" stroke="#E8512A" strokeWidth="2" />
            <text x="200" y="196" textAnchor="middle" fontSize="7.5" fontFamily="var(--font-mono)" fill="#E8512A" fontWeight="bold" letterSpacing="1">AUTONOMY</text>
            <text x="200" y="206" textAnchor="middle" fontSize="7.5" fontFamily="var(--font-mono)" fill="#E8512A" fontWeight="bold" letterSpacing="1">CORE</text>
            <text x="200" y="215" textAnchor="middle" fontSize="4.5" fontFamily="var(--font-mono)" fill="var(--color-cream)" opacity="0.4">SoC PLATFORM</text>
          </g>

          {/* Corner Decor */}
          {[ [15, 15], [385, 15], [15, 385], [385, 385] ].map(([x, y], i) => (
            <g key={i} opacity="0.3">
              <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke="var(--color-primary)" strokeWidth="1" />
              <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke="var(--color-primary)" strokeWidth="1" />
            </g>
          ))}
        </svg>

        {/* Labels */}
        <div className="absolute bottom-4 left-6 font-mono text-[9px] tracking-[0.2em] text-muted uppercase">
          System Architecture Visualization v1.0
        </div>
        <div className="absolute top-4 right-6 flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">Data Stream: Active</span>
        </div>
      </div>
    </div>
  );
};