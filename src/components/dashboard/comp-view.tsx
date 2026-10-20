"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import { moneyUsd } from "@/lib/mock/money";
import {
  COMP_CYCLE,
  meritPct,
  profileForTitle,
  workerName,
} from "@/lib/mock/people-ops";
import { getWorker } from "@/lib/mock/org";

export function CompView() {
  const { session } = useAuth();
  const { ready, state, setCompProposed, submitComp } = useMock();
  const role = session?.user.role ?? "manager";
  const workerId = session?.user.workerId ?? "w-morgan";

  if (!ready) return <DashboardSkeleton />;

  const rows =
    role === "hr_admin"
      ? state.compWorksheets
      : state.compWorksheets.filter((w) => w.managerId === workerId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          {COMP_CYCLE.name}
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Due {COMP_CYCLE.due}. Proposed stays inside the job band on submit
          (demo — not enforced).
        </p>
      </div>

      <ul className="space-y-3">
        {rows.map((w) => {
          const worker = getWorker(w.workerId);
          const band = worker ? profileForTitle(worker.title) : undefined;
          const pct = meritPct(w.current, w.proposed);
          return (
            <li
              key={w.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <p className="font-medium">
                {workerName(w.workerId)}{" "}
                <span className="text-sm font-normal text-[var(--fg-muted)]">
                  {worker?.title} · {w.status}
                </span>
              </p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">
                Current {moneyUsd(w.current)}
                {band
                  ? ` · band ${moneyUsd(band.bandMin)}–${moneyUsd(band.bandMax)}`
                  : ""}
              </p>
              {w.status === "Draft" && role === "manager" ? (
                <label className="mt-3 block text-sm">
                  Proposed
                  <input
                    type="number"
                    className="mt-1 w-full max-w-xs rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
                    value={w.proposed}
                    onChange={(e) =>
                      setCompProposed(w.id, Number(e.target.value) || 0)
                    }
                  />
                </label>
              ) : (
                <p className="mt-2 text-sm">
                  Proposed {moneyUsd(w.proposed)} ({pct.toFixed(1)}%)
                </p>
              )}
              {w.status === "Draft" && role === "manager" ? (
                <Button
                  type="button"
                  size="sm"
                  className="mt-3"
                  onClick={() => submitComp(w.id)}
                >
                  Submit to People
                </Button>
              ) : null}
            </li>
          );
        })}
        {rows.length === 0 ? (
          <li className="text-sm text-[var(--fg-muted)]">
            No worksheets on this persona.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
