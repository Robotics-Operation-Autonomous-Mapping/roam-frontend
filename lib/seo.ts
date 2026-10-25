import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  ORG,
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL,
  SPONSORSHIP_EMAIL,
  TEAM_EMAIL,
} from "@/lib/site";
import { SPONSORS } from "@/components/sponsors/sponsors.data";

export const HOME_TITLE = `${SITE_NAME} | UCalgary Robotics & Autonomous Mapping Club`;
export const HOME_DESCRIPTION =
  "ROAM (Robotics Operation for Autonomous Mapping) is a University of Calgary student robotics club at Schulich, building an autonomous LiDAR mapping rover.";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const absoluteUrl = (path = "/") =>
  path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

type PageMetaInput = {
  /** Rendered through the root title template ("%s | Schulich ROAM") unless `absoluteTitle` is set. */
  title: string;
  absoluteTitle?: boolean;
  description: string;
  path: string;
  noIndex?: boolean;
};

/** Static 1200x630 card from `scripts/generate-og-images.cjs` (public/og/<slug>.png). */
export function ogImage(slug: string, alt: string) {
  return { url: `/og/${slug}.png`, width: 1200, height: 630, alt, type: "image/png" };
}

/**
 * Per-page metadata. Next.js shallow-merges `openGraph`/`twitter`, so each page
 * must carry the full objects or it inherits the homepage's url/title/image.
 */
export function pageMetadata({
  title,
  absoluteTitle,
  description,
  path,
  noIndex,
}: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const image = ogImage(path === "/" ? "home" : path.slice(1), fullTitle);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: SITE_NAME,
      url,
      title: fullTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export const NO_INDEX: Metadata = {
  robots: { index: false, follow: false },
};

/* ---------------- JSON-LD ---------------- */

const schulich = {
  "@type": "EducationalOrganization",
  name: ORG.faculty.name,
  url: ORG.faculty.url,
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: ORG.institution.name,
    url: ORG.institution.url,
  },
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 508,
    },
    description: SITE_DESCRIPTION,
    email: CONTACT_EMAIL,
    ...(ORG.foundingDate ? { foundingDate: ORG.foundingDate } : {}),
    parentOrganization: schulich,
    location: {
      "@type": "Place",
      name: `${ORG.faculty.name}, ${ORG.institution.name}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: ORG.locality,
        addressRegion: ORG.region,
        addressCountry: ORG.country,
      },
    },
    knowsAbout: ORG.knowsAbout,
    sameAs: Object.values(SOCIAL),
    contactPoint: [
      { "@type": "ContactPoint", contactType: "general inquiries", email: CONTACT_EMAIL },
      { "@type": "ContactPoint", contactType: "recruitment", email: TEAM_EMAIL },
      { "@type": "ContactPoint", contactType: "sponsorship", email: SPONSORSHIP_EMAIL },
    ],
    sponsor: SPONSORS.map((s) => ({
      "@type": "Organization",
      name: s.name,
      url: s.websiteUrl,
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    alternateName: ["ROAM", "schulichroam.com"],
    url: SITE_URL,
    inLanguage: "en-CA",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webPageSchema({
  type = "WebPage",
  name,
  description,
  path,
}: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "en-CA",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  };
}

export function projectSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/demo#atlas-1`,
    name: ORG.flagshipProject.name,
    description: ORG.flagshipProject.description,
    url: absoluteUrl("/demo"),
    creator: { "@id": ORG_ID },
    keywords: [
      "autonomous rover",
      "LiDAR mapping",
      "SLAM",
      "ROS 2",
      "RTK-GNSS",
      "digital twin",
    ],
  };
}

type PublicPerson = {
  full_name: string;
  title: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
};

function profileUrl(raw: string | null): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    [...url.searchParams.keys()]
      .filter((k) => k.startsWith("utm_"))
      .forEach((k) => url.searchParams.delete(k));
    return url.toString();
  } catch {
    return null;
  }
}

export function teamMembersSchema(people: PublicPerson[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    member: people.map((p) => {
      const sameAs = [profileUrl(p.linkedin_url), profileUrl(p.portfolio_url)].filter(Boolean);
      return {
        "@type": "Person",
        name: p.full_name,
        ...(p.title ? { jobTitle: p.title } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        memberOf: { "@id": ORG_ID },
      };
    }),
  };
}
