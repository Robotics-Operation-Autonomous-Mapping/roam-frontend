export {
  CONTACT_EMAIL,
  TEAM_EMAIL,
  SPONSORSHIP_EMAIL,
  INBOXES,
} from "@/lib/site";

export const CONTACT_SUBJECTS = [
  "General Inquiry",
  "Partnership",
  "Sponsorship",
  "Media",
  "Join the Team",
  "Other",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export { SOCIAL_LINKS } from "@/lib/site";

export const CAPTAIN = {
  name: "Vyapak Bansal",
  role: "Team Captain",
  linkedIn: "https://www.linkedin.com/in/vyapak-bansal/",
};
