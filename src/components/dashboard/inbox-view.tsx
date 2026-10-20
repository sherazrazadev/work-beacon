"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

export function InboxView() {
  const { session } = useAuth();
  const { ready, inboxForRole, completeInboxTask } = useMock();
  const role = session?.user.role ?? "employee";
  const workerId = session?.user.workerId;

  if (!ready) return <DashboardSkeleton />;

  const tasks = inboxForRole(role, workerId);
  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Inbox
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Approvals, to-dos, and onboarding — {open.length} open.
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Open
        </h2>
        <ul className="mt-3 space-y-3">
          {open.map((t) => (
            <li
              key={t.id}
              className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-[var(--fg)]">{t.title}</p>
                <p className="text-xs text-[var(--fg-muted)]">
                  {t.kind} · due {t.due}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => completeInboxTask(t.id)}
              >
                Mark complete
              </Button>
            </li>
          ))}
          {open.length === 0 ? (
            <li className="text-sm text-[var(--fg-muted)]">Inbox clear.</li>
          ) : null}
        </ul>
      </section>

      {done.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Done
          </h2>
          <ul className="mt-3 space-y-2">
            {done.map((t) => (
              <li
                key={t.id}
                className="text-sm text-[var(--fg-muted)] line-through"
              >
                {t.title}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
