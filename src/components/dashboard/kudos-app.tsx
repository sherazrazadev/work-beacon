"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { Button } from "@/components/ui/button";

const KEY = "work-beacon-kudos";

type Card = { id: string; from: string; text: string };

export function KudosApp() {
  const { session } = useAuth();
  const { state } = useMock();
  const installed = state.installedApps.includes("kudos");
  const [rows, setRows] = useState<Card[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setRows(JSON.parse(raw) as Card[]);
    } catch {
      /* ignore */
    }
  }, []);

  if (!installed) {
    return (
      <p className="text-sm text-[var(--fg-muted)]">
        Kudos Wall is not installed.{" "}
        <Link href="/dashboard/marketplace" className="text-[var(--accent)]">
          Open Apps
        </Link>
        .
      </p>
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const next = [
      {
        id: `k-${Date.now()}`,
        from: session?.user.name ?? "You",
        text: text.trim(),
      },
      ...rows,
    ];
    setRows(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    setText("");
  }

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
        Kudos Wall
      </h1>
      <form onSubmit={onSubmit} className="flex flex-wrap gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Thanks for covering standup"
          className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
        />
        <Button type="submit">Post</Button>
      </form>
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--fg-muted)]">No kudos yet.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
            >
              <p className="font-medium">{r.from}</p>
              <p className="mt-1 text-[var(--fg-muted)]">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
