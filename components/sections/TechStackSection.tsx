"use client";

import React from "react";
import dynamic from "next/dynamic";
import { TechSpecs } from "./tech-stack/TechSpecs";
import { SystemDiagram } from "./tech-stack/SystemDiagram";

const ExplodedSensorRig = dynamic(
  () =>
    import("@/components/interactive/ExplodedSensorRig").then(
      (m) => m.ExplodedSensorRig,
    ),
  { ssr: false },
);

export const TechStackSection = () => {
  return (
    <section className="relative w-full py-32 z-10 pointer-events-none overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase mb-4 opacity-80">
          Engineering // Architecture
        </div>
        <h2 className="font-display text-6xl md:text-8xl text-cream tracking-tighter leading-[0.85] mb-8">
          THE STACK BEHIND <br />
          <span className="text-primary">THE MACHINE.</span>
        </h2>
        <div className="h-[1px] w-full bg-gradient-to-r from-border/60 via-border/20 to-transparent mb-8" />
        <p className="font-mono text-sm text-cream/40 max-w-2xl leading-relaxed uppercase tracking-wider">
          From edge compute to real-time spatial mapping, every component is 
          selected for maximum reliability in high-stakes environments.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-40">
        <TechSpecs />
        <div className="sticky top-24">
          <SystemDiagram />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pointer-events-auto">
        <div className="mb-12">
          <div className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase mb-4 opacity-80">
            Interactive Assembly // Exploratory
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-cream tracking-tight mb-6">
            ATLAS-1 <span className="text-cream/30">SENSOR RIG.</span>
          </h2>
          <p className="font-mono text-xs text-cream/40 max-w-xl leading-relaxed uppercase tracking-widest">
            Tap nodes to inspect the high-precision perception array.
          </p>
        </div>
        <ExplodedSensorRig />
      </div>
    </section>
  );
};
