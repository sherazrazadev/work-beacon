import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { BRAND } from "@/lib/brand";
import { MARKETPLACE_APPS } from "@/lib/marketing-content";

export const metadata: Metadata = { title: "Marketplace" };

export default function MarketplacePage() {
  return (
    <>
      <PageHero
        title={`${BRAND.name} Marketplace`}
        description="Installable extensions that add workflows without forking your system of record."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="grid gap-8 sm:grid-cols-2">
          {MARKETPLACE_APPS.map((app) => (
            <li
              key={app.name}
              className="border-t border-[var(--border)] pt-4"
            >
              <p className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
                {app.category}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold">
                {app.name}
              </h2>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{app.blurb}</p>
              <p className="mt-4 text-sm font-medium text-[var(--accent)]">
                <Link href="/dashboard/marketplace">Install in tenant →</Link>
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/developers">Build an app</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/platform#ecosystem">Platform ecosystem</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
