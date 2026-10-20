"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "./constants";

export default function ProjectsClient() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-bg pt-24">
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionLabel>WHAT WE&apos;VE BUILT</SectionLabel>
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] text-cream leading-[0.85] mb-6">
            PROJECTS
          </h1>
          <p className="font-sans text-lg text-cream/80 max-w-2xl leading-relaxed">
            Every rover starts as a rig on a desk. Here&apos;s what we&apos;ve built so far.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24 w-full flex flex-col gap-12">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </section>
    </div>
  );
}