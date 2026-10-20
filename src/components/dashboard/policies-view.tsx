"use client";

import { useMemo, useState } from "react";
import { searchPolicies } from "@/lib/mock/people-ops";

export function PoliciesView() {
  const [q, setQ] = useState("");
  const articles = useMemo(() => searchPolicies(q), [q]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Policies
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Northstar handbook excerpts (demo copy).
        </p>
      </div>
      <label className="block text-sm">
        Search
        <input
          className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="pto, remote, pay…"
        />
      </label>
      <ul className="space-y-3">
        {articles.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
              {p.category}
            </p>
            <h2 className="mt-1 font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">{p.body}</p>
          </li>
        ))}
        {articles.length === 0 ? (
          <li className="text-sm text-[var(--fg-muted)]">No matching articles.</li>
        ) : null}
      </ul>
    </div>
  );
}
