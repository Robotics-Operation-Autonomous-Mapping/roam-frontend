import { auth, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "./admin";
import type { Member } from "@/lib/members/types";

export type PortalSession = {
  member: Member;
  clerkUserId: string;
  email: string;
};

/**
 * Resolve the signed-in Clerk user to a `members` row, auto-provisioning
 * a default member profile on first portal visit.
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
    return {
      member: existing as Member,
      clerkUserId: userId,
      email: (existing as Member).email,
    };
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress;
  if (!email) return null;

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.username ||
    email.split("@")[0];

  // Link by email if an admin pre-seeded the row
  const { data: byEmail } = await supabase
    .from("members")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (byEmail) {
    const { data: linked, error } = await supabase
      .from("members")
      .update({ clerk_user_id: userId, full_name: byEmail.full_name || fullName })
      .eq("id", byEmail.id)
      .select("*")
      .single();

    if (error || !linked) return null;
    return {
      member: linked as Member,
      clerkUserId: userId,
      email,
    };
  }

  const { data: created, error: createError } = await supabase
    .from("members")
    .insert({
      clerk_user_id: userId,
      email,
      full_name: fullName,
      role: "member",
      is_public: false,
    })
    .select("*")
    .single();

  if (createError || !created) {
    console.error("[portal] member provision failed:", createError?.message);
    return null;
  }

  return {
    member: created as Member,
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
