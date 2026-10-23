"use client";

import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import { INTEGRATION_CATALOG } from "@/lib/mock/platform";

export function IntegrationsView() {
  const { ready, state, toggleIntegration } = useMock();
  if (!ready) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Integrations
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Connect / disconnect stubs. Connection status is saved to your workspace.
        </p>
      </div>
      <ul className="space-y-3">
        {INTEGRATION_CATALOG.map((c) => {
          const on = state.connectedIntegrations.includes(c.id);
          return (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-[var(--fg-muted)]">
                  {c.kind} · {c.blurb}
                </p>
                <p className="mt-1 text-xs text-[var(--accent)]">
                  {on ? "Connected" : "Disconnected"}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant={on ? "secondary" : "default"}
                onClick={() => toggleIntegration(c.id)}
              >
                {on ? "Disconnect" : "Connect"}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
