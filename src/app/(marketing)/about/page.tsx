import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { BRAND } from "@/lib/brand";
import { ABOUT_TIMELINE, LEADERSHIP } from "@/lib/marketing-content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={`About ${BRAND.name}`}
        description="A confident, clean enterprise platform focused on HR, finance, IT, and governed agents."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="max-w-3xl text-[var(--fg-muted)]">
          {BRAND.name} is an original rebuild inspired by public enterprise
          marketing patterns. Product name, visual system, and copy are ours —
          built for demos, learning, and sales conversations.
        </p>

        <h2 className="mt-14 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Timeline
        </h2>
        <ol className="mt-6 space-y-6 border-l border-[var(--border)] pl-6">
          {ABOUT_TIMELINE.map((t) => (
            <li key={t.year} className="relative">
              <span className="absolute -left-[1.4rem] top-1.5 size-2 rounded-full bg-[var(--accent)]" />
              <p className="text-sm font-semibold text-[var(--accent)]">
                {t.year}
              </p>
              <p className="mt-1 text-[var(--fg-muted)]">{t.text}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-14 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Leadership
        </h2>
        <ul className="mt-6 grid gap-8 sm:grid-cols-3">
          {LEADERSHIP.map((p) => (
            <li key={p.name} className="border-t border-[var(--border)] pt-4">
              <h3 className="font-semibold text-[var(--fg)]">{p.name}</h3>
              <p className="mt-1 text-sm text-[var(--accent)]">{p.title}</p>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{p.blurb}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm">
          <Link href="/careers" className="text-[var(--accent)]">
            Open roles →
          </Link>
        </p>
      </section>
    </>
  );
}
