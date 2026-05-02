"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { AboutSection } from "@/components/sections/AboutSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { JoinCTASection } from "@/components/sections/JoinCTASection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative min-h-screen bg-bg overflow-hidden flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars" />
          <div className="stars stars-2" />
          <div className="stars stars-3" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full text-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <SectionLabel className="mb-6">AUTONOMOUS SYSTEMS CLUB</SectionLabel>
            <h1 className="font-display text-[clamp(3.5rem,12vw,8rem)] leading-[0.85] tracking-tight text-cream mb-8">
              EXPLORE.<br />UNDERSTAND.<br />RECREATE.
            </h1>
            <p className="font-sans text-lg md:text-xl text-cream/90 max-w-[560px] mx-auto mb-12 leading-relaxed">
              Building intelligent autonomous systems that explore, understand, and digitally recreate the world around them.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button href="/join" variant="primary">Apply Now</Button>
              <Button href="/demo" variant="ghost">Explore the Demo</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Rest of page ── */}
      <div className="relative z-10 bg-bg">
        <AboutSection />
        <VisionSection />
        <TechStackSection />
        <JoinCTASection />

        {/* ── SPONSOR CTA ── ADDED ───────────────────────────────────────────── */}
        <section className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-24 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">

              {/* Left — copy */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-bg p-10 flex flex-col justify-center gap-5"
              >
                <SectionLabel>Support ROAM</SectionLabel>
                <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.9] tracking-tight text-cream">
                  BACK THE<br />
                  <span className="text-primary">BUILDERS.</span>
                </h2>
                <p className="font-mono text-sm text-cream/50 leading-relaxed tracking-wide max-w-sm">
                  Your sponsorship puts a student-built rover on the competition
                  field — and your brand at the frontier of what's possible.
                </p>
              </motion.div>

              {/* Right — highlights + CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-bg p-10 flex flex-col justify-center gap-6"
              >
                <ul className="flex flex-col gap-3">
                  {[
                    "Logo on the rover & the website",
                    "Instagram, LinkedIn & newsletter features",
                    "Live showcase at competitions & conferences",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 shrink-0 bg-primary rotate-45 inline-block" />
                      <span className="font-mono text-sm text-cream/70 tracking-wide">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Button href="/sponsors" variant="primary">View Sponsorship Packages</Button>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
        {/* ── END SPONSOR CTA ─────────────────────────────────────────────────── */}

      </div>
    </div>
  );
}