"use client";

import Link from "next/link";
import {
  getCostCenter,
  getDepartment,
  getLocation,
  getWorker,
} from "@/lib/mock/org";

export function WorkerProfileView({ workerId }: { workerId: string }) {
  const w = getWorker(workerId);
  if (!w) {
    return (
      <p className="text-sm text-[var(--fg-muted)]">
        Worker not found.{" "}
        <Link href="/dashboard/directory" className="text-[var(--accent)]">
          Directory
        </Link>
      </p>
    );
  }

  const manager = w.managerId ? getWorker(w.managerId) : null;
  const history = [...w.history].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
          Worker profile
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">
          {w.name}
        </h1>
        <p className="mt-1 text-[var(--fg-muted)]">{w.title}</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-[var(--fg-muted)]">Email</dt>
          <dd className="text-sm">{w.email}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--fg-muted)]">Phone</dt>
          <dd className="text-sm">{w.phone}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--fg-muted)]">Department</dt>
          <dd className="text-sm">{getDepartment(w.departmentId)?.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--fg-muted)]">Location</dt>
          <dd className="text-sm">{getLocation(w.locationId)?.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--fg-muted)]">Cost center</dt>
          <dd className="text-sm">
            {getCostCenter(w.costCenterId)?.code} ·{" "}
            {getCostCenter(w.costCenterId)?.name}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--fg-muted)]">Manager</dt>
          <dd className="text-sm">
            {manager ? (
              <Link
                href={`/dashboard/people/${manager.id}`}
                className="text-[var(--accent)]"
              >
                {manager.name}
              </Link>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--fg-muted)]">Hire date</dt>
          <dd className="text-sm">{w.hireDate}</dd>
        </div>
      </dl>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
          Job & employment history
        </h2>
        <ol className="mt-4 space-y-4 border-l border-[var(--border)] pl-5">
          {history.map((h) => (
            <li key={h.id} className="relative">
              <span className="absolute -left-[1.4rem] top-1.5 size-2 rounded-full bg-[var(--accent)]" />
              <p className="text-xs text-[var(--accent)]">
                {h.date} · {h.kind}
              </p>
              <p className="font-medium text-[var(--fg)]">{h.title}</p>
              <p className="text-sm text-[var(--fg-muted)]">{h.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <Link
        href="/dashboard/directory"
        className="inline-flex min-h-10 items-center text-sm text-[var(--accent)]"
      >
        ← Directory
      </Link>
    </div>
  );
}
