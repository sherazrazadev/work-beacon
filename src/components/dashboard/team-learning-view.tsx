"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import { DataTable, Td, Th } from "@/components/ui/data-table";
import { LEARN_COURSES, courseById, isOverdue } from "@/lib/mock/learn";
import { WORKERS, getDirectReports, getWorker } from "@/lib/mock/org";
import { addDaysIso, WF_TODAY } from "@/lib/mock/workforce";

export function TeamLearningView() {
  const { session } = useAuth();
  const { ready, state, assignLearnCourse } = useMock();
  const role = session?.user.role ?? "manager";
  const workerId = session?.user.workerId ?? "w-morgan";
  const people =
    role === "hr_admin" ? WORKERS : getDirectReports(workerId);
  const [target, setTarget] = useState(people[0]?.id ?? "");
  const [courseId, setCourseId] = useState(LEARN_COURSES[0]?.id ?? "");
  const [due, setDue] = useState(addDaysIso(WF_TODAY, 21));
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!target && people[0]) setTarget(people[0].id);
  }, [people, target]);

  if (!ready) return <DashboardSkeleton />;

  const ids = new Set(people.map((w) => w.id));
  const rows = state.learnAssignments.filter((a) => ids.has(a.workerId));
  const overdue = rows.filter((a) => isOverdue(a));

  function onAssign(e: FormEvent) {
    e.preventDefault();
    const id = assignLearnCourse(target, courseId, due);
    const course = courseById(courseId);
    const worker = getWorker(target);
    setMsg(
      id
        ? `Assigned ${course?.title ?? courseId} to ${worker?.name ?? target}.`
        : "Could not assign.",
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Team learning
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Assign catalog courses. Overdue is due date before demo today{" "}
          {WF_TODAY}.
        </p>
        <p className="mt-2 text-sm">
          <Link href="/dashboard/learning" className="text-[var(--accent)]">
            My learning →
          </Link>
        </p>
      </div>

      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      <form
        onSubmit={onAssign}
        className="grid gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-4 sm:items-end"
      >
        <label className="block text-sm">
          Worker
          <select
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            {people.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Course
          <select
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            {LEARN_COURSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Due
          <input
            type="date"
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </label>
        <Button type="submit">Assign</Button>
      </form>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Overdue ({overdue.length})
        </h2>
        {overdue.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--fg-muted)]">None overdue.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {overdue.map((a) => (
              <li key={a.id}>
                {getWorker(a.workerId)?.name ?? a.workerId} ·{" "}
                {courseById(a.courseId)?.title} · due {a.due}
              </li>
            ))}
          </ul>
        )}
      </section>

      <DataTable empty={rows.length === 0 ? "No assignments for this team." : undefined}>
        {rows.length > 0 ? (
          <>
            <thead>
              <tr>
                <Th>Worker</Th>
                <Th>Course</Th>
                <Th>Status</Th>
                <Th numeric>Progress</Th>
                <Th>Due</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <Td>{getWorker(a.workerId)?.name ?? a.workerId}</Td>
                  <Td>{courseById(a.courseId)?.title ?? a.courseId}</Td>
                  <Td>{a.status}</Td>
                  <Td numeric>{a.progress}%</Td>
                  <Td>
                    {a.due}
                    {isOverdue(a) ? (
                      <span className="ml-2 text-xs text-[var(--accent)]">
                        overdue
                      </span>
                    ) : null}
                  </Td>
                </tr>
              ))}
            </tbody>
          </>
        ) : null}
      </DataTable>
    </div>
  );
}
