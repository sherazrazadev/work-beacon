"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { WORKERS, getDirectReports, getWorker } from "@/lib/mock/org";

function Node({
  workerId,
  expanded,
  toggle,
  depth,
}: {
  workerId: string;
  expanded: Set<string>;
  toggle: (id: string) => void;
  depth: number;
}) {
  const worker = getWorker(workerId);
  if (!worker) return null;
  const reports = getDirectReports(workerId);
  const open = expanded.has(workerId);

  return (
    <li>
      <div
        className="flex items-start gap-2 py-1"
        style={{ paddingLeft: depth * 16 }}
      >
        {reports.length > 0 ? (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => toggle(workerId)}
            className="size-9 shrink-0 rounded border border-[var(--border)] text-xs text-[var(--fg-muted)]"
          >
            {open ? "−" : "+"}
          </button>
        ) : (
          <span className="size-9 shrink-0" />
        )}
        <div>
          <Link
            href={`/dashboard/people/${worker.id}`}
            className="inline-flex min-h-9 items-center font-medium text-[var(--fg)] hover:text-[var(--accent)]"
          >
            {worker.name}
          </Link>
          <p className="text-xs text-[var(--fg-muted)]">{worker.title}</p>
        </div>
      </div>
      {open && reports.length > 0 ? (
        <ul>
          {reports.map((r) => (
            <Node
              key={r.id}
              workerId={r.id}
              expanded={expanded}
              toggle={toggle}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function OrgChartView() {
  const roots = useMemo(
    () => WORKERS.filter((w) => w.managerId === null).map((w) => w.id),
    [],
  );
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const next = new Set<string>(roots);
    next.add("w-morgan");
    return next;
  });

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Org chart
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Expand nodes or open a worker profile.
        </p>
      </div>
      <ul className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        {roots.map((id) => (
          <Node
            key={id}
            workerId={id}
            expanded={expanded}
            toggle={toggle}
            depth={0}
          />
        ))}
      </ul>
    </div>
  );
}
