"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const JoinHero = () => (
  <section className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-16 overflow-hidden">
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
    >
      <span
        className="font-display text-[clamp(8rem,30vw,22rem)] text-cream leading-none"
        style={{ opacity: 0.03 }}
      >
        JOIN
      </span>
    </div>

    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <SectionLabel className="mb-6">RECRUITMENT</SectionLabel>
        <h1 className="font-display text-[clamp(3.5rem,12vw,8rem)] text-cream leading-[0.85] mb-8">
          JOIN THE MISSION.
        </h1>
        <p className="font-sans text-xl text-primary font-bold mb-4">
          Real experience. Real challenges. Real impact.
        </p>
        <p className="font-sans text-lg text-cream/80 max-w-xl mx-auto leading-relaxed">
          You do not need to know everything. You need curiosity, commitment,
          and the willingness to learn fast.
        </p>
      </motion.div>
    </div>
  </section>
);
