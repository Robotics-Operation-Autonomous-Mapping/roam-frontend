"use client";

import React, { useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { AboutSection }    from "@/components/sections/AboutSection";
import { VisionSection }   from "@/components/sections/VisionSection";
import { TechStackSection} from "@/components/sections/TechStackSection";
import { JoinCTASection }  from "@/components/sections/JoinCTASection";


const MarsHero = dynamic(
  () => import("@/components/hero/MarsHero"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-screen bg-[#0A0A0B]" aria-hidden="true" />
    ),
  }
);

// Rover scene removed as per user request

// ─── Sponsor CTA (same bento block as before) ────────────────────────────────
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button }       from "@/components/ui/Button";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const scrollUnlocked = useRef(false);

  const handleRoverArrived = useCallback(() => {
    scrollUnlocked.current = true;
  }, []);

  return (
    <div className="flex flex-col w-full">

      <MarsHero onRoverArrived={handleRoverArrived} />
      <div className="relative z-10 bg-bg">
        <AboutSection />
        <VisionSection />
        <TechStackSection />
        <JoinCTASection />

        {/* ── Sponsor CTA ──────────────────────────────────────────────────── */}
        <section className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-24 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">

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
                  <Button href="/sponsors" variant="primary">
                    View Sponsorship Packages
                  </Button>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}