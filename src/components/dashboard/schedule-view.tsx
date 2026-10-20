"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { StackTable } from "@/components/ui/stack-table";
import { getDirectReports, getWorker } from "@/lib/mock/org";
import { WF_TODAY, weekDates, weekStartMonday } from "@/lib/mock/workforce";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

export function ScheduleView() {
  const { session } = useAuth();
  const { ready, state, publishShifts } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const role = session?.user.role ?? "employee";
  const isManager = role === "manager" || role === "hr_admin";
  const weekStart = weekStartMonday(WF_TODAY);
  const days = weekDates(weekStart);

  if (!ready) return <DashboardSkeleton />;

  const rosterIds = isManager
    ? [
        workerId,
        ...getDirectReports(workerId).map((w) => w.id),
      ]
    : [workerId];

  const visibleShifts = state.shifts.filter((s) => {
    if (!days.includes(s.date)) return false;
    if (!rosterIds.includes(s.workerId)) return false;
    if (!isManager && !s.published) return false;
    return true;
  });

  const unpublished = state.shifts.filter((s) => !s.published).length;
  const myShifts = state.shifts
    .filter((s) => s.workerId === workerId && s.published)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
            Schedule
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Week of {weekStart}
            {isManager ? " · roster for you and reports" : " · published shifts"}
          </p>
        </div>
        {isManager ? (
          <Button type="button" onClick={publishShifts} disabled={unpublished === 0}>
            Publish shifts
            {unpublished ? ` (${unpublished})` : ""}
          </Button>
        ) : null}
      </div>

      <StackTable>
        <table className="min-w-[720px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--fg-muted)]">
              <th className="py-2 pr-3 font-medium">Person</th>
              {days.map((d) => (
                <th key={d} className="py-2 pr-2 font-medium">
                  {d.slice(5)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rosterIds.map((id) => {
              const w = getWorker(id);
              return (
                <tr key={id} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-3 font-medium">{w?.name ?? id}</td>
                  {days.map((d) => {
                    const cell = visibleShifts.filter(
                      (s) => s.workerId === id && s.date === d,
                    );
                    return (
                      <td key={d} className="py-2 pr-2 align-top text-xs">
                        {cell.map((s) => (
                          <p key={s.id} className="text-[var(--fg)]">
                            {s.start}–{s.end}
                            {!s.published ? " · draft" : ""}
                          </p>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </StackTable>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          My shifts
        </h2>
        <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {myShifts.map((s) => (
            <li
              key={s.id}
              className="flex justify-between gap-3 px-4 py-3 text-sm"
            >
              <span>
                {s.date} · {s.start}–{s.end}
              </span>
              <span className="text-[var(--fg-muted)]">{s.location}</span>
            </li>
          ))}
          {myShifts.length === 0 ? (
            <li className="px-4 py-6 text-sm text-[var(--fg-muted)]">
              No published shifts this week.
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
