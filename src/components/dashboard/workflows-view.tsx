"use client";

import { useState } from "react";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import {
  ROLE_LABELS,
  WorkflowKind,
  WorkflowStep,
} from "@/lib/mock/platform";
import type { DemoRole } from "@/lib/mock/org";

const ROLES: DemoRole[] = ["manager", "hr_admin", "finance"];

export function WorkflowsView() {
  const { ready, state, setWorkflow } = useMock();
  const [msg, setMsg] = useState<string | null>(null);

  if (!ready) return <DashboardSkeleton />;

  function addStep(kind: WorkflowKind, role: DemoRole) {
    const wf = state.workflows.find((w) => w.id === kind);
    if (!wf) return;
    const steps: WorkflowStep[] = [
      ...wf.steps,
      {
        id: `${kind}-${Date.now()}`,
        role,
        label: ROLE_LABELS[role],
      },
    ];
    setWorkflow(kind, steps);
    setMsg(`${wf.name}: added ${ROLE_LABELS[role]}. Pending items wait on the new last step.`);
  }

  function removeLast(kind: WorkflowKind) {
    const wf = state.workflows.find((w) => w.id === kind);
    if (!wf || wf.steps.length <= 1) {
      setMsg("Keep at least one step.");
      return;
    }
    setWorkflow(kind, wf.steps.slice(0, -1));
    setMsg(`${wf.name}: last step removed. A manager approve may now complete the chain.`);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Workflows
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Leave and expense approval chains. Changing steps changes who must
          act before the request completes.
        </p>
      </div>
      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}
      {state.workflows.map((wf) => (
        <section
          key={wf.id}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <h2 className="font-semibold">{wf.name}</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
            {wf.steps.map((s) => (
              <li key={s.id}>
                {s.label} ({ROLE_LABELS[s.role]})
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <Button
                key={r}
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => addStep(wf.id, r)}
              >
                Add {ROLE_LABELS[r]}
              </Button>
            ))}
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => removeLast(wf.id)}
            >
              Remove last
            </Button>
          </div>
        </section>
      ))}
    </div>
  );
}
