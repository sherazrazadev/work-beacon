"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { getDirectReports, getWorker } from "@/lib/mock/org";

export function PerformanceView() {
  const { session } = useAuth();
  const { goals, checkIns, reviews, state, rateGoal, addFeedback } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const reports = getDirectReports(workerId);
  const [peer, setPeer] = useState(reports[0]?.id ?? "w-casey");
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const myRatings = state.goalRatings.filter((g) => g.workerId === workerId);
  const incoming = state.feedback.filter((f) => f.toWorkerId === workerId);

  function onFeedback(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    addFeedback(workerId, peer, text.trim());
    setText("");
    setMsg("Feedback saved.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
          Performance
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Rate goals 1–5 (calibration-lite) and add peer feedback.
        </p>
      </div>

      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Goals
        </h2>
        <ul className="mt-3 space-y-3">
          {goals.map((g) => {
            const rating =
              myRatings.find((r) => r.goalId === g.id)?.rating ?? 0;
            return (
              <li
                key={g.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-[var(--fg)]">{g.title}</p>
                  <span className="text-xs text-[var(--fg-muted)]">
                    Due {g.due}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div
                    className="h-full bg-[var(--accent)]"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--fg-muted)]">
                  {g.progress}% complete
                </p>
                <label className="mt-3 block text-xs text-[var(--fg-muted)]">
                  Self rating
                  <select
                    value={rating || ""}
                    onChange={(e) =>
                      rateGoal(g.id, workerId, Number(e.target.value))
                    }
                    className="ml-2 min-h-10 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 sm:min-h-8"
                  >
                    <option value="">—</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Peer feedback
        </h2>
        <form
          onSubmit={onFeedback}
          className="mt-3 max-w-xl space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <label className="block text-sm text-[var(--fg-muted)]">
            About
            <select
              value={peer}
              onChange={(e) => setPeer(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            >
              {(reports.length ? reports : [getWorker("w-casey")!]).map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-[var(--fg-muted)]">
            Note
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            />
          </label>
          <Button type="submit">Submit feedback</Button>
        </form>
        <ul className="mt-4 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {incoming.map((f) => (
            <li key={f.id} className="px-4 py-3 text-sm">
              <p className="font-medium">
                From {getWorker(f.fromWorkerId)?.name} · {f.date}
              </p>
              <p className="text-[var(--fg-muted)]">{f.text}</p>
            </li>
          ))}
          {incoming.length === 0 ? (
            <li className="px-4 py-4 text-sm text-[var(--fg-muted)]">
              No feedback received yet.
            </li>
          ) : null}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Check-ins
        </h2>
        <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {checkIns.map((c) => (
            <li key={c.id} className="px-4 py-3 text-sm">
              <p className="font-medium text-[var(--fg)]">
                With {c.with} · {c.date}
              </p>
              <p className="text-[var(--fg-muted)]">{c.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Reviews
        </h2>
        <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="flex justify-between gap-3 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-[var(--fg)]">{r.cycle}</p>
                <p className="text-[var(--fg-muted)]">Due {r.due}</p>
              </div>
              <span>{r.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
