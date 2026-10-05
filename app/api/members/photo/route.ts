import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPortalSession, requireRole } from "@/lib/supabase/portal-auth";
import { createServiceClient } from "@/lib/supabase/admin";
import { MEMBER_PHOTO_BUCKET } from "@/lib/members/constants";

const MAX_BYTES = 1024 * 1024;

const EXT_BY_TYPE: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  const memberId = String(form.get("memberId") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Only JPG, PNG or WebP uploads are allowed" },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Max photo size is 1MB" }, { status: 400 });
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

  const supabase = createServiceClient();

  const { data: previous } = await supabase
    .from("members")
    .select("photo_path")
    .eq("id", targetId)
    .single();

  const path = `${targetId}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Paths are unique per upload, so the object can be cached as immutable.
  const { error: uploadError } = await supabase.storage
    .from(MEMBER_PHOTO_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      cacheControl: "31536000",
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

  const oldPath = previous?.photo_path;
  if (oldPath && oldPath !== path && !/^https?:\/\//.test(oldPath)) {
    await supabase.storage.from(MEMBER_PHOTO_BUCKET).remove([oldPath]);
  }

  revalidatePath("/team");
  return NextResponse.json({ member: data, photo_path: path });
}
