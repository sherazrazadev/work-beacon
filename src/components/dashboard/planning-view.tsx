"use client";

import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { useMock } from "@/components/dashboard/mock-provider";
import { StackTable } from "@/components/ui/stack-table";
import {
  SEED_PLANNING,
  moneyUsd,
  scenarioRows,
  type PlanningScenario,
} from "@/lib/mock/money";

export function PlanningView() {
  const { ready, state, setPlanningScenario } = useMock();

  if (!ready) return <DashboardSkeleton />;

  const scenario = state.planningScenario;
  const rows = scenarioRows(SEED_PLANNING, scenario);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Beacon Planning
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Headcount and spend plan vs actual. Toggle a stretch scenario — original
          Work Beacon UX.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Planning scenario"
        className="flex flex-wrap gap-2"
      >
        {(
          [
            ["baseline", "Baseline"],
            ["stretch", "Stretch"],
          ] as [PlanningScenario, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={scenario === id}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              scenario === id
                ? "border-[var(--accent)] bg-[var(--surface-muted)] font-medium text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--fg-muted)] hover:bg-[var(--surface-muted)]"
            }`}
            onClick={() => setPlanningScenario(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <StackTable className="sm:rounded-xl sm:border sm:border-[var(--border)] sm:bg-[var(--surface)]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--fg-muted)]">
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Plan HC</th>
              <th className="px-4 py-3 font-medium">Actual HC</th>
              <th className="px-4 py-3 font-medium">Plan spend</th>
              <th className="px-4 py-3 font-medium">Actual spend</th>
              <th className="px-4 py-3 font-medium">Variance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const variance = r.planSpend - r.actualSpend;
              return (
                <tr key={r.department} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-medium">{r.department}</td>
                  <td className="px-4 py-3">{r.planHeadcount}</td>
                  <td className="px-4 py-3">{r.actualHeadcount}</td>
                  <td className="px-4 py-3">{moneyUsd(r.planSpend)}</td>
                  <td className="px-4 py-3">{moneyUsd(r.actualSpend)}</td>
                  <td className="px-4 py-3">{moneyUsd(variance)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </StackTable>
    </div>
  );
}
