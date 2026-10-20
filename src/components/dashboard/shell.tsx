"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/components/auth/require-auth";
import { RequireRole } from "@/components/auth/require-role";
import { useAuth } from "@/components/auth/auth-provider";
import { AgentFab } from "@/components/agent/agent-fab";
import { AgentOnboarding } from "@/components/agent/agent-onboarding";
import { AgentPanel } from "@/components/agent/agent-panel";
import { AgentProvider } from "@/components/agent/agent-provider";
import { MockProvider, useMock } from "@/components/dashboard/mock-provider";
import { PersonaSwitcher } from "@/components/dashboard/persona-switcher";
import { GuidedTour } from "@/components/tour/guided-tour";
import { BRAND } from "@/lib/brand";
import { TENANT, roleLabel } from "@/lib/mock/org";
import { navForRole } from "@/lib/rbac";
import { cn } from "@/lib/utils";

function NavLinks({
  onNavigate,
  role,
}: {
  onNavigate?: () => void;
  role: Parameters<typeof navForRole>[0];
}) {
  const pathname = usePathname();
  const links = navForRole(role);

  return (
    <ul className="space-y-1">
      {links.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "block rounded-md px-3 py-2 text-sm",
                active
                  ? "bg-[var(--surface-muted)] font-medium text-[var(--accent)]"
                  : "text-[var(--fg-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--fg)]",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function DashboardChrome({ children }: { children: React.ReactNode }) {
  const { session, signOut } = useAuth();
  const { state, openInboxCount } = useMock();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tourSignal, setTourSignal] = useState(0);
  const role = session?.user.role ?? "employee";
  const unread = state.notifications.filter((n) => !n.read).length;
  const inboxOpen = openInboxCount(role, session?.user.workerId);

  function onLogout() {
    signOut();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-60 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] p-4 md:flex md:flex-col">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--fg)]"
        >
          {BRAND.name}
        </Link>
        <p className="mt-1 text-xs text-[var(--fg-muted)]">{TENANT.name}</p>
        <p className="text-xs font-medium text-[var(--accent)]">
          {roleLabel(role)}
        </p>
        <nav aria-label="Dashboard" className="mt-6 flex-1 overflow-y-auto">
          <NavLinks role={role} />
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)]/80 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-[var(--border)] px-2 py-1 text-sm md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
            >
              Menu
            </button>
            <p className="truncate text-sm text-[var(--fg-muted)]">
              {session?.user.name}
              {session?.user.demo ? " · Demo" : ""}
              {session?.ssoDemo ? " · SSO" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PersonaSwitcher />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setTourSignal((n) => n + 1)}
            >
              Tour
            </Button>
            <Button asChild variant="ghost" size="sm" className="relative">
              <Link href="/dashboard/inbox">
                Inbox
                {inboxOpen > 0 ? (
                  <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] text-white">
                    {inboxOpen}
                  </span>
                ) : null}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="relative hidden sm:inline-flex">
              <Link href="/dashboard/notifications">
                Alerts
                {unread > 0 ? (
                  <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] text-white">
                    {unread}
                  </span>
                ) : null}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
              <Link href="/">Marketing</Link>
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={onLogout}>
              Log out
            </Button>
          </div>
        </header>

        {mobileOpen ? (
          <div className="border-b border-[var(--border)] bg-[var(--surface)] p-4 md:hidden">
            <NavLinks role={role} onNavigate={() => setMobileOpen(false)} />
          </div>
        ) : null}

        <div className="flex-1 overflow-auto p-4 pb-24 sm:p-6">
          <RequireRole>{children}</RequireRole>
        </div>
      </div>
      {state.featureFlags.agentEnabled ? (
        <>
          <AgentFab />
          <AgentPanel />
          <AgentOnboarding />
        </>
      ) : null}
      <GuidedTour startSignal={tourSignal} />
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <MockProvider>
        <AgentProvider>
          <DashboardChrome>{children}</DashboardChrome>
        </AgentProvider>
      </MockProvider>
    </RequireAuth>
  );
}
