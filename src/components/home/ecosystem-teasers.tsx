import Link from "next/link";
import { BRAND } from "@/lib/brand";

const TEASERS = [
  {
    href: "/partners",
    title: "Partner Ecosystem",
    body: "Tap a global partner network for integration, expertise, and service.",
    cta: "Partner Program",
  },
  {
    href: "/industries",
    title: "Industry Solutions",
    body: "Tackle industry-specific challenges with AI that elevates people and processes.",
    cta: "All industries",
  },
  {
    href: "/go",
    title: "Midsize packages",
    body: `With ${BRAND.name} GO, get HR, payroll, finance, and AI in packages for lean teams.`,
    cta: "Product packages",
  },
] as const;

export function EcosystemTeasers() {
  return (
    <section className="bg-[var(--surface-muted)]/60 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--fg)]">
          One platform. Limitless possibilities.
        </h2>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {TEASERS.map((t) => (
            <li key={t.href}>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--fg)]">
                {t.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{t.body}</p>
              <Link
                href={t.href}
                className="mt-4 inline-block text-sm font-medium text-[var(--accent)]"
              >
                {t.cta} →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
