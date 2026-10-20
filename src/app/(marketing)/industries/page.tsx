import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { INDUSTRIES } from "@/lib/content";

export const metadata: Metadata = { title: "Industries" };

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        title="Industry solutions"
        description="Harness AI for the challenges specific to your industry."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((i) => (
            <li key={i.slug} className="border-t border-[var(--border)] pt-4">
              <Link
                href={`/industries/${i.slug}`}
                className="font-[family-name:var(--font-display)] text-lg font-semibold hover:text-[var(--accent)]"
              >
                {i.name}
              </Link>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{i.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
