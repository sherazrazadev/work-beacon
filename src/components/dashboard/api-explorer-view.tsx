"use client";

import { useState } from "react";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";

const PATHS = [
  "/api/demo/workers",
  "/api/demo/events",
  "/api/demo/time-off",
] as const;

export function ApiExplorerView() {
  const { ready, state, rotateDemoApiKey } = useMock();
  const [out, setOut] = useState<string>("");
  const [path, setPath] = useState<(typeof PATHS)[number]>(PATHS[0]);

  if (!ready) return <DashboardSkeleton />;

  async function run() {
    const res = await fetch(path, {
      headers: { Authorization: `Bearer ${state.demoApiKey}` },
    });
    const json = await res.json();
    setOut(JSON.stringify({ status: res.status, json }, null, 2));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          API explorer
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          GET seed data. Demo key is optional on these routes; wrong key
          returns 401.
        </p>
      </div>
      <p className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-xs">
        {state.demoApiKey}
      </p>
      <Button type="button" size="sm" variant="secondary" onClick={rotateDemoApiKey}>
        Rotate key
      </Button>
      <div className="flex flex-wrap gap-2">
        <select
          value={path}
          onChange={(e) => setPath(e.target.value as (typeof PATHS)[number])}
          className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
        >
          {PATHS.map((p) => (
            <option key={p} value={p}>
              GET {p}
            </option>
          ))}
        </select>
        <Button type="button" onClick={() => void run()}>
          Fetch
        </Button>
      </div>
      {out ? (
        <pre className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs">
          {out}
        </pre>
      ) : (
        <p className="text-sm text-[var(--fg-muted)]">No response yet.</p>
      )}
    </div>
  );
}
