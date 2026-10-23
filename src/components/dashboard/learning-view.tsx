"use client";

import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import { DataTable, Td, Th } from "@/components/ui/data-table";
import {
  LEARN_COURSES,
  assignmentsFor,
  courseById,
  isOverdue,
} from "@/lib/mock/learn";

export function LearningView() {
  const { session } = useAuth();
  const { ready, state, startLearnAssignment, completeLearnAssignment } =
    useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const role = session?.user.role ?? "employee";

  if (!ready) return <DashboardSkeleton />;

  const mine = assignmentsFor(workerId, state.learnAssignments);
  const certs = state.learnCertificates.filter((c) => c.workerId === workerId);
  const catalogLeft = LEARN_COURSES.filter(
    (c) => !mine.some((a) => a.courseId === c.id && a.status !== "Completed"),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
            Learning
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Assigned courses are saved to your workspace. Completing Security
            awareness 2026 closes the matching inbox todo.
          </p>
        </div>
        {role === "manager" || role === "hr_admin" ? (
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/learning/team">Team learning</Link>
          </Button>
        ) : null}
      </div>

      {mine.length === 0 ? (
        <EmptyState
          title="No courses assigned"
          body="When a manager assigns a catalog course, it shows here."
          actionHref="/dashboard"
          actionLabel="Back to home"
        />
      ) : (
        <DataTable>
          <thead>
            <tr>
              <Th>Course</Th>
              <Th>Status</Th>
              <Th numeric>Progress</Th>
              <Th>Due</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {mine.map((a) => {
              const course = courseById(a.courseId);
              const overdue = isOverdue(a);
              return (
                <tr key={a.id}>
                  <Td>
                    {course?.title ?? a.courseId}
                    {course?.required ? (
                      <span className="ml-2 text-xs text-[var(--accent)]">
                        required
                      </span>
                    ) : null}
                  </Td>
                  <Td>{a.status}</Td>
                  <Td numeric>{a.progress}%</Td>
                  <Td>
                    {a.due}
                    {overdue ? (
                      <span className="ml-2 text-xs text-[var(--accent)]">
                        overdue
                      </span>
                    ) : null}
                  </Td>
                  <Td>
                    {a.status === "Assigned" ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => startLearnAssignment(a.id)}
                      >
                        Start
                      </Button>
                    ) : null}
                    {a.status === "In progress" ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => completeLearnAssignment(a.id)}
                      >
                        Complete
                      </Button>
                    ) : null}
                    {a.status === "Completed" ? (
                      <span className="text-xs text-[var(--fg-muted)]">
                        {a.completedAt}
                      </span>
                    ) : null}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Certificates
        </h2>
        {certs.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            None yet. Complete a course to issue one.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {certs.map((c) => (
              <li
                key={c.id}
                className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
              >
                <span className="font-medium">{c.courseTitle}</span>
                <span className="text-[var(--fg-muted)]"> · issued {c.issued}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {catalogLeft.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Catalog
          </h2>
          <ul className="mt-3 space-y-1 text-sm text-[var(--fg-muted)]">
            {catalogLeft.map((c) => (
              <li key={c.id}>
                {c.title} · {c.hours}h
                {c.required ? " · required" : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
