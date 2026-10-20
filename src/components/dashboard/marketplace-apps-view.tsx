"use client";

import Link from "next/link";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { Button } from "@/components/ui/button";
import { INSTALLABLE_APPS } from "@/lib/mock/platform";

export function MarketplaceAppsView() {
  const { ready, state, toggleApp } = useMock();
  if (!ready) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          App catalog
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Installing adds a nav item. Uninstall removes it.
        </p>
      </div>
      <ul className="space-y-3">
        {INSTALLABLE_APPS.map((app) => {
          const on = state.installedApps.includes(app.id);
          return (
            <li
              key={app.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <p className="font-medium">{app.name}</p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{app.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => toggleApp(app.id)}
                >
                  {on ? "Uninstall" : "Install"}
                </Button>
                {on ? (
                  <Button asChild size="sm" variant="secondary">
                    <Link href={app.href}>Open</Link>
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
