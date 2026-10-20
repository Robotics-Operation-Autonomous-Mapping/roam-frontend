"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PROJECTS } from "./constants";

const GITHUB_ORG = "https://github.com/Robotics-Operation-Autonomous-Mapping";

export const ProjectsHero = () => {
  const completed = PROJECTS.filter((p) => p.status === "COMPLETED").length;

  return (
    <section className="relative w-full overflow-hidden border-b border-border">
      {/* Background: faint grid with an orange glow on the right */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#F5ECD7 1px, transparent 1px), linear-gradient(90deg, #F5ECD7 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="absolute -right-40 top-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-40 pb-20 md:pt-48 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionLabel>WHAT WE&apos;VE BUILT</SectionLabel>
          <h1 className="font-display text-[clamp(4rem,14vw,10rem)] leading-[0.82] mb-8">
            <span className="block text-cream">FROM RIG</span>
            <span className="block text-primary">TO ROVER.</span>
          </h1>
          <p className="font-sans text-lg text-cream/80 max-w-xl leading-relaxed mb-10">
            Every rover starts as a rig on a desk. These are the machines we&apos;ve designed,
            built and mapped with so far. Drag the models to look around them.
          </p>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
            <div>
              <div className="font-display text-5xl text-cream leading-none">{PROJECTS.length}</div>
              <div className="font-mono text-[10px] text-cream/40 tracking-widest uppercase mt-2">
                Projects
              </div>
            </div>
            <div>
              <div className="font-display text-5xl text-cream leading-none">{completed}</div>
              <div className="font-mono text-[10px] text-cream/40 tracking-widest uppercase mt-2">
                Completed
              </div>
            </div>
            <a
              href={GITHUB_ORG}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-sans font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-bg transition-all duration-300"
            >
              Our code on GitHub
              <span className="text-lg leading-none">↗</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
