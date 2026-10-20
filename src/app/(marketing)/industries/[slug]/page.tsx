import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { INDUSTRIES, getIndustry } from "@/lib/content";
import { BRAND } from "@/lib/brand";
import { INDUSTRY_DETAILS } from "@/lib/marketing-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: getIndustry(slug)?.name ?? "Industries" };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  const detail = INDUSTRY_DETAILS[slug];
  if (!industry || !detail) notFound();

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title={industry.name}
        description={industry.summary}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          Challenges we see
        </h2>
        <ul className="mt-4 space-y-3">
          {detail.challenges.map((ch) => (
            <li
              key={ch}
              className="border-l-2 border-[var(--accent)] pl-3 text-[var(--fg-muted)]"
            >
              {ch}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Recommended modules
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {detail.modules.map((m) => (
            <li
              key={m}
              className="border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm"
            >
              {m}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Playbook
        </h2>
        <p className="mt-3 max-w-3xl text-[var(--fg-muted)]">{detail.playbook}</p>
        <p className="mt-4 max-w-3xl text-sm text-[var(--fg-muted)]">
          {BRAND.name} packages agents and products for {industry.name}{" "}
          organizations — original demo narrative.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/request-demo">Request Demo</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/industries">All industries</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
