"use client";

import React from "react";
import { LinkedInIcon } from "./LinkedInIcon";

export function absoluteUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

export function ProfileLinks({
  linkedinUrl,
  portfolioUrl,
  name,
  variant = "inline",
  compact = false,
}: {
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  name: string;
  variant?: "inline" | "hover" | "row";
  compact?: boolean;
}) {
  const linkedin = linkedinUrl?.trim() ? absoluteUrl(linkedinUrl) : null;
  const portfolio = portfolioUrl?.trim() ? absoluteUrl(portfolioUrl) : null;
  if (!linkedin && !portfolio) return null;

  if (variant === "hover") {
    return (
      <div className="absolute inset-0 bg-bg/70 opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
        {linkedin && (
          <span className="w-12 h-12 border border-primary text-primary flex items-center justify-center">
            <LinkedInIcon />
          </span>
        )}
        {portfolio && (
          <span className="w-12 h-12 border border-primary text-primary flex items-center justify-center font-mono text-[10px] tracking-wider">
            WEB
          </span>
        )}
      </div>
    );
  }

  const linkClass = compact
    ? "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-cream/70 hover:text-primary active:text-primary transition-colors min-h-[44px] sm:min-h-0 py-1"
    : "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cream/50 hover:text-primary transition-colors";

  return (
    <div
      className={
        variant === "row"
          ? "flex flex-wrap items-center gap-4"
          : compact
            ? "flex flex-wrap items-center gap-x-3 gap-y-0"
            : "inline-flex flex-wrap items-center gap-4"
      }
    >
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label={`${name} on LinkedIn`}
          onClick={(e) => e.stopPropagation()}
        >
          <LinkedInIcon />
          LinkedIn
        </a>
      )}
      {portfolio && (
        <a
          href={portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label={`${name} portfolio`}
          onClick={(e) => e.stopPropagation()}
        >
          Portfolio
        </a>
      )}
    </div>
  );
}
