"use client";

import { useMock } from "@/components/dashboard/mock-provider";
import { StackTable } from "@/components/ui/stack-table";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import { moneyUsd } from "@/lib/mock/money";
import {
  attritionReport,
  downloadCsv,
  expenseAgeReport,
  headcountReport,
  payrollRegister,
} from "@/lib/mock/platform";

export function ReportsView() {
  const { ready, state } = useMock();
  if (!ready) return <DashboardSkeleton />;

  const headcount = headcountReport();
  const attrition = attritionReport(state.offboarding);
  const payroll = payrollRegister();
  const ages = expenseAgeReport(state.expenses);
  const maxHead = Math.max(1, ...headcount.map((r) => r.count));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Report gallery
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Headcount, attrition, payroll register, expense age. CSV is generated
          in this browser.
        </p>
      </div>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Headcount</h2>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              downloadCsv("headcount.csv", [
                ["Department", "Count"],
                ...headcount.map((r) => [r.department, String(r.count)]),
              ])
            }
          >
            CSV
          </Button>
        </div>
        <ul className="mt-3 space-y-2">
          {headcount.map((r) => (
            <li key={r.department} className="text-sm">
              <div className="flex justify-between">
                <span>{r.department}</span>
                <span className="tabular-nums">{r.count}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[var(--surface-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${(r.count / maxHead) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Attrition / offboarding</h2>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              downloadCsv("attrition.csv", [
                ["Worker", "Status", "Initiated by"],
                ...attrition.map((r) => [r.worker, r.status, r.initiatedBy]),
              ])
            }
          >
            CSV
          </Button>
        </div>
        {attrition.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--fg-muted)]">None open.</p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm">
            {attrition.map((r) => (
              <li key={r.worker + r.status}>
                {r.worker} · {r.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Payroll register</h2>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              downloadCsv("payroll-register.csv", [
                ["Worker", "Period", "Gross", "Net", "Pay date"],
                ...payroll.map((r) => [
                  r.worker,
                  r.period,
                  String(r.gross),
                  String(r.net),
                  r.payDate,
                ]),
              ])
            }
          >
            CSV
          </Button>
        </div>
        <StackTable className="mt-3">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--fg-muted)]">
                <th className="py-2 pr-3 font-medium">Worker</th>
                <th className="py-2 pr-3 font-medium">Net</th>
                <th className="py-2 font-medium">Pay date</th>
              </tr>
            </thead>
            <tbody>
              {payroll.slice(0, 8).map((r) => (
                <tr key={r.worker} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-3">{r.worker}</td>
                  <td className="py-2 pr-3">{moneyUsd(r.net)}</td>
                  <td className="py-2">{r.payDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </StackTable>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Expense age</h2>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              downloadCsv("expense-age.csv", [
                ["Id", "Merchant", "Amount", "Status", "Age days"],
                ...ages.map((r) => [
                  r.id,
                  r.merchant,
                  String(r.amount),
                  r.status,
                  String(r.ageDays),
                ]),
              ])
            }
          >
            CSV
          </Button>
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {ages.map((r) => (
            <li key={r.id}>
              {r.merchant} · {moneyUsd(r.amount)} · {r.status} · {r.ageDays}d
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
