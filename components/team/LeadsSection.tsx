"use client";

import React, { useRef, useState } from "react";
import type { PublicMember } from "@/lib/members/types";
import { SUBTEAMS } from "@/lib/members/types";
import { SUBTEAM_LABELS } from "@/lib/members/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TeamPhotoCard } from "./TeamPhotoCard";

export function LeadsSection({ leads }: { leads: PublicMember[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const pointerType = useRef<"mouse" | "touch" | "pen" | "other">("other");
  const gridRef = useRef<HTMLDivElement>(null);

  if (!leads.length) return null;

  const ordered = [...leads].sort((a, b) => {
    const ai = a.subteam ? SUBTEAMS.indexOf(a.subteam) : 999;
    const bi = b.subteam ? SUBTEAMS.indexOf(b.subteam) : 999;
    if (ai !== bi) return ai - bi;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  const isTouchLike = () =>
    pointerType.current === "touch" || pointerType.current === "pen";

  const clearHover = () => {
    if (isTouchLike()) return;
    setActiveId(null);
    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      gridRef.current?.contains(active)
    ) {
      active.blur();
    }
  };

  return (
    <section className="py-16 md:py-24 bg-surface relative overflow-x-clip">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E8512A 1px, transparent 1px), linear-gradient(to bottom, #E8512A 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 overflow-x-clip">
        <SectionLabel className="mb-4">LEADERSHIP</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-cream mb-3 md:mb-4">
          SUBTEAM LEADS
        </h2>
        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-cream/40 mb-10 md:mb-14">
          <span className="md:hidden">Tap a photo · details on the card</span>
          <span className="hidden md:inline">
            Hover a photo · expands sideways
          </span>
        </p>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 items-start"
          onMouseLeave={clearHover}
        >
          {ordered.map((lead, index) => {
            const isActive = activeId === lead.id;
            const isDimmed = activeId !== null && !isActive;

            return (
              <div
                key={lead.id}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-label={`${lead.full_name}, ${
                  lead.subteam
                    ? `${SUBTEAM_LABELS[lead.subteam]} Lead`
                    : lead.title || "Lead"
                }`}
                onPointerDown={(e) => {
                  pointerType.current =
                    e.pointerType === "mouse" ||
                    e.pointerType === "touch" ||
                    e.pointerType === "pen"
                      ? e.pointerType
                      : "other";
                }}
                onMouseEnter={() => {
                  if (isTouchLike()) return;
                  setActiveId(lead.id);
                }}
                onClick={() => {
                  if (isTouchLike()) {
                    setActiveId((prev) =>
                      prev === lead.id ? null : lead.id,
                    );
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveId((prev) =>
                      prev === lead.id ? null : lead.id,
                    );
                  }
                  if (e.key === "Escape") setActiveId(null);
                }}
                onBlur={(e) => {
                  if (
                    !e.currentTarget.contains(e.relatedTarget as Node | null) &&
                    !gridRef.current?.contains(e.relatedTarget as Node | null)
                  ) {
                    setActiveId((prev) =>
                      prev === lead.id ? null : prev,
                    );
                  }
                }}
                className={[
                  "relative outline-none transition-[opacity,transform,filter] duration-300 ease-out cursor-pointer",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                  isActive ? "z-30" : "z-0",
                  isDimmed
                    ? "md:opacity-25 md:scale-[0.97] md:blur-[1px]"
                    : "opacity-100 scale-100 blur-0",
                ].join(" ")}
              >
                <TeamPhotoCard
                  index={index}
                  expanded={isActive}
                  name={lead.full_name}
                  roleLabel={
                    lead.subteam
                      ? `${SUBTEAM_LABELS[lead.subteam]} Lead`
                      : lead.title || "Lead"
                  }
                  bio={lead.bio || lead.interesting_thing}
                  photoPath={lead.photo_path}
                  linkedinUrl={lead.linkedin_url}
                  portfolioUrl={lead.portfolio_url}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
