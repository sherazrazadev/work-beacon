import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomerLogo } from "@/components/customer-logo";
import { PageHero } from "@/components/page-hero";
import { CUSTOMER_STORIES } from "@/lib/marketing-content";

type Props = { params: Promise<{ slug: string }> };

function getStory(slug: string) {
  return CUSTOMER_STORIES.find((c) => c.slug === slug);
}

export async function generateStaticParams() {
  return CUSTOMER_STORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: getStory(slug)?.name ?? "Customers" };
}

export default async function CustomerStoryPage({ params }: Props) {
  const { slug } = await params;
  const c = getStory(slug);
  if (!c) notFound();

  return (
    <>
      <PageHero eyebrow={c.industry} title={c.name} description={c.quote} />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-center gap-6">
          <CustomerLogo letters={c.logo.letters} hue={c.logo.hue} size="lg" />
          <div>
            <p className="text-sm text-[var(--fg-muted)]">{c.role}</p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">{c.industry}</p>
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-6 sm:max-w-md">
          {c.metrics.map((m) => (
            <div key={m.label}>
              <dt className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--accent)]">
                {m.value}
              </dt>
              <dd className="text-sm text-[var(--fg-muted)]">{m.label}</dd>
            </div>
          ))}
        </dl>

        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {(
            [
              ["Challenge", c.challenge],
              ["Solution", c.solution],
              ["Result", c.result],
            ] as const
          ).map(([label, text]) => (
            <li key={label} className="border-t border-[var(--border)] pt-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                {label}
              </h2>
              <p className="mt-3 text-[var(--fg-muted)]">{text}</p>
            </li>
          ))}
        </ol>

        <blockquote className="mt-14 border-l-2 border-[var(--accent)] pl-5 text-lg text-[var(--fg)]">
          “{c.quote}”
          <footer className="mt-3 text-sm text-[var(--fg-muted)]">
            — {c.role}, {c.name}
          </footer>
        </blockquote>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/request-demo">Request Demo</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/customers">All stories</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
