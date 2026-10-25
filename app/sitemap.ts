import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/team": 0.8,
  "/join": 0.8,
  "/sponsors": 0.8,
  "/demo": 0.7,
  "/projects": 0.7,
  "/contact": 0.6,
  "/apply": 0.6,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...PUBLIC_ROUTES.map((r) => r.href), "/apply"];
  return paths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/team" ? "weekly" : "monthly",
    priority: PRIORITY[path] ?? 0.5,
  }));
}
