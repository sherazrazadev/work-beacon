"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

export function ClockView() {
  const { session } = useAuth();
  const { ready, state, addPunch } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";

  if (!ready) return <DashboardSkeleton />;

  const punches = state.punches
    .filter((p) => p.workerId === workerId)
    .sort((a, b) => b.at.localeCompare(a.at));
  const last = punches[0];
  const nextKind = last?.kind === "in" ? "out" : "in";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Time clock
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Local timestamps only — demo punches stay in this browser.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--fg-muted)]">
          Last punch:{" "}
          {last
            ? `${last.kind} at ${new Date(last.at).toLocaleString()}`
            : "none"}
        </p>
        <Button
          type="button"
          className="mt-4"
          onClick={() => addPunch(workerId, nextKind)}
        >
          Clock {nextKind}
        </Button>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Punch list
        </h2>
        <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {punches.map((p) => (
            <li
              key={p.id}
              className="flex justify-between gap-3 px-4 py-3 text-sm"
            >
              <span className="capitalize">{p.kind}</span>
              <span className="text-[var(--fg-muted)]">
                {new Date(p.at).toLocaleString()}
              </span>
            </li>
          ))}
          {punches.length === 0 ? (
            <li className="px-4 py-6 text-sm text-[var(--fg-muted)]">
              No punches yet.
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
