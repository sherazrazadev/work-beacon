import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { BRAND } from "@/lib/brand";
import { PRICING_FEATURES } from "@/lib/marketing-content";

export const metadata: Metadata = { title: "Pricing" };

const TIERS: {
  name: string;
  blurb: string;
  points: string[];
  featured?: boolean;
}[] = [
  {
    name: `${BRAND.name} GO`,
    blurb: "For lean midsize teams — HR, payroll, finance, and AI packs.",
    points: ["Core HCM & payroll", "Essential finance", "Agent starter pack"],
  },
  {
    name: "Enterprise",
    blurb: "Full suite for complex orgs with deep governance needs.",
    points: ["Full HCM + Finance", "Data Cloud", "Custom agents"],
    featured: true,
  },
  {
    name: "Enterprise Plus",
    blurb: "Global scale with partner ecosystem and advanced analytics.",
    points: ["Multi-entity ops", "Partner marketplace", "Premier success"],
  },
];

function cell(v: boolean | string) {
  if (v === true) return "✓";
  if (v === false) return "—";
  return v;
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        title="Enterprise pricing, clearly framed"
        description="No real billing — three-tier layout for demos and sales conversations."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="grid gap-8 lg:grid-cols-3">
          {TIERS.map((t) => (
            <li
              key={t.name}
              className={`border border-[var(--border)] p-6 ${
                t.featured
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "bg-[var(--surface)]"
              }`}
            >
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
                {t.name}
              </h2>
              <p
                className={`mt-2 text-sm ${
                  t.featured ? "text-white/75" : "text-[var(--fg-muted)]"
                }`}
              >
                {t.blurb}
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {t.points.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-8"
                variant={t.featured ? "default" : "secondary"}
              >
                <Link href="/contact-sales">Talk to sales</Link>
              </Button>
            </li>
          ))}
        </ul>

        <h2 className="mt-16 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Feature comparison
        </h2>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Scroll horizontally on small screens.
        </p>
        <div className="mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="min-w-[640px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-3 pr-4 font-medium text-[var(--fg-muted)]">
                  Capability
                </th>
                <th className="px-3 py-3 font-medium">GO</th>
                <th className="px-3 py-3 font-medium">Enterprise</th>
                <th className="px-3 py-3 font-medium">Plus</th>
              </tr>
            </thead>
            <tbody>
              {PRICING_FEATURES.map((row) => (
                <tr
                  key={row.name}
                  className="border-b border-[var(--border)] text-[var(--fg-muted)]"
                >
                  <td className="py-3 pr-4 text-[var(--fg)]">{row.name}</td>
                  <td className="px-3 py-3">{cell(row.go)}</td>
                  <td className="px-3 py-3">{cell(row.enterprise)}</td>
                  <td className="px-3 py-3">{cell(row.plus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
