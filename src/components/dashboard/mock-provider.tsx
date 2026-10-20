"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FeatureFlags,
  MockStoreState,
  ProfileData,
  TimeOffRequest,
  clearMockStore,
  defaultMockStore,
  hydrateMockStore,
  readMockStore,
  writeMockStore,
} from "@/lib/mock";
import {
  SEED_EVENTS,
  SEED_PAY_STUBS,
  SEED_BENEFITS,
  SEED_BENEFICIARIES,
  SEED_BENEFIT_DOCS,
  SEED_GOALS,
  SEED_CHECKINS,
  SEED_REVIEWS,
  SEED_COURSES,
  SEED_TEAM,
} from "@/lib/mock/data";
import type { DemoRole } from "@/lib/mock/org";
import type { CandidateStage, JobReq, Scorecard } from "@/lib/mock/talent";
import type {
  BankAccount,
  Expense,
  ExpenseStatus,
  Journal,
  PlanningScenario,
} from "@/lib/mock/money";
import { journalBalanced, nextPoNumber } from "@/lib/mock/money";
import {
  offboardingTemplate,
  onboardingInbox,
  onboardingTemplate,
} from "@/lib/mock/talent";
import {
  Punch,
  Timesheet,
  WF_TODAY,
  addDaysIso,
  allLeaveBalances,
  timesheetTotal,
  weekStartMonday,
} from "@/lib/mock/workforce";
import {
  PULSE_CAMPAIGN,
  PULSE_THEMES,
  hasSubmittedPulse,
  type PulseTheme,
} from "@/lib/mock/pulse";
import {
  HomeWidgetId,
  WorkflowDef,
  WorkflowKind,
  advanceWorkflow,
  newProcessEvent,
  workflowById,
} from "@/lib/mock/platform";
import { getWorker } from "@/lib/mock/org";
import type { InsightBoard } from "@/lib/mock/insights";
import {
  courseById,
  type LearnCertificate,
} from "@/lib/mock/learn";
import type {
  BenefitElection,
  CaseCategory,
  CaseStatus,
  Delegation,
  DelegationScope,
  HrCase,
  InternalApplication,
} from "@/lib/mock/people-ops";
import { workerName } from "@/lib/mock/people-ops";
import type {
  AccessApp,
  AccessRequest,
  EligibilityStatus,
  OrgMove,
  OrgMoveKind,
} from "@/lib/mock/org-ops";
import {
  calculateResults,
  resultToStub,
  SEED_PAY_PERIODS,
  type PayPeriod,
} from "@/lib/mock/payroll";

type MockContextValue = {
  ready: boolean;
  state: MockStoreState;
  pto: { vacationHours: number; sickHours: number; personalHours: number };
  payStubs: typeof SEED_PAY_STUBS;
  payPeriods: PayPeriod[];
  events: typeof SEED_EVENTS;
  benefits: typeof SEED_BENEFITS;
  beneficiaries: typeof SEED_BENEFICIARIES;
  benefitDocs: typeof SEED_BENEFIT_DOCS;
  goals: typeof SEED_GOALS;
  checkIns: typeof SEED_CHECKINS;
  reviews: typeof SEED_REVIEWS;
  courses: typeof SEED_COURSES;
  team: typeof SEED_TEAM;
  addTimeOff: (req: Omit<TimeOffRequest, "id" | "status">) => void;
  updateProfile: (patch: Partial<ProfileData>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setManagerMode: (on: boolean) => void;
  decideApproval: (id: string, status: "Approved" | "Pending") => void;
  completeInboxTask: (id: string) => void;
  setFeatureFlags: (patch: Partial<FeatureFlags>) => void;
  resetStore: () => void;
  inboxForRole: (role: DemoRole, workerId?: string) => MockStoreState["inbox"];
  openInboxCount: (role: DemoRole, workerId?: string) => number;
  addJob: (job: Omit<JobReq, "id" | "status">) => void;
  moveCandidate: (id: string, stage: CandidateStage) => void;
  saveScorecard: (id: string, scorecard: Scorecard) => void;
  attachOffer: (
    id: string,
    offer: { salary: number; startDate: string },
  ) => void;
  hireCandidate: (id: string) => boolean;
  completeOnboardingTask: (workerId: string, taskId: string) => void;
  startOffboarding: (workerId: string, initiatedBy: string) => void;
  toggleOffboardingTask: (planId: string, taskId: string) => void;
  rateGoal: (goalId: string, workerId: string, rating: number) => void;
  addFeedback: (fromWorkerId: string, toWorkerId: string, text: string) => void;
  addBank: (account: Omit<BankAccount, "id">) => void;
  removeBank: (id: string) => void;
  setPrimaryBank: (id: string) => void;
  addExpense: (
    expense: Omit<Expense, "id" | "status">,
  ) => Expense;
  decideExpense: (
    id: string,
    status: ExpenseStatus,
    role?: DemoRole,
  ) => void;
  requestPurchase: (itemId: string, qty: number, requestedBy: string) => void;
  approvePurchase: (id: string) => void;
  issuePurchaseOrder: (id: string) => string | null;
  addJournalDraft: (journal: Omit<Journal, "id" | "status">) => boolean;
  toggleCloseTask: (id: string) => void;
  setPlanningScenario: (scenario: PlanningScenario) => void;
  leaveBalancesFor: (workerId: string) => ReturnType<typeof allLeaveBalances>;
  saveTimesheet: (sheet: Timesheet) => void;
  submitTimesheet: (id: string) => boolean;
  submitLastDraftTimesheet: (workerId: string) => Timesheet | null;
  approveTimesheet: (id: string) => void;
  addPunch: (workerId: string, kind: Punch["kind"]) => void;
  publishShifts: () => void;
  resolveException: (id: string) => void;
  decideTimeOff: (
    id: string,
    status: TimeOffRequest["status"],
    role?: DemoRole,
  ) => void;
  submitPulse: (workerId: string, scores: Record<string, number>) => boolean;
  createPulsePlan: (theme: string) => string | null;
  appendAgentAudit: (entry: {
    personaId: string;
    role: DemoRole;
    toolId: string;
    prompt: string;
    source: "rules" | "llm";
  }) => void;
  clearAgentAudit: () => void;
  setWorkflow: (kind: WorkflowKind, steps: WorkflowDef["steps"]) => void;
  toggleIntegration: (id: string) => void;
  toggleApp: (id: string) => void;
  setHomePins: (role: DemoRole, pins: HomeWidgetId[]) => void;
  setInsightView: (board: InsightBoard) => void;
  startLearnAssignment: (id: string) => boolean;
  completeLearnAssignment: (id: string) => LearnCertificate | null;
  assignLearnCourse: (
    workerId: string,
    courseId: string,
    due: string,
  ) => string | null;
  rotateDemoApiKey: () => string;
  setRetentionDays: (days: number) => void;
  addHrCase: (input: {
    workerId: string;
    category: CaseCategory;
    subject: string;
    body: string;
  }) => HrCase;
  setCaseStatus: (id: string, status: CaseStatus) => void;
  addDelegation: (input: {
    fromWorkerId: string;
    toWorkerId: string;
    scope: DelegationScope;
    end: string;
  }) => Delegation | null;
  setCompProposed: (id: string, proposed: number) => void;
  submitComp: (id: string) => boolean;
  applyInternal: (workerId: string, jobId: string) => InternalApplication | null;
  withdrawInternal: (id: string) => void;
  saveElection: (election: BenefitElection) => void;
  requestMove: (input: {
    kind: OrgMoveKind;
    workerId: string;
    fromTitle: string;
    toTitle: string;
    toDepartmentId: string;
  }) => OrgMove;
  decideMove: (id: string, status: "Approved" | "Denied") => void;
  assignAsset: (id: string, workerId: string) => void;
  returnAsset: (id: string) => void;
  requestAccess: (input: {
    workerId: string;
    app: AccessApp;
    roleLabel: string;
  }) => AccessRequest | null;
  decideAccess: (id: string, status: "Approved" | "Denied") => void;
  saveEligibility: (input: {
    workerId: string;
    status: EligibilityStatus;
    docs: string[];
  }) => void;
  calculatePayRun: (id: string) => boolean;
  completePayRun: (id: string) => boolean;
  addOffCycle: (input: {
    workerId: string;
    amount: number;
    reason: string;
  }) => void;
  payOffCycle: (id: string) => boolean;
  addGarnishment: (input: {
    workerId: string;
    agency: string;
    amountPerPeriod: number;
  }) => void;
  releaseGarnishment: (id: string) => void;
  addRetro: (input: {
    workerId: string;
    amount: number;
    note: string;
    periodLabel: string;
  }) => void;
};

const MockContext = createContext<MockContextValue | null>(null);

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MockStoreState>(defaultMockStore);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const slow = process.env.NEXT_PUBLIC_SLOW_DASHBOARD === "1";
    const timer = window.setTimeout(() => {
      setState(readMockStore());
      setReady(true);
    }, slow ? 1200 : 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state.assets && state.positions && state.hrCases) return;
    const next = hydrateMockStore(state);
    if (next === state) return;
    setState(next);
    writeMockStore(next);
  }, [state]);

  const persist = useCallback((updater: (prev: MockStoreState) => MockStoreState) => {
    setState((prev) => {
      const next = hydrateMockStore(updater(prev));
      writeMockStore(next);
      return next;
    });
  }, []);

  const addTimeOff = useCallback(
    (req: Omit<TimeOffRequest, "id" | "status">) => {
      persist((prev) => ({
        ...prev,
        timeOff: [
          { ...req, id: `to-${Date.now()}`, status: "Pending", stepIndex: 0 },
          ...prev.timeOff,
        ],
      }));
    },
    [persist],
  );

  const updateProfile = useCallback(
    (patch: Partial<ProfileData>) => {
      persist((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...patch },
      }));
    },
    [persist],
  );

  const markNotificationRead = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        ),
      }));
    },
    [persist],
  );

  const markAllNotificationsRead = useCallback(() => {
    persist((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, [persist]);

  const setManagerMode = useCallback(
    (on: boolean) => {
      persist((prev) => ({ ...prev, managerMode: on }));
    },
    [persist],
  );

  const decideApproval = useCallback(
    (id: string, status: "Approved" | "Pending") => {
      persist((prev) => ({
        ...prev,
        approvals: prev.approvals.map((a) =>
          a.id === id ? { ...a, status } : a,
        ),
      }));
    },
    [persist],
  );

  const completeInboxTask = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        inbox: prev.inbox.map((t) =>
          t.id === id ? { ...t, done: true } : t,
        ),
        onboarding: prev.onboarding.map((p) => ({
          ...p,
          tasks: p.tasks.map((t) =>
            t.id === id ? { ...t, done: true } : t,
          ),
        })),
      }));
    },
    [persist],
  );

  const setFeatureFlags = useCallback(
    (patch: Partial<FeatureFlags>) => {
      persist((prev) => ({
        ...prev,
        featureFlags: { ...prev.featureFlags, ...patch },
      }));
    },
    [persist],
  );

  const resetStore = useCallback(() => {
    clearMockStore();
    const next = defaultMockStore();
    writeMockStore(next);
    setState(next);
  }, []);

  const inboxForRole = useCallback(
    (role: DemoRole, workerId?: string) =>
      state.inbox.filter((t) => {
        if (t.workerId) return t.workerId === workerId;
        return t.forRoles.includes(role);
      }),
    [state.inbox],
  );

  const openInboxCount = useCallback(
    (role: DemoRole, workerId?: string) =>
      inboxForRole(role, workerId).filter((t) => !t.done).length,
    [inboxForRole],
  );

  const leaveBalancesFor = useCallback(
    (workerId: string) => {
      const mine = state.timeOff.filter(
        (r) => !r.workerId || r.workerId === workerId,
      );
      return allLeaveBalances(mine);
    },
    [state.timeOff],
  );

  const saveTimesheet = useCallback(
    (sheet: Timesheet) => {
      persist((prev) => {
        const idx = prev.timesheets.findIndex((t) => t.id === sheet.id);
        const next = [...prev.timesheets];
        if (idx >= 0) next[idx] = sheet;
        else next.unshift(sheet);
        return { ...prev, timesheets: next };
      });
    },
    [persist],
  );

  const submitTimesheet = useCallback(
    (id: string) => {
      let ok = false;
      persist((prev) => {
        const sheet = prev.timesheets.find((t) => t.id === id);
        if (!sheet || sheet.status !== "Draft") return prev;
        ok = true;
        const total = timesheetTotal(sheet);
        const exceptions = [...prev.exceptions];
        if (total > 40) {
          exceptions.unshift({
            id: `ex-${Date.now()}`,
            workerId: sheet.workerId,
            kind: "overtime",
            detail: `${total}h submitted week of ${sheet.weekStart} (over 40h).`,
            weekStart: sheet.weekStart,
            resolved: false,
          });
        }
        return {
          ...prev,
          timesheets: prev.timesheets.map((t) =>
            t.id === id ? { ...t, status: "Submitted" } : t,
          ),
          exceptions,
        };
      });
      return ok;
    },
    [persist],
  );

  const submitLastDraftTimesheet = useCallback(
    (workerId: string) => {
      const draft = state.timesheets.find(
        (t) => t.workerId === workerId && t.status === "Draft",
      );
      if (!draft) return null;
      const ok = submitTimesheet(draft.id);
      return ok ? { ...draft, status: "Submitted" as const } : null;
    },
    [state.timesheets, submitTimesheet],
  );

  const approveTimesheet = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        timesheets: prev.timesheets.map((t) =>
          t.id === id && t.status === "Submitted"
            ? { ...t, status: "Approved" }
            : t,
        ),
      }));
    },
    [persist],
  );

  const addPunch = useCallback(
    (workerId: string, kind: Punch["kind"]) => {
      persist((prev) => {
        const punch: Punch = {
          id: `p-${Date.now()}`,
          workerId,
          at: new Date().toISOString(),
          kind,
        };
        const exceptions = [...prev.exceptions];
        if (kind === "in") {
          const last = [...prev.punches]
            .filter((p) => p.workerId === workerId)
            .sort((a, b) => b.at.localeCompare(a.at))[0];
          if (last?.kind === "in") {
            exceptions.unshift({
              id: `ex-${Date.now()}`,
              workerId,
              kind: "missing_punch",
              detail: "Clock-in while previous punch is still open.",
              weekStart: weekStartMonday(WF_TODAY),
              resolved: false,
            });
          }
        }
        return { ...prev, punches: [punch, ...prev.punches], exceptions };
      });
    },
    [persist],
  );

  const publishShifts = useCallback(() => {
    persist((prev) => ({
      ...prev,
      shifts: prev.shifts.map((s) => ({ ...s, published: true })),
    }));
  }, [persist]);

  const resolveException = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        exceptions: prev.exceptions.map((e) =>
          e.id === id ? { ...e, resolved: true } : e,
        ),
      }));
    },
    [persist],
  );

  const decideTimeOff = useCallback(
    (id: string, status: TimeOffRequest["status"], role?: DemoRole) => {
      persist((prev) => {
        const row = prev.timeOff.find((r) => r.id === id);
        if (!row) return prev;
        if (status === "Denied") {
          return {
            ...prev,
            timeOff: prev.timeOff.map((r) =>
              r.id === id ? { ...r, status: "Denied" } : r,
            ),
          };
        }
        const wf = workflowById(prev.workflows, "leave");
        const result = advanceWorkflow(wf, row.stepIndex ?? 0, "Approved");
        const nextStatus = result.completed
          ? "Approved"
          : result.denied
            ? "Denied"
            : "Pending";
        const worker = getWorker(row.workerId ?? "");
        const event = result.completed
          ? newProcessEvent(
              "approved",
              `Leave approved — ${worker?.name ?? row.workerId ?? "worker"}`,
              `${row.type} ${row.start} → ${row.end}`,
              role,
            )
          : null;
        return {
          ...prev,
          timeOff: prev.timeOff.map((r) =>
            r.id === id
              ? { ...r, status: nextStatus, stepIndex: result.stepIndex }
              : r,
          ),
          processEvents: event
            ? [event, ...prev.processEvents].slice(0, 80)
            : prev.processEvents,
        };
      });
    },
    [persist],
  );

  const addJob = useCallback(
    (job: Omit<JobReq, "id" | "status">) => {
      persist((prev) => ({
        ...prev,
        jobs: [
          {
            ...job,
            id: `job-${Date.now()}`,
            status: "Open",
          },
          ...prev.jobs,
        ],
      }));
    },
    [persist],
  );

  const moveCandidate = useCallback(
    (id: string, stage: CandidateStage) => {
      persist((prev) => ({
        ...prev,
        candidates: prev.candidates.map((c) =>
          c.id === id ? { ...c, stage } : c,
        ),
      }));
    },
    [persist],
  );

  const saveScorecard = useCallback(
    (id: string, scorecard: Scorecard) => {
      persist((prev) => ({
        ...prev,
        candidates: prev.candidates.map((c) =>
          c.id === id ? { ...c, scorecard } : c,
        ),
      }));
    },
    [persist],
  );

  const attachOffer = useCallback(
    (id: string, offer: { salary: number; startDate: string }) => {
      persist((prev) => ({
        ...prev,
        candidates: prev.candidates.map((c) =>
          c.id === id
            ? {
                ...c,
                stage: c.stage === "Applied" || c.stage === "Interview" ? "Offer" : c.stage,
                offer: {
                  salary: offer.salary,
                  startDate: offer.startDate,
                  generatedAt: new Date().toISOString(),
                },
              }
            : c,
        ),
      }));
    },
    [persist],
  );

  const hireCandidate = useCallback(
    (id: string) => {
      let ok = false;
      persist((prev) => {
        const cand = prev.candidates.find((c) => c.id === id);
        if (!cand) return prev;
        const workerId = cand.workerId ?? `w-${cand.id}`;
        if (prev.onboarding.some((p) => p.workerId === workerId)) {
          ok = true;
          const hired = newProcessEvent(
            "hired",
            `${cand.name} hired`,
            "Existing onboarding plan",
          );
          return {
            ...prev,
            candidates: prev.candidates.map((c) =>
              c.id === id ? { ...c, stage: "Hired" } : c,
            ),
            jobs: prev.jobs.map((j) =>
              j.id === cand.jobId ? { ...j, status: "Filled" } : j,
            ),
            processEvents: [hired, ...prev.processEvents].slice(0, 80),
          };
        }
        const tasks = onboardingTemplate(workerId);
        ok = true;
        const hired = newProcessEvent(
          "hired",
          `${cand.name} hired`,
          cand.workerId ? "Existing worker record" : `Onboarding plan ${workerId}`,
        );
        return {
          ...prev,
          candidates: prev.candidates.map((c) =>
            c.id === id ? { ...c, stage: "Hired", workerId } : c,
          ),
          jobs: prev.jobs.map((j) =>
            j.id === cand.jobId ? { ...j, status: "Filled" } : j,
          ),
          onboarding: [
            { workerId, candidateId: cand.id, tasks },
            ...prev.onboarding,
          ],
          inbox: [...onboardingInbox(workerId, tasks), ...prev.inbox],
          processEvents: [hired, ...prev.processEvents].slice(0, 80),
        };
      });
      return ok;
    },
    [persist],
  );

  const completeOnboardingTask = useCallback(
    (workerId: string, taskId: string) => {
      persist((prev) => ({
        ...prev,
        onboarding: prev.onboarding.map((p) =>
          p.workerId === workerId
            ? {
                ...p,
                tasks: p.tasks.map((t) =>
                  t.id === taskId ? { ...t, done: true } : t,
                ),
              }
            : p,
        ),
        inbox: prev.inbox.map((t) =>
          t.id === taskId ? { ...t, done: true } : t,
        ),
      }));
    },
    [persist],
  );

  const startOffboarding = useCallback(
    (workerId: string, initiatedBy: string) => {
      persist((prev) => {
        if (prev.offboarding.some((p) => p.workerId === workerId && p.status === "Open")) {
          return prev;
        }
        const worker = getWorker(workerId);
        const terminated = newProcessEvent(
          "terminated",
          `${worker?.name ?? workerId} offboarding started`,
          `Initiated by ${initiatedBy}`,
        );
        return {
          ...prev,
          offboarding: [
            offboardingTemplate(workerId, initiatedBy),
            ...prev.offboarding,
          ],
          processEvents: [terminated, ...prev.processEvents].slice(0, 80),
        };
      });
    },
    [persist],
  );

  const toggleOffboardingTask = useCallback(
    (planId: string, taskId: string) => {
      persist((prev) => ({
        ...prev,
        offboarding: prev.offboarding.map((p) => {
          if (p.id !== planId) return p;
          const tasks = p.tasks.map((t) =>
            t.id === taskId ? { ...t, done: !t.done } : t,
          );
          return {
            ...p,
            tasks,
            status: tasks.every((t) => t.done) ? "Complete" : "Open",
          };
        }),
      }));
    },
    [persist],
  );

  const rateGoal = useCallback(
    (goalId: string, workerId: string, rating: number) => {
      persist((prev) => {
        const idx = prev.goalRatings.findIndex(
          (g) => g.goalId === goalId && g.workerId === workerId,
        );
        const next = [...prev.goalRatings];
        if (idx >= 0) next[idx] = { ...next[idx], rating };
        else next.push({ goalId, workerId, rating });
        return { ...prev, goalRatings: next };
      });
    },
    [persist],
  );

  const addFeedback = useCallback(
    (fromWorkerId: string, toWorkerId: string, text: string) => {
      persist((prev) => ({
        ...prev,
        feedback: [
          {
            id: `fb-${Date.now()}`,
            fromWorkerId,
            toWorkerId,
            text,
            date: new Date().toISOString().slice(0, 10),
          },
          ...prev.feedback,
        ],
      }));
    },
    [persist],
  );

  const addBank = useCallback(
    (account: Omit<BankAccount, "id">) => {
      persist((prev) => {
        const id = `ba-${Date.now()}`;
        const banks = account.primary
          ? prev.banks.map((b) => ({ ...b, primary: false }))
          : prev.banks;
        return {
          ...prev,
          banks: [{ ...account, id }, ...banks],
        };
      });
    },
    [persist],
  );

  const removeBank = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        banks: prev.banks.filter((b) => b.id !== id),
      }));
    },
    [persist],
  );

  const setPrimaryBank = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        banks: prev.banks.map((b) => ({ ...b, primary: b.id === id })),
      }));
    },
    [persist],
  );

  const addExpense = useCallback(
    (expense: Omit<Expense, "id" | "status">) => {
      const row: Expense = {
        ...expense,
        id: `ex-${Date.now()}`,
        status: "Submitted",
        stepIndex: 0,
      };
      persist((prev) => ({ ...prev, expenses: [row, ...prev.expenses] }));
      return row;
    },
    [persist],
  );

  const decideExpense = useCallback(
    (id: string, status: ExpenseStatus, role?: DemoRole) => {
      persist((prev) => {
        const row = prev.expenses.find((e) => e.id === id);
        if (!row) return prev;
        if (status === "Denied") {
          return {
            ...prev,
            expenses: prev.expenses.map((e) =>
              e.id === id ? { ...e, status: "Denied" } : e,
            ),
          };
        }
        const wf = workflowById(prev.workflows, "expense");
        const result = advanceWorkflow(wf, row.stepIndex ?? 0, "Approved");
        const nextStatus = result.completed ? "Approved" : "Submitted";
        const worker = getWorker(row.workerId);
        const event = result.completed
          ? newProcessEvent(
              "approved",
              `Expense approved — ${worker?.name ?? row.workerId}`,
              `${row.merchant} ${row.amount}`,
              role,
            )
          : null;
        return {
          ...prev,
          expenses: prev.expenses.map((e) =>
            e.id === id
              ? { ...e, status: nextStatus, stepIndex: result.stepIndex }
              : e,
          ),
          processEvents: event
            ? [event, ...prev.processEvents].slice(0, 80)
            : prev.processEvents,
        };
      });
    },
    [persist],
  );

  const requestPurchase = useCallback(
    (itemId: string, qty: number, requestedBy: string) => {
      persist((prev) => ({
        ...prev,
        purchases: [
          {
            id: `pr-${Date.now()}`,
            itemId,
            qty,
            requestedBy,
            status: "Requested",
          },
          ...prev.purchases,
        ],
      }));
    },
    [persist],
  );

  const approvePurchase = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        purchases: prev.purchases.map((p) =>
          p.id === id && p.status === "Requested"
            ? { ...p, status: "Approved" }
            : p,
        ),
      }));
    },
    [persist],
  );

  const issuePurchaseOrder = useCallback(
    (id: string) => {
      let po: string | null = null;
      persist((prev) => {
        const req = prev.purchases.find((p) => p.id === id);
        if (!req || req.status !== "Approved") return prev;
        po = nextPoNumber(prev.purchases);
        return {
          ...prev,
          purchases: prev.purchases.map((p) =>
            p.id === id ? { ...p, status: "Ordered", poNumber: po! } : p,
          ),
        };
      });
      return po;
    },
    [persist],
  );

  const addJournalDraft = useCallback(
    (journal: Omit<Journal, "id" | "status">) => {
      if (!journalBalanced(journal.lines)) return false;
      persist((prev) => ({
        ...prev,
        journals: [
          {
            ...journal,
            id: `je-${Date.now()}`,
            status: "Draft",
            lines: journal.lines.map((l) => ({ ...l })),
          },
          ...prev.journals,
        ],
      }));
      return true;
    },
    [persist],
  );

  const toggleCloseTask = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        closeTasks: prev.closeTasks.map((t) =>
          t.id === id ? { ...t, done: !t.done } : t,
        ),
      }));
    },
    [persist],
  );

  const setPlanningScenario = useCallback(
    (scenario: PlanningScenario) => {
      persist((prev) => ({ ...prev, planningScenario: scenario }));
    },
    [persist],
  );

  const submitPulse = useCallback(
    (workerId: string, scores: Record<string, number>) => {
      let ok = false;
      persist((prev) => {
        if (hasSubmittedPulse(prev.pulseResponses, workerId)) return prev;
        ok = true;
        return {
          ...prev,
          pulseResponses: [
            {
              id: `pr-${workerId}-${Date.now()}`,
              campaignId: PULSE_CAMPAIGN.id,
              workerId,
              scores: { ...scores },
              submittedAt: new Date().toISOString(),
            },
            ...prev.pulseResponses,
          ],
        };
      });
      return ok;
    },
    [persist],
  );

  const createPulsePlan = useCallback(
    (theme: string) => {
      const typed = PULSE_THEMES.find((t) => t === theme) as
        | PulseTheme
        | undefined;
      if (!typed) return null;
      let inboxId: string | null = null;
      persist((prev) => {
        if (prev.pulsePlans.some((p) => p.theme === typed)) {
          inboxId = prev.pulsePlans.find((p) => p.theme === typed)?.inboxTaskId ?? null;
          return prev;
        }
        inboxId = `in-pulse-${typed.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`;
        const planId = `plan-${Date.now()}`;
        return {
          ...prev,
          pulsePlans: [
            {
              id: planId,
              theme: typed,
              title: `Improve ${typed}`,
              ownerRoles: ["manager", "hr_admin"],
              createdAt: WF_TODAY,
              inboxTaskId: inboxId,
              note: `From ${PULSE_CAMPAIGN.title} — lowest or selected theme.`,
            },
            ...prev.pulsePlans,
          ],
          inbox: [
            {
              id: inboxId,
              title: `Pulse action: improve ${typed}`,
              kind: "todo",
              due: addDaysIso(WF_TODAY, 7),
              done: false,
              forRoles: ["manager", "hr_admin"],
            },
            ...prev.inbox,
          ],
        };
      });
      return inboxId;
    },
    [persist],
  );

  const appendAgentAudit = useCallback(
    (entry: {
      personaId: string;
      role: DemoRole;
      toolId: string;
      prompt: string;
      source: "rules" | "llm";
    }) => {
      persist((prev) => ({
        ...prev,
        agentAudit: [
          {
            id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            at: new Date().toISOString(),
            ...entry,
          },
          ...prev.agentAudit,
        ].slice(0, 80),
      }));
    },
    [persist],
  );

  const clearAgentAudit = useCallback(() => {
    persist((prev) => ({ ...prev, agentAudit: [] }));
  }, [persist]);

  const setWorkflow = useCallback(
    (kind: WorkflowKind, steps: WorkflowDef["steps"]) => {
      persist((prev) => ({
        ...prev,
        workflows: prev.workflows.map((w) =>
          w.id === kind
            ? { ...w, steps: steps.map((s) => ({ ...s })) }
            : w,
        ),
      }));
    },
    [persist],
  );

  const toggleIntegration = useCallback(
    (id: string) => {
      persist((prev) => {
        const on = prev.connectedIntegrations.includes(id);
        return {
          ...prev,
          connectedIntegrations: on
            ? prev.connectedIntegrations.filter((x) => x !== id)
            : [...prev.connectedIntegrations, id],
        };
      });
    },
    [persist],
  );

  const toggleApp = useCallback(
    (id: string) => {
      persist((prev) => {
        const on = prev.installedApps.includes(id);
        return {
          ...prev,
          installedApps: on
            ? prev.installedApps.filter((x) => x !== id)
            : [...prev.installedApps, id],
        };
      });
    },
    [persist],
  );

  const setHomePins = useCallback(
    (role: DemoRole, pins: HomeWidgetId[]) => {
      persist((prev) => ({
        ...prev,
        homePins: { ...prev.homePins, [role]: pins },
      }));
    },
    [persist],
  );

  const setInsightView = useCallback(
    (board: InsightBoard) => {
      persist((prev) => ({ ...prev, insightView: board }));
    },
    [persist],
  );

  const startLearnAssignment = useCallback(
    (id: string) => {
      let ok = false;
      persist((prev) => {
        const row = prev.learnAssignments.find((a) => a.id === id);
        if (!row || row.status === "Completed") return prev;
        ok = true;
        return {
          ...prev,
          learnAssignments: prev.learnAssignments.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: "In progress" as const,
                  progress: Math.max(a.progress, 25),
                }
              : a,
          ),
        };
      });
      return ok;
    },
    [persist],
  );

  const completeLearnAssignment = useCallback(
    (id: string) => {
      let cert: LearnCertificate | null = null;
      persist((prev) => {
        const row = prev.learnAssignments.find((a) => a.id === id);
        if (!row || row.status === "Completed") return prev;
        const course = courseById(row.courseId);
        const certId = `cert-${row.workerId}-${row.courseId}-${Date.now()}`;
        cert = {
          id: certId,
          assignmentId: id,
          workerId: row.workerId,
          courseTitle: course?.title ?? row.courseId,
          issued: WF_TODAY,
        };
        const title = course?.title ?? "";
        return {
          ...prev,
          learnAssignments: prev.learnAssignments.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: "Completed" as const,
                  progress: 100,
                  completedAt: WF_TODAY,
                  certificateId: certId,
                }
              : a,
          ),
          learnCertificates: [cert, ...prev.learnCertificates],
          inbox: prev.inbox.map((t) =>
            !t.done &&
            /security awareness/i.test(t.title) &&
            /security awareness/i.test(title)
              ? { ...t, done: true }
              : t,
          ),
        };
      });
      return cert;
    },
    [persist],
  );

  const assignLearnCourse = useCallback(
    (workerId: string, courseId: string, due: string) => {
      const course = courseById(courseId);
      if (!course || !workerId) return null;
      let created: string | null = null;
      persist((prev) => {
        const open = prev.learnAssignments.find(
          (a) =>
            a.workerId === workerId &&
            a.courseId === courseId &&
            a.status !== "Completed",
        );
        if (open) {
          created = open.id;
          return prev;
        }
        const id = `la-${workerId}-${courseId}-${Date.now()}`;
        created = id;
        return {
          ...prev,
          learnAssignments: [
            {
              id,
              courseId,
              workerId,
              status: "Assigned",
              progress: 0,
              due,
              assignedAt: WF_TODAY,
            },
            ...prev.learnAssignments,
          ],
        };
      });
      return created;
    },
    [persist],
  );

  const rotateDemoApiKey = useCallback(() => {
    const next = `wb_live_${Math.random().toString(36).slice(2, 10)}`;
    persist((prev) => ({ ...prev, demoApiKey: next }));
    return next;
  }, [persist]);

  const setRetentionDays = useCallback(
    (days: number) => {
      persist((prev) => ({ ...prev, retentionDays: days }));
    },
    [persist],
  );

  const addHrCase = useCallback(
    (input: {
      workerId: string;
      category: CaseCategory;
      subject: string;
      body: string;
    }) => {
      const id = `case-${Date.now()}`;
      const inboxTaskId = `in-${id}`;
      const row: HrCase = {
        ...input,
        id,
        status: "Open",
        createdAt: WF_TODAY,
        inboxTaskId,
      };
      persist((prev) => ({
        ...prev,
        hrCases: [row, ...prev.hrCases],
        inbox: [
          {
            id: inboxTaskId,
            title: `HR case: ${input.subject}`,
            kind: "todo",
            due: addDaysIso(WF_TODAY, 3),
            done: false,
            forRoles: ["hr_admin"],
          },
          ...prev.inbox,
        ],
      }));
      return row;
    },
    [persist],
  );

  const setCaseStatus = useCallback(
    (id: string, status: CaseStatus) => {
      persist((prev) => {
        const row = prev.hrCases.find((c) => c.id === id);
        return {
          ...prev,
          hrCases: prev.hrCases.map((c) =>
            c.id === id ? { ...c, status } : c,
          ),
          inbox:
            status === "Resolved" && row
              ? prev.inbox.map((t) =>
                  t.id === row.inboxTaskId ? { ...t, done: true } : t,
                )
              : prev.inbox,
        };
      });
    },
    [persist],
  );

  const addDelegation = useCallback(
    (input: {
      fromWorkerId: string;
      toWorkerId: string;
      scope: DelegationScope;
      end: string;
    }) => {
      if (input.fromWorkerId === input.toWorkerId) return null;
      let created: Delegation | null = null;
      persist((prev) => {
        if (
          prev.delegations.some(
            (d) => d.fromWorkerId === input.fromWorkerId && d.end >= WF_TODAY,
          )
        ) {
          return prev;
        }
        const id = `del-${Date.now()}`;
        const inboxTaskId = `in-${id}`;
        created = {
          id,
          ...input,
          start: WF_TODAY,
          inboxTaskId,
        };
        return {
          ...prev,
          delegations: [created, ...prev.delegations],
          inbox: [
            {
              id: inboxTaskId,
              title: `Acting for ${workerName(input.fromWorkerId)} (${input.scope}) until ${input.end}`,
              kind: "todo",
              due: input.end,
              done: false,
              forRoles: ["manager", "hr_admin", "employee", "finance"],
              workerId: input.toWorkerId,
            },
            ...prev.inbox,
          ],
        };
      });
      return created;
    },
    [persist],
  );

  const setCompProposed = useCallback(
    (id: string, proposed: number) => {
      persist((prev) => ({
        ...prev,
        compWorksheets: prev.compWorksheets.map((w) =>
          w.id === id && w.status === "Draft" ? { ...w, proposed } : w,
        ),
      }));
    },
    [persist],
  );

  const submitComp = useCallback(
    (id: string) => {
      let ok = false;
      persist((prev) => {
        const row = prev.compWorksheets.find((w) => w.id === id);
        if (!row || row.status !== "Draft") return prev;
        ok = true;
        const inboxId = `in-comp-${id}`;
        return {
          ...prev,
          compWorksheets: prev.compWorksheets.map((w) =>
            w.id === id ? { ...w, status: "Submitted" } : w,
          ),
          inbox: [
            {
              id: inboxId,
              title: `Merit review: ${workerName(row.workerId)}`,
              kind: "approval",
              due: addDaysIso(WF_TODAY, 7),
              done: false,
              forRoles: ["hr_admin"],
            },
            ...prev.inbox,
          ],
        };
      });
      return ok;
    },
    [persist],
  );

  const applyInternal = useCallback(
    (workerId: string, jobId: string) => {
      let created: InternalApplication | null = null;
      persist((prev) => {
        if (
          prev.internalApps.some(
            (a) =>
              a.workerId === workerId &&
              a.jobId === jobId &&
              a.status === "Applied",
          )
        ) {
          return prev;
        }
        const job = prev.jobs.find((j) => j.id === jobId);
        const id = `ia-${Date.now()}`;
        const inboxTaskId = `in-${id}`;
        created = {
          id,
          workerId,
          jobId,
          at: WF_TODAY,
          status: "Applied",
          inboxTaskId,
        };
        return {
          ...prev,
          internalApps: [created, ...prev.internalApps],
          inbox: [
            {
              id: inboxTaskId,
              title: `Internal apply: ${workerName(workerId)} → ${job?.title ?? jobId}`,
              kind: "todo",
              due: addDaysIso(WF_TODAY, 5),
              done: false,
              forRoles: ["manager", "hr_admin"],
              workerId: job?.hiringManagerId,
            },
            ...prev.inbox,
          ],
        };
      });
      return created;
    },
    [persist],
  );

  const withdrawInternal = useCallback(
    (id: string) => {
      persist((prev) => {
        const row = prev.internalApps.find((a) => a.id === id);
        return {
          ...prev,
          internalApps: prev.internalApps.map((a) =>
            a.id === id ? { ...a, status: "Withdrawn" } : a,
          ),
          inbox: row
            ? prev.inbox.map((t) =>
                t.id === row.inboxTaskId ? { ...t, done: true } : t,
              )
            : prev.inbox,
        };
      });
    },
    [persist],
  );

  const saveElection = useCallback(
    (election: BenefitElection) => {
      persist((prev) => ({
        ...prev,
        elections: [
          election,
          ...prev.elections.filter((e) => e.workerId !== election.workerId),
        ],
      }));
    },
    [persist],
  );

  const requestMove = useCallback(
    (input: {
      kind: OrgMoveKind;
      workerId: string;
      fromTitle: string;
      toTitle: string;
      toDepartmentId: string;
    }) => {
      const id = `mv-${Date.now()}`;
      const inboxTaskId = `in-${id}`;
      const row: OrgMove = {
        ...input,
        id,
        status: "Submitted",
        createdAt: WF_TODAY,
        inboxTaskId,
      };
      persist((prev) => ({
        ...prev,
        orgMoves: [row, ...prev.orgMoves],
        inbox: [
          {
            id: inboxTaskId,
            title: `${input.kind}: ${input.fromTitle} → ${input.toTitle}`,
            kind: "approval",
            due: addDaysIso(WF_TODAY, 5),
            done: false,
            forRoles: ["hr_admin", "manager"],
          },
          ...prev.inbox,
        ],
      }));
      return row;
    },
    [persist],
  );

  const decideMove = useCallback(
    (id: string, status: "Approved" | "Denied") => {
      persist((prev) => {
        const row = prev.orgMoves.find((m) => m.id === id);
        return {
          ...prev,
          orgMoves: prev.orgMoves.map((m) =>
            m.id === id ? { ...m, status } : m,
          ),
          inbox: row
            ? prev.inbox.map((t) =>
                t.id === row.inboxTaskId ? { ...t, done: true } : t,
              )
            : prev.inbox,
        };
      });
    },
    [persist],
  );

  const assignAsset = useCallback(
    (id: string, workerId: string) => {
      persist((prev) => ({
        ...prev,
        assets: prev.assets.map((a) =>
          a.id === id
            ? { ...a, workerId, status: "Assigned" as const }
            : a,
        ),
      }));
    },
    [persist],
  );

  const returnAsset = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        assets: prev.assets.map((a) =>
          a.id === id
            ? { ...a, workerId: null, status: "Available" as const }
            : a,
        ),
      }));
    },
    [persist],
  );

  const requestAccess = useCallback(
    (input: { workerId: string; app: AccessApp; roleLabel: string }) => {
      let created: AccessRequest | null = null;
      persist((prev) => {
        const dup = prev.accessRequests.find(
          (r) =>
            r.workerId === input.workerId &&
            r.app === input.app &&
            r.status === "Open",
        );
        if (dup) return prev;
        const id = `acc-${Date.now()}`;
        const inboxTaskId = `in-${id}`;
        created = {
          ...input,
          id,
          status: "Open",
          createdAt: WF_TODAY,
          inboxTaskId,
        };
        return {
          ...prev,
          accessRequests: [created, ...prev.accessRequests],
          inbox: [
            {
              id: inboxTaskId,
              title: `Access request: ${input.app} ${input.roleLabel}`,
              kind: "todo",
              due: addDaysIso(WF_TODAY, 3),
              done: false,
              forRoles: ["hr_admin"],
            },
            ...prev.inbox,
          ],
        };
      });
      return created;
    },
    [persist],
  );

  const decideAccess = useCallback(
    (id: string, status: "Approved" | "Denied") => {
      persist((prev) => {
        const row = prev.accessRequests.find((r) => r.id === id);
        return {
          ...prev,
          accessRequests: prev.accessRequests.map((r) =>
            r.id === id ? { ...r, status } : r,
          ),
          inbox: row
            ? prev.inbox.map((t) =>
                t.id === row.inboxTaskId ? { ...t, done: true } : t,
              )
            : prev.inbox,
        };
      });
    },
    [persist],
  );

  const saveEligibility = useCallback(
    (input: {
      workerId: string;
      status: EligibilityStatus;
      docs: string[];
    }) => {
      persist((prev) => ({
        ...prev,
        eligibility: [
          {
            workerId: input.workerId,
            status: input.status,
            docs: [...input.docs],
            updatedAt: WF_TODAY,
          },
          ...prev.eligibility.filter((e) => e.workerId !== input.workerId),
        ],
      }));
    },
    [persist],
  );

  const calculatePayRun = useCallback(
    (id: string) => {
      const run = state.payrollRuns.find((r) => r.id === id);
      if (!run || run.status === "Complete") return false;
      persist((prev) => {
        const current = prev.payrollRuns.find((r) => r.id === id);
        if (!current || current.status === "Complete") return prev;
        const results = calculateResults(
          current.groupId,
          prev.garnishments,
          prev.retroAdjustments,
        );
        return {
          ...prev,
          payrollRuns: prev.payrollRuns.map((r) =>
            r.id === id ? { ...r, status: "Calculated" as const, results } : r,
          ),
        };
      });
      return true;
    },
    [persist, state.payrollRuns],
  );

  const completePayRun = useCallback(
    (id: string) => {
      const run = state.payrollRuns.find((r) => r.id === id);
      if (!run || run.status !== "Calculated") return false;
      persist((prev) => {
        const current = prev.payrollRuns.find((r) => r.id === id);
        if (!current || current.status !== "Calculated") return prev;
        const stubs = current.results.map((row) => resultToStub(current, row));
        return {
          ...prev,
          payrollRuns: prev.payrollRuns.map((r) =>
            r.id === id ? { ...r, status: "Complete" as const } : r,
          ),
          extraPayStubs: [...stubs, ...prev.extraPayStubs],
          retroAdjustments: prev.retroAdjustments.map((r) =>
            r.appliedToRunId
              ? r
              : current.results.some((x) => x.workerId === r.workerId && x.retro)
                ? { ...r, appliedToRunId: id }
                : r,
          ),
          inbox: [
            {
              id: `in-pay-${id}`,
              title: `Pay run ${id} posted (${current.payDate})`,
              kind: "todo" as const,
              due: current.payDate,
              done: false,
              forRoles: ["finance" as const, "hr_admin" as const],
            },
            ...prev.inbox,
          ],
        };
      });
      return true;
    },
    [persist, state.payrollRuns],
  );

  const addOffCycle = useCallback(
    (input: { workerId: string; amount: number; reason: string }) => {
      persist((prev) => ({
        ...prev,
        offCyclePays: [
          {
            id: `oc-${Date.now()}`,
            workerId: input.workerId,
            amount: input.amount,
            reason: input.reason,
            payDate: WF_TODAY,
            status: "Draft",
          },
          ...prev.offCyclePays,
        ],
      }));
    },
    [persist],
  );

  const payOffCycle = useCallback(
    (id: string) => {
      const row = state.offCyclePays.find((o) => o.id === id);
      if (!row || row.status === "Paid") return false;
      persist((prev) => {
        const current = prev.offCyclePays.find((o) => o.id === id);
        if (!current || current.status === "Paid") return prev;
        const taxes = Math.round(current.amount * 0.22 * 100) / 100;
        const net = Math.round((current.amount - taxes) * 100) / 100;
        return {
          ...prev,
          offCyclePays: prev.offCyclePays.map((o) =>
            o.id === id ? { ...o, status: "Paid" as const } : o,
          ),
          extraPayStubs: [
            {
              id: `pay-oc-${id}`,
              workerId: current.workerId,
              period: `Off-cycle ${current.payDate}`,
              payDate: current.payDate,
              net,
              gross: current.amount,
              taxes,
              deductions: 0,
              earnings: [
                { label: current.reason || "Off-cycle", amount: current.amount },
              ],
              taxLines: [{ label: "Withholding", amount: taxes }],
              deductionLines: [],
            },
            ...prev.extraPayStubs,
          ],
        };
      });
      return true;
    },
    [persist, state.offCyclePays],
  );

  const addGarnishment = useCallback(
    (input: {
      workerId: string;
      agency: string;
      amountPerPeriod: number;
    }) => {
      persist((prev) => ({
        ...prev,
        garnishments: [
          {
            id: `gar-${Date.now()}`,
            workerId: input.workerId,
            agency: input.agency,
            amountPerPeriod: input.amountPerPeriod,
            status: "Active",
          },
          ...prev.garnishments,
        ],
      }));
    },
    [persist],
  );

  const releaseGarnishment = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        garnishments: prev.garnishments.map((g) =>
          g.id === id ? { ...g, status: "Released" as const } : g,
        ),
      }));
    },
    [persist],
  );

  const addRetro = useCallback(
    (input: {
      workerId: string;
      amount: number;
      note: string;
      periodLabel: string;
    }) => {
      persist((prev) => ({
        ...prev,
        retroAdjustments: [
          {
            id: `ret-${Date.now()}`,
            ...input,
          },
          ...prev.retroAdjustments,
        ],
      }));
    },
    [persist],
  );

  const alexBalances = leaveBalancesFor("w-alex");
  const pto = {
    vacationHours: alexBalances.find((b) => b.type === "Vacation")?.remaining ?? 0,
    sickHours: alexBalances.find((b) => b.type === "Sick")?.remaining ?? 0,
    personalHours:
      alexBalances.find((b) => b.type === "Personal")?.remaining ?? 0,
  };

  const value = useMemo<MockContextValue>(
    () => ({
      ready,
      state,
      pto,
      payStubs: [...state.extraPayStubs, ...SEED_PAY_STUBS],
      payPeriods: SEED_PAY_PERIODS,
      events: SEED_EVENTS,
      benefits: SEED_BENEFITS,
      beneficiaries: SEED_BENEFICIARIES,
      benefitDocs: SEED_BENEFIT_DOCS,
      goals: SEED_GOALS,
      checkIns: SEED_CHECKINS,
      reviews: SEED_REVIEWS,
      courses: SEED_COURSES,
      team: SEED_TEAM,
      addTimeOff,
      updateProfile,
      markNotificationRead,
      markAllNotificationsRead,
      setManagerMode,
      decideApproval,
      completeInboxTask,
      setFeatureFlags,
      resetStore,
      inboxForRole,
      openInboxCount,
      leaveBalancesFor,
      saveTimesheet,
      submitTimesheet,
      submitLastDraftTimesheet,
      approveTimesheet,
      addPunch,
      publishShifts,
      resolveException,
      decideTimeOff,
      addJob,
      moveCandidate,
      saveScorecard,
      attachOffer,
      hireCandidate,
      completeOnboardingTask,
      startOffboarding,
      toggleOffboardingTask,
      rateGoal,
      addFeedback,
      addBank,
      removeBank,
      setPrimaryBank,
      addExpense,
      decideExpense,
      requestPurchase,
      approvePurchase,
      issuePurchaseOrder,
      addJournalDraft,
      toggleCloseTask,
      setPlanningScenario,
      submitPulse,
      createPulsePlan,
      appendAgentAudit,
      clearAgentAudit,
      setWorkflow,
      toggleIntegration,
      toggleApp,
      setHomePins,
      setInsightView,
      startLearnAssignment,
      completeLearnAssignment,
      assignLearnCourse,
      rotateDemoApiKey,
      setRetentionDays,
      addHrCase,
      setCaseStatus,
      addDelegation,
      setCompProposed,
      submitComp,
      applyInternal,
      withdrawInternal,
      saveElection,
      requestMove,
      decideMove,
      assignAsset,
      returnAsset,
      requestAccess,
      decideAccess,
      saveEligibility,
      calculatePayRun,
      completePayRun,
      addOffCycle,
      payOffCycle,
      addGarnishment,
      releaseGarnishment,
      addRetro,
    }),
    [
      ready,
      state,
      pto,
      addTimeOff,
      updateProfile,
      markNotificationRead,
      markAllNotificationsRead,
      setManagerMode,
      decideApproval,
      completeInboxTask,
      setFeatureFlags,
      resetStore,
      inboxForRole,
      openInboxCount,
      leaveBalancesFor,
      saveTimesheet,
      submitTimesheet,
      submitLastDraftTimesheet,
      approveTimesheet,
      addPunch,
      publishShifts,
      resolveException,
      decideTimeOff,
      addJob,
      moveCandidate,
      saveScorecard,
      attachOffer,
      hireCandidate,
      completeOnboardingTask,
      startOffboarding,
      toggleOffboardingTask,
      rateGoal,
      addFeedback,
      addBank,
      removeBank,
      setPrimaryBank,
      addExpense,
      decideExpense,
      requestPurchase,
      approvePurchase,
      issuePurchaseOrder,
      addJournalDraft,
      toggleCloseTask,
      setPlanningScenario,
      submitPulse,
      createPulsePlan,
      appendAgentAudit,
      clearAgentAudit,
      setWorkflow,
      toggleIntegration,
      toggleApp,
      setHomePins,
      setInsightView,
      startLearnAssignment,
      completeLearnAssignment,
      assignLearnCourse,
      rotateDemoApiKey,
      setRetentionDays,
      addHrCase,
      setCaseStatus,
      addDelegation,
      setCompProposed,
      submitComp,
      applyInternal,
      withdrawInternal,
      saveElection,
      requestMove,
      decideMove,
      assignAsset,
      returnAsset,
      requestAccess,
      decideAccess,
      saveEligibility,
      calculatePayRun,
      completePayRun,
      addOffCycle,
      payOffCycle,
      addGarnishment,
      releaseGarnishment,
      addRetro,
    ],
  );

  return <MockContext.Provider value={value}>{children}</MockContext.Provider>;
}

export function useMock() {
  const ctx = useContext(MockContext);
  if (!ctx) throw new Error("useMock must be used within MockProvider");
  return ctx;
}
