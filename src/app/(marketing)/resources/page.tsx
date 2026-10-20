import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ResourcesLibrary } from "@/components/resources-library";
import { RESOURCE_SECTIONS } from "@/lib/content";

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        title="Resources"
        description="Guides, demos, events, and webinars for HR, finance, and platform teams."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          Library
        </h2>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Filter by topic. Every guide is original Work Beacon content.
        </p>
        <div className="mt-6">
          <ResourcesLibrary />
        </div>

        <h2 className="mt-16 font-[family-name:var(--font-display)] text-2xl font-semibold">
          More hubs
        </h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {RESOURCE_SECTIONS.map((r) => (
            <li key={r.slug} className="border-t border-[var(--border)] pt-4">
              <Link
                href={`/resources/${r.slug}`}
                className="font-[family-name:var(--font-display)] text-xl font-semibold hover:text-[var(--accent)]"
              >
                {r.name}
              </Link>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{r.blurb}</p>
            </li>
          ))}
          <li className="border-t border-[var(--border)] pt-4">
            <Link
              href="/customers"
              className="font-[family-name:var(--font-display)] text-xl font-semibold hover:text-[var(--accent)]"
            >
              Customer Stories
            </Link>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Outcomes from demo organizations.
            </p>
          </li>
        </ul>
      </section>
    </>
  );
}
