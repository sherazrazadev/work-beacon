"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useMock } from "@/components/dashboard/mock-provider";
import { PAY_GROUPS, periodLabel } from "@/lib/mock/payroll";
import { getWorker } from "@/lib/mock/org";
import { moneyUsd } from "@/lib/mock/money";

export function PayrollView() {
  const { ready, state, calculatePayRun, completePayRun } = useMock();
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  const runs = state.payrollRuns;

  function calc(id: string) {
    setMsg(calculatePayRun(id) ? "Calculated." : "Cannot calculate that run.");
  }
  function complete(id: string) {
    setMsg(
      completePayRun(id)
        ? "Posted. Stubs are on Pay."
        : "Calculate first.",
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Payroll
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Draft → Calculate → Complete. Completing writes employee stubs.
        </p>
      </div>
      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}
      {runs.length === 0 ? (
        <EmptyState title="No runs" body="Reset the mock store from Admin." />
      ) : (
        runs.map((run) => {
          const group = PAY_GROUPS.find((g) => g.id === run.groupId);
          const tot = run.results.reduce((s, r) => s + r.net, 0);
          return (
            <section
              key={run.id}
              className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{group?.name}</p>
                  <p className="text-sm text-[var(--fg-muted)]">
                    {periodLabel(run.periodStart, run.periodEnd)} · pay{" "}
                    {run.payDate} · {run.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  {run.status === "Draft" ? (
                    <Button type="button" size="sm" onClick={() => calc(run.id)}>
                      Calculate
                    </Button>
                  ) : null}
                  {run.status === "Calculated" ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => complete(run.id)}
                    >
                      Complete
                    </Button>
                  ) : null}
                </div>
              </div>
              {run.results.length === 0 ? (
                <p className="text-sm text-[var(--fg-muted)]">
                  No results yet.
                </p>
              ) : (
                <>
                  <ul className="space-y-1 text-sm">
                    {run.results.map((r) => (
                      <li
                        key={r.workerId}
                        className="flex justify-between gap-3"
                      >
                        <span>{getWorker(r.workerId)?.name ?? r.workerId}</span>
                        <span className="tabular-nums text-[var(--fg-muted)]">
                          {r.retro ? `retro ${moneyUsd(r.retro)} · ` : ""}
                          {r.garnish ? `garnish ${moneyUsd(r.garnish)} · ` : ""}
                          net {moneyUsd(r.net)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm font-medium">
                    Net total {moneyUsd(tot)}
                  </p>
                </>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}
