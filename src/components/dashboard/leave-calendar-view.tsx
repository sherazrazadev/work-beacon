"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { getDirectReports, getWorker } from "@/lib/mock/org";
import { WF_TODAY, addDaysIso } from "@/lib/mock/workforce";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(iso);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function inRange(iso: string, start: string, end: string) {
  return iso >= start && iso <= end;
}

export function LeaveCalendarView() {
  const { session } = useAuth();
  const { state, decideTimeOff } = useMock();
  const role = session?.user.role ?? "employee";
  const workerId = session?.user.workerId ?? "w-alex";
  const isManager = role === "manager" || role === "hr_admin";

  const today = new Date(`${WF_TODAY}T12:00:00`);
  const [cursor, setCursor] = useState({
    y: today.getFullYear(),
    m: today.getMonth(),
  });

  const reportIds = useMemo(
    () => new Set(getDirectReports(workerId).map((w) => w.id)),
    [workerId],
  );

  const events = useMemo(() => {
    return state.timeOff.filter((r) => {
      if (r.status === "Denied") return false;
      if (!isManager) return !r.workerId || r.workerId === workerId;
      const id = r.workerId ?? workerId;
      return id === workerId || reportIds.has(id);
    });
  }, [state.timeOff, isManager, workerId, reportIds]);

  const cells = monthGrid(cursor.y, cursor.m);
  const label = new Date(cursor.y, cursor.m, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  function prev() {
    setCursor((c) =>
      c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 },
    );
  }
  function next() {
    setCursor((c) =>
      c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 },
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
            Leave calendar
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            {isManager
              ? "Your absences plus direct reports."
              : "Your approved and pending leave."}{" "}
            <Link href="/dashboard/time-off" className="text-[var(--accent)]">
              Request time off
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            className="rounded-md border border-[var(--border)] px-3 py-1 text-sm"
          >
            Prev
          </button>
          <p className="min-w-[9rem] text-center text-sm font-medium">{label}</p>
          <button
            type="button"
            onClick={next}
            className="rounded-md border border-[var(--border)] px-3 py-1 text-sm"
          >
            Next
          </button>
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[560px] sm:min-w-0">
          <div className="grid grid-cols-7 gap-px border border-[var(--border)] bg-[var(--border)] text-center text-[10px] uppercase tracking-wider text-[var(--fg-muted)] sm:text-xs">
            {WEEKDAYS.map((d) => (
              <div key={d} className="bg-[var(--surface)] py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px border border-t-0 border-[var(--border)] bg-[var(--border)]">
            {cells.map((iso, i) => {
              const hits = iso
                ? events.filter((e) => inRange(iso, e.start, e.end))
                : [];
              return (
                <div
                  key={iso ?? `pad-${i}`}
                  className={cn(
                    "min-h-[4.5rem] bg-[var(--surface)] p-1 sm:min-h-[5.5rem] sm:p-2",
                    iso === WF_TODAY && "ring-1 ring-inset ring-[var(--accent)]",
                  )}
                >
                  {iso ? (
                    <>
                      <p className="text-xs text-[var(--fg-muted)]">
                        {iso.slice(8)}
                      </p>
                      <ul className="mt-1 space-y-0.5">
                        {hits.slice(0, 3).map((h) => (
                          <li
                            key={h.id}
                            className="truncate rounded bg-[var(--surface-muted)] px-1 py-0.5 text-[10px] text-[var(--fg)]"
                          >
                            {isManager
                              ? (getWorker(h.workerId ?? workerId)?.preferredName ??
                                "You")
                              : h.type}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isManager ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Pending leave
          </h2>
          <ul className="mt-3 space-y-2">
            {events
              .filter((e) => e.status === "Pending")
              .map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
                >
                  <span>
                    {getWorker(e.workerId ?? workerId)?.name} · {e.type} ·{" "}
                    {e.start} → {e.end}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => decideTimeOff(e.id, "Approved")}
                  >
                    Approve
                  </Button>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-[var(--fg-muted)]">
        Demo today {WF_TODAY}. Next week starts {addDaysIso(WF_TODAY, 1)}.
      </p>
    </div>
  );
}
