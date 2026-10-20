import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo-routes";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/dashboard/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
