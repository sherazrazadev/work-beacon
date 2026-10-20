"use client";

import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";import { AGENT_TOOLS } from "@/lib/agent/tools";
import { ROUTE_ROLES } from "@/lib/rbac";
import { ROLE_LABELS } from "@/lib/mock/platform";
import type { DemoRole } from "@/lib/mock/org";

const ALL: DemoRole[] = ["employee", "manager", "hr_admin", "finance"];

export function SecurityView() {
  const { ready, state, setRetentionDays } = useMock();
  if (!ready) return <DashboardSkeleton />;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Security & compliance
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Role matrix, retention, agent tool registry.
        </p>
      </div>

      <section>
        <h2 className="font-semibold">Roles matrix</h2>
        {/* Permission matrix: kept as a scrolling grid (stacking 25 paths x 5 cols is worse). */}
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--fg-muted)]">
                <th className="py-2 pr-3 font-medium">Path</th>
                {ALL.map((r) => (
                  <th key={r} className="py-2 pr-3 font-medium">
                    {ROLE_LABELS[r]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROUTE_ROLES.map((row) => (
                <tr key={row.prefix} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-3 font-mono text-xs">{row.prefix}</td>
                  {ALL.map((r) => (
                    <td key={r} className="py-2 pr-3">
                      {row.roles.includes(r) ? "yes" : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-semibold">Retention</h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Demo audit / event keep window: {state.retentionDays} days.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[365, 1095, 2555].map((d) => (
            <button
              key={d}
              type="button"
              className={`rounded-md border px-3 py-1.5 text-sm ${
                state.retentionDays === d
                  ? "border-[var(--accent)] font-medium"
                  : "border-[var(--border)]"
              }`}
              onClick={() => setRetentionDays(d)}
            >
              {d} days
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold">AI agent registry</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {AGENT_TOOLS.map((t) => (
            <li key={t.id}>
              <span className="font-mono text-xs">{t.id}</span>
              <span className="text-[var(--fg-muted)]"> — {t.description}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
