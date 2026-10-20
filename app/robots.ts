import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
            disallow: ["/admin", "/portal", "/sign-in", "/sign-up"], // Keep private and login pages out of search results // Protect admin crawling and optimize crawling budget
    },
    sitemap: "https://schulichroam.com/sitemap.xml",
  };
}
