"use client";

import React from "react";
import { MILESTONES } from "./constants";

export const UpcomingGrid = () => (
  <section className="max-w-7xl mx-auto px-6 w-full mb-24">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-primary bg-surface p-8">
        <h3 className="font-display text-2xl text-primary mb-6 border-b border-primary/30 pb-4">
          IN PROGRESS
        </h3>
        <ul className="space-y-3">
          {MILESTONES.filter((m) => m.status === "active").map((m) => (
            <li key={m.label} className="flex items-start gap-3 font-sans text-sm text-cream/90">
              <span className="text-primary mt-1 shrink-0">●</span>
              {m.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-border bg-surface p-8">
        <h3 className="font-display text-2xl text-muted mb-6 border-b border-border pb-4">
          UPCOMING
        </h3>
        <ul className="space-y-3">
          {MILESTONES.filter((m) => m.status === "upcoming").slice(0, 5).map((m) => (
            <li key={m.label} className="flex items-start gap-3 font-sans text-sm text-cream/50">
              <span className="text-muted mt-1 shrink-0">○</span>
              {m.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
