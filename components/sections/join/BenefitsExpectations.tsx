"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GAINS, TRAITS, COMMITMENTS } from "./constants";

export const BenefitsExpectations = () => (
  <section className="py-24 bg-bg">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
      {/* ── BENEFITS ── */}
      <div>
        <SectionLabel className="mb-4">BENEFITS</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl text-cream mb-12">
          WHAT YOU GET
        </h2>

        <div className="relative pl-8 border-l border-border flex flex-col gap-8">
          <motion.div
            className="absolute left-[-1px] top-0 w-[2px] bg-primary origin-top"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            style={{ height: "100%" }}
          />

          {GAINS.map((gain, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -left-[38px] top-[5px] w-3 h-3 rounded-full bg-bg border-2 border-primary z-10" />
              <p className="font-sans text-cream/90 leading-relaxed">{gain}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── EXPECTATIONS ── */}
      <div>
        <SectionLabel className="mb-4">EXPECTATIONS</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl text-cream mb-12">
          WHAT WE EXPECT
        </h2>

        <div className="flex flex-wrap gap-3 mb-8">
          {TRAITS.map((trait, i) => (
            <motion.span
              key={trait}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="px-5 py-2 border border-primary text-primary font-sans text-sm font-bold uppercase tracking-wider"
            >
              {trait}
            </motion.span>
          ))}
        </div>

        <p className="font-sans text-cream/70 leading-relaxed mb-8">
          We value people who show up, push through, and care about doing good work.
        </p>

        <div className="bg-surface-2 border border-border p-6">
          <h3 className="font-mono text-xs text-primary tracking-widest mb-4">
            [ COMMITMENT LEVEL ]
          </h3>
          <ul className="space-y-3 font-sans text-sm text-cream/80">
            {COMMITMENTS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-primary mt-0.5 shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
