import { NextResponse } from "next/server";
import { requireRole } from "@/lib/supabase/portal-auth";
import { createServiceClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const session = await requireRole(["admin"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset") || 0);
  const limit = Math.min(Number(searchParams.get("limit") || 25), 50);

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("email_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ logs: data ?? [] });
}
