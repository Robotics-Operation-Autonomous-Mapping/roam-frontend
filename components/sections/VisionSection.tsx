"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./vision/SectionHeader";
import { DomainCard }    from "./vision/DomainCard";
import { DOMAIN_CONFIG } from "./vision/constants";

export const VisionSection: React.FC = () => {
  return (
    <section className="relative w-full py-24 bg-surface z-10 pointer-events-auto shadow-2xl overflow-hidden">
      {/* Subtle scanline texture overlay */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px w-full" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          {DOMAIN_CONFIG.map((domain, i) => (
            <DomainCard key={domain.id} domain={domain} index={i} />
          ))}
        </div>

        {/* Footer metadata row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-between mt-4"
          style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em" }}
        >
          <span>SYS.VISION_MODULE v2.4.1</span>
          <span>3 DOMAIN MODULES LOADED</span>
          <span>HOVER CARDS TO ACTIVATE</span>
        </motion.div>
      </div>
    </section>
  );
};