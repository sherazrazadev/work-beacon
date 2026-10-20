"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { wellnessTips } from "@/lib/mock/pulse";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function HomeWidgets() {
  const { session } = useAuth();
  const { ready, payStubs, events, benefits, state, leaveBalancesFor } =
    useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const balances = leaveBalancesFor(workerId);
  const vacation =
    balances.find((b) => b.type === "Vacation")?.remaining ?? 0;
  const sick = balances.find((b) => b.type === "Sick")?.remaining ?? 0;
  const personal =
    balances.find((b) => b.type === "Personal")?.remaining ?? 0;
  const latest = payStubs[0];
  const pending = state.timeOff.filter(
    (t) =>
      t.status === "Pending" && (!t.workerId || t.workerId === workerId),
  ).length;

  if (!ready) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)] sm:text-3xl">
          Welcome, {session?.user.name ?? "there"}
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Northstar Labs ·{" "}
          {session?.user.role?.replace("_", " ") ?? "employee"} home — mock
          data for demos.
          {session?.ssoDemo ? " · Signed in via SSO theater." : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            PTO balance
          </h2>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--accent)]">
            {vacation}h
          </p>
          <p className="mt-1 text-xs text-[var(--fg-muted)]">
            Vacation · {sick}h sick · {personal}h personal
            {pending ? ` · ${pending} pending` : ""}
          </p>
          <Link
            href="/dashboard/time-off"
            className="mt-3 inline-block text-sm text-[var(--accent)]"
          >
            Request time off →
          </Link>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Latest pay stub
          </h2>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--fg)]">
            {money(latest.net)}
          </p>
          <p className="mt-1 text-xs text-[var(--fg-muted)]">
            {latest.period} · paid {latest.payDate}
          </p>
          <Link
            href="/dashboard/pay"
            className="mt-3 inline-block text-sm text-[var(--accent)]"
          >
            View pay →
          </Link>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:col-span-2 xl:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Upcoming
          </h2>
          <ul className="mt-3 space-y-2">
            {events.slice(0, 3).map((ev) => (
              <li
                key={ev.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="text-[var(--fg)]">{ev.title}</span>
                <span className="shrink-0 text-[var(--fg-muted)]">{ev.date}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--fg)]">
          Wellness & benefits
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {wellnessTips(benefits, events).map((tip) => (
            <li
              key={tip.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                {tip.title}
              </p>
              <p className="mt-2 text-sm">{tip.body}</p>
              <Link
                href={tip.href}
                className="mt-2 inline-block text-sm text-[var(--accent)]"
              >
                Open benefits →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--fg)]">
          Quick actions
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/dashboard/time-off">Request time off</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/timesheets">Timesheet</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/schedule">My shifts</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/onboarding">Onboarding</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/pay">Open pay stubs</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/expenses">Expenses</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/pulse">Beacon Pulse</Link>
          </Button>
          {session?.user.role === "finance" ? (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link href="/dashboard/ledger">Ledger</Link>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <Link href="/dashboard/planning">Beacon Planning</Link>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <Link href="/dashboard/close">Close</Link>
              </Button>
            </>
          ) : null}
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/benefits">Benefits</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/learning">Learning</Link>
          </Button>
          {session?.user.role === "manager" ||
          session?.user.role === "hr_admin" ? (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link href="/dashboard/recruiting">Recruiting</Link>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <Link href="/dashboard/exceptions">Exceptions</Link>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <Link href="/dashboard/pulse/insights">Pulse insights</Link>
              </Button>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
