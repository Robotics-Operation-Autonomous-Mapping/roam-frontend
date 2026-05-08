"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Cell } from "./pathfinding/types";
import { isBlocked, findPath } from "./pathfinding/utils";
import { Scene } from "./pathfinding/Scene";

export const PathPlanningSandbox: React.FC = () => {
  const [start, setStart] = useState<Cell | null>(null);
  const [end, setEnd] = useState<Cell | null>(null);
  const [path, setPath] = useState<Cell[]>([]);
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [error, setError] = useState<string>("");

  const resetSelection = () => {
    setStart(null);
    setEnd(null);
    setPath([]);
    setError("");
    setSelecting("start");
  };

  const handleSelect = (cell: Cell) => {
    if (isBlocked(cell)) {
      setError("Selected cell is occupied by an obstacle.");
      return;
    }

    setError("");
    if (selecting === "start") {
      setStart(cell);
      setEnd(null);
      setPath([]);
      setSelecting("end");
      return;
    }

    if (!start) return;
    setEnd(cell);
    const computed = findPath(start, cell);
    setPath(computed);
    if (computed.length === 0) {
      setError("No valid path found. Pick another endpoint.");
    }
    setSelecting("start");
  };

  return (
    <div className="w-full h-full min-h-[360px] border border-border bg-surface/60 relative">
      <div className="absolute top-3 left-3 z-10 font-mono text-[11px] tracking-widest text-primary uppercase">
        [ Path Planning Sandbox ]
      </div>
      <div className="absolute top-3 right-3 z-10 font-mono text-[11px] tracking-widest text-muted uppercase">
        {selecting === "start" ? "Select Start" : "Select End"}
      </div>
      <button
        type="button"
        onClick={resetSelection}
        className="absolute top-10 right-3 z-10 font-mono text-[10px] tracking-widest text-primary uppercase border border-primary px-2 py-1 bg-bg/80 hover:bg-primary hover:text-white transition-colors"
      >
        Reset Start/End
      </button>
      <div className="absolute bottom-3 left-3 z-10 font-mono text-[11px] tracking-widest text-cream/80 uppercase">
        {path.length > 1
          ? `Path nodes: ${path.length}`
          : "Awaiting route input"}
      </div>
      {error && (
        <div className="absolute bottom-3 right-3 z-10 font-mono text-[10px] tracking-wide text-primary uppercase bg-bg/80 border border-primary px-2 py-1">
          {error}
        </div>
      )}
      <Canvas
        camera={{ position: [10, 11, 10], fov: 48 }}
        dpr={
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1
        }
        gl={{
          antialias: typeof window !== "undefined" && window.innerWidth > 768,
        }}
      >
        <Scene start={start} end={end} path={path} onSelect={handleSelect} />
      </Canvas>
    </div>
  );
};
