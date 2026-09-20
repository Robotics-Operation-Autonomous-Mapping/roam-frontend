"use client";

import React from "react";

export const MarsHeroHUD = () => (
  <>
    <div className="absolute top-7 left-6 md:left-[72px] font-mono text-[7px] md:text-[9px] tracking-[0.15em] md:tracking-[0.22em] text-white/20 leading-[1.6] md:leading-[1.9] uppercase pointer-events-none z-10">
      ROAM / ATLAS-1
      <br />
      Engineering · UofC
      <br />
      Status: Operational
    </div>
    <div className="absolute top-7 right-6 md:right-[48px] font-mono text-[7px] md:text-[9px] tracking-[0.15em] md:tracking-[0.22em] text-white/20 leading-[1.6] md:leading-[1.9] text-right uppercase pointer-events-none z-10">
      51.04° N 114.09° W<br />
      Alt: 1042M · Calgary, AB
      <br />
      Mission cycle: Active
    </div>
  </>
);
