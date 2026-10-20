"use client";

import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { LEARNING_PATHS } from "@/lib/mock/talent";

export function LearningView() {
  const { session } = useAuth();
  const { courses, state } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const skills =
    state.skills.find((s) => s.workerId === workerId)?.tags ?? [];
  const suggested = LEARNING_PATHS.filter((p) => skills.includes(p.skill));
  const groups = [
    {
      title: "Assigned",
      items: courses.filter((c) => c.status === "Assigned"),
    },
    {
      title: "In progress",
      items: courses.filter((c) => c.status === "In progress"),
    },
    {
      title: "Completed",
      items: courses.filter((c) => c.status === "Completed"),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
          Learning
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Assigned, in-progress, and completed courses. Paths follow your
          skills tags.
        </p>
      </div>

      {suggested.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Suggested for your skills
          </h2>
          <ul className="mt-3 space-y-2">
            {suggested.map((p) => (
              <li
                key={p.skill}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
              >
                <span className="text-[var(--accent)]">{p.skill}</span>
                {" · "}
                {p.courseTitle}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {courses.length === 0 ? (
        <EmptyState
          title="No courses assigned"
          body="When learning plans are assigned, they will appear in these lists."
          actionHref="/dashboard"
          actionLabel="Back to home"
        />
      ) : (
      groups.map((group) => (
        <section key={group.title}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            {group.title}
          </h2>
          {group.items.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              No {group.title.toLowerCase()} courses.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {group.items.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                >
                  <p className="font-medium text-[var(--fg)]">{c.title}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className="h-full bg-[var(--accent)]"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[var(--fg-muted)]">
                    {c.progress}%
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))
      )}
    </div>
  );
}
