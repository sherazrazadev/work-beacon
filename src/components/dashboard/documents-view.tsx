"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

export function DocumentsView() {
  const { session } = useAuth();
  const { ready, state } = useMock();
  const [toast, setToast] = useState<string | null>(null);
  const workerId = session?.user.workerId;

  if (!ready) return <DashboardSkeleton />;

  const docs = state.documents.filter(
    (d) => !d.workerId || d.workerId === workerId || session?.user.role === "hr_admin",
  );

  function downloadStub(name: string) {
    setToast(`Downloaded stub: ${name}`);
    window.setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Documents
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Metadata only — no real PII files are stored.
        </p>
      </div>

      {toast ? (
        <p
          role="status"
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--accent)]"
        >
          {toast}
        </p>
      ) : null}

      <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        {docs.map((d) => (
          <li
            key={d.id}
            className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-[var(--fg)]">{d.name}</p>
              <p className="text-xs text-[var(--fg-muted)]">
                {d.category} · updated {d.updated}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => downloadStub(d.name)}
            >
              Download stub
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
