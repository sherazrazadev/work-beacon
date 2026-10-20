import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return {
    title: post?.title ?? "Blog",
    description: post?.summary,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${post.topic} · ${post.minutes} min · ${post.date}`}
        title={post.title}
        description={post.summary}
      />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="text-sm text-[var(--fg-muted)]">{post.author}</p>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-[var(--fg-muted)]">
          {post.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Link
          href="/blog"
          className="mt-10 inline-block text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
        >
          ← All posts
        </Link>
      </article>
    </>
  );
}
