/** Stored paths are served via the `/member-photos/*` rewrite so Vercel's CDN caches them. */
export function memberPhotoUrl(photoPath: string | null | undefined): string | null {
  if (!photoPath) return null;
  if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
    return photoPath;
  }
  return `/member-photos/${photoPath.replace(/^\//, "")}`;
}
