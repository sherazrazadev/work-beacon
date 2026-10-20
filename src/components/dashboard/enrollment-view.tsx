"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import {
  ENROLLMENT_CLOSES,
  MEDICAL_PLANS,
  enrollmentOpen,
} from "@/lib/mock/people-ops";
import { WF_TODAY } from "@/lib/mock/workforce";

export function EnrollmentView() {
  const { session } = useAuth();
  const { ready, state, saveElection } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const existing = state.elections.find((e) => e.workerId === workerId);
  const [medical, setMedical] = useState(
    existing?.medical ?? MEDICAL_PLANS[0],
  );
  const [dental, setDental] = useState(existing?.dental ?? true);
  const [k401Pct, setK401Pct] = useState(existing?.k401Pct ?? 6);
  const [msg, setMsg] = useState<string | null>(null);
  const open = enrollmentOpen();

  if (!ready) return <DashboardSkeleton />;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!open) {
      setMsg("Window closed.");
      return;
    }
    saveElection({
      workerId,
      medical,
      dental,
      k401Pct,
      submittedAt: WF_TODAY,
    });
    setMsg("Elections saved. Benefits will show this plan set.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Open enrollment
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Closes {ENROLLMENT_CLOSES}. Demo today {WF_TODAY}
          {open ? "." : " — window closed."}
        </p>
      </div>

      {existing ? (
        <p className="text-sm text-[var(--accent)]">
          Last submitted {existing.submittedAt}: {existing.medical}
          {existing.dental ? " · dental on" : " · dental waived"} · 401(k){" "}
          {existing.k401Pct}%.
        </p>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <label className="block text-sm">
          Medical
          <select
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            value={medical}
            onChange={(e) => setMedical(e.target.value)}
          >
            {MEDICAL_PLANS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={dental}
            onChange={(e) => setDental(e.target.checked)}
          />
          Beacon Dental Plus
        </label>
        <label className="block text-sm">
          401(k) %
          <select
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            value={k401Pct}
            onChange={(e) => setK401Pct(Number(e.target.value))}
          >
            {[0, 3, 6, 8].map((n) => (
              <option key={n} value={n}>
                {n}%
              </option>
            ))}
          </select>
        </label>
        {msg ? (
          <p role="status" className="text-sm text-[var(--accent)]">
            {msg}
          </p>
        ) : null}
        <Button type="submit" disabled={!open}>
          Submit elections
        </Button>
      </form>
    </div>
  );
}
