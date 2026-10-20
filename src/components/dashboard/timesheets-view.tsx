"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { COST_CENTERS } from "@/lib/mock/org";
import {
  WF_TODAY,
  emptyWeekTimesheet,
  timesheetTotal,
  weekStartMonday,
} from "@/lib/mock/workforce";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

export function TimesheetsView() {
  const { session } = useAuth();
  const {
    ready,
    state,
    saveTimesheet,
    submitTimesheet,
    approveTimesheet,
  } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const isManager =
    session?.user.role === "manager" || session?.user.role === "hr_admin";
  const currentWeek = weekStartMonday(WF_TODAY);

  const mine = useMemo(
    () =>
      state.timesheets
        .filter((t) => t.workerId === workerId)
        .sort((a, b) => b.weekStart.localeCompare(a.weekStart)),
    [state.timesheets, workerId],
  );

  const current =
    mine.find((t) => t.weekStart === currentWeek) ??
    emptyWeekTimesheet(workerId, currentWeek);

  const [draft, setDraft] = useState(current);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setDraft(current);
    // current is rebuilt each render; sync when the stored sheet id/status changes
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on identity fields
  }, [current.id, current.status, current.weekStart, ready]);

  if (!ready) return <DashboardSkeleton />;

  function setHours(date: string, hours: number) {
    setDraft((prev) => ({
      ...prev,
      days: prev.days.map((d) => (d.date === date ? { ...d, hours } : d)),
    }));
  }

  function setMeta(date: string, field: "project" | "costCenterId", value: string) {
    setDraft((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date ? { ...d, [field]: value } : d,
      ),
    }));
  }

  function save() {
    saveTimesheet(draft);
    setMsg("Draft saved.");
  }

  function submit() {
    saveTimesheet(draft);
    const ok = submitTimesheet(draft.id);
    setMsg(ok ? "Week submitted." : "Nothing to submit — already sent.");
  }

  const pendingTeam = state.timesheets.filter((t) => t.status === "Submitted");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Timesheets
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Week of {current.weekStart} · {timesheetTotal(draft)}h
        </p>
      </div>

      {msg ? (
        <p role="status" className="text-sm text-[var(--accent)]">
          {msg}
        </p>
      ) : null}

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="min-w-[640px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--fg-muted)]">
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Hours</th>
              <th className="py-2 pr-3 font-medium">Cost center</th>
              <th className="py-2 font-medium">Project</th>
            </tr>
          </thead>
          <tbody>
            {draft.days.map((d) => (
              <tr key={d.date} className="border-b border-[var(--border)]">
                <td className="py-2 pr-3">{d.date}</td>
                <td className="py-2 pr-3">
                  <input
                    type="number"
                    min={0}
                    max={24}
                    step={0.5}
                    disabled={draft.status !== "Draft"}
                    value={d.hours}
                    onChange={(e) => setHours(d.date, Number(e.target.value))}
                    className="w-20 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1"
                  />
                </td>
                <td className="py-2 pr-3">
                  <select
                    disabled={draft.status !== "Draft"}
                    value={d.costCenterId ?? ""}
                    onChange={(e) =>
                      setMeta(d.date, "costCenterId", e.target.value)
                    }
                    className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1"
                  >
                    <option value="">—</option>
                    {COST_CENTERS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2">
                  <input
                    disabled={draft.status !== "Draft"}
                    value={d.project ?? ""}
                    onChange={(e) => setMeta(d.date, "project", e.target.value)}
                    className="w-36 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {draft.status === "Draft" ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={save}>
            Save draft
          </Button>
          <Button type="button" onClick={submit}>
            Submit week
          </Button>
        </div>
      ) : (
        <p className="text-sm text-[var(--fg-muted)]">Status: {draft.status}</p>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Submitted history
        </h2>
        <ul className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {mine.map((t) => (
            <li
              key={t.id}
              className="flex justify-between gap-3 px-4 py-3 text-sm"
            >
              <span>
                Week of {t.weekStart} · {timesheetTotal(t)}h
              </span>
              <span className="text-[var(--fg-muted)]">{t.status}</span>
            </li>
          ))}
        </ul>
      </section>

      {isManager && pendingTeam.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Approve submitted
          </h2>
          <ul className="mt-3 space-y-2">
            {pendingTeam.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
              >
                <span>
                  {t.workerId} · week {t.weekStart} · {timesheetTotal(t)}h
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => approveTimesheet(t.id)}
                >
                  Approve
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
