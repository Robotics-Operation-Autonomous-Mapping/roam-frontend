"use client";

import React from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const MarsHeroContent = ({
  controls,
}: {
  controls: ReturnType<typeof useAnimation>;
}) => {
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div className="absolute inset-0 z-10 flex items-end pointer-events-none">
      <div className="max-w-7xl mx-auto w-full px-6 pb-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate={controls}
          className="flex flex-col items-start"
        >
          <motion.div variants={item}>
            <SectionLabel className="mb-5">
              Robotics Operation & Autonomous Mapping
            </SectionLabel>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(4rem,11vw,8.5rem)] leading-[0.86] tracking-tight text-cream mb-7"
          >
            <span className="sr-only">ROAM Robotics Club - Schulich School of Engineering, University of Calgary</span>
            EXPLORE.
            <br />
            <span className="text-primary">UNDERSTAND.</span>
            <br />
            <span
              className="text-cream"
              style={{
                WebkitTextStroke: "1px rgba(245,236,215,0.25)",
                color: "transparent",
                textShadow: "0 0 20px rgba(232,81,42,0.2)", // Subtle Martian glow
              }}
            >
              RECREATE.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="font-mono text-sm text-cream/45 max-w-[420px] leading-[1.85] tracking-wide mb-10"
          >
            We build machines that read the world.
            <br />
            Student engineers. Serious technology.
            <br />
            One rover at a time.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-start gap-5 pointer-events-auto"
          >
            <Button href="/join" variant="primary">
              Apply Now
            </Button>
            <Button href="/demo" variant="ghost">
              Explore the Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
