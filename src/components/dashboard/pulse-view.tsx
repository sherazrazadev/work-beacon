"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import {
  PULSE_CAMPAIGN,
  PULSE_QUESTIONS,
  hasSubmittedPulse,
} from "@/lib/mock/pulse";

const SCALE = [1, 2, 3, 4, 5] as const;

export function PulseView() {
  const { session } = useAuth();
  const { ready, state, submitPulse } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const submitted = hasSubmittedPulse(state.pulseResponses, workerId);
  const mine = state.pulseResponses.find(
    (r) => r.workerId === workerId && r.campaignId === PULSE_CAMPAIGN.id,
  );
  const [scores, setScores] = useState<Record<string, number>>({});
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setScores({});
    setMsg(null);
  }, [workerId]);

  if (!ready) return <DashboardSkeleton />;

  const complete = PULSE_QUESTIONS.every((q) => scores[q.id]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!complete) {
      setMsg("Answer all five questions.");
      return;
    }
    const ok = submitPulse(workerId, scores);
    setMsg(ok ? "Thanks — recorded without showing your name on insights." : "Already submitted.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          {PULSE_CAMPAIGN.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Closes {PULSE_CAMPAIGN.closes}. {PULSE_CAMPAIGN.scale}. Managers see
          theme averages only.
        </p>
      </div>

      {submitted && mine ? (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-semibold">You already responded</h2>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Submitted {mine.submittedAt.slice(0, 10)}. Your scores stay with
            this browser store; insights never list workers.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {PULSE_QUESTIONS.map((q) => (
              <li key={q.id} className="flex justify-between gap-3">
                <span>{q.theme}</span>
                <span className="font-medium">{mine.scores[q.id]}/5</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          {PULSE_QUESTIONS.map((q) => (
            <fieldset
              key={q.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <legend className="px-1 text-sm font-semibold">
                {q.theme}
              </legend>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{q.prompt}</p>
              <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
                {SCALE.map((n) => {
                  const checked = scores[q.id] === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      className={`rounded-md border px-3 py-1.5 text-sm ${
                        checked
                          ? "border-[var(--accent)] bg-[var(--surface-muted)] font-medium"
                          : "border-[var(--border)]"
                      }`}
                      onClick={() =>
                        setScores((prev) => ({ ...prev, [q.id]: n }))
                      }
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
          {msg ? (
            <p role="status" className="text-sm text-[var(--accent)]">
              {msg}
            </p>
          ) : null}
          <Button type="submit" disabled={!complete}>
            Submit Pulse
          </Button>
        </form>
      )}

      {(session?.user.role === "manager" ||
        session?.user.role === "hr_admin") && (
        <p className="text-sm">
          <Link href="/dashboard/pulse/insights" className="text-[var(--accent)]">
            Open Pulse insights →
          </Link>
        </p>
      )}
    </div>
  );
}
