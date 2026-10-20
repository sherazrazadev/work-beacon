import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { RESOURCE_ARTICLES } from "@/lib/marketing-content";

type Props = { params: Promise<{ slug: string }> };

function getArticle(slug: string) {
  return RESOURCE_ARTICLES.find((a) => a.slug === slug);
}

export async function generateStaticParams() {
  return RESOURCE_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: getArticle(slug)?.title ?? "Guide" };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${article.topic} · ${article.minutes} min read`}
        title={article.title}
        description={article.summary}
      />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="space-y-5 text-[var(--fg-muted)]">
          {article.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Link
          href="/resources"
          className="mt-10 inline-block text-sm text-[var(--accent)]"
        >
          ← Resources hub
        </Link>
      </article>
    </>
  );
}
