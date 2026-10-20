"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { getWorker } from "@/lib/mock/org";
import { SEED_CATALOG, moneyUsd } from "@/lib/mock/money";

export function ProcurementView() {
  const { session } = useAuth();
  const {
    ready,
    state,
    requestPurchase,
    approvePurchase,
    issuePurchaseOrder,
  } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const role = session?.user.role ?? "employee";
  const canApprove = role === "manager" || role === "hr_admin" || role === "finance";
  const canIssue = role === "finance";

  const [itemId, setItemId] = useState(SEED_CATALOG[0].id);
  const [qty, setQty] = useState("1");
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  function catalogName(id: string) {
    return SEED_CATALOG.find((c) => c.id === id)?.name ?? id;
  }

  function onRequest(e: FormEvent) {
    e.preventDefault();
    const n = Math.max(1, Number(qty) || 1);
    requestPurchase(itemId, n, workerId);
    setMsg("Request submitted.");
  }

  function onPo(id: string) {
    const po = issuePurchaseOrder(id);
    setMsg(po ? `Purchase order ${po} issued.` : "Approve first, then issue PO.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Procurement
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Catalog request → approval → PO number. Demo catalog only.
        </p>
      </div>

      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      <form
        onSubmit={onRequest}
        className="grid max-w-xl gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2"
      >
        <h2 className="sm:col-span-2 text-sm font-semibold">Catalog request</h2>
        <label className="block text-sm text-[var(--fg-muted)]">
          Item
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          >
            {SEED_CATALOG.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {moneyUsd(c.unitPrice)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-[var(--fg-muted)]">
          Quantity
          <input
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            inputMode="numeric"
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          />
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" size="sm">
            Request
          </Button>
        </div>
      </form>

      {state.purchases.length === 0 ? (
        <EmptyState
          title="No requests"
          body="Pick a catalog item to start the happy path."
        />
      ) : (
        <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {state.purchases.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {catalogName(p.itemId)} × {p.qty}
                </p>
                <p className="text-xs text-[var(--fg-muted)]">
                  {getWorker(p.requestedBy)?.name ?? p.requestedBy} · {p.status}
                  {p.poNumber ? ` · ${p.poNumber}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                {canApprove && p.status === "Requested" ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => approvePurchase(p.id)}
                  >
                    Approve
                  </Button>
                ) : null}
                {canIssue && p.status === "Approved" ? (
                  <Button type="button" size="sm" onClick={() => onPo(p.id)}>
                    Issue PO
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
