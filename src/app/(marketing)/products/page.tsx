import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { PRODUCTS } from "@/lib/content";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <PageHero
        title="A unified portfolio with AI at the core"
        description="Trusted products for critical HR, finance, and IT functions."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <li key={p.slug} className="border-t border-[var(--border)] pt-5">
              <Link href={`/products/${p.slug}`} className="group block">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold group-hover:text-[var(--accent)]">
                  {p.name}
                </h2>
                <p className="mt-2 text-sm text-[var(--fg-muted)]">
                  {p.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
