"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { workerName } from "@/lib/mock/people-ops";

export function ContingentView() {
  const { session } = useAuth();
  const { ready, state } = useMock();
  const role = session?.user.role ?? "manager";
  const workerId = session?.user.workerId ?? "w-morgan";

  if (!ready) return <DashboardSkeleton />;

  const rows =
    role === "hr_admin"
      ? state.contingent
      : state.contingent.filter((c) => c.managerId === workerId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Contingent workers
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Contractors are not in the employee org chart.
        </p>
      </div>
      <ul className="space-y-3">
        {rows.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="font-medium">
              {c.name}{" "}
              <span className="text-sm font-normal text-[var(--fg-muted)]">
                {c.status}
              </span>
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {c.title} · {c.vendor} · manager {workerName(c.managerId)} · ends{" "}
              {c.endDate}
            </p>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="text-sm text-[var(--fg-muted)]">
            No contractors on this persona.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
