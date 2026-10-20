"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { DEPARTMENTS, getDirectReports, getWorker } from "@/lib/mock/org";
import { departmentName, workerTitle } from "@/lib/mock/org-ops";

export function MovesView() {
  const { session } = useAuth();
  const { ready, state, requestMove, decideMove } = useMock();
  const role = session?.user.role ?? "employee";
  const workerId = session?.user.workerId ?? "w-alex";
  const isApprover = role === "hr_admin" || role === "manager";
  const reports = getDirectReports(workerId);
  const [kind, setKind] = useState<"Transfer" | "Promotion">("Transfer");
  const [who, setWho] = useState(
    role === "manager" ? (reports[0]?.id ?? workerId) : workerId,
  );
  const [toTitle, setToTitle] = useState("Senior Engineer");
  const [toDepartmentId, setToDepartmentId] = useState("dep-eng");
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  const rows =
    role === "hr_admin"
      ? state.orgMoves
      : role === "manager"
        ? state.orgMoves.filter(
            (m) =>
              m.workerId === workerId ||
              reports.some((r) => r.id === m.workerId),
          )
        : state.orgMoves.filter((m) => m.workerId === workerId);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const row = requestMove({
      kind,
      workerId: who,
      fromTitle: workerTitle(who),
      toTitle,
      toDepartmentId,
    });
    setMsg(row ? `Queued ${row.id}` : "Could not submit.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Transfers & promotions
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Demo org-change queue. People Operations approves.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <div className="flex flex-wrap gap-3">
          <label className="text-sm">
            Kind
            <select
              className="mt-1 block rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
              value={kind}
              onChange={(e) =>
                setKind(e.target.value as "Transfer" | "Promotion")
              }
            >
              <option>Transfer</option>
              <option>Promotion</option>
            </select>
          </label>
          {role === "manager" ? (
            <label className="text-sm">
              Worker
              <select
                className="mt-1 block rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
                value={who}
                onChange={(e) => setWho(e.target.value)}
              >
                <option value={workerId}>Me</option>
                {reports.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="text-sm">
            To title
            <input
              className="mt-1 block rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
              value={toTitle}
              onChange={(e) => setToTitle(e.target.value)}
              required
            />
          </label>
          <label className="text-sm">
            Department
            <select
              className="mt-1 block rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
              value={toDepartmentId}
              onChange={(e) => setToDepartmentId(e.target.value)}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Button type="submit">Submit</Button>
        {msg ? (
          <p role="status" className="text-sm text-[var(--accent)]">
            {msg}
          </p>
        ) : null}
      </form>

      <ul className="space-y-3">
        {rows.map((m) => (
          <li
            key={m.id}
            className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">
                {m.kind} · {getWorker(m.workerId)?.name ?? m.workerId}
              </p>
              <p className="text-sm text-[var(--fg-muted)]">
                {m.fromTitle} → {m.toTitle} ({departmentName(m.toDepartmentId)})
                · {m.status}
              </p>
            </div>
            {isApprover && m.status === "Submitted" ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => decideMove(m.id, "Approved")}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => decideMove(m.id, "Denied")}
                >
                  Deny
                </Button>
              </div>
            ) : null}
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="text-sm text-[var(--fg-muted)]">No moves yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
