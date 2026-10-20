import {
  AGENT_CATEGORIES,
  CUSTOMERS,
  INDUSTRIES,
  PRODUCTS,
  RESOURCE_SECTIONS,
} from "@/lib/content";
import { RESOURCE_ARTICLES } from "@/lib/marketing-content";

/** Public marketing routes for sitemap (excludes auth + dashboard). */
export function marketingPaths(): string[] {
  const base = [
    "/",
    "/agents",
    "/platform",
    "/products",
    "/customers",
    "/industries",
    "/resources",
    "/pricing",
    "/about",
    "/company",
    "/careers",
    "/contact-sales",
    "/go",
    "/partners",
    "/community",
    "/marketplace",
    "/developers",
    "/privacy",
    "/terms",
    "/accessibility",
    "/cookie-preferences",
    "/request-demo",
    "/login",
  ];

  return [
    ...base,
    ...AGENT_CATEGORIES.map((a) => `/agents/${a.slug}`),
    ...PRODUCTS.map((p) => `/products/${p.slug}`),
    ...CUSTOMERS.map((c) => `/customers/${c.slug}`),
    ...INDUSTRIES.map((i) => `/industries/${i.slug}`),
    ...RESOURCE_SECTIONS.map((r) => `/resources/${r.slug}`),
    ...RESOURCE_ARTICLES.map((a) => `/resources/guides/${a.slug}`),
  ];
}

export function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}
