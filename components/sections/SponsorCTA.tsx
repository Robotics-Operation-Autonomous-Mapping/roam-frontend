"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

export const SponsorCTA = () => (
  <section className="border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center text-center mb-20"
      >
        <SectionLabel className="mb-8">Support ROAM</SectionLabel>
        <h2 className="font-display text-[clamp(3rem,11vw,8rem)] leading-[0.8] tracking-tighter text-cream uppercase mb-10">
          BACK THE <span className="text-primary">BUILDERS.</span>
        </h2>
        <p className="font-mono text-sm md:text-base text-cream/50 leading-relaxed tracking-wide max-w-2xl">
          Your sponsorship puts a student-built rover on the competition
          field — and your brand at the frontier of what&apos;s possible.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto border border-white/10 bg-surface/30 p-10 md:p-16 flex flex-col md:flex-row items-center gap-12"
      >
        <ul className="flex flex-col gap-4 flex-1 text-left">
          {[
            "Logo on the rover & the website",
            "Instagram, LinkedIn & newsletter features",
            "Live showcase at competitions & conferences",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 shrink-0 bg-primary rotate-45 inline-block" />
              <span className="font-mono text-sm md:text-base text-cream/70 tracking-wide">{item}</span>
            </li>
          ))}
        </ul>
        <div className="shrink-0">
          <Button href="/sponsors" variant="primary" className="px-8 py-4 text-sm md:px-12 md:py-5 md:text-base">
            View Sponsorship Packages
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);
