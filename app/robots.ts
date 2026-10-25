import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Portal and auth pages stay crawlable so their noindex tag is seen.
// Admin and API routes are disallowed outright.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
