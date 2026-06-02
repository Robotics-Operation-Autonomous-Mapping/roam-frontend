"use client";

import React from "react";
import { SponsorHero } from "@/components/sections/sponsors/SponsorHero";
import { StatBar } from "@/components/sections/sponsors/StatBar";
import { PackageSection } from "@/components/sections/sponsors/PackageSection";
import { ContactSection } from "@/components/sections/sponsors/ContactSection";
import { SponsorsSection } from "@/components/sponsors/SponsorsSection";

export default function SponsorsClient() {
  return (
    <div className="flex flex-col w-full bg-bg text-cream">
      <SponsorHero />
      <StatBar />
      <PackageSection />
      <SponsorsSection />
      <ContactSection />
    </div>
  );
}
