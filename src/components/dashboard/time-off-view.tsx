"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import type { TimeOffRequest } from "@/lib/mock";

const PREFILL_KEY = "work-beacon-timeoff-prefill";

export function TimeOffView() {
  const { session } = useAuth();
  const { state, addTimeOff, leaveBalancesFor } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const balances = leaveBalancesFor(workerId);
  const mine = state.timeOff.filter(
    (r) => !r.workerId || r.workerId === workerId,
  );

  const [type, setType] = useState<TimeOffRequest["type"]>("Vacation");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [hours, setHours] = useState("8");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(PREFILL_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as {
        type?: TimeOffRequest["type"];
        start?: string;
        end?: string;
        hours?: number;
      };
      if (data.type) setType(data.type);
      if (data.start) setStart(data.start);
      if (data.end) setEnd(data.end);
      if (data.hours) setHours(String(data.hours));
      setMessage("Prefilled from Work Beacon Agent — review and submit.");
      window.sessionStorage.removeItem(PREFILL_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const h = Number(hours);
    if (!start || !end || !Number.isFinite(h) || h <= 0) {
      setMessage("Enter start, end, and hours.");
      return;
    }
    const remaining = balances.find((b) => b.type === type)?.remaining ?? 0;
    if (h > remaining) {
      setMessage(
        `${type} remaining is ${remaining}h. Reduce hours or pick another type.`,
      );
      return;
    }
    addTimeOff({ type, start, end, hours: h, workerId });
    setMessage("Request submitted (pending).");
    setStart("");
    setEnd("");
    setHours("8");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
          Time Off
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Balances from Northstar leave policy minus approved and pending
          requests.{" "}
          <Link href="/dashboard/calendar" className="text-[var(--accent)]">
            Calendar
          </Link>
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-3">
        {balances.map((b) => (
          <li
            key={b.type}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
              {b.type}
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--accent)]">
              {b.remaining}h
            </p>
            <p className="mt-1 text-xs text-[var(--fg-muted)]">
              {b.used}h used of {b.granted}h granted
            </p>
            <p className="mt-2 text-xs text-[var(--fg-muted)]">{b.policy.note}</p>
          </li>
        ))}
      </ul>

      <form
        onSubmit={onSubmit}
        className="max-w-xl space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <h2 className="text-sm font-semibold text-[var(--fg)]">New request</h2>
        <label className="block text-sm text-[var(--fg-muted)]">
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TimeOffRequest["type"])}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
          >
            <option>Vacation</option>
            <option>Sick</option>
            <option>Personal</option>
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-[var(--fg-muted)]">
            Start
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
              required
            />
          </label>
          <label className="block text-sm text-[var(--fg-muted)]">
            End
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
              required
            />
          </label>
        </div>
        <label className="block text-sm text-[var(--fg-muted)]">
          Hours
          <input
            type="number"
            min={1}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
            required
          />
        </label>
        {message ? (
          <p className="text-sm text-[var(--accent)]" role="status">
            {message}
          </p>
        ) : null}
        <Button type="submit">Submit request</Button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] text-[var(--fg-muted)]">
            <tr>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Dates</th>
              <th className="px-3 py-2 font-medium">Hours</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {mine.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[var(--border)] last:border-0"
              >
                <td className="px-3 py-2 text-[var(--fg)]">{row.type}</td>
                <td className="px-3 py-2 text-[var(--fg-muted)]">
                  {row.start} → {row.end}
                </td>
                <td className="px-3 py-2">{row.hours}</td>
                <td className="px-3 py-2">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
