"use client";

import React from "react";
import dynamic from "next/dynamic";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CanvasErrorBoundary } from "@/components/ui/CanvasErrorBoundary";

const PointCloudCanvas = dynamic(
  () => import("@/components/pointcloud/PointCloudCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-bg border border-border">
        <span className="font-mono text-sm text-primary animate-pulse">
          [ INITIALIZING POINT CLOUD SIMULATION... ]
        </span>
      </div>
    ),
  }
);

export const PointCloudVisualization = () => (
  <>
    <section className="max-w-7xl mx-auto px-6 w-full mb-6">
      <SectionLabel className="mb-4">LIVE POINT CLOUD SIMULATION</SectionLabel>
      <h2 className="font-display text-4xl md:text-5xl text-cream mb-8">
        3D TERRAIN VISUALIZATION
      </h2>
    </section>

    <div className="relative w-full mb-2" style={{ height: "60vh", minHeight: "400px" }}>
      <CanvasErrorBoundary>
        <PointCloudCanvas />
      </CanvasErrorBoundary>
    </div>

    <div className="max-w-7xl mx-auto px-6 w-full mb-24">
      <p className="font-sans text-cream/70 leading-relaxed max-w-3xl">
        Our rover will use dual LiDAR sensors to generate point clouds like this in real time,
        capturing the geometry of its surroundings and feeding it into a 3D digital twin pipeline.
        Each coloured point represents a LiDAR return — low elevations in blue, mid in cream, peaks in coral.
      </p>
    </div>
  </>
);
