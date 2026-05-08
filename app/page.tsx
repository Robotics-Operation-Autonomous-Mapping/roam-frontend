"use client";

import React, { useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { AboutSection } from "@/components/sections/AboutSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { JoinCTASection } from "@/components/sections/JoinCTASection";
import { SponsorCTA } from "@/components/sections/SponsorCTA";

const MarsHero = dynamic(() => import("@/components/hero/MarsHero"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-screen bg-[#0A0A0B]" aria-hidden="true" />
  ),
});

export default function Home() {
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