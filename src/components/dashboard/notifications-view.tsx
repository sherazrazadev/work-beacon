"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { useMock } from "@/components/dashboard/mock-provider";

export function NotificationsView() {
  const { state, markNotificationRead, markAllNotificationsRead } = useMock();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Mark items read — stored locally.
          </p>
        </div>
        {state.notifications.length > 0 ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={markAllNotificationsRead}
          >
            Mark all read
          </Button>
        ) : null}
      </div>

      {state.notifications.length === 0 ? (
        <EmptyState
          title="You're all caught up"
          body="No notifications right now. Check home for upcoming deadlines."
          actionHref="/dashboard"
          actionLabel="Back to home"
        />
      ) : (
      <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        {state.notifications.map((n) => (
          <li
            key={n.id}
            className="flex flex-wrap items-start justify-between gap-3 px-4 py-3"
          >
            <div>
              <p
                className={`text-sm font-medium ${
                  n.read ? "text-[var(--fg-muted)]" : "text-[var(--fg)]"
                }`}
              >
                {n.title}
                {!n.read ? (
                  <span className="ml-2 text-[10px] uppercase tracking-wide text-[var(--accent)]">
                    New
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{n.body}</p>
              <p className="mt-1 text-xs text-[var(--fg-muted)]">{n.at}</p>
            </div>
            {!n.read ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => markNotificationRead(n.id)}
              >
                Mark read
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}
