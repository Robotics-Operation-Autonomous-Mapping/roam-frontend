"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const ContactHero = () => (
  <section className="relative border-b border-white/10 overflow-hidden bg-bg">
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
    >
      <span
        className="font-display text-[clamp(6rem,28vw,18rem)] text-cream leading-none"
        style={{ opacity: 0.03 }}
      >
        CONTACT
      </span>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl"
      >
        <SectionLabel className="mb-6">Get in Touch</SectionLabel>
        <h1 className="font-display text-[clamp(3rem,10vw,6.5rem)] leading-[0.85] tracking-tighter text-cream uppercase mb-6">
          Contact <span className="text-primary">Us</span>
        </h1>
        <p className="font-mono text-sm md:text-base text-cream/55 leading-relaxed tracking-wide max-w-xl">
          Partnerships, sponsorships, media, or joining the team — send us a message
          and the ROAM executive team will get back to you.
        </p>
      </motion.div>
    </div>
  </section>
);
