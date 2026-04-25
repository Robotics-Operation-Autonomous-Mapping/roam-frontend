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
      </div>
    </div>
  );
}
