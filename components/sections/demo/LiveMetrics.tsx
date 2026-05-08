"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatCounter } from "@/components/ui/StatCounter";

export const LiveMetrics = () => (
  <section className="max-w-7xl mx-auto px-6 w-full mb-24">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { end: 15,   label: "TEAM MEMBERS",     suffix: "",  prefix: "" },
        { end: 1,    label: "PROTOTYPE VERSION", suffix: "",  prefix: "V" },
        { end: 5,    label: "DEPARTMENTS",       suffix: "",  prefix: "" },
        { end: 2026, label: "TARGET YEAR",       suffix: "",  prefix: "" },
      ].map(({ end, label, suffix, prefix }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface border border-border p-6 flex flex-col"
        >
          <span className="font-mono text-xs text-muted mb-2 tracking-widest">{label}</span>
          <span className="font-mono text-3xl text-primary font-bold inline-flex items-baseline">
            {prefix && <span>{prefix}</span>}
            <StatCounter end={end} label="" duration={1500} />
            {suffix && <span>{suffix}</span>}
          </span>
        </motion.div>
      ))}
    </div>
  </section>
);
