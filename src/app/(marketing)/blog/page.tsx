import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from Work Beacon on HR, finance, IT, and workplace agents.",
};

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Blog"
        description="Practical notes on people, money, and agents — original Work Beacon writing."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {posts.map((post) => (
            <li key={post.slug} className="py-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                {post.topic} · {post.minutes} min ·{" "}
                <time dateTime={post.date}>{post.date}</time>
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--fg)]">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-[var(--accent)]"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--fg-muted)]">
                {post.summary}
              </p>
              <p className="mt-3 text-xs text-[var(--fg-muted)]">{post.author}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
