import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"], // Protect admin crawling and optimize crawling budget
    },
    sitemap: "https://schulichroam.com/sitemap.xml",
  };
}
