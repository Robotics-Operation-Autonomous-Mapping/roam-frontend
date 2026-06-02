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
