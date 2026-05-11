"use client";

import React, { useState, useEffect } from "react";

export const MissionClock: React.FC = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Start with a random baseline for more "realistic" mission elapsed time
    setTick(Math.floor(Math.random() * 5000) + 12000);
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(Math.floor(tick / 3600)).padStart(2, "0");
  const m = String(Math.floor((tick % 3600) / 60)).padStart(2, "0");
  const s = String(tick % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-3 py-1 rounded-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      <span className="font-mono text-[11px] text-primary font-bold tracking-[0.2em] tabular-nums">
        MET {h}:{m}:{s}
      </span>
    </div>
  );
};
