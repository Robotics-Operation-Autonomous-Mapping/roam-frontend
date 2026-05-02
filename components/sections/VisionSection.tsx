"use client";

import React from "react";
import { motion } from "framer-motion";

const DOMAINS = [
  {
    icon: "🗺",
    title: "TERRAIN MAPPING",
    description: "Centimeter-level spatial reconstruction",
  },
  {
    icon: "🏗",
    title: "INFRASTRUCTURE INSPECTION",
    description: "Autonomous defect detection at scale",
  },
  {
    icon: "🌱",
    title: "ENVIRONMENTAL MONITORING",
    description: "Real-time ecological data capture",
  },
];

export const VisionSection = () => {
  return (
    <section className="relative w-full py-24 bg-surface z-10 pointer-events-auto shadow-2xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-6">
            WE BELIEVE ROBOTICS SHOULD DO MORE THAN MOVE.
          </h2>
          <p className="font-sans text-lg text-cream/80">
            ROAM aims to become a hub for ambitious builders who want to create
            autonomous machines that solve real-world problems in mapping,
            exploration, infrastructure inspection, and environmental
            monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {DOMAINS.map((domain, i) => (
            <motion.div
              key={domain.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="group bg-surface-2 border border-border hover:border-primary p-8 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="text-4xl mb-6">{domain.icon}</div>
              <h3 className="font-sans font-bold text-xl text-cream mb-2">
                {domain.title}
              </h3>
              <p className="font-sans text-cream/70">{domain.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
