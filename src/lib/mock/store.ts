import {
  ApprovalItem,
  NotificationItem,
  ProfileData,
  SEED_APPROVALS,
  SEED_NOTIFICATIONS,
  SEED_PROFILE,
  SEED_TIME_OFF,
  TimeOffRequest,
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

const KEY = "work-beacon-mock-store";

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
  };
}

export function readMockStore(): MockStoreState {
  if (typeof window === "undefined") return defaultMockStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultMockStore();
    const parsed = JSON.parse(raw) as Partial<MockStoreState>;
    const base = defaultMockStore();
    return {
      timeOff: parsed.timeOff ?? base.timeOff,
      profile: { ...base.profile, ...parsed.profile },
      notifications: parsed.notifications ?? base.notifications,
      approvals: parsed.approvals ?? base.approvals,
      managerMode: parsed.managerMode ?? false,
      inbox: parsed.inbox ?? base.inbox,
      documents: parsed.documents ?? base.documents,
      featureFlags: { ...base.featureFlags, ...parsed.featureFlags },
      timesheets: parsed.timesheets ?? base.timesheets,
      punches: parsed.punches ?? base.punches,
      shifts: parsed.shifts ?? base.shifts,
      exceptions: parsed.exceptions ?? base.exceptions,
      jobs: parsed.jobs ?? base.jobs,
      candidates: parsed.candidates ?? base.candidates,
      onboarding: parsed.onboarding ?? base.onboarding,
      offboarding: parsed.offboarding ?? base.offboarding,
      skills: parsed.skills ?? base.skills,
      succession: parsed.succession ?? base.succession,
      goalRatings: parsed.goalRatings ?? base.goalRatings,
      feedback: parsed.feedback ?? base.feedback,
      banks: parsed.banks ?? base.banks,
      expenses: parsed.expenses ?? base.expenses,
      purchases: parsed.purchases ?? base.purchases,
      journals: parsed.journals ?? base.journals,
      closeTasks: parsed.closeTasks ?? base.closeTasks,
      planningScenario: parsed.planningScenario ?? base.planningScenario,
      pulseResponses: parsed.pulseResponses ?? base.pulseResponses,
      pulsePlans: parsed.pulsePlans ?? base.pulsePlans,
      agentAudit: parsed.agentAudit ?? base.agentAudit,
    };
  } catch {
    return defaultMockStore();
  }
}

export function writeMockStore(state: MockStoreState) {
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearMockStore() {
  window.localStorage.removeItem(KEY);
}
