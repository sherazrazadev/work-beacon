"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/field";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { StackTable } from "@/components/ui/stack-table";
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
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
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
      setError("Enter start, end, and hours.");
      setMessage(null);
      return;
    }
    const remaining = balances.find((b) => b.type === type)?.remaining ?? 0;
    if (h > remaining) {
      setError(
        `${type} remaining is ${remaining}h. Reduce hours or pick another type.`,
      );
      setMessage(null);
      return;
    }
    addTimeOff({ type, start, end, hours: h, workerId });
    setError(null);
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
            <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-[var(--fg)]">
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
        className="max-w-xl space-y-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <h2 className="text-sm font-semibold text-[var(--fg)]">New request</h2>
        <Field label="Type">
          <SelectInput
            value={type}
            onChange={(e) => setType(e.target.value as TimeOffRequest["type"])}
          >
            <option>Vacation</option>
            <option>Sick</option>
            <option>Personal</option>
          </SelectInput>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start">
            <TextInput
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </Field>
          <Field label="End">
            <TextInput
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </Field>
        </div>
        <Field label="Hours" error={error}>
          <TextInput
            type="number"
            min={1}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
          />
        </Field>
        {message ? (
          <p className="text-sm" role="status">
            {message}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Submit request</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setStart("");
              setEnd("");
              setHours("8");
              setError(null);
              setMessage(null);
            }}
          >
            Clear
          </Button>
        </div>
      </form>

      <StackTable className="sm:rounded-xl sm:border sm:border-[var(--border)] sm:bg-[var(--surface)]">
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
      </StackTable>
    </div>
  );
}
