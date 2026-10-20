"use client";

import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useMock } from "@/components/dashboard/mock-provider";
import { PAY_GROUPS, periodLabel, taxPackHtml } from "@/lib/mock/payroll";
import { downloadHtml } from "@/lib/mock/money";

export function TaxPacksView() {
  const { ready, state } = useMock();
  if (!ready) return <DashboardSkeleton />;

  const done = state.payrollRuns.filter((r) => r.status === "Complete");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Tax packs
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          HTML pack per completed run — demo only, not a filing.
        </p>
      </div>
      {done.length === 0 ? (
        <EmptyState
          title="No completed runs"
          body="Finance completes a payroll run first."
        />
      ) : (
        <ul className="space-y-3">
          {done.map((run) => {
            const group = PAY_GROUPS.find((g) => g.id === run.groupId);
            return (
              <li
                key={run.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div>
                  <p className="font-medium">{group?.name}</p>
                  <p className="text-sm text-[var(--fg-muted)]">
                    {periodLabel(run.periodStart, run.periodEnd)} ·{" "}
                    {run.payDate}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    downloadHtml(`beacon-tax-pack-${run.payDate}.html`, taxPackHtml(run))
                  }
                >
                  Download pack
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
