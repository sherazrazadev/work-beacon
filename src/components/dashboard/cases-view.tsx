"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import {
  CASE_CATEGORIES,
  type CaseCategory,
  type CaseStatus,
  workerName,
} from "@/lib/mock/people-ops";

export function CasesView() {
  const { session } = useAuth();
  const { ready, state, addHrCase, setCaseStatus } = useMock();
  const role = session?.user.role ?? "employee";
  const workerId = session?.user.workerId ?? "w-alex";
  const [category, setCategory] = useState<CaseCategory>("Payroll");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  const rows =
    role === "hr_admin"
      ? state.hrCases
      : state.hrCases.filter((c) => c.workerId === workerId);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!subject.trim()) {
      setMsg("Add a subject.");
      return;
    }
    const row = addHrCase({
      workerId,
      category,
      subject: subject.trim(),
      body: body.trim() || "—",
    });
    setSubject("");
    setBody("");
    setMsg(`Filed ${row.id}. People Operations will see it in Inbox.`);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          HR cases
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          File a People Operations case. Names stay on the ticket — this is not
          Pulse.
        </p>
      </div>

      {role !== "hr_admin" ? (
        <form
          onSubmit={onSubmit}
          className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <label className="block text-sm">
            Category
            <select
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value as CaseCategory)}
            >
              {CASE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Subject
            <input
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Detail
            <textarea
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
          {msg ? (
            <p role="status" className="text-sm text-[var(--accent)]">
              {msg}
            </p>
          ) : null}
          <Button type="submit">File case</Button>
        </form>
      ) : null}

      <ul className="space-y-3">
        {rows.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="font-medium">
              {c.subject}{" "}
              <span className="text-sm font-normal text-[var(--fg-muted)]">
                {c.status}
              </span>
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {c.category} · {workerName(c.workerId)} · {c.createdAt}
            </p>
            <p className="mt-2 text-sm">{c.body}</p>
            {role === "hr_admin" && c.status !== "Resolved" ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {(["In progress", "Resolved"] as CaseStatus[]).map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setCaseStatus(c.id, s)}
                  >
                    Mark {s.toLowerCase()}
                  </Button>
                ))}
              </div>
            ) : null}
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="text-sm text-[var(--fg-muted)]">No cases.</li>
        ) : null}
      </ul>
    </div>
  );
}
