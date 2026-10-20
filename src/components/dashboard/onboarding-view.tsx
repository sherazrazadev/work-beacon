"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { getWorker } from "@/lib/mock/org";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

export function OnboardingView() {
  const { session } = useAuth();
  const { ready, state, completeOnboardingTask } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const isHr =
    session?.user.role === "hr_admin" || session?.user.role === "manager";

  if (!ready) return <DashboardSkeleton />;

  const mine = state.onboarding.find((p) => p.workerId === workerId);
  const all = isHr ? state.onboarding : mine ? [mine] : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Onboarding
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Day-1 checklist. Hire Jordan on the recruiting board, then switch to
          New hire. Tasks also appear in{" "}
          <Link href="/dashboard/inbox" className="text-[var(--accent)]">
            Inbox
          </Link>
          .
        </p>
      </div>

      {all.length === 0 ? (
        <p className="text-sm text-[var(--fg-muted)]">
          No onboarding plan for this persona yet.
        </p>
      ) : null}

      {all.map((plan) => {
        const open = plan.tasks.filter((t) => !t.done).length;
        return (
          <section
            key={plan.workerId}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <h2 className="font-semibold">
              {getWorker(plan.workerId)?.name ?? plan.workerId} · {open} open
            </h2>
            <ul className="mt-3 space-y-2">
              {plan.tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] py-2 text-sm"
                >
                  <div>
                    <p className={t.done ? "line-through text-[var(--fg-muted)]" : ""}>
                      {t.title}
                    </p>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {t.kind} · due {t.due}
                    </p>
                  </div>
                  {!t.done ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        completeOnboardingTask(plan.workerId, t.id)
                      }
                    >
                      Complete
                    </Button>
                  ) : (
                    <span className="text-xs text-[var(--accent)]">Done</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
