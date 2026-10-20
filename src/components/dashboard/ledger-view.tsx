"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { useMock } from "@/components/dashboard/mock-provider";
import { CHART_OF_ACCOUNTS, moneyUsd } from "@/lib/mock/money";

export function LedgerView() {
  const { ready, state, addJournalDraft } = useMock();
  const [date, setDate] = useState("2026-10-18");
  const [memo, setMemo] = useState("");
  const [debitAcct, setDebitAcct] = useState("5100");
  const [creditAcct, setCreditAcct] = useState("2000");
  const [amount, setAmount] = useState("42");
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  function accountName(code: string) {
    return CHART_OF_ACCOUNTS.find((a) => a.code === code)?.name ?? code;
  }

  function onCreate(e: FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0 || !memo.trim()) {
      setMsg("Memo and a positive amount are required.");
      return;
    }
    const ok = addJournalDraft({
      date,
      memo: memo.trim(),
      lines: [
        { accountCode: debitAcct, debit: n, credit: 0 },
        { accountCode: creditAcct, debit: 0, credit: n },
      ],
    });
    setMsg(ok ? "Draft journal saved." : "Lines must balance.");
    if (ok) setMemo("");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Ledger
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Chart of accounts and journals. Finance persona only.
        </p>
      </div>

      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Chart of accounts
        </h2>
        <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm">
          {CHART_OF_ACCOUNTS.map((a) => (
            <li key={a.code} className="flex justify-between gap-3 px-4 py-2">
              <span className="font-medium">
                {a.code} · {a.name}
              </span>
              <span className="text-[var(--fg-muted)]">{a.type}</span>
            </li>
          ))}
        </ul>
      </section>

      <form
        onSubmit={onCreate}
        className="grid max-w-2xl gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2"
      >
        <h2 className="sm:col-span-2 text-sm font-semibold">New draft journal</h2>
        <label className="block text-sm text-[var(--fg-muted)]">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          />
        </label>
        <label className="block text-sm text-[var(--fg-muted)]">
          Amount
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          />
        </label>
        <label className="sm:col-span-2 block text-sm text-[var(--fg-muted)]">
          Memo
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
          />
        </label>
        <label className="block text-sm text-[var(--fg-muted)]">
          Debit
          <select
            value={debitAcct}
            onChange={(e) => setDebitAcct(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          >
            {CHART_OF_ACCOUNTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.code} {a.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-[var(--fg-muted)]">
          Credit
          <select
            value={creditAcct}
            onChange={(e) => setCreditAcct(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          >
            {CHART_OF_ACCOUNTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.code} {a.name}
              </option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" size="sm">
            Save draft
          </Button>
        </div>
      </form>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Journals
        </h2>
        {state.journals.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No journals" body="Create a balanced draft." />
          </div>
        ) : (
          <ul className="mt-3 space-y-3">
            {state.journals.map((j) => (
              <li
                key={j.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
              >
                <div className="flex justify-between gap-2">
                  <p className="font-medium">{j.memo}</p>
                  <span>{j.status}</span>
                </div>
                <p className="text-xs text-[var(--fg-muted)]">{j.date}</p>
                <ul className="mt-2 space-y-1 text-xs">
                  {j.lines.map((l, i) => (
                    <li key={`${j.id}-${i}`} className="flex justify-between">
                      <span>
                        {l.accountCode} {accountName(l.accountCode)}
                      </span>
                      <span>
                        Dr {moneyUsd(l.debit)} · Cr {moneyUsd(l.credit)}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
