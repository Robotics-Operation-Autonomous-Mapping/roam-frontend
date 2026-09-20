"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function TeamHero() {
  return (
    <section className="relative min-h-[55vh] sm:min-h-[70vh] flex items-center overflow-hidden bg-bg border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span
          className="font-display text-[28vw] leading-none text-cream whitespace-nowrap"
          style={{ opacity: 0.03 }}
        >
          TEAM
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 w-full">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-3xl"
        >
          <SectionLabel className="mb-4">THE BUILDERS</SectionLabel>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-cream leading-[0.95]">
            THE PEOPLE BEHIND ATLAS-1.
          </h1>
          <p className="mt-5 sm:mt-6 max-w-xl font-sans text-cream/60 text-sm sm:text-base md:text-lg leading-relaxed">
            Six subteams. One rover. Meet the leads and the crew mapping the
            next frontier of autonomy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
