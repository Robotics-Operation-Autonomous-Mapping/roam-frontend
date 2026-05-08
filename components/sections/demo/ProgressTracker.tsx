"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MILESTONES } from "./constants";

const MilestoneDot: React.FC<{ status: string }> = ({ status }) => {
  if (status === "done") {
    return <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-[5px]" />;
  }
  if (status === "active") {
    return (
      <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-[5px] animate-pulse shadow-[0_0_6px_var(--color-primary)]" />
    );
  }
  return <div className="w-3 h-3 rounded-full border border-border shrink-0 mt-[5px]" />;
};

export const ProgressTracker = () => (
  <section className="max-w-7xl mx-auto px-6 w-full mb-24">
    <SectionLabel className="mb-4">BUILD PROGRESS</SectionLabel>
    <h2 className="font-display text-4xl md:text-5xl text-cream mb-12">
      PROGRESS TRACKER
    </h2>

    <div className="relative pl-10 flex flex-col gap-6 max-w-2xl">
      <div className="absolute left-[19px] top-0 w-[2px] h-full bg-border" />
      <motion.div
        className="absolute left-[19px] top-0 w-[2px] bg-primary origin-top"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{ height: `${(3 / MILESTONES.length) * 100}%` }}
      />

      {MILESTONES.map((ms, i) => (
        <motion.div
          key={ms.label}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          className="relative flex items-start gap-4"
        >
          <div className="absolute -left-[26px] z-10">
            <MilestoneDot status={ms.status} />
          </div>
          <div>
            <p
              className={`font-sans text-sm ${
                ms.status === "done"
                  ? "text-cream/90 line-through decoration-primary/50"
                  : ms.status === "active"
                  ? "text-primary font-bold"
                  : "text-cream/40"
              }`}
            >
              {ms.label}
            </p>
            {ms.note && (
              <p className="font-mono text-xs text-primary mt-1">[ {ms.note} ]</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);
