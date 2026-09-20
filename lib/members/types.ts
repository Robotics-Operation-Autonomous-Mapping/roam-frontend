export const SUBTEAMS = [
  "software",
  "electrical",
  "mechanical",
  "geomatics",
  "business_operations",
  "content_and_events",
] as const;

export type Subteam = (typeof SUBTEAMS)[number];

export const MEMBER_ROLES = ["member", "lead", "admin"] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number];

export type Member = {
  id: string;
  clerk_user_id: string | null;
  full_name: string;
  /** Primary contact email (often same as university_email) */
  email: string;
  university_email: string | null;
  personal_email: string | null;
  ucid: string | null;
  date_of_birth: string | null;
  interesting_thing: string | null;
  bio: string | null;
  photo_path: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  subteam: Subteam | null;
  role: MemberRole;
  is_public: boolean;
  sort_order: number;
  title: string | null;
  last_birthday_email_year: number | null;
  created_at: string;
  updated_at: string;
};

/** Fields safe to expose on the public Team page */
export type PublicMember = Pick<
  Member,
  | "id"
  | "full_name"
  | "bio"
  | "interesting_thing"
  | "photo_path"
  | "linkedin_url"
  | "portfolio_url"
  | "subteam"
  | "role"
  | "title"
  | "sort_order"
>;

export type ProfileUpdate = Partial<
  Pick<
    Member,
    | "full_name"
    | "email"
    | "university_email"
    | "personal_email"
    | "ucid"
    | "date_of_birth"
    | "interesting_thing"
    | "bio"
    | "linkedin_url"
    | "portfolio_url"
    | "subteam"
    | "photo_path"
    | "is_public"
  >
>;

export type AdminMemberUpdate = Partial<
  Pick<
    Member,
    | "full_name"
    | "email"
    | "university_email"
    | "personal_email"
    | "ucid"
    | "date_of_birth"
    | "interesting_thing"
    | "bio"
    | "linkedin_url"
    | "portfolio_url"
    | "subteam"
    | "role"
    | "title"
    | "is_public"
    | "sort_order"
    | "photo_path"
    | "clerk_user_id"
  >
>;
