"use client";

import Image from "next/image";
import Link from "next/link";
import type { Sponsor } from "./sponsors.data";
import styles from "./SponsorsSection.module.css";

interface SponsorLogoCardProps {
  sponsor: Sponsor;
  isPlatinum?: boolean;
  compact?: boolean;
}

export function SponsorLogoCard({
  sponsor,
  isPlatinum,
  compact,
}: SponsorLogoCardProps) {
  const wrapperClass = [
    isPlatinum ? styles.logoImageWrapperPlatinum : styles.logoImageWrapper,
    compact ? styles.logoImageWrapperCompact : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={sponsor.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={[styles.logoCard, compact ? styles.logoCardCompact : ""]
        .filter(Boolean)
        .join(" ")}
      aria-label={`Visit ${sponsor.name} website`}
    >
      <div className={[wrapperClass, styles.logoImageWell].filter(Boolean).join(" ")}>
        <Image
          src={sponsor.logoSrc}
          alt={sponsor.altText}
          fill
          sizes={
            compact
              ? "(max-width: 768px) 120px, 140px"
              : "(max-width: 1024px) 200px, 240px"
          }
          className={styles.logoImage}
          style={{ objectFit: "contain" }}
        />
      </div>
    </Link>
  );
}
