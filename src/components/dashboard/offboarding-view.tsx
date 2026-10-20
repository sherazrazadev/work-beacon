"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { WORKERS, getDirectReports, getWorker } from "@/lib/mock/org";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

export function OffboardingView() {
  const { session } = useAuth();
  const { ready, state, startOffboarding, toggleOffboardingTask } = useMock();
  const workerId = session?.user.workerId ?? "w-morgan";
  const isHr = session?.user.role === "hr_admin";
  const options = isHr
    ? WORKERS.filter((w) => w.id !== workerId)
    : getDirectReports(workerId);
  const [target, setTarget] = useState(options[0]?.id ?? "w-casey");

  if (!ready) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Offboarding
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Mock access-revoke checklist. No real accounts are changed.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-[var(--fg-muted)]">
          Worker
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-1 block rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          >
            {options.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </label>
        <Button
          type="button"
          onClick={() => startOffboarding(target, workerId)}
        >
          Start offboarding
        </Button>
      </div>

      <ul className="space-y-4">
        {state.offboarding.map((plan) => (
          <li
            key={plan.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="font-medium">
              {getWorker(plan.workerId)?.name} · {plan.status}
            </p>
            <p className="text-xs text-[var(--fg-muted)]">
              Initiated by {getWorker(plan.initiatedBy)?.name}
            </p>
            {(() => {
              const held = state.assets.filter(
                (a) => a.workerId === plan.workerId && a.status === "Assigned",
              );
              const openAcc = state.accessRequests.filter(
                (r) => r.workerId === plan.workerId && r.status === "Open",
              );
              if (held.length === 0 && openAcc.length === 0) return null;
              return (
                <p className="mt-2 text-sm text-[var(--fg-muted)]">
                  Recall:{" "}
                  {held.map((a) => `${a.kind} ${a.tag}`).join(", ") || "no assets"}
                  {openAcc.length
                    ? ` · ${openAcc.length} open access request${openAcc.length === 1 ? "" : "s"}`
                    : ""}
                </p>
              );
            })()}
            <ul className="mt-3 space-y-2">
              {plan.tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleOffboardingTask(plan.id, t.id)}
                  />
                  <span className={t.done ? "line-through text-[var(--fg-muted)]" : ""}>
                    {t.title}
                    {t.revoke ? " · revoke flag" : ""}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
        {state.offboarding.length === 0 ? (
          <li className="text-sm text-[var(--fg-muted)]">
            No offboarding in progress.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
