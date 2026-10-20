"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/components/auth/require-auth";
import { RequireRole } from "@/components/auth/require-role";
import { useAuth } from "@/components/auth/auth-provider";
import { AgentFab } from "@/components/agent/agent-fab";
import { useAgentUi } from "@/components/agent/agent-provider";
import { AgentOnboarding } from "@/components/agent/agent-onboarding";
import { AgentPanel } from "@/components/agent/agent-panel";
import { AgentProvider } from "@/components/agent/agent-provider";
import { MockProvider, useMock } from "@/components/dashboard/mock-provider";
import { PersonaSwitcher } from "@/components/dashboard/persona-switcher";
import { GuidedTour } from "@/components/tour/guided-tour";
import { BRAND } from "@/lib/brand";
import { TENANT, roleLabel } from "@/lib/mock/org";
import { navForRole } from "@/lib/rbac";
import { INSTALLABLE_APPS } from "@/lib/mock/platform";
import { cn } from "@/lib/utils";

function navGroupLabel(href: string): string {
  if (
    href === "/dashboard" ||
    href.startsWith("/dashboard/inbox") ||
    href.startsWith("/dashboard/notifications") ||
    href.startsWith("/dashboard/profile")
  ) {
    return "Workspace";
  }
  if (/\/(time-off|calendar|timesheets|clock|schedule)(\/|$)/.test(href)) {
    return "Time";
  }
  if (
    /\/(pay|expenses|procurement|ledger|planning|close|payroll|pay-setup|pay-adjustments|tax-packs)(\/|$)/.test(
      href,
    )
  ) {
    return "Money";
  }
  if (
    /\/(directory|org|team|people|moves|assets|access|eligibility|positions)(\/|$)/.test(
      href,
    )
  ) {
    return "People";
  }
  if (
    /\/(recruiting|onboarding|offboarding|performance|learning|comp|succession|mobility|job-architecture)(\/|$)/.test(
      href,
    )
  ) {
    return "Talent";
  }
  if (/\/(benefits|pulse|cases|enrollment|policies)(\/|$)/.test(href)) {
    return "Experience";
  }
  return "Platform";
}

function NavLinks({
  onNavigate,
  role,
  extra,
}: {
  onNavigate?: () => void;
  role: Parameters<typeof navForRole>[0];
  extra?: { href: string; label: string; exact: boolean }[];
}) {
  const pathname = usePathname();
  const links = [...navForRole(role), ...(extra ?? [])];
  const order = [
    "Workspace",
    "Time",
    "Money",
    "Experience",
    "People",
    "Talent",
    "Platform",
  ];
  const buckets = new Map<string, typeof links>();
  for (const item of links) {
    const label = navGroupLabel(item.href);
    const list = buckets.get(label) ?? [];
    list.push(item);
    buckets.set(label, list);
  }
  const groups = [
    ...order.filter((label) => buckets.has(label)).map((label) => ({
      label,
      items: buckets.get(label)!,
    })),
    ...[...buckets.keys()]
      .filter((label) => !order.includes(label))
      .map((label) => ({ label, items: buckets.get(label)! })),
  ];

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-md border-l-2 px-2 py-1.5 text-[13px] leading-5 transition-colors",
                      active
                        ? "border-[var(--accent)] bg-[var(--surface-muted)] font-medium text-[var(--fg)]"
                        : "border-transparent text-[var(--fg-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--fg)]",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function DashboardChrome({ children }: { children: React.ReactNode }) {
  const { session, signOut } = useAuth();
  const { state, openInboxCount } = useMock();
  const { toggle: toggleAgent, open: agentOpen } = useAgentUi();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tourSignal, setTourSignal] = useState(0);
  const role = session?.user.role ?? "employee";
  const unread = state.notifications.filter((n) => !n.read).length;
  const inboxOpen = openInboxCount(role, session?.user.workerId);
  const appLinks = INSTALLABLE_APPS.filter((a) =>
    state.installedApps.includes(a.id),
  ).map((a) => ({ href: a.href, label: a.navLabel, exact: false as const }));

  function onLogout() {
    signOut();
    router.replace("/login");
  }

  return (
    <div className="dashboard-shell flex min-h-full flex-1">
      <aside className="hidden w-56 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] p-3 lg:flex lg:flex-col">
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
          <NavLinks role={role} extra={appLinks} />
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface)]/80 px-3 backdrop-blur sm:gap-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="min-h-10 shrink-0 rounded-md border border-[var(--border)] px-3 py-1 text-sm hover:bg-[var(--surface-muted)] lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
            >
              Menu
            </button>
            <p className="hidden truncate text-sm text-[var(--fg-muted)] sm:block">
              {session?.user.name}
              {session?.user.demo ? " · Demo" : ""}
              {session?.ssoDemo ? " · SSO" : ""}
            </p>
          </div>
          <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-2">
            <PersonaSwitcher />
            {state.featureFlags.agentEnabled ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 shrink-0 sm:hidden"
                aria-expanded={agentOpen}
                onClick={toggleAgent}
              >
                Agent
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => setTourSignal((n) => n + 1)}
            >
              Tour
            </Button>
            <Button asChild variant="ghost" size="sm" className="relative h-10 shrink-0 sm:h-8">
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
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={onLogout}
            >
              Log out
            </Button>
          </div>
        </header>

        {mobileOpen ? (
          <div className="max-h-[70vh] overflow-y-auto border-b border-[var(--border)] bg-[var(--surface)] p-4 lg:hidden">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4 sm:hidden">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--fg)]">
                  {session?.user.name}
                  {session?.user.demo ? " · Demo" : ""}
                </p>
                <p className="text-xs text-[var(--accent)]">{roleLabel(role)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-10"
                  onClick={() => {
                    setMobileOpen(false);
                    setTourSignal((n) => n + 1);
                  }}
                >
                  Tour
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-10"
                  onClick={onLogout}
                >
                  Log out
                </Button>
              </div>
            </div>
            <NavLinks
              role={role}
              extra={appLinks}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        ) : null}

        <div
          data-dash-content
          className="min-w-0 flex-1 overflow-auto p-4 pb-24 sm:p-6"
        >
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
