"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import { DataTable, Td, Th, Tr } from "@/components/ui/data-table";
import { downloadCsv } from "@/lib/mock/platform";
import {
  INSIGHT_BOARDS,
  type InsightBoard,
  canSeeInsightBoard,
  defaultInsightBoard,
  managerSpans,
  moneyVsPlan,
  openReqLoad,
  peopleByDepartment,
  peopleByLocation,
  spendByCategory,
  talentFunnel,
  timeOps,
} from "@/lib/mock/insights";
import { moneyUsd } from "@/lib/mock/money";

function Bars({
  rows,
}: {
  rows: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (rows.length === 0) {
    return <p className="text-sm text-[var(--fg-muted)]">No rows.</p>;
  }
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="text-sm">
          <div className="flex justify-between gap-2">
            <span>{r.label}</span>
            <span className="tabular-nums">{r.count}</span>
          </div>
          <div
            className="mt-1 h-2 rounded-full bg-[var(--surface-muted)]"
            role="meter"
            aria-label={r.label}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={r.count}
          >
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{ width: `${(r.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function InsightsView() {
  const { session } = useAuth();
  const { ready, state, setInsightView } = useMock();
  const role = session?.user.role ?? "employee";

  if (!ready) return <DashboardSkeleton />;

  const saved = state.insightView;
  const board =
    saved && canSeeInsightBoard(role, saved)
      ? saved
      : defaultInsightBoard(role);
  const tabs = INSIGHT_BOARDS.filter((b) => canSeeInsightBoard(role, b));

  const dept = peopleByDepartment();
  const loc = peopleByLocation();
  const spans = managerSpans();
  const funnel = talentFunnel(state.candidates);
  const reqs = openReqLoad(state.jobs);
  const time = timeOps(state.timesheets, state.exceptions);
  const money = moneyVsPlan(
    state.planningScenario,
    state.expenses,
    state.purchases,
  );
  const cats = spendByCategory(state.expenses);

  function onTab(next: InsightBoard) {
    setInsightView(next);
  }

  function exportCsv() {
    if (board === "people") {
      downloadCsv("insights-people.csv", [
        ["Slice", "Label", "Count"],
        ...dept.map((r) => ["Department", r.label, String(r.count)]),
        ...loc.map((r) => ["Location", r.label, String(r.count)]),
        ...spans.map((r) => ["Span", r.label, String(r.count)]),
      ]);
      return;
    }
    if (board === "talent") {
      downloadCsv("insights-talent.csv", [
        ["Kind", "Label", "Count"],
        ...funnel.map((r) => ["Stage", r.label, String(r.count)]),
        ...reqs.map((r) => ["Open req", r.label, String(r.count)]),
      ]);
      return;
    }
    if (board === "time") {
      downloadCsv("insights-time.csv", [
        ["Metric", "Value"],
        ["Timesheets", String(time.sheets)],
        ["Drafts", String(time.drafts)],
        ["Over 40h", String(time.overtime)],
        ["Open exceptions", String(time.openEx)],
      ]);
      return;
    }
    downloadCsv("insights-money.csv", [
      ["Department", "Plan HC", "Actual HC", "Plan spend", "Actual spend"],
      ...money.rows.map((r) => [
        r.department,
        String(r.planHeadcount),
        String(r.actualHeadcount),
        String(r.planSpend),
        String(r.actualSpend),
      ]),
    ]);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
            Beacon Insights
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Live mock store — people, talent, time, and money vs plan.
          </p>
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={exportCsv}>
          CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Insight boards">
        {tabs.map((b) => (
          <button
            key={b}
            type="button"
            role="tab"
            aria-selected={board === b}
            className={`rounded-md border px-3 py-1.5 text-sm capitalize ${
              board === b
                ? "border-[var(--accent)] bg-[var(--surface-muted)] font-medium"
                : "border-[var(--border)]"
            }`}
            onClick={() => onTab(b)}
          >
            {b}
          </button>
        ))}
      </div>

      {board === "people" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">By department</h2>
            <div className="mt-3">
              <Bars rows={dept} />
            </div>
          </section>
          <section className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">By location</h2>
            <div className="mt-3">
              <Bars rows={loc} />
            </div>
          </section>
          <section className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">Manager span</h2>
            <div className="mt-3">
              <Bars rows={spans} />
            </div>
          </section>
        </div>
      ) : null}

      {board === "talent" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">Pipeline</h2>
            <div className="mt-3">
              <Bars rows={funnel} />
            </div>
          </section>
          <section className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">Open reqs</h2>
            <div className="mt-3">
              {reqs.length === 0 ? (
                <p className="text-sm text-[var(--fg-muted)]">No open reqs.</p>
              ) : (
                <Bars rows={reqs} />
              )}
            </div>
          </section>
        </div>
      ) : null}

      {board === "time" ? (
        <section>
          <DataTable>
            <thead>
              <tr>
                <Th>Metric</Th>
                <Th numeric>Count</Th>
              </tr>
            </thead>
            <tbody>
              <Tr>
                <Td>Timesheets</Td>
                <Td numeric>{time.sheets}</Td>
              </Tr>
              <Tr>
                <Td>Drafts</Td>
                <Td numeric>{time.drafts}</Td>
              </Tr>
              <Tr>
                <Td>Over 40h</Td>
                <Td numeric>{time.overtime}</Td>
              </Tr>
              <Tr>
                <Td>Open exceptions</Td>
                <Td numeric>{time.openEx}</Td>
              </Tr>
            </tbody>
          </DataTable>
        </section>
      ) : null}

      {board === "money" ? (
        <div className="space-y-6">
          <p className="text-sm text-[var(--fg-muted)]">
            Scenario <strong>{state.planningScenario}</strong> · spend{" "}
            {moneyUsd(money.actualSpend)} vs plan {moneyUsd(money.planSpend)} ·
            pending expenses {moneyUsd(money.pendingExp)} · open POs{" "}
            {moneyUsd(money.openPo)}
          </p>
          <DataTable>
            <thead>
              <tr>
                <Th>Department</Th>
                <Th numeric>Plan HC</Th>
                <Th numeric>Actual HC</Th>
                <Th numeric>Plan spend</Th>
                <Th numeric>Actual spend</Th>
              </tr>
            </thead>
            <tbody>
              {money.rows.map((r) => (
                <Tr key={r.department}>
                  <Td>{r.department}</Td>
                  <Td numeric>{r.planHeadcount}</Td>
                  <Td numeric>{r.actualHeadcount}</Td>
                  <Td numeric>{moneyUsd(r.planSpend)}</Td>
                  <Td numeric>{moneyUsd(r.actualSpend)}</Td>
                </Tr>
              ))}
            </tbody>
          </DataTable>
          <section className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">Expenses by category</h2>
            <div className="mt-3">
              <Bars
                rows={cats.map((c) => ({
                  label: c.label,
                  count: Math.round(c.amount),
                }))}
              />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
