"use client";

import { ProjectsHero } from "./ProjectsHero";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "./constants";

export default function ProjectsClient() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-bg">
      <ProjectsHero />

      <section className="max-w-7xl mx-auto px-6 py-24 w-full flex flex-col gap-12">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </section>
    </div>
  );
}