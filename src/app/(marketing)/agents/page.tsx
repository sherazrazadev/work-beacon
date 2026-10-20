import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { AGENT_CATEGORIES } from "@/lib/content";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Agents" };

export default function AgentsPage() {
  return (
    <>
      <PageHero
        title="Specialized AI agents, governed end to end"
        description={`${BRAND.name} Agent orchestrates domain agents that anticipate, advise, and act within your rules.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="grid gap-8 sm:grid-cols-2">
          {AGENT_CATEGORIES.map((a) => (
            <li key={a.slug} className="border-t border-[var(--border)] pt-5">
              <Link href={`/agents/${a.slug}`} className="group block">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--fg)] group-hover:text-[var(--accent)]">
                  {a.name}
                </h2>
                <p className="mt-2 text-[var(--fg-muted)]">{a.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
