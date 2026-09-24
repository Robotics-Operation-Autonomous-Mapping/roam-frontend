import { auth, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "./admin";
import type { Member } from "@/lib/members/types";
import { DEPT_TO_SUBTEAM } from "@/lib/members/constants";
import type { Subteam } from "@/lib/members/types";

export type PortalSession = {
  member: Member;
  clerkUserId: string;
  email: string;
};

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

type AcceptedApplication = {
  id: string;
  full_name: string;
  ucid: string | null;
  university_email: string;
  personal_email: string | null;
  department: string | null;
  interesting_thing: string | null;
  linkedin: string | null;
  portfolio: string | null;
  status: string;
};

async function findAcceptedApplication(
  supabase: ReturnType<typeof createServiceClient>,
  email: string,
): Promise<AcceptedApplication | null> {
  const { data: byUni } = await supabase
    .from("applications")
    .select(
      "id, full_name, ucid, university_email, personal_email, department, interesting_thing, linkedin, portfolio, status",
    )
    .eq("status", "accepted")
    .ilike("university_email", email)
    .maybeSingle();

  if (byUni) return byUni as AcceptedApplication;

  const { data: byPersonal } = await supabase
    .from("applications")
    .select(
      "id, full_name, ucid, university_email, personal_email, department, interesting_thing, linkedin, portfolio, status",
    )
    .eq("status", "accepted")
    .ilike("personal_email", email)
    .maybeSingle();

  return (byPersonal as AcceptedApplication | null) ?? null;
}

async function findMemberByLoginEmails(
  supabase: ReturnType<typeof createServiceClient>,
  email: string,
  app?: AcceptedApplication | null,
): Promise<Member | null> {
  const candidates = [
    email,
    app?.university_email ? normalizeEmail(app.university_email) : null,
    app?.personal_email ? normalizeEmail(app.personal_email) : null,
  ].filter(Boolean) as string[];

  for (const candidate of [...new Set(candidates)]) {
    const { data: byEmail } = await supabase
      .from("members")
      .select("*")
      .eq("email", candidate)
      .maybeSingle();
    if (byEmail) return byEmail as Member;

    const { data: byUni, error: uniErr } = await supabase
      .from("members")
      .select("*")
      .eq("university_email", candidate)
      .maybeSingle();
    if (!uniErr && byUni) return byUni as Member;

    const { data: byPersonal, error: personalErr } = await supabase
      .from("members")
      .select("*")
      .eq("personal_email", candidate)
      .maybeSingle();
    if (!personalErr && byPersonal) return byPersonal as Member;
  }

  return null;
}

/**
 * Resolve Clerk user → members row.
 * Login is only allowed when the Clerk email matches university_email or
 * personal_email on an application with status = accepted
 * (seeded admins may link by members.email without an application).
 */
export async function getPortalSession(): Promise<PortalSession | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("members")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (existing) {
    const member = existing as Member;
    // Admins and leads stay linked once established — don't re-gate on application rows
    if (member.role === "admin" || member.role === "lead") {
      return { member, clerkUserId: userId, email: member.email };
    }

    const emailsToCheck = [
      member.university_email,
      member.personal_email,
      member.email,
    ]
      .filter(Boolean)
      .map((e) => normalizeEmail(e as string));

    let stillAccepted = false;
    for (const e of [...new Set(emailsToCheck)]) {
      if (await findAcceptedApplication(supabase, e)) {
        stillAccepted = true;
        break;
      }
    }
    if (!stillAccepted) return null;

    return { member, clerkUserId: userId, email: member.email };
  }

  const user = await currentUser();
  const emailRaw =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress;
  if (!emailRaw) return null;

  const email = normalizeEmail(emailRaw);
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.username ||
    email.split("@")[0];

  const accepted = await findAcceptedApplication(supabase, email);

  // Seeded captains / admins: allow members.email match without an application
  if (!accepted) {
    const { data: adminRow } = await supabase
      .from("members")
      .select("*")
      .eq("role", "admin")
      .eq("email", email)
      .maybeSingle();

    if (!adminRow) return null;

    const { data: linked, error } = await supabase
      .from("members")
      .update({
        clerk_user_id: userId,
        full_name: adminRow.full_name || fullName,
      })
      .eq("id", adminRow.id)
      .select("*")
      .single();

    if (error || !linked) return null;
    return {
      member: linked as Member,
      clerkUserId: userId,
      email,
    };
  }

  const uni = normalizeEmail(accepted.university_email);
  const personal = accepted.personal_email
    ? normalizeEmail(accepted.personal_email)
    : null;

  const member = await findMemberByLoginEmails(supabase, email, accepted);

  if (!member) {
    const subteam =
      (accepted.department &&
        (DEPT_TO_SUBTEAM[accepted.department] as Subteam | undefined)) ||
      null;

    const { data: created, error: createError } = await supabase
      .from("members")
      .insert({
        clerk_user_id: userId,
        email: uni || email,
        university_email: uni || null,
        personal_email: personal,
        full_name: accepted.full_name || fullName,
        ucid: accepted.ucid || null,
        interesting_thing: accepted.interesting_thing || null,
        linkedin_url: accepted.linkedin || null,
        portfolio_url: accepted.portfolio || null,
        subteam,
        role: "member",
        is_public: false,
      })
      .select("*")
      .single();

    if (createError || !created) {
      console.error("[portal] member create failed:", createError?.message);
      return null;
    }

    return {
      member: created as Member,
      clerkUserId: userId,
      email,
    };
  }

  const { data: linked, error } = await supabase
    .from("members")
    .update({
      clerk_user_id: userId,
      full_name: member.full_name || accepted.full_name || fullName,
      university_email: member.university_email || uni || null,
      personal_email: member.personal_email || personal,
    })
    .eq("id", member.id)
    .select("*")
    .single();

  if (error || !linked) return null;

  return {
    member: linked as Member,
    clerkUserId: userId,
    email,
  };
}

export async function requirePortalSession(): Promise<PortalSession | null> {
  return getPortalSession();
}

export async function requireRole(
  roles: Array<Member["role"]>,
): Promise<PortalSession | null> {
  const session = await getPortalSession();
  if (!session) return null;
  if (!roles.includes(session.member.role)) return null;
  return session;
}

/** Admin-only portal tools (members CMS, compose). */
export async function requireAdmin(): Promise<PortalSession | null> {
  return requireRole(["admin"]);
}
