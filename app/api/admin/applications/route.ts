import { NextResponse } from "next/server";
import { requireRole } from "@/lib/supabase/portal-auth";
import { createServiceClient } from "@/lib/supabase/admin";
import type { AppStatus } from "@/lib/supabase/client";
import { DEPT_TO_SUBTEAM } from "@/lib/members/constants";

export async function GET() {
  const session = await requireRole(["admin", "lead"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let apps = data ?? [];
  if (session.member.role === "lead" && session.member.subteam) {
    apps = apps.filter((app) => {
      const mapped = DEPT_TO_SUBTEAM[app.department as string];
      return mapped === session.member.subteam;
    });
  }

  return NextResponse.json({ applications: apps });
}

export async function PATCH(request: Request) {
  const session = await requireRole(["admin", "lead"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { id?: string; status?: AppStatus; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (session.member.role === "lead" && session.member.subteam) {
    const { data: app } = await supabase
      .from("applications")
      .select("department")
      .eq("id", body.id)
      .maybeSingle();
    const mapped = app ? DEPT_TO_SUBTEAM[app.department as string] : null;
    if (mapped !== session.member.subteam) {
      return NextResponse.json({ error: "Outside your subteam" }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from("applications")
    .update({
      status: body.status,
      reviewer_notes: body.notes ?? null,
      reviewed_by: session.member.email,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ application: data });
}
