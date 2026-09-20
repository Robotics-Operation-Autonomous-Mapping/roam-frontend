import { MEMBER_PHOTO_BUCKET } from "@/lib/members/constants";
import { supabaseUrl } from "@/lib/supabase/config";

export function memberPhotoUrl(photoPath: string | null | undefined): string | null {
  if (!photoPath) return null;
  if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
    return photoPath;
  }
  const base = supabaseUrl.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${MEMBER_PHOTO_BUCKET}/${photoPath.replace(/^\//, "")}`;
}
