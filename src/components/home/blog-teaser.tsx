import Link from "next/link";
import { latestBlogPosts } from "@/lib/blog";

export function BlogTeaser() {
  const posts = latestBlogPosts(3);

  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Blog
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--fg)] sm:text-4xl">
              Notes on people, money, and agents.
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            All posts →
          </Link>
        </div>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug} className="border-t border-[var(--border)] pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                {post.topic} · {post.minutes} min
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--fg)]">
                <Link href={`/blog/${post.slug}`} className="hover:text-[var(--accent)]">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
                {post.summary}
              </p>
              <time
                className="mt-4 block text-xs text-[var(--fg-muted)]"
                dateTime={post.date}
              >
                {post.date}
              </time>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
