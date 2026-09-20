import type { Subteam } from "./types";

export const SUBTEAM_LABELS: Record<Subteam, string> = {
  software: "Software",
  electrical: "Electrical",
  mechanical: "Mechanical",
  geomatics: "Geomatics",
  business_operations: "Business Operations",
  content_and_events: "Content & Events",
};

/** Map application form department labels → portal subteams (for lead filtering). */
export const DEPT_TO_SUBTEAM: Record<string, Subteam> = {
  Mechanical: "mechanical",
  Electrical: "electrical",
  "Computer Engineering": "software",
  "Software Development": "software",
  Geomatics: "geomatics",
  Mechatronics: "mechanical",
  "Business/Operations": "business_operations",
  "Content & Media": "content_and_events",
};

export const MEMBER_PHOTO_BUCKET = "member-photos";

export const PUBLIC_MEMBER_COLUMNS =
  "id, full_name, bio, interesting_thing, photo_path, linkedin_url, portfolio_url, subteam, role, title, sort_order" as const;
