"use client";

import React from "react";
import { motion } from "framer-motion";
import { JoinHero } from "@/components/sections/join/JoinHero";
import { RolesSection } from "@/components/sections/join/RolesSection";
import { BenefitsExpectations } from "@/components/sections/join/BenefitsExpectations";
import { TEAM_EMAIL } from "@/lib/site";

export default function JoinClient() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-bg">
      <JoinHero />
      <RolesSection />
      <BenefitsExpectations />

      {/* ── FINAL CTA — coral background ── */}
      <section className="w-full bg-primary py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-[clamp(2rem,6vw,4rem)] text-bg leading-[0.9] mb-10">
              IF YOU WANT TO HELP SHAPE THIS FROM DAY ONE — NOW IS THE TIME.
            </h2>
            <a
              href="/apply"
              className="inline-block bg-bg text-cream font-sans font-bold uppercase tracking-widest px-10 py-4 hover:bg-surface-2 transition-colors min-h-[44px]"
            >
              APPLY NOW →
            </a>
            <p className="font-mono text-xs text-bg/70 mt-8 tracking-wide">
              Questions?{" "}
              <a
                href={`mailto:${TEAM_EMAIL}?subject=Join%20ROAM%20%E2%80%94%20Question`}
                className="underline hover:text-bg transition-colors"
              >
                {TEAM_EMAIL}
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
