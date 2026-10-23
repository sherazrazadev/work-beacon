import {
  ApprovalItem,
  NotificationItem,
  ProfileData,
  SEED_APPROVALS,
  SEED_NOTIFICATIONS,
  SEED_PROFILE,
  SEED_TIME_OFF,
  TimeOffRequest,
  PayStub,
} from "@/lib/mock/data";
import {
  InboxTask,
  SEED_INBOX,
  SEED_VAULT_DOCS,
  VaultDoc,
} from "@/lib/mock/org";
import {
  Punch,
  SEED_EXCEPTIONS,
  SEED_PUNCHES,
  SEED_SHIFTS,
  SEED_TEAM_LEAVE,
  SEED_TIMESHEETS,
  Shift,
  TimeException,
  Timesheet,
} from "@/lib/mock/workforce";
import {
  Candidate,
  GoalRating,
  JobReq,
  OffboardingPlan,
  OnboardingPlan,
  PeerFeedback,
  SEED_CANDIDATES,
  SEED_FEEDBACK,
  SEED_GOAL_RATINGS,
  SEED_JOBS,
  SEED_OFFBOARDING,
  SEED_ONBOARDING,
  SEED_SKILLS,
  SEED_SUCCESSION,
  SkillTag,
  SuccessionBox,
} from "@/lib/mock/talent";
import {
  BankAccount,
  CloseTask,
  Expense,
  Journal,
  PlanningScenario,
  PurchaseRequest,
  SEED_BANKS,
  SEED_CLOSE,
  SEED_EXPENSES,
  SEED_JOURNALS,
  SEED_PURCHASES,
} from "@/lib/mock/money";
import {
  AgentAuditEntry,
  PulseActionPlan,
  PulseResponse,
  SEED_AGENT_AUDIT,
  SEED_PULSE_PLANS,
  SEED_PULSE_RESPONSES,
} from "@/lib/mock/pulse";
import {
  DEMO_API_KEY_DEFAULT,
  DEFAULT_HOME_PINS,
  HomeWidgetId,
  ProcessEvent,
  SEED_PROCESS_EVENTS,
  SEED_WORKFLOWS,
  WorkflowDef,
} from "@/lib/mock/platform";
import {
  BenefitElection,
  CompWorksheet,
  ContingentWorker,
  Delegation,
  HrCase,
  InternalApplication,
  SEED_CASES,
  SEED_COMP,
  SEED_CONTINGENT,
  SEED_DELEGATIONS,
  SEED_ELECTIONS,
  SEED_INTERNAL_APPS,
} from "@/lib/mock/people-ops";
import {
  AccessRequest,
  Eligibility,
  ItAsset,
  OrgMove,
  Position,
  SEED_ACCESS,
  SEED_ASSETS,
  SEED_ELIGIBILITY,
  SEED_MOVES,
  SEED_POSITIONS,
} from "@/lib/mock/org-ops";
import {
  Garnishment,
  OffCyclePay,
  PayRun,
  RetroAdjustment,
  SEED_EXTRA_STUBS,
  SEED_GARNISHMENTS,
  SEED_OFF_CYCLE,
  SEED_PAYROLL_RUNS,
  SEED_RETRO,
} from "@/lib/mock/payroll";
import type { InsightBoard } from "@/lib/mock/insights";
import {
  LearnAssignment,
  LearnCertificate,
  SEED_LEARN_ASSIGNMENTS,
  SEED_LEARN_CERTS,
} from "@/lib/mock/learn";
import type { DemoRole } from "@/lib/mock/org";


export type FeatureFlags = {
  agentEnabled: boolean;
  marketplaceEnabled: boolean;
  slowDashboard: boolean;
};

export type MockStoreState = {
  timeOff: TimeOffRequest[];
  profile: ProfileData;
  notifications: NotificationItem[];
  approvals: ApprovalItem[];
  /** @deprecated use auth persona role; kept for migrate */
  managerMode: boolean;
  inbox: InboxTask[];
  documents: VaultDoc[];
  featureFlags: FeatureFlags;
  timesheets: Timesheet[];
  punches: Punch[];
  shifts: Shift[];
  exceptions: TimeException[];
  jobs: JobReq[];
  candidates: Candidate[];
  onboarding: OnboardingPlan[];
  offboarding: OffboardingPlan[];
  skills: SkillTag[];
  succession: SuccessionBox[];
  goalRatings: GoalRating[];
  feedback: PeerFeedback[];
  banks: BankAccount[];
  expenses: Expense[];
  purchases: PurchaseRequest[];
  journals: Journal[];
  closeTasks: CloseTask[];
  planningScenario: PlanningScenario;
  pulseResponses: PulseResponse[];
  pulsePlans: PulseActionPlan[];
  agentAudit: AgentAuditEntry[];
  workflows: WorkflowDef[];
  processEvents: ProcessEvent[];
  connectedIntegrations: string[];
  installedApps: string[];
  homePins: Partial<Record<DemoRole, HomeWidgetId[]>>;
  demoApiKey: string;
  retentionDays: number;
  hrCases: HrCase[];
  delegations: Delegation[];
  compWorksheets: CompWorksheet[];
  internalApps: InternalApplication[];
  elections: BenefitElection[];
  contingent: ContingentWorker[];
  positions: Position[];
  orgMoves: OrgMove[];
  assets: ItAsset[];
  accessRequests: AccessRequest[];
  eligibility: Eligibility[];
  payrollRuns: PayRun[];
  garnishments: Garnishment[];
  offCyclePays: OffCyclePay[];
  retroAdjustments: RetroAdjustment[];
  extraPayStubs: PayStub[];
  insightView: InsightBoard | null;
  learnAssignments: LearnAssignment[];
  learnCertificates: LearnCertificate[];
};

export function defaultMockStore(): MockStoreState {
  return {
    timeOff: [...SEED_TIME_OFF, ...SEED_TEAM_LEAVE],
    profile: { ...SEED_PROFILE },
    notifications: SEED_NOTIFICATIONS.map((n) => ({ ...n })),
    approvals: SEED_APPROVALS.map((a) => ({ ...a })),
    managerMode: false,
    inbox: SEED_INBOX.map((t) => ({ ...t })),
    documents: SEED_VAULT_DOCS.map((d) => ({ ...d })),
    featureFlags: {
      agentEnabled: true,
      marketplaceEnabled: true,
      slowDashboard: false,
    },
    timesheets: SEED_TIMESHEETS.map((t) => ({
      ...t,
      days: t.days.map((d) => ({ ...d })),
    })),
    punches: SEED_PUNCHES.map((p) => ({ ...p })),
    shifts: SEED_SHIFTS.map((s) => ({ ...s })),
    exceptions: SEED_EXCEPTIONS.map((e) => ({ ...e })),
    jobs: SEED_JOBS.map((j) => ({ ...j })),
    candidates: SEED_CANDIDATES.map((c) => ({ ...c })),
    onboarding: SEED_ONBOARDING.map((p) => ({
      ...p,
      tasks: p.tasks.map((t) => ({ ...t })),
    })),
    offboarding: SEED_OFFBOARDING.map((p) => ({
      ...p,
      tasks: p.tasks.map((t) => ({ ...t })),
    })),
    skills: SEED_SKILLS.map((s) => ({ ...s, tags: [...s.tags] })),
    succession: SEED_SUCCESSION.map((s) => ({
      ...s,
      readyNow: [...s.readyNow],
      ready1yr: [...s.ready1yr],
    })),
    goalRatings: SEED_GOAL_RATINGS.map((g) => ({ ...g })),
    feedback: SEED_FEEDBACK.map((f) => ({ ...f })),
    banks: SEED_BANKS.map((b) => ({ ...b })),
    expenses: SEED_EXPENSES.map((e) => ({ ...e })),
    purchases: SEED_PURCHASES.map((p) => ({ ...p })),
    journals: SEED_JOURNALS.map((j) => ({
      ...j,
      lines: j.lines.map((l) => ({ ...l })),
    })),
    closeTasks: SEED_CLOSE.map((t) => ({ ...t })),
    planningScenario: "baseline",
    pulseResponses: SEED_PULSE_RESPONSES.map((r) => ({
      ...r,
      scores: { ...r.scores },
    })),
    pulsePlans: SEED_PULSE_PLANS.map((p) => ({ ...p })),
    agentAudit: SEED_AGENT_AUDIT.map((a) => ({ ...a })),
    workflows: SEED_WORKFLOWS.map((w) => ({
      ...w,
      steps: w.steps.map((s) => ({ ...s })),
    })),
    processEvents: SEED_PROCESS_EVENTS.map((e) => ({ ...e })),
    connectedIntegrations: [],
    installedApps: [],
    homePins: {
      employee: [...DEFAULT_HOME_PINS.employee],
      manager: [...DEFAULT_HOME_PINS.manager],
      hr_admin: [...DEFAULT_HOME_PINS.hr_admin],
      finance: [...DEFAULT_HOME_PINS.finance],
    },
    demoApiKey: DEMO_API_KEY_DEFAULT,
    retentionDays: 2555,
    hrCases: SEED_CASES.map((c) => ({ ...c })),
    delegations: SEED_DELEGATIONS.map((d) => ({ ...d })),
    compWorksheets: SEED_COMP.map((w) => ({ ...w })),
    internalApps: SEED_INTERNAL_APPS.map((a) => ({ ...a })),
    elections: SEED_ELECTIONS.map((e) => ({ ...e })),
    contingent: SEED_CONTINGENT.map((c) => ({ ...c })),
    positions: SEED_POSITIONS.map((p) => ({ ...p })),
    orgMoves: SEED_MOVES.map((m) => ({ ...m })),
    assets: SEED_ASSETS.map((a) => ({ ...a })),
    accessRequests: SEED_ACCESS.map((a) => ({ ...a })),
    eligibility: SEED_ELIGIBILITY.map((e) => ({ ...e, docs: [...e.docs] })),
    payrollRuns: SEED_PAYROLL_RUNS.map((r) => ({
      ...r,
      results: r.results.map((x) => ({ ...x })),
    })),
    garnishments: SEED_GARNISHMENTS.map((g) => ({ ...g })),
    offCyclePays: SEED_OFF_CYCLE.map((o) => ({ ...o })),
    retroAdjustments: SEED_RETRO.map((r) => ({ ...r })),
    extraPayStubs: SEED_EXTRA_STUBS.map((s) => ({
      ...s,
      earnings: s.earnings.map((l) => ({ ...l })),
      taxLines: s.taxLines.map((l) => ({ ...l })),
      deductionLines: s.deductionLines.map((l) => ({ ...l })),
    })),
    insightView: null,
    learnAssignments: SEED_LEARN_ASSIGNMENTS.map((a) => ({ ...a })),
    learnCertificates: SEED_LEARN_CERTS.map((c) => ({ ...c })),
  };
}
