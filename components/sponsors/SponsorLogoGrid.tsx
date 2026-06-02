"use client";

import type { Sponsor, SponsorTierLevel } from "./sponsors.data";
import { SponsorLogoCard } from "./SponsorLogoCard";
import styles from "./SponsorsSection.module.css";

interface SponsorLogoGridProps {
  sponsors: Sponsor[];
  variant?: SponsorTierLevel;
  /** Fits logos inside mission-level package cards without overflow. */
  compact?: boolean;
}

const variantClass: Record<SponsorTierLevel, string> = {
  platinum: styles.logoGridPlatinum,
  gold: styles.logoGrid,
  basic: styles.logoGridBasic,
};

export function SponsorLogoGrid({
  sponsors,
  variant = "gold",
  compact = false,
}: SponsorLogoGridProps) {
  const gridClass = [
    variantClass[variant],
    compact ? styles.logoGridCompact : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={gridClass}>
      {sponsors.map((sponsor) => (
        <SponsorLogoCard
          key={sponsor.name}
          sponsor={sponsor}
          isPlatinum={variant === "platinum"}
          compact={compact}
        />
      ))}
    </div>
  );
}
