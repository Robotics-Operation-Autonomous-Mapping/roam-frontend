"use client";

import React from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

export const JoinCTASection = () => {
  return (
    <section
      id="join-cta"
      className="relative w-full py-32 bg-bg z-10 pointer-events-auto border-t border-border"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2">
        <div>
          <SectionLabel>JOIN THE MISSION</SectionLabel>
          <h2 className="font-display text-5xl md:text-7xl text-cream mb-8 leading-none">
            BUILD THE FUTURE WITH US.
          </h2>
          <p className="font-sans text-lg text-cream/80 mb-8 max-w-lg leading-relaxed">
            Whether you are mechanical, electrical, software, geomatics,
            business, or just hungry to learn — there is a place for you here.
          </p>

          <blockquote className="font-sans italic text-xl md:text-2xl text-primary mb-12 border-l-4 border-primary pl-6 py-2">
            &quot;Learning, collaboration, and execution matter more than
            titles.&quot;
          </blockquote>

          <div className="flex flex-col sm:flex-row gap-6">
            <Button href="/join" variant="primary">
              Apply Now →
            </Button>
            <Button href="/demo" variant="ghost">
              Explore the Demo →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
