// components/sponsors/sponsors.data.ts

export type SponsorTierLevel = "platinum" | "gold" | "basic";

export interface Sponsor {
  name: string;
  logoSrc: string;
  websiteUrl: string;
  altText: string;
  tier: SponsorTierLevel;
}

export interface SponsorTier {
  id: SponsorTierLevel;
  label: string;
  priceRange: string;
  isTopTier: boolean;
  benefits: string[];
}

/**
 * Sponsors ordered by tier:
 * - Platinum: SSE (Schulich School of Engineering)
 * - Gold: Hexagon, SolidWorks, Altium, ANSYS
 * - Basic: GESS
 */
export const SPONSORS: Sponsor[] = [
  // ── Platinum ──
  {
    name: "Schulich School of Engineering",
    logoSrc: "/sponsors/sse.png",
    websiteUrl: "https://www.ucalgary.ca/schulich",
    altText: "Schulich School of Engineering logo",
    tier: "platinum",
  },
  // ── Gold ──
  {
    name: "Hexagon",
    logoSrc: "/sponsors/hexagon.png",
    websiteUrl: "https://hexagon.com",
    altText: "Hexagon logo",
    tier: "gold",
  },
  {
    name: "SolidWorks",
    logoSrc: "/sponsors/solidworks.png",
    websiteUrl: "https://www.solidworks.com",
    altText: "SolidWorks logo",
    tier: "gold",
  },
  {
    name: "Altium",
    logoSrc: "/sponsors/altium.png",
    websiteUrl: "https://www.altium.com",
    altText: "Altium logo",
    tier: "gold",
  },
  {
    name: "ANSYS",
    logoSrc: "/sponsors/ansys.png",
    websiteUrl: "https://www.ansys.com",
    altText: "ANSYS logo",
    tier: "gold",
  },
  // ── Basic ──
  {
    name: "GESS",
    logoSrc: "/sponsors/gess.png",
    websiteUrl: "https://www.gess.com",
    altText: "GESS logo",
    tier: "basic",
  },
];

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: "platinum",
    label: "Title / Platinum Sponsor",
    priceRange: "$7,500+",
    isTopTier: true,
    benefits: [
      "Primary logo placement on the rover chassis, website header & all competition media",
      "Dedicated booth presence at ROAM competitions and showcases",
      "Featured in all social media campaigns (Instagram, LinkedIn) and press releases",
      "Exclusive co-branded newsletter spotlight and quarterly impact report",
    ],
  },
  {
    id: "gold",
    label: "Gold Sponsor",
    priceRange: "$4,000 – $7,500",
    isTopTier: false,
    benefits: [
      "Prominent logo on the ROAM website sponsors section and team uniforms",
      "Shoutout posts across all ROAM social channels with dedicated feature content",
      "Recognition in competition presentations and engineering documentation",
    ],
  },
  {
    id: "basic",
    label: "Basic Sponsor",
    priceRange: "Up to $4,000",
    isTopTier: false,
    benefits: [
      "Logo listed on the ROAM website sponsors page",
      "Mention in ROAM's bi-annual partner newsletter",
    ],
  },
];

export interface MissionPackage {
  tierId: SponsorTierLevel;
  tier: string;
  range: string;
  tagline: string;
  benefits: string[];
  cta: string;
  highlight: boolean;
}

const PACKAGE_DISPLAY: Record<
  SponsorTierLevel,
  Pick<MissionPackage, "tier" | "tagline" | "cta" | "highlight">
> = {
  platinum: {
    tier: "Title / Platinum",
    tagline: "Maximum impact. Maximum recognition.",
    cta: "Become a Platinum Sponsor",
    highlight: true,
  },
  gold: {
    tier: "Gold",
    tagline: "Your brand at the frontier of autonomy.",
    cta: "Become a Gold Sponsor",
    highlight: false,
  },
  basic: {
    tier: "Basic",
    tagline: "Fuel the next generation of engineers.",
    cta: "Become a Basic Sponsor",
    highlight: false,
  },
};

/** Mission-level sponsorship packages (benefits synced with SPONSOR_TIERS). */
export const MISSION_PACKAGES: MissionPackage[] = SPONSOR_TIERS.map((tier) => ({
  tierId: tier.id,
  ...PACKAGE_DISPLAY[tier.id],
  range: tier.priceRange,
  benefits: tier.benefits,
}));

/** Helper: filter sponsors by tier */
export function sponsorsByTier(tier: SponsorTierLevel): Sponsor[] {
  return SPONSORS.filter((s) => s.tier === tier);
}
