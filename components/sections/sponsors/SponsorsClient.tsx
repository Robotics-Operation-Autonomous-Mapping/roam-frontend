"use client";

import React from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SponsorHero } from "@/components/sections/sponsors/SponsorHero";
import { StatBar } from "@/components/sections/sponsors/StatBar";
import { WhyPartner } from "@/components/sections/sponsors/WhyPartner";
import { PackageSection } from "@/components/sections/sponsors/PackageSection";
import { ContactSection } from "@/components/sections/sponsors/ContactSection";

export default function SponsorsClient() {
  return (
    <div className="flex flex-col w-full bg-bg text-cream">
      <SponsorHero />
      <StatBar />
      <WhyPartner />
      <PackageSection />
      <ContactSection />

      {/* ── CURRENT SPONSORS placeholder ── */}
      <section className="border-t border-white/10 max-w-7xl mx-auto px-6 py-20 w-full">
        <SectionLabel className="mb-8 block text-center">Current Sponsors</SectionLabel>
        <div className="border border-dashed border-white/15 py-14 text-center">
          <p className="font-mono text-xs text-cream/25 uppercase tracking-[0.25em]">
            Sponsor logos coming soon
          </p>
        </div>
      </section>
    </div>
  );
}
