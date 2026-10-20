import Link from "next/link";
import { BRAND } from "@/lib/brand";

const PROPS = [
  {
    title: "Other AI guesses. Ours doesn't need to.",
    body: `${BRAND.name} sits at the intersection of HR and finance — people, policies, skills, and financials in one place.`,
    href: "/agents/beacon",
    cta: "Explore the Agent",
  },
  {
    title: "AI you can trust to run on your rules.",
    body: "Full business context. Clear audit trails. Agents that stay inside your security, permissions, and guardrails.",
    href: "/platform#governance",
    cta: "Agent System of Record",
  },
  {
    title: "AI that works, wherever you work.",
    body: "Connect essential enterprise apps and build workflows that meet people where they already are.",
    href: "/platform",
    cta: "Developer Platform",
  },
] as const;

export function ValueProps() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--fg)] sm:text-4xl">
          The trusted agentic platform for HR, finance, and IT.
        </h2>
        <ul className="mt-12 grid gap-10 md:grid-cols-3">
          {PROPS.map((item) => (
            <li key={item.title} className="border-t border-[var(--border)] pt-6">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--fg)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">
                {item.body}
              </p>
              <Link
                href={item.href}
                className="mt-4 inline-block text-sm font-medium text-[var(--accent)]"
              >
                {item.cta} →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
