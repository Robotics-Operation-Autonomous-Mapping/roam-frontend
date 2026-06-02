// components/sponsors/SponsorTierCard.tsx
// Server Component — pure display, no browser APIs needed.

import type { SponsorTier } from "./sponsors.data";
import styles from "./SponsorsSection.module.css";

interface SponsorTierCardProps {
  tier: SponsorTier;
}

export function SponsorTierCard({ tier }: SponsorTierCardProps) {
  const cardClass = [
    styles.tierCard,
    tier.isTopTier ? styles.tierCardTop : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClass} aria-label={`${tier.label} sponsorship tier`}>
      {/* Top-tier badge */}
      {tier.isTopTier && (
        <span className={styles.topTierBadge} aria-hidden="false">
          ⭐ Top Tier
        </span>
      )}

      {/* Tier name */}
      <h3 className={styles.tierLabel}>{tier.label}</h3>

      {/* Price range */}
      <span className={styles.tierPrice}>{tier.priceRange}</span>

      {/* Benefits */}
      <ul className={styles.benefitsList}>
        {tier.benefits.map((benefit) => (
          <li key={benefit} className={styles.benefitItem}>
            <span
              className={[
                styles.benefitBullet,
                tier.isTopTier ? styles.benefitBulletTop : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            />
            {benefit}
          </li>
        ))}
      </ul>
    </article>
  );
}
