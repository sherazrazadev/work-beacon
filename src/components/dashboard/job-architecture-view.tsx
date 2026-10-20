"use client";

import { JOB_PROFILES, CURRENT_SALARY, profileForTitle } from "@/lib/mock/people-ops";
import { WORKERS } from "@/lib/mock/org";
import { moneyUsd } from "@/lib/mock/money";

export function JobArchitectureView() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Job architecture
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Families and salary bands for Northstar Labs (demo).
        </p>
      </div>
      <ul className="space-y-3">
        {JOB_PROFILES.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="font-medium">{p.family}</p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {p.titles.join(" · ")}
            </p>
            <p className="mt-2 text-sm tabular-nums">
              {moneyUsd(p.bandMin)} – {moneyUsd(p.bandMid)} – {moneyUsd(p.bandMax)}
            </p>
          </li>
        ))}
      </ul>
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Workers vs band midpoint
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {WORKERS.map((w) => {
            const band = profileForTitle(w.title);
            const sal = CURRENT_SALARY[w.id];
            return (
              <li key={w.id} className="flex justify-between gap-3">
                <span>
                  {w.name} · {w.title}
                </span>
                <span className="tabular-nums text-[var(--fg-muted)]">
                  {sal ? moneyUsd(sal) : "—"}
                  {band ? ` / mid ${moneyUsd(band.bandMid)}` : ""}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
