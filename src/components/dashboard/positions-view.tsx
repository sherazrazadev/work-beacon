"use client";

import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { getWorker } from "@/lib/mock/org";
import { departmentName } from "@/lib/mock/org-ops";

export function PositionsView() {
  const { ready, state } = useMock();
  if (!ready) return <DashboardSkeleton />;

  const fte = state.positions.reduce((n, p) => n + p.fte, 0);
  const open = state.positions.filter((p) => p.status === "Open").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Positions
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          {fte} FTE · {open} open · frozen stays unfilled.
        </p>
      </div>
      <ul className="space-y-3">
        {state.positions.map((p) => {
          const incumbent = p.incumbentWorkerId
            ? getWorker(p.incumbentWorkerId)
            : null;
          return (
            <li
              key={p.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <p className="font-medium">
                {p.title}{" "}
                <span className="text-sm font-normal text-[var(--fg-muted)]">
                  {p.code} · {p.status}
                </span>
              </p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">
                {departmentName(p.departmentId)} · {p.fte} FTE ·{" "}
                {incumbent ? incumbent.name : "no incumbent"}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
