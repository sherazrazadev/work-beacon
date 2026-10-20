"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { getWorker } from "@/lib/mock/org";

export function EligibilityView() {
  const { session } = useAuth();
  const { ready, state, saveEligibility } = useMock();
  const role = session?.user.role ?? "employee";
  const workerId = session?.user.workerId ?? "w-alex";
  const isHr = role === "hr_admin";
  const [docs, setDocs] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    setDocs(
      state.eligibility.find((e) => e.workerId === workerId)?.docs.join(", ") ??
        "",
    );
    setMsg(null);
  }, [workerId, ready]);

  if (!ready) return <DashboardSkeleton />;

  const rows = isHr
    ? state.eligibility
    : state.eligibility.filter((e) => e.workerId === workerId);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const list = docs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    saveEligibility({
      workerId,
      status: list.length ? "Complete" : "Missing",
      docs: list,
    });
    setMsg("Recorded in this browser.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Work eligibility
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          I-9 theater only — no documents leave this browser.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <label className="block text-sm">
          Documents on file (comma-separated)
          <input
            className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            value={docs}
            onChange={(e) => setDocs(e.target.value)}
            placeholder="I-9 Section 1, List A: passport"
          />
        </label>
        <Button type="submit">Save</Button>
        {msg ? (
          <p role="status" className="text-sm text-[var(--accent)]">
            {msg}
          </p>
        ) : null}
      </form>

      <ul className="space-y-3">
        {rows.map((e) => (
          <li
            key={e.workerId}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="font-medium">
              {getWorker(e.workerId)?.name ?? e.workerId} · {e.status}
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {e.docs.length ? e.docs.join(" · ") : "No docs"} · updated{" "}
              {e.updatedAt}
            </p>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="text-sm text-[var(--fg-muted)]">
            Nothing on file for this persona.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
