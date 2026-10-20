"use client";

import { useState } from "react";
import { useMock } from "@/components/dashboard/mock-provider";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { TENANT, COST_CENTERS, DEPARTMENTS, LOCATIONS, WORKERS } from "@/lib/mock/org";

export function AdminView() {
  const { ready, state, setFeatureFlags, resetStore, clearAgentAudit } =
    useMock();
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  function onReset() {
    resetStore();
    setMsg("Mock store reset to seed.");
    window.setTimeout(() => setMsg(null), 2500);
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Admin console
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Tenant settings for {TENANT.name} (demo).
        </p>
      </div>

      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="font-semibold">Tenant</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--fg-muted)]">Name</dt>
            <dd>{TENANT.name}</dd>
          </div>
          <div>
            <dt className="text-[var(--fg-muted)]">Legal</dt>
            <dd>{TENANT.legalName}</dd>
          </div>
          <div>
            <dt className="text-[var(--fg-muted)]">Workers</dt>
            <dd>{WORKERS.length}</dd>
          </div>
          <div>
            <dt className="text-[var(--fg-muted)]">Departments</dt>
            <dd>{DEPARTMENTS.length}</dd>
          </div>
          <div>
            <dt className="text-[var(--fg-muted)]">Locations</dt>
            <dd>{LOCATIONS.length}</dd>
          </div>
          <div>
            <dt className="text-[var(--fg-muted)]">Cost centers</dt>
            <dd>{COST_CENTERS.length}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="font-semibold">Feature flags</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {(
            [
              ["agentEnabled", "Agent panel"],
              ["marketplaceEnabled", "Marketplace links"],
              ["slowDashboard", "Slow dashboard skeleton"],
            ] as const
          ).map(([key, label]) => (
            <li key={key}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.featureFlags[key]}
                  onChange={(e) =>
                    setFeatureFlags({ [key]: e.target.checked })
                  }
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Agent audit log</h2>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              clearAgentAudit();
              setMsg("Audit log cleared.");
              window.setTimeout(() => setMsg(null), 2500);
            }}
          >
            Clear log
          </Button>
        </div>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Last {state.agentAudit.length} tool calls (persona, tool, rules vs
          LLM). LLM stays off unless NEXT_PUBLIC_AGENT_LLM=1.
        </p>
        {state.agentAudit.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--fg-muted)]">
            No calls yet. Open the agent and ask a question.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--fg-muted)]">
                  <th className="py-2 pr-3 font-medium">When</th>
                  <th className="py-2 pr-3 font-medium">Persona</th>
                  <th className="py-2 pr-3 font-medium">Tool</th>
                  <th className="py-2 pr-3 font-medium">Source</th>
                  <th className="py-2 font-medium">Prompt</th>
                </tr>
              </thead>
              <tbody>
                {state.agentAudit.slice(0, 40).map((row) => (
                  <tr key={row.id} className="border-b border-[var(--border)]">
                    <td className="py-2 pr-3 whitespace-nowrap">
                      {row.at.replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="py-2 pr-3">
                      {row.personaId} · {row.role.replace("_", " ")}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">{row.toolId}</td>
                    <td className="py-2 pr-3">{row.source}</td>
                    <td className="py-2 max-w-[16rem] truncate">{row.prompt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="font-semibold">Seed reset</h2>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Clears localStorage mock store (inbox, profile edits, approvals) back
          to defaults.
        </p>
        <Button type="button" variant="secondary" className="mt-4" onClick={onReset}>
          Reset mock store
        </Button>
      </section>
    </div>
  );
}
