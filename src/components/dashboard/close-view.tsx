"use client";

import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useMock } from "@/components/dashboard/mock-provider";
import { CLOSE_PERIOD } from "@/lib/mock/money";

export function CloseView() {
  const { ready, state, toggleCloseTask } = useMock();

  if (!ready) return <DashboardSkeleton />;

  const tasks = state.closeTasks.filter((t) => t.period === CLOSE_PERIOD);
  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Month-end close
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Period {CLOSE_PERIOD} · {done}/{tasks.length} complete. Toggles are saved
          to your workspace.
        </p>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="No close tasks"
          body="Reset demo data from Admin if the checklist is missing."
        />
      ) : (
        <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {tasks.map((t) => (
            <li key={t.id} className="px-4 py-3">
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleCloseTask(t.id)}
                  className="mt-0.5"
                />
                <span className={t.done ? "text-[var(--fg-muted)] line-through" : ""}>
                  {t.title}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
