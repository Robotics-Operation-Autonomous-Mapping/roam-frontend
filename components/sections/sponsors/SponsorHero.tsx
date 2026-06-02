"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SPONSORSHIP_EMAIL } from "@/lib/site";
import { SponsorNetworkCanvas } from "./SponsorNetworkCanvas";

export const SponsorHero = () => {
  const generalMailto = `mailto:${SPONSORSHIP_EMAIL}?subject=Sponsorship%20Inquiry%20%E2%80%94%20General&body=Hi%20ROAM%20team%2C%0A%0AI%27d%20like%20to%20learn%20more%20about%20sponsoring%20ROAM.%0A%0AOrganization%3A%20%0AContact%20Name%3A%20%0AMessage%3A%20`;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-border bg-bg">
      {/* Interactive Network Background */}
      <SponsorNetworkCanvas />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      
      {/* Radial fade to black at edges so the network doesn't look cut off */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--color-bg)_100%)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          {/* Left Column: Typography */}
          <div className="flex-1">
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
              className="font-display text-[clamp(3.5rem,12vw,8rem)] leading-[0.85] tracking-tighter text-cream mb-6 max-w-4xl uppercase"
            >
              THE ROVER<br />
              DOESN&apos;T BUILD<br />
              <span className="text-primary" style={{ textShadow: "0 0 40px rgba(232,81,42,0.3)" }}>ITSELF.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-sm md:text-base text-cream/60 max-w-md leading-relaxed mb-10"
            >
              We are building the future of autonomous robotics. Join our network of industry leaders, innovators, and visionaries powering the ATLAS-1 mission.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-6"
            >
              <a
                href={generalMailto}
                className="inline-flex items-center gap-3 font-sans font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 bg-primary text-bg hover:bg-white hover:text-bg transition-all duration-300"
              >
                Become a Partner
                <span className="text-lg leading-none">→</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: High-tech badge/stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex flex-col gap-4 w-[320px]"
          >
            <div className="p-6 border border-primary/20 bg-surface/40 backdrop-blur-md rounded-sm">
              <div className="font-mono text-[10px] text-primary tracking-[0.3em] uppercase mb-4">
                Mission Status
              </div>
              <div className="font-display text-3xl text-cream mb-2">ACTIVE</div>
              <div className="font-sans text-xs text-muted leading-relaxed">
                Seeking strategic partners for hardware, software, and operational funding to deploy ATLAS-1.
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-white/10 bg-surface/20 backdrop-blur-md">
                <div className="font-mono text-[9px] text-muted tracking-widest uppercase mb-2">Network</div>
                <div className="font-display text-2xl text-cream">50+</div>
              </div>
              <div className="p-4 border border-white/10 bg-surface/20 backdrop-blur-md">
                <div className="font-mono text-[9px] text-muted tracking-widest uppercase mb-2">Disciplines</div>
                <div className="font-display text-2xl text-cream">8</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
