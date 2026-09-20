import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/supabase/portal-auth";
import { createServiceClient } from "@/lib/supabase/admin";
import type { AdminMemberUpdate, MemberRole, Subteam } from "@/lib/members/types";
import { MEMBER_ROLES, SUBTEAMS } from "@/lib/members/types";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const session = await requireRole(["admin"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: AdminMemberUpdate;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: AdminMemberUpdate = {};
  if (typeof body.full_name === "string") patch.full_name = body.full_name.trim();
  if (typeof body.email === "string") patch.email = body.email.trim().toLowerCase();
  if (typeof body.ucid === "string") patch.ucid = body.ucid.trim() || null;
  if (typeof body.interesting_thing === "string")
    patch.interesting_thing = body.interesting_thing.trim() || null;
  if (typeof body.bio === "string") patch.bio = body.bio.trim() || null;
  if (typeof body.linkedin_url === "string")
    patch.linkedin_url = body.linkedin_url.trim() || null;
  if (typeof body.portfolio_url === "string")
    patch.portfolio_url = body.portfolio_url.trim() || null;
  if (typeof body.date_of_birth === "string")
    patch.date_of_birth = body.date_of_birth.trim() || null;
  if (typeof body.title === "string") patch.title = body.title.trim() || null;
  if (typeof body.is_public === "boolean") patch.is_public = body.is_public;
  if (typeof body.sort_order === "number") patch.sort_order = body.sort_order;
  if (body.role && MEMBER_ROLES.includes(body.role as MemberRole)) {
    patch.role = body.role as MemberRole;
  }
  if (body.subteam === null) patch.subteam = null;
  else if (body.subteam && SUBTEAMS.includes(body.subteam as Subteam)) {
    patch.subteam = body.subteam as Subteam;
  }

  const supabase = createServiceClient();

  if (patch.role === "lead" && patch.subteam) {
    const { data: existingLead } = await supabase
      .from("members")
      .select("id, full_name")
      .eq("role", "lead")
      .eq("subteam", patch.subteam)
      .neq("id", params.id)
      .maybeSingle();

    if (existingLead) {
      return NextResponse.json(
        {
          error: `${existingLead.full_name} is already the lead for this subteam. Demote them first.`,
          warning: true,
        },
        { status: 409 },
      );
    }
  }

  const { data, error } = await supabase
    .from("members")
    .update(patch)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/team");
  return NextResponse.json({ member: data });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await requireRole(["admin"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (params.id === session.member.id) {
    return NextResponse.json(
      { error: "You cannot delete your own member row." },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("members").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/team");
  return NextResponse.json({ ok: true });
}
