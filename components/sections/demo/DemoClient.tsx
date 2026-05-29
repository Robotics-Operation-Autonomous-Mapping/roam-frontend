"use client";

import React from "react";
import dynamic from "next/dynamic";
import { DemoHero } from "@/components/sections/demo/DemoHero";
import { StatusBanner } from "@/components/sections/demo/StatusBanner";
import { LiveMetrics } from "@/components/sections/demo/LiveMetrics";
import { PointCloudVisualization } from "@/components/sections/demo/PointCloudVisualization";
import { ProgressTracker } from "@/components/sections/demo/ProgressTracker";
import { TechStackTable } from "@/components/sections/demo/TechStackTable";
import { UpcomingGrid } from "@/components/sections/demo/UpcomingGrid";

const AutoNavigationSimulation = dynamic(
  () =>
    import("@/components/interactive/AutoNavigationSimulation").then(
      (m) => m.AutoNavigationSimulation
    ),
  { ssr: false }
);

export default function DemoClient() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-bg pt-24">
      <DemoHero />
      <StatusBanner />
      <LiveMetrics />
      <PointCloudVisualization />
      <AutoNavigationSimulation />
      <ProgressTracker />
      <TechStackTable />
      <UpcomingGrid />
    </div>
  );
}
