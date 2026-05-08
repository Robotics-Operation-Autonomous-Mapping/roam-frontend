"use client";

import React from "react";
import { motion } from "framer-motion";
import { TECH_SPECS } from "./constants";

const SPEC_META: Record<string, { category: string; icon: string }> = {
  "High-Resolution LiDAR":  { category: "SENSORS",  icon: "🛰️" },
  "Stereo Vision System":   { category: "SENSORS",  icon: "📷" },
  "Autonomy Compute Unit":  { category: "COMPUTE", icon: "🧠" },
  "4D Imaging Radar":       { category: "SENSORS",  icon: "👁️" },
  "High-Density Battery":   { category: "POWER",   icon: "🔋" },
  "RTK-GNSS Receiver":      { category: "SENSORS",  icon: "📍" },
  "9-DOF IMU Sensor":       { category: "SENSORS",  icon: "🧭" },
  "Motor Control Unit":     { category: "DRIVE",   icon: "⚙️" },
};

export const TechSpecs = () => {
  // Group by category
  const categories = Array.from(new Set(Object.values(SPEC_META).map(m => m.category)));

  return (
    <div className="pointer-events-auto">
      <div className="mb-12">
        <div className="font-mono text-[10px] tracking-[0.4em] text-primary uppercase mb-4 opacity-80">
          Hardware Manifest // v1.0
        </div>
        <h2 className="font-display text-5xl text-cream tracking-tighter leading-[0.9]">
          SYSTEM <span className="text-primary">DATASHEET.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {categories.map((cat, catIdx) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIdx * 0.1 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-8 bg-primary/40" />
              <span className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase font-bold">
                {cat}
              </span>
              <div className="h-[1px] flex-1 bg-border/30" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {TECH_SPECS.filter(s => (SPEC_META[s.component]?.category || "SYSTEM") === cat).map((spec) => (
                <div key={spec.component} className="group relative flex items-start gap-5">
                  <div className="flex-shrink-0 w-10 h-10 border border-border/60 bg-surface/40 flex items-center justify-center text-lg group-hover:border-primary/50 transition-colors">
                    {SPEC_META[spec.component]?.icon || "🔧"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-mono text-[13px] text-cream uppercase font-bold tracking-wider group-hover:text-primary transition-colors">
                        {spec.component}
                      </h4>
                      <div className="h-[1px] flex-1 mx-4 bg-border/20 border-dotted border-b" />
                      <span className="font-mono text-[9px] text-primary/60 uppercase">Operational</span>
                    </div>
                    <p className="font-mono text-[11px] text-cream/40 leading-relaxed max-w-[320px]">
                      {spec.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-border/20 flex justify-between items-center opacity-30 font-mono text-[9px] uppercase tracking-widest">
        <span>Roam Engineering Dept.</span>
        <span>ATLAS-1 Platform Specs</span>
      </div>
    </div>
  );
};