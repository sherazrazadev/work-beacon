"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import { DEPARTMENTS } from "@/lib/mock/org";
import { workerName } from "@/lib/mock/people-ops";

export function MobilityView() {
  const { session } = useAuth();
  const { ready, state, applyInternal, withdrawInternal } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const role = session?.user.role ?? "employee";

  if (!ready) return <DashboardSkeleton />;

  const open = state.jobs.filter((j) => j.status === "Open");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Internal jobs
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Apply to an open req. Hiring managers get an Inbox item.
        </p>
      </div>
      <ul className="space-y-3">
        {open.map((job) => {
          const dept = DEPARTMENTS.find((d) => d.id === job.departmentId);
          const mine = state.internalApps.find(
            (a) =>
              a.workerId === workerId &&
              a.jobId === job.id &&
              a.status === "Applied",
          );
          return (
            <li
              key={job.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <p className="font-medium">{job.title}</p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">
                {dept?.name} · {job.headcount}{" "}
                {job.headcount === 1 ? "seat" : "seats"} · hiring{" "}
                {workerName(job.hiringManagerId)}
              </p>
              {mine ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-3"
                  onClick={() => withdrawInternal(mine.id)}
                >
                  Withdraw
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="mt-3"
                  onClick={() => applyInternal(workerId, job.id)}
                >
                  Apply
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {role === "manager" || role === "hr_admin" ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Applications
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {state.internalApps.map((a) => {
              const job = state.jobs.find((j) => j.id === a.jobId);
              return (
                <li key={a.id}>
                  {workerName(a.workerId)} → {job?.title ?? a.jobId} · {a.status}{" "}
                  · {a.at}
                </li>
              );
            })}
            {state.internalApps.length === 0 ? (
              <li className="text-[var(--fg-muted)]">None yet.</li>
            ) : null}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
