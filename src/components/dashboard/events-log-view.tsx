"use client";

import { useMemo, useState } from "react";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

export function EventsLogView() {
  const { ready, state } = useMock();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return state.processEvents.filter((e) => {
      if (kind !== "all" && e.kind !== kind) return false;
      if (!needle) return true;
      return `${e.title} ${e.detail} ${e.kind}`.toLowerCase().includes(needle);
    });
  }, [state.processEvents, q, kind]);

  if (!ready) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Business process events
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          hired, paid, approved, terminated — searchable.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title or detail"
          className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
          aria-label="Search events"
        />
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
          aria-label="Event kind"
        >
          <option value="all">All kinds</option>
          <option value="hired">hired</option>
          <option value="paid">paid</option>
          <option value="approved">approved</option>
          <option value="terminated">terminated</option>
        </select>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--fg-muted)]">No events match.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((e) => (
            <li
              key={e.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
            >
              <p className="font-medium">
                {e.kind} · {e.title}
              </p>
              <p className="text-[var(--fg-muted)]">{e.detail}</p>
              <p className="mt-1 text-xs text-[var(--fg-muted)]">
                {e.at.replace("T", " ").slice(0, 16)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
