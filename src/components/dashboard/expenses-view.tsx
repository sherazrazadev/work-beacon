"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { getWorker } from "@/lib/mock/org";
import { moneyUsd } from "@/lib/mock/money";

const CATEGORIES = ["Software", "Travel", "Meals", "Office", "Other"];

export function ExpensesView() {
  const { session } = useAuth();
  const { ready, state, addExpense, decideExpense } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const role = session?.user.role ?? "employee";
  const isManager = role === "manager" || role === "hr_admin";
  const isFinance = role === "finance";

  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("Software");
  const [date, setDate] = useState("2026-10-18");
  const [receiptName, setReceiptName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  const mine = state.expenses.filter((e) => e.workerId === workerId);
  const pending = state.expenses.filter((e) => e.status === "Submitted");
  const approvedQueue = state.expenses.filter((e) => e.status === "Approved");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0 || !merchant.trim()) {
      setMsg("Amount and merchant are required.");
      return;
    }
    addExpense({
      workerId,
      amount: n,
      merchant: merchant.trim(),
      category,
      date,
      receiptName: receiptName.trim() || "receipt.txt",
      receiptKb: 32,
    });
    setAmount("");
    setMerchant("");
    setReceiptName("");
    setMsg("Expense submitted.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Expenses
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Submit receipts as metadata only. Managers approve; Finance sees the
          approved queue.
        </p>
      </div>

      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      {!isFinance ? (
        <form
          onSubmit={onSubmit}
          className="grid max-w-2xl gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2"
        >
          <h2 className="sm:col-span-2 text-sm font-semibold">New expense</h2>
          <label className="block text-sm text-[var(--fg-muted)]">
            Amount
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              required
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
            />
          </label>
          <label className="block text-sm text-[var(--fg-muted)]">
            Merchant
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
            />
          </label>
          <label className="block text-sm text-[var(--fg-muted)]">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-[var(--fg-muted)]">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            />
          </label>
          <label className="sm:col-span-2 block text-sm text-[var(--fg-muted)]">
            Receipt filename
            <input
              value={receiptName}
              onChange={(e) => setReceiptName(e.target.value)}
              placeholder="uber-oct.pdf"
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
            />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" size="sm">
              Submit
            </Button>
          </div>
        </form>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          {isFinance ? "Approved queue" : "My expenses"}
        </h2>
        {(isFinance ? approvedQueue : mine).length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title={isFinance ? "Queue is empty" : "No expenses"}
              body={
                isFinance
                  ? "Approved reports will land here for reimbursement."
                  : "Submit a report to start the demo path."
              }
            />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            {(isFinance ? approvedQueue : mine).map((e) => (
              <li key={e.id} className="px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">
                    {e.merchant} · {moneyUsd(e.amount)}
                  </p>
                  <span>{e.status}</span>
                </div>
                <p className="text-xs text-[var(--fg-muted)]">
                  {e.category} · {e.date} · {e.receiptName} ({e.receiptKb} KB)
                  {isFinance
                    ? ` · ${getWorker(e.workerId)?.name ?? e.workerId}`
                    : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {isManager ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Pending approval
          </h2>
          {pending.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Nothing waiting.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {pending.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {getWorker(e.workerId)?.name ?? e.workerId} ·{" "}
                      {moneyUsd(e.amount)}
                    </p>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {e.merchant} · {e.category}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => decideExpense(e.id, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => decideExpense(e.id, "Denied")}
                    >
                      Deny
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
