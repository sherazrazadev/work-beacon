import type { MetadataRoute } from "next";
import { marketingPaths, siteUrl } from "@/lib/seo-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return marketingPaths().map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-10-19"),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
