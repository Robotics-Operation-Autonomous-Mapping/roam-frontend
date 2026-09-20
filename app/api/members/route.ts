import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/supabase/portal-auth";
import { createServiceClient } from "@/lib/supabase/admin";
import type { AdminMemberUpdate, Subteam } from "@/lib/members/types";
import { MEMBER_ROLES, SUBTEAMS } from "@/lib/members/types";

export async function GET() {
  const session = await requireRole(["admin"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("full_name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ members: data ?? [] });
}

export async function POST(request: Request) {
  const session = await requireRole(["admin"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: AdminMemberUpdate & { email?: string; full_name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const full_name = body.full_name?.trim();
  const university_email =
    body.university_email?.trim().toLowerCase() || null;
  const personal_email = body.personal_email?.trim().toLowerCase() || null;
  if (!email || !full_name) {
    return NextResponse.json(
      { error: "email and full_name are required" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("members")
    .insert({
      email,
      university_email,
      personal_email,
      full_name,
      role: body.role && MEMBER_ROLES.includes(body.role) ? body.role : "member",
      subteam:
        body.subteam && SUBTEAMS.includes(body.subteam as Subteam)
          ? body.subteam
          : null,
      title: body.title?.trim() || null,
      is_public: body.is_public ?? false,
      sort_order: body.sort_order ?? 0,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/team");
  return NextResponse.json({ member: data });
}
