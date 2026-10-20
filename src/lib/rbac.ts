import type { DemoRole } from "@/lib/mock/org";

/** Path prefixes that require at least one of the listed roles. */
export const ROUTE_ROLES: { prefix: string; roles: DemoRole[] }[] = [
  { prefix: "/dashboard/admin", roles: ["hr_admin"] },
  { prefix: "/dashboard/team", roles: ["manager", "hr_admin"] },
  { prefix: "/dashboard/exceptions", roles: ["manager", "hr_admin"] },
  { prefix: "/dashboard/recruiting", roles: ["manager", "hr_admin"] },
  { prefix: "/dashboard/offboarding", roles: ["manager", "hr_admin"] },
  { prefix: "/dashboard/succession", roles: ["hr_admin"] },
  { prefix: "/dashboard/ledger", roles: ["finance"] },
  { prefix: "/dashboard/planning", roles: ["finance"] },
  { prefix: "/dashboard/close", roles: ["finance"] },
  { prefix: "/dashboard/pulse/insights", roles: ["manager", "hr_admin"] },
];

export function rolesAllowedForPath(pathname: string): DemoRole[] | null {
  const hit = ROUTE_ROLES.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`),
  );
  return hit ? hit.roles : null;
}

export function canAccessPath(role: DemoRole, pathname: string): boolean {
  const needed = rolesAllowedForPath(pathname);
  if (!needed) return true;
  return needed.includes(role);
}

export function navForRole(role: DemoRole) {
  const base = [
    { href: "/dashboard", label: "Home", exact: true },
    { href: "/dashboard/inbox", label: "Inbox", exact: false },
    { href: "/dashboard/directory", label: "Directory", exact: false },
    { href: "/dashboard/org", label: "Org chart", exact: false },
    { href: "/dashboard/time-off", label: "Time Off", exact: false },
    { href: "/dashboard/calendar", label: "Calendar", exact: false },
    { href: "/dashboard/timesheets", label: "Timesheets", exact: false },
    { href: "/dashboard/clock", label: "Clock", exact: false },
    { href: "/dashboard/schedule", label: "Schedule", exact: false },
    { href: "/dashboard/pay", label: "Pay", exact: false },
    { href: "/dashboard/expenses", label: "Expenses", exact: false },
    { href: "/dashboard/procurement", label: "Procurement", exact: false },
    { href: "/dashboard/benefits", label: "Benefits", exact: false },
    { href: "/dashboard/pulse", label: "Pulse", exact: true },
    { href: "/dashboard/onboarding", label: "Onboarding", exact: false },
    { href: "/dashboard/performance", label: "Performance", exact: false },
    { href: "/dashboard/learning", label: "Learning", exact: false },
    { href: "/dashboard/documents", label: "Documents", exact: false },
    { href: "/dashboard/profile", label: "Profile", exact: false },
    { href: "/dashboard/notifications", label: "Notifications", exact: false },
  ];

  const extra: { href: string; label: string; exact: boolean }[] = [];
  if (role === "manager" || role === "hr_admin") {
    extra.push({ href: "/dashboard/team", label: "My Team", exact: false });
    extra.push({
      href: "/dashboard/exceptions",
      label: "Exceptions",
      exact: false,
    });
    extra.push({
      href: "/dashboard/recruiting",
      label: "Recruiting",
      exact: false,
    });
    extra.push({
      href: "/dashboard/offboarding",
      label: "Offboarding",
      exact: false,
    });
    extra.push({
      href: "/dashboard/pulse/insights",
      label: "Pulse insights",
      exact: false,
    });
  }
  if (role === "hr_admin") {
    extra.push({
      href: "/dashboard/succession",
      label: "Succession",
      exact: false,
    });
    extra.push({ href: "/dashboard/admin", label: "Admin", exact: false });
  }
  if (role === "finance") {
    extra.push({ href: "/dashboard/ledger", label: "Ledger", exact: false });
    extra.push({ href: "/dashboard/planning", label: "Planning", exact: false });
    extra.push({ href: "/dashboard/close", label: "Close", exact: false });
  }
  return [...base, ...extra];
}
