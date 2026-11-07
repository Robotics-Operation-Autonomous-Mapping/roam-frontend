"use client";

import React, { useCallback, useRef } from "react";
import { AboutSection } from "@/components/sections/AboutSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { JoinCTASection } from "@/components/sections/JoinCTASection";
import { SponsorCTA } from "@/components/sections/SponsorCTA";
// Imported normally (not client-only), so the headline and buttons are in the
// HTML the server sends. The canvas animation still only starts in the browser.
import MarsHero from "@/components/hero/MarsHero";

export default function HomeClient() {
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
        <SponsorCTA />
      </div>
    </div>
  );
}
