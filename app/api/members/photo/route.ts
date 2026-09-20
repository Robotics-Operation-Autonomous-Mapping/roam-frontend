import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPortalSession, requireRole } from "@/lib/supabase/portal-auth";
import { createServiceClient } from "@/lib/supabase/admin";
import { MEMBER_PHOTO_BUCKET } from "@/lib/members/constants";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  const memberId = String(form.get("memberId") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Max photo size is 5MB" }, { status: 400 });
  }

  const self = await getPortalSession();
  if (!self) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let targetId = self.member.id;
  if (memberId && memberId !== self.member.id) {
    const admin = await requireRole(["admin"]);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    targetId = memberId;
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${targetId}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = createServiceClient();
  const { error: uploadError } = await supabase.storage
    .from(MEMBER_PHOTO_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("members")
    .update({ photo_path: path })
    .eq("id", targetId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/team");
  return NextResponse.json({ member: data, photo_path: path });
}
