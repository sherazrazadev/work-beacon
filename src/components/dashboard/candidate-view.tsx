"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

function printOffer(name: string, salary: number, startDate: string) {
  const html = `<!doctype html><title>Offer — ${name}</title>
  <body style="font-family:system-ui;padding:40px;max-width:640px">
  <h1>Work Beacon · Offer letter (stub)</h1>
  <p>Dear ${name},</p>
  <p>Northstar Labs is pleased to offer you employment starting <strong>${startDate}</strong>
  with an annual base salary of <strong>$${salary.toLocaleString()}</strong>.</p>
  <p>This is a demo document — not a legal offer. Print or save as PDF from the browser.</p>
  </body>`;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}

export function CandidateView({ candidateId }: { candidateId: string }) {
  const { ready, state, saveScorecard, attachOffer, hireCandidate } = useMock();
  const cand = state.candidates.find((c) => c.id === candidateId);
  const job = cand ? state.jobs.find((j) => j.id === cand.jobId) : null;

  const [comm, setComm] = useState(cand?.scorecard?.communication ?? 3);
  const [craft, setCraft] = useState(cand?.scorecard?.craft ?? 3);
  const [collab, setCollab] = useState(cand?.scorecard?.collaboration ?? 3);
  const [notes, setNotes] = useState(cand?.scorecard?.notes ?? "");
  const [salary, setSalary] = useState(String(cand?.offer?.salary ?? 145000));
  const [startDate, setStartDate] = useState(
    cand?.offer?.startDate ?? "2026-10-27",
  );
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;
  if (!cand) {
    return (
      <p className="text-sm text-[var(--fg-muted)]">
        Candidate not found.{" "}
        <Link href="/dashboard/recruiting" className="text-[var(--accent)]">
          Board
        </Link>
      </p>
    );
  }

  function onScore(e: FormEvent) {
    e.preventDefault();
    saveScorecard(cand!.id, {
      communication: comm,
      craft,
      collaboration: collab,
      notes,
    });
    setMsg("Scorecard saved.");
  }

  function onOffer(e: FormEvent) {
    e.preventDefault();
    const n = Number(salary);
    attachOffer(cand!.id, { salary: n, startDate });
    printOffer(cand!.name, n, startDate);
    setMsg("Offer attached and print dialog opened.");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
          {cand.stage} · {job?.title}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">
          {cand.name}
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">{cand.email}</p>
      </div>

      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      <form
        onSubmit={onScore}
        className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <h2 className="font-semibold">Interview scorecard</h2>
        {(
          [
            ["Communication", comm, setComm],
            ["Craft", craft, setCraft],
            ["Collaboration", collab, setCollab],
          ] as const
        ).map(([label, val, set]) => (
          <label key={label} className="block text-sm text-[var(--fg-muted)]">
            {label} (1–5)
            <input
              type="number"
              min={1}
              max={5}
              value={val}
              onChange={(e) => set(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            />
          </label>
        ))}
        <label className="block text-sm text-[var(--fg-muted)]">
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          />
        </label>
        <Button type="submit">Save scorecard</Button>
      </form>

      <form
        onSubmit={onOffer}
        className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <h2 className="font-semibold">Offer letter</h2>
        <label className="block text-sm text-[var(--fg-muted)]">
          Base salary (USD)
          <input
            type="number"
            min={1}
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          />
        </label>
        <label className="block text-sm text-[var(--fg-muted)]">
          Start date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          />
        </label>
        {cand.offer ? (
          <p className="text-xs text-[var(--fg-muted)]">
            Attached ${cand.offer.salary.toLocaleString()} · start{" "}
            {cand.offer.startDate}
          </p>
        ) : null}
        <Button type="submit">Generate offer (print stub)</Button>
      </form>

      {cand.stage !== "Hired" ? (
        <Button type="button" onClick={() => hireCandidate(cand.id)}>
          Hire into onboarding
        </Button>
      ) : (
        <Link href="/dashboard/onboarding" className="text-sm text-[var(--accent)]">
          Open onboarding →
        </Link>
      )}

      <p>
        <Link href="/dashboard/recruiting" className="text-sm text-[var(--accent)]">
          ← Board
        </Link>
      </p>
    </div>
  );
}
