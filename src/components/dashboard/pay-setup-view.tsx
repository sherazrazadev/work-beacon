"use client";

import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { useMock } from "@/components/dashboard/mock-provider";
import {
  PAY_GROUPS,
  SEED_PAY_PERIODS,
  workersInGroup,
} from "@/lib/mock/payroll";

export function PaySetupView() {
  const { ready, state } = useMock();
  if (!ready) return <DashboardSkeleton />;

  const paid = new Set(
    state.payrollRuns
      .filter((r) => r.status === "Complete")
      .map((r) => r.periodId),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Pay setup
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Groups and calendar for Northstar Labs (demo).
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Groups
        </h2>
        <ul className="mt-3 space-y-3">
          {PAY_GROUPS.map((g) => {
            const members = workersInGroup(g.id);
            return (
              <li
                key={g.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <p className="font-medium">{g.name}</p>
                <p className="text-sm text-[var(--fg-muted)]">
                  {g.cadence === "semi" ? "Semi-monthly" : "Biweekly"} ·{" "}
                  {g.periodsPerYear} periods/year · {members.length} workers
                </p>
                <p className="mt-2 text-sm">
                  {members.map((w) => w.preferredName).join(", ")}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Calendar
        </h2>
        <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {SEED_PAY_PERIODS.map((p) => {
            const status = paid.has(p.id) ? "Paid" : p.status;
            const group = PAY_GROUPS.find((g) => g.id === p.groupId);
            return (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
              >
                <span>
                  {group?.name} · {p.start} → {p.end}
                </span>
                <span className="text-[var(--fg-muted)]">
                  Pay {p.payDate} · {status}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
