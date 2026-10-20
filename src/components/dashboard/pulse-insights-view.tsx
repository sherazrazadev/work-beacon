"use client";

import { useState } from "react";
import Link from "next/link";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import {
  PULSE_CAMPAIGN,
  lowestTheme,
  themeAverages,
} from "@/lib/mock/pulse";

export function PulseInsightsView() {
  const { ready, state, createPulsePlan } = useMock();
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  const avgs = themeAverages(state.pulseResponses);
  const n = avgs[0]?.n ?? 0;
  const low = lowestTheme(state.pulseResponses);

  function onPlan(theme: string) {
    const id = createPulsePlan(theme);
    setMsg(
      id
        ? `Action plan queued in Inbox (${id}).`
        : "Could not create that plan.",
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Pulse insights
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          {PULSE_CAMPAIGN.title} · {n} responses · theme averages only (no
          names).
        </p>
      </div>

      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      {n === 0 ? (
        <p className="text-sm text-[var(--fg-muted)]">
          No responses yet.{" "}
          <Link href="/dashboard/pulse" className="text-[var(--accent)]">
            Open the survey
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {avgs.map((t) => {
            const pct = (t.avg / 5) * 100;
            const isLow = low?.theme === t.theme;
            return (
              <li
                key={t.theme}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">
                    {t.theme}
                    {isLow ? (
                      <span className="ml-2 text-xs font-normal text-[var(--accent)]">
                        lowest
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm tabular-nums">
                    {t.avg.toFixed(2)} / 5
                  </p>
                </div>
                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]"
                  role="meter"
                  aria-valuemin={1}
                  aria-valuemax={5}
                  aria-valuenow={Number(t.avg.toFixed(2))}
                  aria-label={`${t.theme} average`}
                >
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-3"
                  onClick={() => onPlan(t.theme)}
                >
                  Create action plan
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Action plans
        </h2>
        {state.pulsePlans.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--fg-muted)]">None yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {state.pulsePlans.map((p) => (
              <li key={p.id}>
                {p.title} · inbox {p.inboxTaskId} · {p.createdAt}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-sm">
          <Link href="/dashboard/inbox" className="text-[var(--accent)]">
            Open Inbox →
          </Link>
        </p>
      </section>
    </div>
  );
}
