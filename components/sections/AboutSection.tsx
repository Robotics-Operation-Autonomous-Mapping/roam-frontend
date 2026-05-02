"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatCounter } from "@/components/ui/StatCounter";

const PathPlanningSandbox = dynamic(
  () =>
    import("@/components/interactive/PathPlanningSandbox").then(
      (m) => m.PathPlanningSandbox,
    ),
  { ssr: false },
);

const DISCIPLINES = [
  "Mechanical",
  "Electrical",
  "Geomatics",
  "Software & Controls",
  "Systems Integration",
];

export const AboutSection = () => {
  return (
    <section className="relative w-full py-24 z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2">
        {/* Left Content (Right side is empty for the floating rover) */}
        <div className="pointer-events-auto">
          <SectionLabel>WHO WE ARE</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl text-cream mb-8">
            BUILT BY BUILDERS
          </h2>
          <p className="font-sans text-lg text-cream/80 mb-12 max-w-xl leading-relaxed">
            ROAM is a newly founded robotics club driven by curiosity,
            innovation, and hands-on engineering. Our mission is to bring
            together students from different technical backgrounds to build
            advanced autonomous systems from the ground up.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-12 mb-12">
            <StatCounter end={15} label="ACTIVE MEMBERS" />
            <StatCounter end={5} label="DISCIPLINES" />
            <StatCounter end={1} label="FLAGSHIP ROVER" />
          </div>

          {/* Discipline Pills */}
          <div className="flex flex-wrap gap-3 max-w-xl">
            {DISCIPLINES.map((discipline, i) => (
              <motion.div
                key={discipline}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="px-4 py-2 border border-primary bg-surface-2 rounded-none font-sans text-sm text-cream"
              >
                {discipline}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Interactive 3D sandbox */}
        <div className="pointer-events-auto mt-12 md:mt-0 md:pl-8">
          <PathPlanningSandbox />
        </div>
      </div>
    </section>
  );
};
