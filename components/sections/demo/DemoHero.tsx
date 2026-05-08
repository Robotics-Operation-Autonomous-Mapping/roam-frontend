"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const DemoHero = () => (
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
);
