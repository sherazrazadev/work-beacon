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

type MockContextValue = {
  ready: boolean;
  state: MockStoreState;
  pto: { vacationHours: number; sickHours: number; personalHours: number };
  payStubs: typeof SEED_PAY_STUBS;
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
  decideExpense: (id: string, status: ExpenseStatus) => void;
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
  decideTimeOff: (id: string, status: TimeOffRequest["status"]) => void;
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

  const persist = useCallback((updater: (prev: MockStoreState) => MockStoreState) => {
    setState((prev) => {
      const next = updater(prev);
      writeMockStore(next);
      return next;
    });
  }, []);

  const addTimeOff = useCallback(
    (req: Omit<TimeOffRequest, "id" | "status">) => {
      persist((prev) => ({
        ...prev,
        timeOff: [
          { ...req, id: `to-${Date.now()}`, status: "Pending" },
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
    (id: string, status: TimeOffRequest["status"]) => {
      persist((prev) => ({
        ...prev,
        timeOff: prev.timeOff.map((r) => (r.id === id ? { ...r, status } : r)),
      }));
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
          return {
            ...prev,
            candidates: prev.candidates.map((c) =>
              c.id === id ? { ...c, stage: "Hired" } : c,
            ),
            jobs: prev.jobs.map((j) =>
              j.id === cand.jobId ? { ...j, status: "Filled" } : j,
            ),
          };
        }
        const tasks = onboardingTemplate(workerId);
        ok = true;
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
        return {
          ...prev,
          offboarding: [
            offboardingTemplate(workerId, initiatedBy),
            ...prev.offboarding,
          ],
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
      };
      persist((prev) => ({ ...prev, expenses: [row, ...prev.expenses] }));
      return row;
    },
    [persist],
  );

  const decideExpense = useCallback(
    (id: string, status: ExpenseStatus) => {
      persist((prev) => ({
        ...prev,
        expenses: prev.expenses.map((e) =>
          e.id === id ? { ...e, status } : e,
        ),
      }));
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
      payStubs: SEED_PAY_STUBS,
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
    ],
  );

  return <MockContext.Provider value={value}>{children}</MockContext.Provider>;
}

export function useMock() {
  const ctx = useContext(MockContext);
  if (!ctx) throw new Error("useMock must be used within MockProvider");
  return ctx;
}
