"use client";

import React, { useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { AboutSection } from "@/components/sections/AboutSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { JoinCTASection } from "@/components/sections/JoinCTASection";
import { SponsorCTA } from "@/components/sections/SponsorCTA";
import { HERO_H1_SR } from "@/components/hero/heroCopy";

const MarsHero = dynamic(() => import("@/components/hero/MarsHero"), {
  ssr: false,
  // The hero is client-only; this placeholder carries the same h1 so it is in the server HTML.
  loading: () => (
    <div className="w-full min-h-screen bg-[#0A0A0B]">
      <h1 className="sr-only">{HERO_H1_SR}</h1>
    </div>
  ),
});

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
