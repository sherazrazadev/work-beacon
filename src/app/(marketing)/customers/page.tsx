import type { Metadata } from "next";
import Link from "next/link";
import { CustomerLogo } from "@/components/customer-logo";
import { PageHero } from "@/components/page-hero";
import { CUSTOMER_STORIES } from "@/lib/marketing-content";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <>
      <PageHero
        title="Customers turning AI into ROI"
        description="Demo case studies with fictional organizations — not real customer marks."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="grid gap-10 lg:grid-cols-3">
          {CUSTOMER_STORIES.map((c) => (
            <li key={c.slug} className="border-t border-[var(--border)] pt-5">
              <CustomerLogo letters={c.logo.letters} hue={c.logo.hue} />
              <p className="mt-4 text-xs uppercase tracking-wider text-[var(--fg-muted)]">
                {c.industry}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold">
                <Link
                  href={`/customers/${c.slug}`}
                  className="hover:text-[var(--accent)]"
                >
                  {c.name}
                </Link>
              </h2>
              <p className="mt-3 text-sm text-[var(--fg-muted)]">“{c.quote}”</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
