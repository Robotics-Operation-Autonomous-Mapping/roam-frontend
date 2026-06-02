"use client";
// components/sponsors/SponsorsSection.tsx
// Displays sponsor logos grouped by tier (Platinum → Gold → Basic).
// Tier pricing cards live in PackageSection — this section only shows the logos.

import { useEffect, useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { sponsorsByTier } from "./sponsors.data";
import { SponsorLogoGrid } from "./SponsorLogoGrid";
import styles from "./SponsorsSection.module.css";

const platinumSponsors = sponsorsByTier("platinum");
const goldSponsors = sponsorsByTier("gold");
const basicSponsors = sponsorsByTier("basic");

export function SponsorsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll<HTMLElement>(
      `.${styles.animateTarget}`
    );

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add(styles.visible));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="sponsors"
      className={styles.section}
      ref={sectionRef}
      aria-label="Our Sponsors"
    >
      <div className={styles.inner}>
        <div className={`${styles.animateTarget}`}>
          <SectionLabel className="mb-6">Thank You</SectionLabel>
          <h2 className={styles.heading}>
            Current{" "}
            <span className={styles.headingAccent}>Sponsors</span>
          </h2>
        </div>

        {/* ── Platinum tier ── */}
        {platinumSponsors.length > 0 && (
          <div className={`${styles.tierGroup} ${styles.animateTarget}`}>
            <span className={styles.tierGroupLabel}>
              <span className={styles.tierBadgeStar}>★</span> Title / Platinum
            </span>
            <SponsorLogoGrid sponsors={platinumSponsors} variant="platinum" />
          </div>
        )}

        {/* ── Gold tier ── */}
        {goldSponsors.length > 0 && (
          <div
            className={`${styles.tierGroup} ${styles.animateTarget}`}
            style={{ animationDelay: "0.1s" }}
          >
            <span className={styles.tierGroupLabel}>Gold</span>
            <SponsorLogoGrid sponsors={goldSponsors} variant="gold" />
          </div>
        )}

        {/* ── Basic tier ── */}
        {basicSponsors.length > 0 && (
          <div
            className={`${styles.tierGroup} ${styles.animateTarget}`}
            style={{ animationDelay: "0.2s" }}
          >
            <span className={styles.tierGroupLabel}>Basic</span>
            <SponsorLogoGrid sponsors={basicSponsors} variant="basic" />
          </div>
        )}
      </div>
    </section>
  );
}
