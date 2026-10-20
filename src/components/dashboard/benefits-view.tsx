"use client";

import { useMock } from "@/components/dashboard/mock-provider";

export function BenefitsView() {
  const { benefits, beneficiaries, benefitDocs } = useMock();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
          Benefits
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Enrollments, beneficiaries, and documents.
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Enrollments
        </h2>
        <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {benefits.map((b) => (
            <li key={b.id} className="flex justify-between gap-3 px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-[var(--fg)]">{b.name}</p>
                <p className="text-[var(--fg-muted)]">{b.plan}</p>
              </div>
              <span>{b.status}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Beneficiaries
        </h2>
        <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {beneficiaries.map((b) => (
            <li key={b.id} className="flex justify-between gap-3 px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-[var(--fg)]">{b.name}</p>
                <p className="text-[var(--fg-muted)]">{b.relationship}</p>
              </div>
              <span>{b.percent}%</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Documents
        </h2>
        <ul className="mt-3 space-y-2">
          {benefitDocs.map((d) => (
            <li
              key={d.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
            >
              <p className="font-medium text-[var(--fg)]">{d.name}</p>
              <p className="text-xs text-[var(--fg-muted)]">Updated {d.updated}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
