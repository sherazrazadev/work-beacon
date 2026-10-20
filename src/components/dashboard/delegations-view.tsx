"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import { WORKERS } from "@/lib/mock/org";
import {
  type DelegationScope,
  workerName,
} from "@/lib/mock/people-ops";
import { addDaysIso, WF_TODAY } from "@/lib/mock/workforce";

export function DelegationsView() {
  const { session } = useAuth();
  const { ready, state, addDelegation } = useMock();
  const fromWorkerId = session?.user.workerId ?? "w-morgan";
  const [toWorkerId, setToWorkerId] = useState(
    WORKERS.find((w) => w.id !== fromWorkerId)?.id ?? "w-alex",
  );
  const [scope, setScope] = useState<DelegationScope>("leave");
  const [end, setEnd] = useState(addDaysIso(WF_TODAY, 14));
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  const mine = state.delegations.filter(
    (d) =>
      d.fromWorkerId === fromWorkerId || d.toWorkerId === fromWorkerId,
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const row = addDelegation({ fromWorkerId, toWorkerId, scope, end });
    setMsg(
      row
        ? `Delegation ${row.id} — ${workerName(toWorkerId)} has an Inbox item.`
        : "Already have an active delegation, or invalid delegate.",
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Delegations
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Let someone act on leave or expense queues while you are out.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <label className="block text-sm">
          Delegate
          <select
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            value={toWorkerId}
            onChange={(e) => setToWorkerId(e.target.value)}
          >
            {WORKERS.filter((w) => w.id !== fromWorkerId).map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Scope
          <select
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            value={scope}
            onChange={(e) => setScope(e.target.value as DelegationScope)}
          >
            <option value="leave">Leave</option>
            <option value="expense">Expenses</option>
            <option value="all">Leave + expenses</option>
          </select>
        </label>
        <label className="block text-sm">
          Ends
          <input
            type="date"
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>
        {msg ? (
          <p role="status" className="text-sm text-[var(--accent)]">
            {msg}
          </p>
        ) : null}
        <Button type="submit">Create delegation</Button>
      </form>

      <ul className="space-y-3">
        {mine.map((d) => (
          <li
            key={d.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
          >
            {workerName(d.fromWorkerId)} → {workerName(d.toWorkerId)} ·{" "}
            {d.scope} · {d.start}–{d.end}
          </li>
        ))}
        {mine.length === 0 ? (
          <li className="text-sm text-[var(--fg-muted)]">None yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
