import { NextResponse } from "next/server";
import { requireRole } from "@/lib/supabase/portal-auth";
import { createServiceClient } from "@/lib/supabase/admin";
import type { AppStatus } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Leads and admins both receive the full unfiltered applications list. */
export async function GET() {
  const session = await requireRole(["admin", "lead"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const applications = data ?? [];
  return NextResponse.json({
    applications,
    role: session.member.role,
    count: applications.length,
    scope: "all",
  });
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
    return NextResponse.json(
      { error: "id and status required" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
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
