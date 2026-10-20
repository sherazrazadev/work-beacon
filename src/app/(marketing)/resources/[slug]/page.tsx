import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ResourcesLibrary } from "@/components/resources-library";
import { RESOURCE_SECTIONS } from "@/lib/content";
import { RESOURCE_ARTICLES } from "@/lib/marketing-content";

type Props = { params: Promise<{ slug: string }> };

const SECTION_COPY: Record<string, string[]> = {
  demos: [
    "Employee dashboard walkthrough — inbox, pay, time off",
    "Agent panel: ask for PTO balance and start a request",
    "Manager approvals and team calendar",
  ],
  events: [
    "Beacon Summit (demo) — Sept virtual keynote",
    "Industry roundtable: Retail scheduling",
    "Office hours with platform engineers",
  ],
  webinars: [
    "Governed agents for HR leaders",
    "Finance close with shared actuals",
    "Building marketplace apps safely",
  ],
  library: [],
};

export async function generateStaticParams() {
  return RESOURCE_SECTIONS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = RESOURCE_SECTIONS.find((r) => r.slug === slug);
  return { title: item?.name ?? "Resources" };
}

export default async function ResourceSectionPage({ params }: Props) {
  const { slug } = await params;
  const item = RESOURCE_SECTIONS.find((r) => r.slug === slug);
  if (!item) notFound();

  const items = SECTION_COPY[slug] ?? [];

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={item.name}
        description={item.blurb}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {slug === "library" ? (
          <ResourcesLibrary />
        ) : (
          <ul className="space-y-4">
            {items.map((line) => (
              <li
                key={line}
                className="border-t border-[var(--border)] pt-4 text-[var(--fg-muted)]"
              >
                {line}
              </li>
            ))}
            {slug === "demos" && (
              <li className="border-t border-[var(--border)] pt-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-[var(--accent)]"
                >
                  Open the live demo dashboard →
                </Link>
              </li>
            )}
          </ul>
        )}

        {slug !== "library" && (
          <div className="mt-12">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
              From the library
            </h2>
            <ul className="mt-4 space-y-2">
              {RESOURCE_ARTICLES.slice(0, 3).map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/resources/guides/${a.slug}`}
                    className="text-sm text-[var(--accent)]"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href="/resources"
          className="mt-10 inline-block text-sm text-[var(--accent)]"
        >
          ← Resources hub
        </Link>
      </section>
    </>
  );
}
