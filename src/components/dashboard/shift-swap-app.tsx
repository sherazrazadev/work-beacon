"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { Button } from "@/components/ui/button";

const KEY = "work-beacon-shift-swaps";

type Swap = { id: string; note: string; from: string; done: boolean };

export function ShiftSwapApp() {
  const { session } = useAuth();
  const { state } = useMock();
  const installed = state.installedApps.includes("shift-swap");
  const [rows, setRows] = useState<Swap[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setRows(JSON.parse(raw) as Swap[]);
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: Swap[]) {
    setRows(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }

  if (!installed) {
    return (
      <p className="text-sm text-[var(--fg-muted)]">
        Shift Swap is not installed.{" "}
        <Link href="/dashboard/marketplace" className="text-[var(--accent)]">
          Open Apps
        </Link>
        .
      </p>
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    persist([
      {
        id: `sw-${Date.now()}`,
        note: note.trim(),
        from: session?.user.name ?? "You",
        done: false,
      },
      ...rows,
    ]);
    setNote("");
  }

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
        Shift Swap
      </h1>
      <form onSubmit={onSubmit} className="flex flex-wrap gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Sat 9–5 ↔ Sun 12–8"
          className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
        />
        <Button type="submit">Propose</Button>
      </form>
      <ul className="space-y-2 text-sm">
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <span>
              {r.from}: {r.note}
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                persist(rows.map((x) => (x.id === r.id ? { ...x, done: true } : x)))
              }
            >
              {r.done ? "Confirmed" : "Confirm"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
