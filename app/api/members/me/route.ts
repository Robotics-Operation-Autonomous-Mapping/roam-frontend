import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPortalSession } from "@/lib/supabase/portal-auth";
import { createServiceClient, hasServiceRole } from "@/lib/supabase/admin";
import type { ProfileUpdate, Subteam } from "@/lib/members/types";
import { SUBTEAMS } from "@/lib/members/types";

export async function GET() {
  const session = await getPortalSession();
  if (!session) {
    return NextResponse.json(
      {
        error: hasServiceRole()
          ? "Not permitted. If you believe this is a mistake, contact vyapakbansal@gmail.com"
          : "Missing SUPABASE_SERVICE_ROLE_KEY — required for portal writes.",
      },
      { status: 401 },
    );
  }
  return NextResponse.json({ member: session.member });
}

export async function PATCH(request: Request) {
  const session = await getPortalSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ProfileUpdate;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: ProfileUpdate = {};
  if (typeof body.full_name === "string") patch.full_name = body.full_name.trim();
  if (typeof body.email === "string") patch.email = body.email.trim().toLowerCase();
  if (typeof body.university_email === "string")
    patch.university_email = body.university_email.trim().toLowerCase() || null;
  else if (body.university_email === null) patch.university_email = null;
  if (typeof body.personal_email === "string")
    patch.personal_email = body.personal_email.trim().toLowerCase() || null;
  else if (body.personal_email === null) patch.personal_email = null;
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
  if (typeof body.is_public === "boolean") patch.is_public = body.is_public;
  if (body.subteam === null) patch.subteam = null;
  else if (typeof body.subteam === "string" && SUBTEAMS.includes(body.subteam as Subteam)) {
    patch.subteam = body.subteam as Subteam;
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("members")
    .update(patch)
    .eq("id", session.member.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/team");
  return NextResponse.json({ member: data });
}
