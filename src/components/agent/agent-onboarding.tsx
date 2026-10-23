"use client";

import { Button } from "@/components/ui/button";
import { useAgentUi, AGENT_NAME } from "@/components/agent/agent-provider";
import { BRAND } from "@/lib/brand";

export function AgentOnboarding() {
  const { showOnboarding, dismissOnboarding, skipOnboarding } = useAgentUi();

  if (!showOnboarding) return null;

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-[color-mix(in_oklab,var(--fg)_45%,transparent)] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-onboard-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
          {BRAND.name}
        </p>
        <h2
          id="agent-onboard-title"
          className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]"
        >
          Meet {AGENT_NAME}
        </h2>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          Ask about PTO, pay stubs, time off, or upcoming deadlines. It reads
          your dashboard data that you are allowed to see — it runs rules in your browser, no live model calls by default.
          Press ⌘K / Ctrl+K anytime.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={dismissOnboarding}>
            Open the agent
          </Button>
          <Button type="button" variant="secondary" onClick={skipOnboarding}>
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
}
