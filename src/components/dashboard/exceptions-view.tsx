"use client";

import { Button } from "@/components/ui/button";
import { useMock } from "@/components/dashboard/mock-provider";
import { getWorker } from "@/lib/mock/org";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

export function ExceptionsView() {
  const { ready, state, resolveException } = useMock();

  if (!ready) return <DashboardSkeleton />;

  const open = state.exceptions.filter((e) => !e.resolved);
  const done = state.exceptions.filter((e) => e.resolved);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Overtime & exceptions
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          OT over 40h/week and missing punches. Resolve marks them closed.
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Open · {open.length}
        </h2>
        <ul className="mt-3 space-y-3">
          {open.map((e) => (
            <li
              key={e.id}
              className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--accent)]">
                  {e.kind.replace("_", " ")}
                </p>
                <p className="mt-1 font-medium text-[var(--fg)]">
                  {getWorker(e.workerId)?.name ?? e.workerId}
                </p>
                <p className="text-sm text-[var(--fg-muted)]">{e.detail}</p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => resolveException(e.id)}
              >
                Resolve
              </Button>
            </li>
          ))}
          {open.length === 0 ? (
            <li className="text-sm text-[var(--fg-muted)]">No open exceptions.</li>
          ) : null}
        </ul>
      </section>

      {done.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Resolved
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--fg-muted)]">
            {done.map((e) => (
              <li key={e.id} className="line-through">
                {getWorker(e.workerId)?.name} · {e.kind.replace("_", " ")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
