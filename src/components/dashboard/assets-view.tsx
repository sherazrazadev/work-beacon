"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { getWorker } from "@/lib/mock/org";

export function AssetsView() {
  const { session } = useAuth();
  const { ready, state, assignAsset, returnAsset } = useMock();
  const role = session?.user.role ?? "employee";
  const workerId = session?.user.workerId ?? "w-alex";
  const isHr = role === "hr_admin";

  if (!ready) return <DashboardSkeleton />;

  const rows = isHr
    ? state.assets
    : state.assets.filter(
        (a) => a.workerId === workerId || a.status === "Available",
      );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          IT assets
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Laptops, badges, phones — mock checkout. No MDM.
        </p>
      </div>
      <ul className="space-y-3">
        {rows.map((a) => (
          <li
            key={a.id}
            className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">
                {a.kind} · {a.tag}
              </p>
              <p className="text-sm text-[var(--fg-muted)]">
                {a.status}
                {a.workerId
                  ? ` · ${getWorker(a.workerId)?.name ?? a.workerId}`
                  : ""}
              </p>
            </div>
            <div className="flex gap-2">
              {a.status === "Available" ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => assignAsset(a.id, workerId)}
                >
                  Check out
                </Button>
              ) : null}
              {a.status === "Assigned" &&
              (isHr || a.workerId === workerId) ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => returnAsset(a.id)}
                >
                  Return
                </Button>
              ) : null}
            </div>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="text-sm text-[var(--fg-muted)]">No assets on this view.</li>
        ) : null}
      </ul>
    </div>
  );
}
