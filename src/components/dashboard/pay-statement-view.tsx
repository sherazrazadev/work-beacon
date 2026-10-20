"use client";

import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { useMock } from "@/components/dashboard/mock-provider";
import { moneyUsd, payYtd } from "@/lib/mock/money";
import type { PayLine } from "@/lib/mock/data";

function LineTable({
  title,
  lines,
}: {
  title: string;
  lines: PayLine[];
}) {
  const total = lines.reduce((s, l) => s + l.amount, 0);
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
        {title}
      </h2>
      {lines.length === 0 ? (
        <p className="mt-2 text-sm text-[var(--fg-muted)]">No lines.</p>
      ) : (
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--fg-muted)]">
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.label} className="border-t border-[var(--border)]">
                <td className="py-2">{l.label}</td>
                <td className="py-2 text-right">{moneyUsd(l.amount)}</td>
              </tr>
            ))}
            <tr className="border-t border-[var(--border)] font-semibold">
              <td className="py-2">Total</td>
              <td className="py-2 text-right">{moneyUsd(total)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </section>
  );
}

export function PayStatementView({ stubId }: { stubId: string }) {
  const { ready, payStubs } = useMock();
  const stub = payStubs.find((s) => s.id === stubId);
  const ytd = payYtd(payStubs);

  if (!ready) return <DashboardSkeleton />;
  if (!stub) {
    return (
      <EmptyState
        title="Statement not found"
        body="That pay period is not in the demo set."
        actionHref="/dashboard/pay"
        actionLabel="Back to pay"
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link
          href="/dashboard/pay"
          className="text-sm text-[var(--accent)]"
        >
          ← All statements
        </Link>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold">
          {stub.period}
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Paid {stub.payDate} · net {moneyUsd(stub.net)}
        </p>
      </div>

      <LineTable title="Earnings" lines={stub.earnings} />
      <LineTable title="Taxes" lines={stub.taxLines} />
      <LineTable title="Deductions" lines={stub.deductionLines} />

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          This check vs YTD
        </h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Gross</dt>
            <dd>
              {moneyUsd(stub.gross)} · YTD {moneyUsd(ytd.gross)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Taxes</dt>
            <dd>
              {moneyUsd(stub.taxes)} · YTD {moneyUsd(ytd.taxes)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Deductions</dt>
            <dd>
              {moneyUsd(stub.deductions)} · YTD {moneyUsd(ytd.deductions)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-[var(--border)] pt-2 font-semibold">
            <dt>Net</dt>
            <dd>
              {moneyUsd(stub.net)} · YTD {moneyUsd(ytd.net)}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
