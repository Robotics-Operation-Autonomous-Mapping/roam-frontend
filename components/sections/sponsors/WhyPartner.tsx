"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { WHY_SPONSOR } from "./constants";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export const WhyPartner = () => (
  <section className="max-w-7xl mx-auto px-6 py-32 md:py-48 w-full">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mb-20"
    >
      <SectionLabel className="mb-6">Why Partner With Us</SectionLabel>
      <h2 className="font-display text-[clamp(4rem,10vw,7rem)] leading-[0.8] tracking-tighter text-cream max-w-4xl uppercase">
        YOUR BRAND.<br />
        <span className="text-primary">OUR TERRAIN.</span>
      </h2>
      <div className="h-[1px] w-full bg-gradient-to-r from-primary/40 to-transparent mt-10" />
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
      {WHY_SPONSOR.map((item, i) => (
        <motion.div
          key={item.title}
          custom={i}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-bg p-8 flex flex-col gap-4"
        >
          <span className="font-mono text-3xl text-primary">{item.icon}</span>
          <h3 className="font-display text-2xl uppercase tracking-tight text-cream">
            {item.title}
          </h3>
          <p className="font-mono text-sm text-cream/50 leading-relaxed tracking-wide">
            {item.body}
          </p>
        </motion.div>
      ))}
    </div>
  </section>
);
