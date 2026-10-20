"use client";

import dynamic from "next/dynamic";
import { CanvasErrorBoundary } from "@/components/ui/CanvasErrorBoundary";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });


import Image from "next/image";
import type { Project } from "./constants";

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-2 border border-border bg-surface">
      {/* Image, or a placeholder until we have one */}
        <div className="relative aspect-video lg:aspect-auto lg:min-h-[420px] bg-surface-2">        {project.model ? (
        <CanvasErrorBoundary>
            <ModelViewer url={project.model} />
        </CanvasErrorBoundary>
        ) : project.image ? (
        <Image src={project.image} alt={`${project.name} rig`} fill className="object-cover" />
        ) : (
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs text-cream/40 tracking-[0.3em]">
            [ MODEL COMING SOON ]
            </span>
        </div>
        )}
      </div>

      {/* Text */}
      <div className="p-8 flex flex-col gap-6">
        <div>
          <p className="font-mono text-xs text-primary tracking-[0.3em] mb-2">
            {project.status}
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-cream leading-none">
            {project.name}
          </h2>
          <p className="font-sans text-cream/60 mt-2">{project.tagline}</p>
        </div>

        <p className="font-sans text-cream/80 leading-relaxed">{project.summary}</p>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-6">
          {project.specs.map((spec) => (
            <div key={spec.label}>
              <dt className="font-mono text-[10px] text-cream/40 tracking-widest uppercase">
                {spec.label}
              </dt>
              <dd className="font-sans text-sm text-cream">{spec.value}</dd>
            </div>
          ))}
        </dl>

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start inline-flex items-center gap-3 font-sans font-bold text-xs uppercase tracking-[0.2em] px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-bg transition-all duration-300"
          >
            View code on GitHub
            <span className="text-lg leading-none">↗</span>
          </a>
        )}
      </div>
    </article>
  );
};
