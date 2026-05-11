"use client";

import React, { useState, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { GRID_SIZE, STATIC_OBSTACLES, CP, type Cell } from "./nav/types";
import { isBlockedByList, findPath } from "./nav/pathfinding";
import { NavScene } from "./nav/NavScene";
import { Minimap } from "./nav/Minimap";

export const AutoNavigationSimulation: React.FC = () => {
  // ── Path state ────────────────────────────────────────────────────────────
  const [start, setStart] = useState<Cell | null>(null);
  const [end, setEnd] = useState<Cell | null>(null);
  const [path, setPath] = useState<Cell[]>([]);
  const [visited, setVisited] = useState<Cell[]>([]);
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [shouldRun, setShouldRun] = useState(false);
  const [error, setError] = useState("");

  // ── Controls ──────────────────────────────────────────────────────────────
  const [speed, setSpeed] = useState(0.9);

  // ── Rover position: throttled to ~10 fps so minimap doesn't cause 60fps re-renders
  const lastSnapTime = useRef(0);
  const [roverPosSnap, setRoverPosSnap] = useState<{
    x: number;
    z: number;
  } | null>(null);
  const handleRoverPos = useCallback((pos: { x: number; z: number }) => {
    const now = performance.now();
    if (now - lastSnapTime.current > 100) {
      lastSnapTime.current = now;
      setRoverPosSnap({ ...pos });
    }
  }, []);

  // ── Cell selection ────────────────────────────────────────────────────────
  const handleSelect = (cell: Cell) => {
    if (isBlockedByList(cell, STATIC_OBSTACLES)) {
      setError("Cell blocked by obstacle.");
      return;
    }
    setError("");
    setShouldRun(false);

    if (selecting === "start") {
      setStart(cell);
      setEnd(null);
      setPath([]);
      setVisited([]);
      setSelecting("end");
      return;
    }

    if (!start) return;
    setEnd(cell);
    const { path: p, visited: v } = findPath(start, cell, STATIC_OBSTACLES);
    setPath(p);
    setVisited(v);
    setSelecting("start");
    if (p.length < 2) setError("No valid path — pick different points.");
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleStart = () => {
    if (path.length > 1) {
      setError("");
      setShouldRun(true);
    } else setError("Create a valid path first.");
  };

  const handleReset = () => {
    setStart(null);
    setEnd(null);
    setPath([]);
    setVisited([]);
    setSelecting("start");
    setShouldRun(false);
    setError("");
    setRoverPosSnap(null);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const pathLen =
    path.length > 1
      ? path
          .reduce((acc, c, i) => {
            if (i === 0) return acc;
            const prev = path[i - 1];
            return acc + Math.sqrt((c.x - prev.x) ** 2 + (c.z - prev.z) ** 2);
          }, 0)
          .toFixed(1)
      : null;

  return (
    <section className="max-w-7xl mx-auto px-6 w-full mb-24">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-display text-4xl md:text-5xl text-cream mb-2">
          AUTONOMOUS PATH FOLLOWING
        </h3>
        <p className="font-sans text-cream/60 max-w-3xl leading-relaxed text-sm">
          A* pathfinding · 8-directional diagonal movement · live replanning
        </p>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap gap-3 mb-3 items-center">
        {/* Speed */}
        <div className="flex items-center gap-2 bg-surface/40 border border-border px-3 py-1.5">
          <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
            Speed
          </span>
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-20 accent-[#00F5FF]"
          />
          <span className="font-mono text-[10px] text-primary w-6">
            {speed.toFixed(1)}×
          </span>
        </div>

        {/* Path info */}
        {pathLen && (
          <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
            Path: {pathLen} units · {path.length} nodes
          </span>
        )}

        {/* Actions */}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={handleStart}
            className="font-mono text-[10px] tracking-widest uppercase border border-primary px-3 py-1.5 bg-bg/80 text-primary hover:bg-primary hover:text-black transition-colors"
          >
            Start
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="font-mono text-[10px] tracking-widest uppercase border border-border px-3 py-1.5 bg-bg/80 text-cream/80 hover:border-primary hover:text-primary transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative w-full h-[500px] border border-border">
        {/* HUD */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <div className="font-mono text-[10px] tracking-widest text-primary uppercase bg-bg/80 px-2 py-1 mb-1">
            [ AUTO-NAV ]
          </div>
          <div className="font-mono text-[9px] tracking-widest text-muted uppercase bg-bg/80 px-2 py-1">
            Click → {selecting === "start" ? "SET START" : "SET END"}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none flex flex-col gap-1">
          {[
            { color: "#00FF88", label: "Start" },
            { color: CP.orange, label: "End" },
            { color: CP.cyan, label: "Path" },
          ].map(({ color, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 bg-bg/80 px-2 py-0.5"
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: color,
                  borderRadius: "50%",
                }}
              />
              <span className="font-mono text-[9px] text-muted tracking-widest uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="absolute bottom-16 left-3 z-10 font-mono text-[10px] tracking-widest uppercase border border-[#FF6B00] bg-bg/90 text-[#FF6B00] px-2 py-1">
            ⚠ {error}
          </div>
        )}

        {/* Minimap */}
        <Minimap
          obstacles={STATIC_OBSTACLES}
          path={path}
          start={start}
          end={end}
          visited={visited}
          roverPos={roverPosSnap}
        />

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [10, 11, 10], fov: 47 }}
          dpr={[1, 2]}
          shadows
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <NavScene
            start={start}
            end={end}
            path={path}
            visited={visited}
            obstacles={STATIC_OBSTACLES}
            shouldRun={shouldRun}
            speed={speed}
            onSelect={handleSelect}
            onRoverPos={handleRoverPos}
          />
        </Canvas>
      </div>

      {/* Footer */}
      <div className="flex gap-4 mt-2 font-mono text-[9px] tracking-widest text-muted uppercase">
        <span>Algo: A* diagonal</span>
        <span>·</span>
        <span>
          Grid: {GRID_SIZE}×{GRID_SIZE}
        </span>
        <span>·</span>
        <span>Visited: {visited.length} nodes</span>
      </div>
    </section>
  );
};
