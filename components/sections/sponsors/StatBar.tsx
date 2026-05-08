"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "./constants";

export const StatBar = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="border-b border-white/10 grid grid-cols-2 md:grid-cols-4"
    >
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className={`flex flex-col items-center justify-center py-16 md:py-24 px-6 text-center ${
            i < STATS.length - 1 ? "border-r border-white/10" : ""
          }`}
        >
          <span className="font-display text-5xl md:text-7xl text-primary mb-2 leading-none">{s.value}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-cream/50">
            {s.label}
          </span>
        </motion.div>
      ))}
    </section>
  );
};
