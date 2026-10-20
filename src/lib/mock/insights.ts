import type { DemoRole } from "@/lib/mock/org";
import { DEPARTMENTS, LOCATIONS, WORKERS } from "@/lib/mock/org";
import type { Expense, PlanningScenario, PurchaseRequest } from "@/lib/mock/money";
import { SEED_CATALOG, SEED_PLANNING, scenarioRows } from "@/lib/mock/money";
import {
  CANDIDATE_STAGES,
  type Candidate,
  type JobReq,
} from "@/lib/mock/talent";
import {
  timesheetTotal,
  type TimeException,
  type Timesheet,
} from "@/lib/mock/workforce";

export const INSIGHT_BOARDS = ["people", "talent", "time", "money"] as const;
export type InsightBoard = (typeof INSIGHT_BOARDS)[number];

export function defaultInsightBoard(role: DemoRole): InsightBoard {
  if (role === "finance") return "money";
  if (role === "manager") return "talent";
  if (role === "hr_admin") return "people";
  return "time";
}

export function canSeeInsightBoard(role: DemoRole, board: InsightBoard) {
  if (board === "talent") return role === "manager" || role === "hr_admin";
  if (board === "money")
    return role === "finance" || role === "hr_admin" || role === "manager";
  return true;
}

export function peopleByDepartment() {
  return DEPARTMENTS.map((d) => ({
    label: d.name,
    count: WORKERS.filter((w) => w.departmentId === d.id).length,
  }));
}

export function peopleByLocation() {
  return LOCATIONS.map((l) => ({
    label: l.name,
    count: WORKERS.filter((w) => w.locationId === l.id).length,
  }));
}

export function managerSpans() {
  const managers = WORKERS.filter((w) =>
    WORKERS.some((r) => r.managerId === w.id),
  );
  return managers
    .map((m) => ({
      label: m.name,
      count: WORKERS.filter((w) => w.managerId === m.id).length,
    }))
    .sort((a, b) => b.count - a.count);
}

export function talentFunnel(candidates: Candidate[]) {
  return CANDIDATE_STAGES.map((stage) => ({
    label: stage,
    count: candidates.filter((c) => c.stage === stage).length,
  }));
}

export function openReqLoad(jobs: JobReq[]) {
  return jobs
    .filter((j) => j.status === "Open")
    .map((j) => ({
      label: j.title,
      count: j.headcount,
    }));
}

export function timeOps(timesheets: Timesheet[], exceptions: TimeException[]) {
  const overtime = timesheets.filter((t) => timesheetTotal(t) > 40).length;
  const drafts = timesheets.filter((t) => t.status === "Draft").length;
  const openEx = exceptions.filter((e) => !e.resolved).length;
  return { overtime, drafts, openEx, sheets: timesheets.length };
}

export function moneyVsPlan(
  scenario: PlanningScenario,
  expenses: Expense[],
  purchases: PurchaseRequest[],
) {
  const rows = scenarioRows(SEED_PLANNING, scenario);
  const planSpend = rows.reduce((s, r) => s + r.planSpend, 0);
  const actualSpend = rows.reduce((s, r) => s + r.actualSpend, 0);
  const planHc = rows.reduce((s, r) => s + r.planHeadcount, 0);
  const actualHc = rows.reduce((s, r) => s + r.actualHeadcount, 0);
  const pendingExp = expenses
    .filter((e) => e.status === "Submitted")
    .reduce((s, e) => s + e.amount, 0);
  const openPo = purchases
    .filter((p) => p.status === "Requested" || p.status === "Approved")
    .reduce((s, p) => {
      const item = SEED_CATALOG.find((c) => c.id === p.itemId);
      return s + p.qty * (item?.unitPrice ?? 0);
    }, 0);
  return { rows, planSpend, actualSpend, planHc, actualHc, pendingExp, openPo };
}

export function spendByCategory(expenses: Expense[]) {
  const map = new Map<string, number>();
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  }
  return [...map.entries()].map(([label, amount]) => ({ label, amount }));
}

export function insightSnapshot(input: {
  candidates: Candidate[];
  jobs: JobReq[];
  timesheets: Timesheet[];
  exceptions: TimeException[];
  expenses: Expense[];
  purchases: PurchaseRequest[];
  scenario: PlanningScenario;
}) {
  const people = peopleByDepartment();
  const time = timeOps(input.timesheets, input.exceptions);
  const money = moneyVsPlan(input.scenario, input.expenses, input.purchases);
  return {
    headcount: WORKERS.length,
    departments: people.length,
    openJobs: input.jobs.filter((j) => j.status === "Open").length,
    pipeline: input.candidates.length,
    drafts: time.drafts,
    overtime: time.overtime,
    exceptions: time.openEx,
    spendVariance: money.actualSpend - money.planSpend,
    pendingExp: money.pendingExp,
  };
}
