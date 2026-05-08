"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const SponsorHero = () => {
  const generalMailto =
    "mailto:schulichroam@gmail.com?subject=Sponsorship%20Inquiry%20%E2%80%94%20General&body=Hi%20ROAM%20team%2C%0A%0AI%27d%20like%20to%20learn%20more%20about%20sponsoring%20ROAM.%0A%0AOrganization%3A%20%0AContact%20Name%3A%20%0AMessage%3A%20";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden border-b border-white/10 pt-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel className="mb-8">Partnership Opportunities</SectionLabel>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(3.5rem,15vw,9rem)] leading-[0.8] tracking-tighter text-cream mb-10 max-w-6xl uppercase"
        >
          THE ROVER<br />
          DOESN&apos;T BUILD<br />
          <span className="text-primary">ITSELF.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="font-mono text-base md:text-lg text-cream/60 max-w-[540px] leading-relaxed tracking-wide mb-12"
        >
          Behind every bolt, every sensor, every line of autonomous code — there&apos;s a
          team of students who refuse to accept limits. Your sponsorship doesn&apos;t just
          fund hardware. It launches careers, proves concepts, and puts your brand
          at the frontier of what students can achieve.
        </motion.p>

        <motion.a
          href={generalMailto}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          className="inline-block font-mono text-sm uppercase tracking-[0.2em] px-10 py-4 bg-primary text-bg hover:bg-primary/85 transition-colors duration-200"
        >
          Get in Touch
        </motion.a>
      </div>
    </section>
  );
};
