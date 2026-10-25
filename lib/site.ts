/** Canonical origin (apex, HTTPS, no trailing slash). */
export const SITE_URL = "https://schulichroam.com";

export const SITE_NAME = "Schulich ROAM";
export const SITE_SHORT_NAME = "ROAM";
export const SITE_FULL_NAME = "Robotics Operation for Autonomous Mapping";

/** Names the club is known or searched by. */
export const SITE_ALTERNATE_NAMES = [
  "ROAM",
  "ROAM Robotics Club",
  "ROAM UCalgary",
  "Robotics Operation for Autonomous Mapping",
  "Robotics Operation and Autonomous Mapping",
  "schulichroam",
];

/** One-sentence factual description reused in metadata, JSON-LD and llms.txt. */
export const SITE_DESCRIPTION =
  "ROAM (Robotics Operation for Autonomous Mapping) is a student robotics club at the Schulich School of Engineering, University of Calgary, building an autonomous LiDAR mapping rover.";

export const ORG = {
  institution: {
    name: "University of Calgary",
    url: "https://www.ucalgary.ca",
  },
  faculty: {
    name: "Schulich School of Engineering",
    url: "https://schulich.ucalgary.ca",
  },
  locality: "Calgary",
  region: "AB",
  country: "CA",
  flagshipProject: {
    name: "ATLAS-1",
    description:
      "ATLAS-1 is ROAM's first autonomous rover, designed for LiDAR mapping and 3D digital-twin generation using ROS 2, dual LiDAR, stereo cameras and RTK-GNSS.",
  },
  // TODO(seo): add foundingDate (YYYY or YYYY-MM) once confirmed by the exec team.
  foundingDate: null as string | null,
  knowsAbout: [
    "Robotics",
    "Autonomous mapping",
    "Autonomous navigation",
    "Autonomous ground vehicles",
    "LiDAR mapping",
    "SLAM",
    "Point cloud processing",
    "RTK-GNSS",
    "Sensor fusion",
    "ROS 2",
    "Geomatics engineering",
    "Digital twins",
  ],
} as const;

export const SOCIAL = {
  instagram: "https://www.instagram.com/schulichroam/",
  linkedin: "https://www.linkedin.com/company/schulichroam/",
  github: "https://github.com/Robotics-Operation-Autonomous-Mapping",
  linktree: "https://linktr.ee/schulichroam",
} as const;

export const SOCIAL_LINKS = [
  { label: "Instagram", href: SOCIAL.instagram, srOnly: "Schulich ROAM on Instagram" },
  { label: "LinkedIn", href: SOCIAL.linkedin, srOnly: "Schulich ROAM on LinkedIn" },
  { label: "GitHub", href: SOCIAL.github, srOnly: "Schulich ROAM on GitHub" },
  { label: "Linktree", href: SOCIAL.linktree, srOnly: "Schulich ROAM on Linktree" },
] as const;

/** Public pages in navigation order; also drives the sitemap. */
export const PUBLIC_ROUTES = [
  { label: "Home", href: "/" },
  { label: "Team", href: "/team" },
  { label: "Join Us", href: "/join" },
  { label: "Demo", href: "/demo" },
  { label: "Projects", href: "/projects" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact", href: "/contact" },
] as const;

/** General inquiries. */
export const CONTACT_EMAIL = "contact@schulichroam.com";

/** Recruitment, membership, and team-wide communication. */
export const TEAM_EMAIL = "team@schulichroam.com";

/** Sponsorship & partnership inquiries. */
export const SPONSORSHIP_EMAIL = "sponsorship@schulichroam.com";

/** CC on contact form submissions. */
export const TEAM_CC_EMAIL = "vyapakbansal@gmail.com";

export const INBOXES = [
  { label: "General", email: CONTACT_EMAIL },
  { label: "Team & recruitment", email: TEAM_EMAIL },
  { label: "Sponsorship", email: SPONSORSHIP_EMAIL },
] as const;

const SPONSORSHIP_SUBJECTS = new Set(["Sponsorship", "Partnership"]);
const TEAM_SUBJECTS = new Set(["Join the Team"]);

/** Route contact form mail by topic (catch-all still delivers if misrouted). */
export function inboxForContactSubject(subject: string): string {
  if (SPONSORSHIP_SUBJECTS.has(subject)) return SPONSORSHIP_EMAIL;
  if (TEAM_SUBJECTS.has(subject)) return TEAM_EMAIL;
  return CONTACT_EMAIL;
}

/** Flip `open` to close applications site-wide (hero, join, apply). */
export const RECRUITMENT = { open: true };
