"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable, Td, Th, Tr } from "@/components/ui/data-table";
import { EmptyState } from "@/components/empty-state";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { getWorker } from "@/lib/mock/org";
import {
  SEED_TAX_FORMS,
  SEED_TOTAL_REWARDS,
  downloadHtml,
  moneyUsd,
  payYtd,
  taxFormHtml,
} from "@/lib/mock/money";

export function PayView() {
  const { session } = useAuth();
  const {
    ready,
    payStubs,
    state,
    addBank,
    removeBank,
    setPrimaryBank,
  } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const worker = getWorker(workerId);
  const [nick, setNick] = useState("");
  const [routing, setRouting] = useState("");
  const [last4, setLast4] = useState("");
  const [kind, setKind] = useState<"Checking" | "Savings">("Checking");
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  const mine = payStubs.filter((s) => !s.workerId || s.workerId === workerId);
  const ytd = payYtd(mine);
  const rewards = SEED_TOTAL_REWARDS;
  const totalRewards =
    rewards.base + rewards.bonus + rewards.benefitsEmployer;
  const forms = SEED_TAX_FORMS.filter((f) => f.workerId === workerId);

  function onAddBank(e: FormEvent) {
    e.preventDefault();
    if (last4.replace(/\D/g, "").length !== 4) {
      setMsg("Last 4 digits required.");
      return;
    }
    addBank({
      nickname: nick.trim() || "New account",
      routing: routing.trim() || "000000000",
      last4: last4.replace(/\D/g, "").slice(-4),
      kind,
      primary: state.banks.length === 0,
    });
    setNick("");
    setRouting("");
    setLast4("");
    setMsg("Bank account saved.");
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
          Pay
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Statements, deposit, tax forms, and total rewards — demo data stays
          in this browser.
        </p>
      </div>

      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Year-to-date {rewards.year}
        </h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["Gross", ytd.gross],
              ["Taxes", ytd.taxes],
              ["Deductions", ytd.deductions],
              ["Net", ytd.net],
            ] as const
          ).map(([label, n]) => (
            <div
              key={label}
              className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4"
            >
              <dt className="text-xs text-[var(--fg-muted)]">{label}</dt>
              <dd className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold">
                {moneyUsd(n)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Statements
        </h2>
        {mine.length === 0 ? (
          <EmptyState
            title="No pay stubs yet"
            body="When payroll runs, stubs will show up here."
            actionHref="/dashboard"
            actionLabel="Back to home"
          />
        ) : (
          <div className="mt-3">
            <DataTable>
              <thead>
                <tr>
                  <Th>Period</Th>
                  <Th>Paid</Th>
                  <Th numeric>Net</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {mine.map((stub) => (
                  <Tr key={stub.id}>
                    <Td>{stub.period}</Td>
                    <Td className="text-[var(--fg-muted)]">{stub.payDate}</Td>
                    <Td numeric>{moneyUsd(stub.net)}</Td>
                    <Td>
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/dashboard/pay/${stub.id}`}>Details</Link>
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </DataTable>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Direct deposit
        </h2>
        {state.banks.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No bank accounts"
              body="Add a checking or savings account for payroll (mock only)."
            />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            {state.banks.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-[var(--fg)]">
                    {b.nickname}
                    {b.primary ? " · Primary" : ""}
                  </p>
                  <p className="text-[var(--fg-muted)]">
                    {b.kind} · •••• {b.last4} · routing {b.routing}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!b.primary ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setPrimaryBank(b.id)}
                    >
                      Make primary
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBank(b.id)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <form
          onSubmit={onAddBank}
          className="mt-4 grid max-w-2xl gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2"
        >
          <h3 className="sm:col-span-2 text-sm font-semibold">Add account</h3>
          <label className="block text-sm text-[var(--fg-muted)]">
            Nickname
            <input
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
            />
          </label>
          <label className="block text-sm text-[var(--fg-muted)]">
            Routing
            <input
              value={routing}
              onChange={(e) => setRouting(e.target.value)}
              inputMode="numeric"
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
            />
          </label>
          <label className="block text-sm text-[var(--fg-muted)]">
            Last 4
            <input
              value={last4}
              onChange={(e) => setLast4(e.target.value)}
              required
              maxLength={4}
              inputMode="numeric"
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
            />
          </label>
          <label className="block text-sm text-[var(--fg-muted)]">
            Type
            <select
              value={kind}
              onChange={(e) =>
                setKind(e.target.value as "Checking" | "Savings")
              }
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            >
              <option>Checking</option>
              <option>Savings</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" size="sm">
              Save account
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Tax forms
        </h2>
        {forms.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No forms on file"
              body="W-2 and 1099 copies will appear after year-end."
            />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            {forms.map((f) => (
              <li
                key={f.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {f.kind} · {f.year}
                  </p>
                  <p className="text-xs text-[var(--fg-muted)]">
                    Issued {f.issued}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    downloadHtml(
                      `${f.kind}-${f.year}.html`,
                      taxFormHtml(f, worker?.name ?? "Employee"),
                    )
                  }
                >
                  Download HTML
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Total rewards {rewards.year}
        </h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Annual view of cash plus employer-paid benefits cost.
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {(
            [
              ["Base salary", rewards.base],
              ["Target bonus", rewards.bonus],
              ["Benefits (employer)", rewards.benefitsEmployer],
              ["Total", totalRewards],
            ] as const
          ).map(([label, n]) => (
            <div
              key={label}
              className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4"
            >
              <dt className="text-xs text-[var(--fg-muted)]">{label}</dt>
              <dd className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold">
                {moneyUsd(n)}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
