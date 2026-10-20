"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { getWorker } from "@/lib/mock/org";
import { ACCESS_APPS, type AccessApp } from "@/lib/mock/org-ops";

export function AccessView() {
  const { session } = useAuth();
  const { ready, state, requestAccess, decideAccess } = useMock();
  const role = session?.user.role ?? "employee";
  const workerId = session?.user.workerId ?? "w-alex";
  const isHr = role === "hr_admin";
  const [app, setApp] = useState<AccessApp>("VPN");
  const [roleLabel, setRoleLabel] = useState("member");
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  const rows = isHr
    ? state.accessRequests
    : state.accessRequests.filter((r) => r.workerId === workerId);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const row = requestAccess({ workerId, app, roleLabel });
    setMsg(row ? `Opened ${row.id}` : "Already open for that app.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Access requests
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Demo entitlements. Nothing is provisioned.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <label className="text-sm">
          App
          <select
            className="mt-1 block rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            value={app}
            onChange={(e) => setApp(e.target.value as AccessApp)}
          >
            {ACCESS_APPS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Role
          <input
            className="mt-1 block rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            value={roleLabel}
            onChange={(e) => setRoleLabel(e.target.value)}
            required
          />
        </label>
        <Button type="submit">Request</Button>
        {msg ? (
          <p role="status" className="text-sm text-[var(--accent)]">
            {msg}
          </p>
        ) : null}
      </form>

      <ul className="space-y-3">
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">
                {r.app} · {r.roleLabel}
              </p>
              <p className="text-sm text-[var(--fg-muted)]">
                {getWorker(r.workerId)?.name ?? r.workerId} · {r.status}
              </p>
            </div>
            {isHr && r.status === "Open" ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => decideAccess(r.id, "Approved")}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => decideAccess(r.id, "Denied")}
                >
                  Deny
                </Button>
              </div>
            ) : null}
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="text-sm text-[var(--fg-muted)]">No requests.</li>
        ) : null}
      </ul>
    </div>
  );
}
