"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { wellnessTips } from "@/lib/mock/pulse";
import {
  DEFAULT_HOME_PINS,
  HOME_WIDGET_META,
  HomeWidgetId,
  pendingExpensesForRole,
  pendingLeaveForRole,
} from "@/lib/mock/platform";
import { WORKERS, getDirectReports } from "@/lib/mock/org";
import { isOverdue } from "@/lib/mock/learn";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function Card({
  title,
  value,
  hint,
  href,
  hrefLabel,
}: {
  title: string;
  value: string;
  hint?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <section className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
        {title}
      </h2>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-[var(--fg)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-[var(--fg-muted)]">{hint}</p>
      ) : null}
      {href ? (
        <Link href={href} className="mt-1 inline-flex min-h-10 items-center text-sm text-[var(--accent)]">
          {hrefLabel ?? "Open →"}
        </Link>
      ) : null}
    </section>
  );
}

export function HomeWidgets() {
  const { session } = useAuth();
  const {
    ready,
    payStubs,
    events,
    benefits,
    state,
    leaveBalancesFor,
    setHomePins,
  } = useMock();
  const [edit, setEdit] = useState(false);
  const role = session?.user.role ?? "employee";
  const workerId = session?.user.workerId ?? "w-alex";
  const pins =
    state.homePins[role] ?? DEFAULT_HOME_PINS[role] ?? DEFAULT_HOME_PINS.employee;

  const balances = leaveBalancesFor(workerId);
  const vacation =
    balances.find((b) => b.type === "Vacation")?.remaining ?? 0;
  const sick = balances.find((b) => b.type === "Sick")?.remaining ?? 0;
  const personal =
    balances.find((b) => b.type === "Personal")?.remaining ?? 0;
  const latest = payStubs.find(
    (s) => !s.workerId || s.workerId === workerId,
  ) ?? payStubs[0];
  const pendingMine = state.timeOff.filter(
    (t) =>
      t.status === "Pending" && (!t.workerId || t.workerId === workerId),
  ).length;

  if (!ready) return <DashboardSkeleton />;

  const values: Record<HomeWidgetId, { title: string; value: string; hint?: string; href?: string; hrefLabel?: string } | "wellness" | "upcoming"> = {
    pto: {
      title: "PTO balance",
      value: `${vacation}h`,
      hint: `Vacation · ${sick}h sick · ${personal}h personal${pendingMine ? ` · ${pendingMine} pending` : ""}`,
      href: "/dashboard/time-off",
      hrefLabel: "Request time off →",
    },
    pay: {
      title: "Latest pay stub",
      value: money(latest.net),
      hint: `${latest.period} · paid ${latest.payDate}`,
      href: "/dashboard/pay",
      hrefLabel: "View pay →",
    },
    upcoming: "upcoming",
    wellness: "wellness",
    pendingLeave: {
      title: "Pending leave",
      value: String(pendingLeaveForRole(state.timeOff, state.workflows, role).length),
      hint: "Waiting on your workflow step",
      href: "/dashboard/calendar",
    },
    pendingExpenses: {
      title: "Pending expenses",
      value: String(
        pendingExpensesForRole(state.expenses, state.workflows, role).length,
      ),
      href: "/dashboard/expenses",
    },
    team: {
      title: "Direct reports",
      value: String(getDirectReports(workerId).length),
      href: "/dashboard/team",
    },
    headcount: {
      title: "Headcount",
      value: String(WORKERS.length),
      href: "/dashboard/reports",
    },
    openJobs: {
      title: "Open jobs",
      value: String(state.jobs.filter((j) => j.status === "Open").length),
      href: "/dashboard/recruiting",
    },
    offboarding: {
      title: "Offboarding",
      value: String(state.offboarding.filter((p) => p.status === "Open").length),
      href: "/dashboard/offboarding",
    },
    pulse: {
      title: "Pulse responses",
      value: String(state.pulseResponses.length),
      href: "/dashboard/pulse/insights",
    },
    closeTasks: {
      title: "Close tasks open",
      value: String(state.closeTasks.filter((t) => !t.done).length),
      href: "/dashboard/close",
    },
    insights: {
      title: "Beacon Insights",
      value: String(WORKERS.length),
      hint: "People · talent · time · money",
      href: "/dashboard/insights",
      hrefLabel: "Open insights →",
    },
    learning: {
      title: "Learning",
      value: String(
        state.learnAssignments.filter(
          (a) => a.workerId === workerId && a.status !== "Completed",
        ).length,
      ),
      hint: `${state.learnAssignments.filter((a) => a.workerId === workerId && isOverdue(a)).length} overdue`,
      href: "/dashboard/learning",
      hrefLabel: "Open learning →",
    },
  };

  function togglePin(id: HomeWidgetId) {
    const next = pins.includes(id) ? pins.filter((p) => p !== id) : [...pins, id];
    setHomePins(role, next.slice(0, 6));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)] sm:text-3xl">
            Welcome, {session?.user.name ?? "there"}
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Northstar Labs · {role.replace("_", " ")} home.
            {session?.ssoDemo ? " · Signed in via SSO theater." : ""}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => setEdit((v) => !v)}
        >
          {edit ? "Done" : "Pin widgets"}
        </Button>
      </div>

      {edit ? (
        <fieldset className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <legend className="px-1 text-sm font-semibold">Widgets for this role</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {HOME_WIDGET_META.map((w) => (
              <label key={w.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pins.includes(w.id)}
                  onChange={() => togglePin(w.id)}
                />
                {w.label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {pins.map((id) => {
          const spec = values[id];
          if (spec === "upcoming") {
            return (
              <section
                key={id}
                className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 sm:col-span-2"
              >
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                  Upcoming
                </h2>
                {events.length === 0 ? (
                  <p className="mt-3 text-sm text-[var(--fg-muted)]">
                    No upcoming items.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {events.slice(0, 3).map((ev) => (
                      <li
                        key={ev.id}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span>{ev.title}</span>
                        <span className="shrink-0 tabular-nums text-[var(--fg-muted)]">
                          {ev.date}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          }
          if (spec === "wellness") {
            return (
              <section
                key={id}
                className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 sm:col-span-2"
              >
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                  Wellness
                </h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {wellnessTips(benefits, events)
                    .slice(0, 2)
                    .map((t) => (
                      <li key={t.id}>{t.body}</li>
                    ))}
                </ul>
              </section>
            );
          }
          return (
            <Card
              key={id}
              title={spec.title}
              value={spec.value}
              hint={spec.hint}
              href={spec.href}
              hrefLabel={spec.hrefLabel}
            />
          );
        })}
      </div>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
          Quick actions
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/dashboard/time-off">Request time off</Link>
          </Button>
          {role === "manager" || role === "hr_admin" || role === "finance" ? (
            <Button asChild size="sm" variant="secondary">
              <Link href="/dashboard/reports">Reports</Link>
            </Button>
          ) : null}
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/marketplace">Apps</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/pulse">Beacon Pulse</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
