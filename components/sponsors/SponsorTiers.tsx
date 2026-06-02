// components/sponsors/SponsorTiers.tsx
// Server Component — receives tiers as props, no browser APIs needed.

import type { SponsorTier } from "./sponsors.data";
import { SponsorTierCard } from "./SponsorTierCard";
import styles from "./SponsorsSection.module.css";

interface SponsorTiersProps {
  tiers: SponsorTier[];
}

export function SponsorTiers({ tiers }: SponsorTiersProps) {
  return (
    <div className={styles.tiersGrid}>
      {tiers.map((tier) => (
        <SponsorTierCard key={tier.id} tier={tier} />
      ))}
    </div>
  );
}
