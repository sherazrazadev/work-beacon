"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RESOURCE_ARTICLES } from "@/lib/marketing-content";

const TOPICS = ["All", ...Array.from(new Set(RESOURCE_ARTICLES.map((a) => a.topic)))];

export function ResourcesLibrary() {
  const [topic, setTopic] = useState("All");
  const articles = useMemo(
    () =>
      topic === "All"
        ? RESOURCE_ARTICLES
        : RESOURCE_ARTICLES.filter((a) => a.topic === topic),
    [topic],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTopic(t)}
            className={`border px-3 py-1.5 text-sm transition-colors ${
              topic === t
                ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {articles.map((a) => (
          <li key={a.slug} className="border-t border-[var(--border)] pt-4">
            <p className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
              {a.topic} · {a.minutes} min
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold">
              <Link
                href={`/resources/guides/${a.slug}`}
                className="hover:text-[var(--accent)]"
              >
                {a.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">{a.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
