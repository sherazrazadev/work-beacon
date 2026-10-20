"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAgentUi } from "@/components/agent/agent-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { Button } from "@/components/ui/button";
import { tourStepsFor, tourStorageKey, type TourStep } from "@/lib/tour/steps";
import type { DemoRole } from "@/lib/mock/org";

export function GuidedTour({
  startSignal,
}: {
  startSignal: number;
}) {
  const { session } = useAuth();
  const { showOnboarding } = useAgentUi();
  const { state } = useMock();
  const router = useRouter();
  const pathname = usePathname();
  const role: DemoRole = session?.user.role ?? "employee";
  const steps = tourStepsFor(role);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!session || (state.featureFlags.agentEnabled && showOnboarding)) return;
    const seen = window.localStorage.getItem(tourStorageKey(role));
    if (!seen) {
      const t = window.setTimeout(() => setOpen(true), 500);
      return () => window.clearTimeout(t);
    }
  }, [session, role, showOnboarding, state.featureFlags.agentEnabled]);

  useEffect(() => {
    if (startSignal > 0) {
      setIndex(0);
      setOpen(true);
    }
  }, [startSignal]);

  const step: TourStep | undefined = steps[index];

  const finish = useCallback(() => {
    window.localStorage.setItem(tourStorageKey(role), "1");
    setOpen(false);
    setIndex(0);
  }, [role]);

  function next() {
    const upcoming = steps[index + 1];
    if (!upcoming) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
    if (upcoming.href !== pathname) router.push(upcoming.href);
  }

  useEffect(() => {
    if (!open || !step) return;
    if (step.href !== pathname) router.push(step.href);
  }, [open, step, pathname, router]);

  if (!open || !step) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[color-mix(in_oklab,var(--fg)_40%,transparent)] p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
          Tour {index + 1} / {steps.length} · {role.replace("_", " ")}
        </p>
        <h2
          id="tour-title"
          className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold"
        >
          {step.title}
        </h2>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">{step.body}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={next}>
            {index + 1 === steps.length ? "Done" : "Next"}
          </Button>
          <Button type="button" variant="secondary" onClick={finish}>
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
