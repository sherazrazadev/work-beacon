"use client";

import { useMock } from "@/components/dashboard/mock-provider";
import { getWorker } from "@/lib/mock/org";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

function names(ids: string[]) {
  if (ids.length === 0) return "—";
  return ids.map((id) => getWorker(id)?.name ?? id).join(", ");
}

export function SuccessionView() {
  const { ready, state } = useMock();
  if (!ready) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Succession
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Critical roles with ready-now and ready-1yr boxes. HR Admin only.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {state.succession.map((box) => (
          <li
            key={box.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="text-xs uppercase tracking-wider text-[var(--accent)]">
              {box.roleTitle}
            </p>
            <p className="mt-1 font-medium">
              Incumbent: {getWorker(box.incumbentWorkerId)?.name}
            </p>
            <p className="mt-3 text-sm">
              <span className="text-[var(--fg-muted)]">Ready now · </span>
              {names(box.readyNow)}
            </p>
            <p className="mt-1 text-sm">
              <span className="text-[var(--fg-muted)]">Ready 1yr · </span>
              {names(box.ready1yr)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
