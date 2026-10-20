import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { AGENT_CATEGORIES, getAgentCategory } from "@/lib/content";
import { AGENT_DETAILS } from "@/lib/marketing-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return AGENT_CATEGORIES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getAgentCategory(slug);
  return { title: item?.name ?? "Agents" };
}

export default async function AgentCategoryPage({ params }: Props) {
  const { slug } = await params;
  const item = getAgentCategory(slug);
  const detail = AGENT_DETAILS[slug];
  if (!item || !detail) notFound();

  return (
    <>
      <PageHero
        eyebrow="Agents"
        title={item.name}
        description={item.summary}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--fg)]">
              The problem
            </h2>
            <p className="mt-3 text-[var(--fg-muted)]">{detail.problem}</p>

            <h2 className="mt-10 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--fg)]">
              Capabilities
            </h2>
            <ul className="mt-4 space-y-3">
              {detail.capabilities.map((c) => (
                <li
                  key={c}
                  className="border-l-2 border-[var(--accent)] pl-3 text-[var(--fg-muted)]"
                >
                  {c}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--fg)]">
              Outcomes
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {detail.outcomes.map((o) => (
                <li
                  key={o}
                  className="border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--fg)]"
                >
                  {o}
                </li>
              ))}
            </ul>
          </div>

          <aside className="border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
              Try the demo
            </h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Request a walkthrough or open the employee dashboard to chat with
              the agent panel.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild>
                <Link href="/request-demo">Request Demo</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/login">Open dashboard</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/agents">All agents</Link>
              </Button>
            </div>
          </aside>
        </div>

        <div className="mt-16 border-t border-[var(--border)] pt-10">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
            FAQ
          </h2>
          <dl className="mt-6 space-y-6">
            {detail.faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--fg-muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
