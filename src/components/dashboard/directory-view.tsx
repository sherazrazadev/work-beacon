"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  WORKERS,
  getDepartment,
  getLocation,
} from "@/lib/mock/org";

export function DirectoryView() {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return WORKERS;
    return WORKERS.filter((w) => {
      const dep = getDepartment(w.departmentId)?.name ?? "";
      const loc = getLocation(w.locationId)?.name ?? "";
      return (
        w.name.toLowerCase().includes(needle) ||
        w.title.toLowerCase().includes(needle) ||
        w.email.toLowerCase().includes(needle) ||
        dep.toLowerCase().includes(needle) ||
        loc.toLowerCase().includes(needle)
      );
    });
  }, [q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Directory
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Search people across Northstar Labs.
        </p>
      </div>
      <label className="block text-sm text-[var(--fg-muted)]">
        Search
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name, title, department…"
          className="mt-1 w-full max-w-md rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </label>
      <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        {results.map((w) => (
          <li key={w.id}>
            <Link
              href={`/dashboard/people/${w.id}`}
              className="flex flex-col gap-1 px-4 py-3 hover:bg-[var(--surface-muted)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-[var(--fg)]">{w.name}</p>
                <p className="text-sm text-[var(--fg-muted)]">{w.title}</p>
              </div>
              <div className="text-xs text-[var(--fg-muted)] sm:text-right">
                <p>{getDepartment(w.departmentId)?.name}</p>
                <p>{getLocation(w.locationId)?.name}</p>
              </div>
            </Link>
          </li>
        ))}
        {results.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-[var(--fg-muted)]">
            No matches.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
