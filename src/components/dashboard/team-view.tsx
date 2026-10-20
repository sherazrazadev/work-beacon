"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { getDirectReports, getWorker } from "@/lib/mock/org";

export function TeamView() {
  const { session } = useAuth();
  const { state, decideApproval } = useMock();
  const workerId = session?.user.workerId ?? "w-morgan";
  const me = getWorker(workerId);
  const reports = getDirectReports(workerId);

  const pending = state.approvals.filter((a) => a.status === "Pending").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
          My Team
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          {me?.name ?? "Manager"} · direct reports from Northstar seed.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
            Team size
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">
            {reports.length}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
            Pending approvals
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--accent)]">
            {pending}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Direct reports
        </h2>
        <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {reports.map((m) => (
            <li key={m.id} className="px-4 py-3 text-sm">
              <Link
                href={`/dashboard/people/${m.id}`}
                className="font-medium text-[var(--fg)] hover:text-[var(--accent)]"
              >
                {m.name}
              </Link>
              <p className="text-[var(--fg-muted)]">{m.title}</p>
            </li>
          ))}
          {reports.length === 0 ? (
            <li className="px-4 py-6 text-sm text-[var(--fg-muted)]">
              No direct reports for this persona. Switch to Manager.
            </li>
          ) : null}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Approvals queue
        </h2>
        <ul className="mt-3 space-y-2">
          {state.approvals.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-[var(--fg)]">
                  {a.employee} · {a.type}
                </p>
                <p className="text-xs text-[var(--fg-muted)]">{a.detail}</p>
                <p className="mt-1 text-xs">{a.status}</p>
              </div>
              {a.status === "Pending" ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => decideApproval(a.id, "Approved")}
                >
                  Approve
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
