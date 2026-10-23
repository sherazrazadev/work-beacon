"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMock } from "@/components/dashboard/mock-provider";
import { DEPARTMENTS, getWorker } from "@/lib/mock/org";
import {
  CANDIDATE_STAGES,
  type CandidateStage,
} from "@/lib/mock/talent";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

export function RecruitingView() {
  const { ready, state, addJob, moveCandidate, hireCandidate } = useMock();
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState(DEPARTMENTS[0].id);
  const [hiringManagerId, setHiringManagerId] = useState("w-morgan");
  const [headcount, setHeadcount] = useState("1");
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addJob({
      title: title.trim(),
      departmentId,
      hiringManagerId,
      headcount: Math.max(1, Number(headcount) || 1),
    });
    setTitle("");
    setMsg("Req added to the board.");
  }

  function onHire(id: string) {
    const ok = hireCandidate(id);
    setMsg(
      ok
        ? "Hired — onboarding checklist is live. Switch persona to New hire."
        : "Hire failed.",
    );
  }

  const managers = ["w-morgan", "w-ceo", "w-priya"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Recruiting
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Kanban is saved to your workspace. Hire Jordan Hale to open onboarding.
        </p>
      </div>

      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      <form
        onSubmit={onCreate}
        className="grid max-w-3xl gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2"
      >
        <h2 className="sm:col-span-2 text-sm font-semibold">New job req</h2>
        <label className="block text-sm text-[var(--fg-muted)]">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
            required
          />
        </label>
        <label className="block text-sm text-[var(--fg-muted)]">
          Department
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-[var(--fg-muted)]">
          Hiring manager
          <select
            value={hiringManagerId}
            onChange={(e) => setHiringManagerId(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          >
            {managers.map((id) => (
              <option key={id} value={id}>
                {getWorker(id)?.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-[var(--fg-muted)]">
          Headcount
          <input
            type="number"
            min={1}
            value={headcount}
            onChange={(e) => setHeadcount(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          />
        </label>
        <div className="sm:col-span-2">
          <Button type="submit">Create req</Button>
        </div>
      </form>

      <ul className="flex flex-wrap gap-2 text-sm text-[var(--fg-muted)]">
        {state.jobs.map((j) => (
          <li
            key={j.id}
            className="rounded-full border border-[var(--border)] px-3 py-1"
          >
            {j.title} · hc {j.headcount} · {j.status}
          </li>
        ))}
      </ul>

      <div className="md:overflow-x-auto">
        <div className="flex flex-col gap-3 md:min-w-[720px] md:flex-row">
          {CANDIDATE_STAGES.map((stage) => (
            <section
              key={stage}
              className="w-full rounded-xl md:w-56 md:shrink-0  border border-[var(--border)] bg-[var(--surface)] p-3"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                {stage}
              </h2>
              <ul className="mt-3 space-y-2">
                {state.candidates
                  .filter((c) => c.stage === stage)
                  .map((c) => {
                    const job = state.jobs.find((j) => j.id === c.jobId);
                    return (
                      <li
                        key={c.id}
                        className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3"
                      >
                        <Link
                          href={`/dashboard/recruiting/${c.id}`}
                          className="inline-flex min-h-10 items-center font-medium text-[var(--fg)] hover:text-[var(--accent)] md:min-h-0"
                        >
                          {c.name}
                        </Link>
                        <p className="text-xs text-[var(--fg-muted)]">
                          {job?.title}
                        </p>
                        <label className="mt-2 block text-xs text-[var(--fg-muted)]">
                          Move
                          <select
                            value={c.stage}
                            onChange={(e) =>
                              moveCandidate(
                                c.id,
                                e.target.value as CandidateStage,
                              )
                            }
                            className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--surface)] px-1 py-1 min-h-10 sm:min-h-8"
                          >
                            {CANDIDATE_STAGES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </label>
                        {stage === "Offer" ? (
                          <Button
                            type="button"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => onHire(c.id)}
                          >
                            Hire
                          </Button>
                        ) : null}
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
