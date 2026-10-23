import type { DemoRole } from "@/lib/mock/org";
import { DEPARTMENTS, WORKERS } from "@/lib/mock/org";
import type { TimeOffRequest } from "@/lib/mock/data";
import { SEED_PAY_STUBS } from "@/lib/mock/data";
import type { Expense } from "@/lib/mock/money";
import type { OffboardingPlan } from "@/lib/mock/talent";
import { WF_TODAY } from "@/lib/mock/workforce";
import { daysUntil } from "@/lib/mock/pulse";

export type WorkflowKind = "leave" | "expense";

export type WorkflowStep = {
  id: string;
  role: DemoRole;
  label: string;
};

export type WorkflowDef = {
  id: WorkflowKind;
  name: string;
  steps: WorkflowStep[];
};

export type ProcessEventKind = "hired" | "paid" | "approved" | "terminated";

export type ProcessEvent = {
  id: string;
  at: string;
  kind: ProcessEventKind;
  title: string;
  detail: string;
  actorRole?: DemoRole;
};

export type IntegrationDef = {
  id: string;
  name: string;
  kind: string;
  blurb: string;
};

export type InstallableApp = {
  id: string;
  name: string;
  navLabel: string;
  href: string;
  blurb: string;
};

export type HomeWidgetId =
  | "pto"
  | "pay"
  | "upcoming"
  | "wellness"
  | "pendingLeave"
  | "pendingExpenses"
  | "team"
  | "headcount"
  | "openJobs"
  | "offboarding"
  | "pulse"
  | "closeTasks"
  | "insights"
  | "learning";

export const HOME_WIDGET_META: { id: HomeWidgetId; label: string }[] = [
  { id: "pto", label: "PTO balance" },
  { id: "pay", label: "Latest pay" },
  { id: "upcoming", label: "Upcoming" },
  { id: "wellness", label: "Wellness" },
  { id: "pendingLeave", label: "Pending leave" },
  { id: "pendingExpenses", label: "Pending expenses" },
  { id: "team", label: "Team size" },
  { id: "headcount", label: "Headcount" },
  { id: "openJobs", label: "Open jobs" },
  { id: "offboarding", label: "Offboarding" },
  { id: "pulse", label: "Pulse responses" },
  { id: "closeTasks", label: "Close tasks" },
  { id: "insights", label: "Insights" },
  { id: "learning", label: "Learning" },
];

export const DEFAULT_HOME_PINS: Record<DemoRole, HomeWidgetId[]> = {
  employee: ["pto", "pay", "upcoming", "learning"],
  manager: ["pendingLeave", "pendingExpenses", "team", "insights"],
  hr_admin: ["headcount", "openJobs", "insights", "pulse"],
  finance: ["pendingExpenses", "closeTasks", "insights", "upcoming"],
};

export const SEED_WORKFLOWS: WorkflowDef[] = [
  {
    id: "leave",
    name: "Leave approval",
    steps: [
      { id: "lv-1", role: "manager", label: "Manager" },
      { id: "lv-2", role: "hr_admin", label: "People" },
    ],
  },
  {
    id: "expense",
    name: "Expense approval",
    steps: [
      { id: "ex-1", role: "manager", label: "Manager" },
      { id: "ex-2", role: "finance", label: "Finance" },
    ],
  },
];

export const SEED_PROCESS_EVENTS: ProcessEvent[] = [
  {
    id: "pe-1",
    at: "2026-09-02T14:00:00.000Z",
    kind: "hired",
    title: "Alex Rivera hired",
    detail: "Engineering · Software Engineer",
  },
  {
    id: "pe-2",
    at: "2026-10-15T16:00:00.000Z",
    kind: "paid",
    title: "Payroll posted",
    detail: "Oct 1–15, 2026 register",
  },
  {
    id: "pe-3",
    at: "2026-10-08T11:20:00.000Z",
    kind: "approved",
    title: "Leave approved",
    detail: "Casey Nguyen · Vacation (historical)",
    actorRole: "manager",
  },
];

export const INTEGRATION_CATALOG: IntegrationDef[] = [
  {
    id: "slack",
    name: "Slack",
    kind: "Chat",
    blurb: "Post approval notices to a channel.",
  },
  {
    id: "idp",
    name: "Company IdP",
    kind: "Identity",
    blurb: "SSO theater already on login.",
  },
  {
    id: "ats",
    name: "Inbound ATS",
    kind: "Talent",
    blurb: "Pull candidates into Recruiting.",
  },
  {
    id: "bank",
    name: "Payroll bank",
    kind: "Money",
    blurb: "NACHA-style file stub.",
  },
];

export const INSTALLABLE_APPS: InstallableApp[] = [
  {
    id: "shift-swap",
    name: "Shift Swap",
    navLabel: "Shift Swap",
    href: "/dashboard/apps/shift-swap",
    blurb: "Associates propose a trade; manager confirms.",
  },
  {
    id: "kudos",
    name: "Kudos Wall",
    navLabel: "Kudos",
    href: "/dashboard/apps/kudos",
    blurb: "Public thanks for teammates.",
  },
];

export const DEMO_API_KEY_DEFAULT = "wb_live_demo_northstar";

export const ROLE_LABELS: Record<DemoRole, string> = {
  employee: "Employee",
  manager: "Manager",
  hr_admin: "HR Admin",
  finance: "Finance",
};

export function workflowById(
  workflows: WorkflowDef[],
  id: WorkflowKind,
): WorkflowDef {
  return workflows.find((w) => w.id === id) ?? SEED_WORKFLOWS[0];
}

export function workflowStep(wf: WorkflowDef, stepIndex = 0): WorkflowStep | null {
  if (wf.steps.length === 0) return null;
  const i = Math.min(Math.max(0, stepIndex), wf.steps.length - 1);
  return wf.steps[i];
}

export function canActOnStep(
  wf: WorkflowDef,
  stepIndex: number,
  role: DemoRole,
) {
  const step = workflowStep(wf, stepIndex);
  return Boolean(step && step.role === role);
}

export type AdvanceResult = {
  stepIndex: number;
  completed: boolean;
  denied: boolean;
};

export function advanceWorkflow(
  wf: WorkflowDef,
  stepIndex: number,
  decision: "Approved" | "Denied",
): AdvanceResult {
  if (decision === "Denied") {
    return { stepIndex, completed: false, denied: true };
  }
  const next = stepIndex + 1;
  if (next >= wf.steps.length) {
    return { stepIndex, completed: true, denied: false };
  }
  return { stepIndex: next, completed: false, denied: false };
}

export function newProcessEvent(
  kind: ProcessEventKind,
  title: string,
  detail: string,
  actorRole?: DemoRole,
): ProcessEvent {
  return {
    id: `pe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
    kind,
    title,
    detail,
    actorRole,
  };
}

export function downloadCsv(filename: string, rows: string[][]) {
  const body = rows
    .map((r) =>
      r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function headcountReport() {
  return DEPARTMENTS.map((d) => ({
    department: d.name,
    count: WORKERS.filter((w) => w.departmentId === d.id).length,
  }));
}

export function attritionReport(plans: OffboardingPlan[]) {
  return plans.map((p) => {
    const w = WORKERS.find((x) => x.id === p.workerId);
    return {
      worker: w?.name ?? p.workerId,
      status: p.status,
      initiatedBy: p.initiatedBy,
    };
  });
}

export function payrollRegister() {
  const stub = SEED_PAY_STUBS[0];
  return WORKERS.map((w) => ({
    worker: w.name,
    period: stub.period,
    gross: stub.gross,
    net: stub.net,
    payDate: stub.payDate,
  }));
}

export function expenseAgeReport(expenses: Expense[], asOf = WF_TODAY) {
  return expenses.map((e) => ({
    id: e.id,
    merchant: e.merchant,
    amount: e.amount,
    status: e.status,
    ageDays: Math.max(0, daysUntil(e.date, asOf)),
  }));
}

export function pendingLeaveForRole(
  requests: (TimeOffRequest & { stepIndex?: number })[],
  workflows: WorkflowDef[],
  role: DemoRole,
) {
  const wf = workflowById(workflows, "leave");
  return requests.filter(
    (r) =>
      r.status === "Pending" && canActOnStep(wf, r.stepIndex ?? 0, role),
  );
}

export function pendingExpensesForRole(
  expenses: (Expense & { stepIndex?: number })[],
  workflows: WorkflowDef[],
  role: DemoRole,
) {
  const wf = workflowById(workflows, "expense");
  return expenses.filter(
    (e) =>
      e.status === "Submitted" && canActOnStep(wf, e.stepIndex ?? 0, role),
  );
}
