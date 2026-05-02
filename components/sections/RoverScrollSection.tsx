"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { CanvasErrorBoundary } from "@/components/ui/CanvasErrorBoundary";

const RoverCanvas = dynamic(() => import("@/components/rover/RoverCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-bg">
      <span className="font-mono text-sm text-primary animate-pulse">
        [ INITIALIZING 3D RENDERER... ]
      </span>
    </div>
  ),
});

const ASSEMBLY_PHASES = [
  {
    label: "PHASE 01 / DISASSEMBLED",
    title: "16 systems. Zero compromises.",
  },
  {
    label: "PHASE 02 / MOBILITY SYSTEMS",
    title: "6-wheel independent suspension for all-terrain navigation.",
  },
  {
    label: "PHASE 03 / COMPUTE CORE",
    title: "Two NVIDIA Jetson Orins. Onboard AI at the edge.",
  },
  {
    label: "PHASE 04 / SENSOR SUITE",
    title:
      "Dual LiDAR. Stereo RGB. IR thermal. Eyes that see in every dimension.",
  },
  {
    label: "PHASE 05 / OPERATIONAL",
    title: "Autonomous. Aware. Alive.",
  },
];

/**
 * RoverScrollSection — pinned scroll-driven rover assembly experience.
 *
 * Architecture note: Hero content lives INSIDE this component so it is
 * pinned together with the canvas by GSAP ScrollTrigger. The hero fades
 * out as assembly begins. Scroll progress is tracked via window.scrollY
 * relative to the section's offsetTop (NOT getBoundingClientRect, which
 * returns 0 during GSAP pinning and breaks progress calculation).
 */
export const RoverScrollSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Record the section's document-relative top position once on mount
  // before GSAP modifies the DOM
  const sectionTopRef = useRef<number>(0);

  const [activePhase, setActivePhase] = useState(-1); // -1 = hero visible
  const TOTAL_SCROLL =
    typeof window !== "undefined" ? window.innerHeight * 6 : 4000;

  const handleSeeRover = useCallback(() => {
    if (!containerRef.current) return;
    const start = containerRef.current.offsetTop;
    window.scrollTo({
      top: start + window.innerHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      sectionTopRef.current = containerRef.current.offsetTop;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const sectionTop = sectionTopRef.current;

    // Not yet reached the section
    if (scrollY < sectionTop) {
      setActivePhase(-1);
      return;
    }

    const progress = Math.min((scrollY - sectionTop) / TOTAL_SCROLL, 1);

    // Show hero until user has scrolled at least 8% into the assembly
    if (progress < 0.08) {
      setActivePhase(-1);
    } else if (progress < 0.15) {
      setActivePhase(0);
    } else if (progress < 0.35) {
      setActivePhase(1);
    } else if (progress < 0.55) {
      setActivePhase(2);
    } else if (progress < 0.75) {
      setActivePhase(3);
    } else {
      setActivePhase(4);
    }
  }, [TOTAL_SCROLL]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const isHero = activePhase === -1;

  return (
    <section
      ref={containerRef}
      id="rover-assembly-section"
      className="relative w-full h-screen bg-bg overflow-hidden"
      aria-label="Scroll-driven 3D rover assembly experience"
    >
      {/* ── 3D Canvas — full viewport background ── */}
      <div className="absolute inset-0 z-0">
        <CanvasErrorBoundary>
          <RoverCanvas containerRef={containerRef} />
        </CanvasErrorBoundary>
      </div>

      {/* ── Hero overlay — visible before assembly begins ── */}
      {isHero && (
        <motion.div
          key="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center pointer-events-none"
        >
          {/* Star field */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="stars" />
            <div className="stars stars-2" />
            <div className="stars stars-3" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center pointer-events-auto">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SectionLabel className="mb-8">
                AUTONOMOUS SYSTEMS CLUB
              </SectionLabel>
            </motion.div>

            {/* Clip-path wipe headline */}
            <h1 className="font-display flex flex-col items-center mb-8">
              {["EXPLORE.", "UNDERSTAND.", "RECREATE."].map((word, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.span
                    className="block text-[clamp(3.5rem,12vw,8rem)] leading-[0.85] tracking-tight text-cream"
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    animate={{ clipPath: "inset(0% 0 0 0)" }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {word}
                  </motion.span>
                </div>
              ))}
            </h1>

            {/* Subline */}
            <motion.p
              className="font-sans text-lg md:text-xl text-cream/90 max-w-[560px] mx-auto mb-12 leading-relaxed"
              initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
              animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Building intelligent autonomous systems that explore, understand,
              and digitally recreate the world around them.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button href="/join" variant="primary">
                Apply Now
              </Button>
              <Button variant="ghost" onClick={handleSeeRover}>
                See the Rover ↓
              </Button>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-primary pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* ── Phase text — appears as assembly progresses ── */}
      {!isHero && (
        <motion.div
          key={`phase-${activePhase}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-[12%] left-[6%] z-20 pointer-events-none w-[88%] md:w-[42%]"
        >
          <div className="bg-bg/75 backdrop-blur-sm px-6 py-5 border-l-2 border-primary">
            <SectionLabel>{ASSEMBLY_PHASES[activePhase]?.label}</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream tracking-wide uppercase leading-none mt-2">
              {ASSEMBLY_PHASES[activePhase]?.title}
            </h2>
          </div>
        </motion.div>
      )}
    </section>
  );
};
