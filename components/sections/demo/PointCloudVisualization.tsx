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
      <SectionLabel className="mb-4">LIVE LIDAR SLAM SIMULATION</SectionLabel>
      <h2 className="font-display text-4xl md:text-5xl text-cream mb-8">
        WATCH THE ROVER MAP CAMPUS
      </h2>
    </section>

    <div className="relative w-full mb-2" style={{ height: "75vh", minHeight: "460px" }}>
      <CanvasErrorBoundary>
        <PointCloudCanvas />
      </CanvasErrorBoundary>
    </div>

    <div className="max-w-7xl mx-auto px-6 w-full mb-24">
      <p className="font-sans text-cream/70 leading-relaxed max-w-3xl">
        A simulated rover drives Collegiate Boulevard through the heart of the University of
        Calgary, built from real OpenStreetMap data. It starts blind: a spinning 32-channel LiDAR
        fires over a hundred thousand laser pulses a second, and every return becomes a point. As
        it drives, MacHall, the Engineering blocks, Kinesiology and the cherry trees appear out of
        the dark, stitched into one map with a single point per voxel. Switch to class colours to
        see the scan split into roads, paths, grass, buildings, glass and trees, the way our
        perception pipeline labels it.
      </p>
    </div>
  </>
);
