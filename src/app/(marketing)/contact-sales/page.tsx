import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Contact Sales" };

export default function ContactSalesPage() {
  return (
    <>
      <PageHero
        title="Contact Sales"
        description={`Tell us about your team — form wiring arrives with auth flows. For now, request a demo.`}
      />
      <section className="mx-auto max-w-lg px-4 py-14 sm:px-6">
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <label className="block text-sm text-[var(--fg-muted)]">
            Work email
            <input
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
              placeholder="you@company.com"
            />
          </label>
          <label className="block text-sm text-[var(--fg-muted)]">
            Company
            <input
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
              placeholder={`${BRAND.name} prospect`}
            />
          </label>
          <Button asChild className="w-full">
            <Link href="/request-demo">Continue to Request Demo</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
