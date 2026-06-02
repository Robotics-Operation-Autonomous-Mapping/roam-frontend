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

export const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/schulichroam/",
    srOnly: "Instagram",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/schulichroam/",
    srOnly: "LinkedIn",
  },
  {
    label: "GitHub",
    href: "https://github.com/Robotics-Operation-Autonomous-Mapping",
    srOnly: "GitHub",
  },
  {
    label: "Linktree",
    href: "https://linktr.ee/schulichroam",
    srOnly: "Linktree",
  },
] as const;

export const CAPTAIN = {
  name: "Vyapak Bansal",
  role: "Team Captain",
  linkedIn: "https://www.linkedin.com/in/vyapak-bansal/",
};
