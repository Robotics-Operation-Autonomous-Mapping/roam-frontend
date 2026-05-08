"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const SectionHeader: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="text-center max-w-3xl mx-auto mb-16">
      <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
        >
          MISSION STATEMENT // ROAM ROBOTICS
        </motion.span>
      </div>
      <h2 className="font-display text-4xl md:text-5xl text-cream mb-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "inline-block" }}
        >
          WE BELIEVE ROBOTICS SHOULD DO MORE THAN MOVE.
        </motion.span>
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          transformOrigin: "left",
          marginBottom: 24,
        }}
      />
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="font-sans text-lg text-cream/80"
      >
        ROAM aims to become a hub for ambitious builders who want to create
        autonomous machines that solve real-world problems in mapping, infrastructure inspection, and environmental monitoring.
      </motion.p>
    </div>
  );
};
