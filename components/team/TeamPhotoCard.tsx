"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { memberPhotoUrl } from "@/lib/members/photo";
import { ProfileLinks } from "./ProfileLinks";

type TeamPhotoCardProps = {
  name: string;
  roleLabel: string;
  bio?: string | null;
  photoPath?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  index?: number;
  expanded?: boolean;
};

/** Side panel direction for desktop 4-col grid (last col opens left). */
function desktopPanelPosition(index: number): string {
  return index % 4 === 3
    ? "md:right-full md:left-auto md:border-l md:border-r-0"
    : "md:left-full md:right-auto md:border-r md:border-l-0";
}

/**
 * Lead card: on mobile, blur-overlay on the photo (no side expand).
 * On md+, side panel overlays dimmed neighbors.
 */
export function TeamPhotoCard({
  name,
  roleLabel,
  bio,
  photoPath,
  linkedinUrl,
  portfolioUrl,
  index = 0,
  expanded = false,
}: TeamPhotoCardProps) {
  const photo = memberPhotoUrl(photoPath);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: Math.min(index, 8) * 0.04,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative"
    >
      <div
        className={[
          "relative aspect-[3/4] border bg-surface-2 overflow-hidden transition-[border-color] duration-500",
          expanded ? "border-primary" : "border-border",
        ].join(" ")}
      >
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            className={[
              "object-cover transition-[transform,filter] duration-500 ease-out",
              expanded
                ? "scale-[1.04] blur-sm md:blur-0"
                : "scale-100 blur-0",
            ].join(" ")}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div
            className={[
              "absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-widest text-cream/30 transition-[filter] duration-500",
              expanded ? "blur-sm md:blur-0" : "blur-0",
            ].join(" ")}
          >
            NO PHOTO
          </div>
        )}

        {/* Resting name */}
        <div
          className={[
            "absolute inset-x-0 bottom-0 p-2.5 sm:p-3 bg-gradient-to-t from-bg via-bg/60 to-transparent pointer-events-none transition-opacity duration-300",
            expanded ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <p className="font-display text-base sm:text-lg md:text-xl text-cream leading-none truncate">
            {name}
          </p>
        </div>

        <div
          className={[
            "absolute left-0 top-0 bottom-0 w-[2px] bg-primary origin-top transition-transform duration-700 ease-out z-10",
            expanded ? "scale-y-100" : "scale-y-0",
          ].join(" ")}
        />

        {/* Mobile overlay (no sideways expand) */}
        <div
          className={[
            "md:hidden absolute inset-0 flex flex-col justify-end gap-2 p-3 sm:p-4 bg-bg/80 transition-opacity duration-300",
            expanded
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          ].join(" ")}
          aria-hidden={!expanded}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
            {roleLabel}
          </p>
          <h3 className="font-display text-lg sm:text-xl text-cream leading-none">
            {name}
          </h3>
          {bio && (
            <p className="font-sans text-[11px] text-cream/70 leading-relaxed line-clamp-4">
              {bio}
            </p>
          )}
          {expanded && (
            <ProfileLinks
              name={name}
              linkedinUrl={linkedinUrl}
              portfolioUrl={portfolioUrl}
              compact
            />
          )}
        </div>
      </div>

      {/* Desktop side panel */}
      <div
        className={[
          "hidden md:block absolute top-0 h-full overflow-hidden z-10 bg-bg",
          "shadow-[12px_8px_40px_rgba(0,0,0,0.5)]",
          "transition-[width,opacity,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          desktopPanelPosition(index),
          expanded
            ? "w-[min(15rem,42vw)] opacity-100 border border-primary"
            : "w-0 opacity-0 border border-transparent pointer-events-none",
        ].join(" ")}
        aria-hidden={!expanded}
      >
        <div className="h-full w-[min(15rem,42vw)] p-4 md:p-5 flex flex-col justify-end gap-2.5 box-border">
          <p
            className={[
              "font-mono text-[10px] uppercase tracking-[0.2em] text-primary transition-all duration-500",
              expanded
                ? "translate-x-0 opacity-100 delay-75"
                : "translate-x-2 opacity-0",
            ].join(" ")}
          >
            {roleLabel}
          </p>
          <h3
            className={[
              "font-display text-2xl text-cream leading-none transition-all duration-500",
              expanded
                ? "translate-x-0 opacity-100 delay-100"
                : "translate-x-2 opacity-0",
            ].join(" ")}
          >
            {name}
          </h3>
          {bio && (
            <p
              className={[
                "font-sans text-xs text-cream/60 leading-relaxed line-clamp-5 transition-all duration-500",
                expanded
                  ? "translate-x-0 opacity-100 delay-150"
                  : "translate-x-2 opacity-0",
              ].join(" ")}
            >
              {bio}
            </p>
          )}
          {expanded && (
            <div className="translate-x-0 opacity-100 delay-200 transition-all duration-500">
              <ProfileLinks
                name={name}
                linkedinUrl={linkedinUrl}
                portfolioUrl={portfolioUrl}
              />
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
