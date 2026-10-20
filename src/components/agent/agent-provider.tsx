"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import {
  AGENT_NAME,
  loadHistory,
  runAgent,
  runAgentTool,
  saveHistory,
  type AgentSource,
  type ChatMessage,
} from "@/lib/agent";
import { AGENT_TOOL_IDS } from "@/lib/agent/tools";
import { ONBOARDING_KEY } from "@/lib/agent/history";
import { PULSE_CAMPAIGN, hasSubmittedPulse } from "@/lib/mock/pulse";
import { courseById, isOverdue } from "@/lib/mock/learn";
import { getDirectReports } from "@/lib/mock/org";
import { insightSnapshot } from "@/lib/mock/insights";

type AgentContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  messages: ChatMessage[];
  typing: boolean;
  send: (text: string) => void;
  clearChat: () => void;
  showOnboarding: boolean;
  dismissOnboarding: () => void;
  skipOnboarding: () => void;
};

const AgentUiContext = createContext<AgentContextValue | null>(null);

function uid() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const {
    pto,
    payStubs,
    events,
    benefits,
    state,
    leaveBalancesFor,
    submitLastDraftTimesheet,
    addExpense,
    openInboxCount,
    appendAgentAudit,
    addHrCase,
    requestAccess,
    completeLearnAssignment,
  } = useMock();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const history = loadHistory();
    setMessages(history);
    const seen = window.localStorage.getItem(ONBOARDING_KEY);
    if (!seen) setShowOnboarding(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveHistory(messages);
  }, [messages, ready]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  const skipOnboarding = useCallback(() => {
    window.localStorage.setItem(ONBOARDING_KEY, "1");
    setShowOnboarding(false);
  }, []);

  const dismissOnboarding = useCallback(() => {
    skipOnboarding();
    setOpen(true);
  }, [skipOnboarding]);

  const clearChat = useCallback(() => {
    setMessages([]);
    saveHistory([]);
  }, []);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typing) return;

      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        text: trimmed,
        at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setTyping(true);
      setOpen(true);

      window.setTimeout(() => {
        void (async () => {
          const workerId = session?.user.workerId ?? "w-alex";
          const role = session?.user.role ?? "employee";
          const balances = leaveBalancesFor(workerId);
          const ptoNow = {
            vacationHours:
              balances.find((b) => b.type === "Vacation")?.remaining ??
              pto.vacationHours,
            sickHours:
              balances.find((b) => b.type === "Sick")?.remaining ??
              pto.sickHours,
            personalHours:
              balances.find((b) => b.type === "Personal")?.remaining ??
              pto.personalHours,
          };
          const plan = state.onboarding.find((p) => p.workerId === workerId);
          const ctx = {
            vacationHours: ptoNow.vacationHours,
            sickHours: ptoNow.sickHours,
            personalHours: ptoNow.personalHours,
            latestPay:
              payStubs.find((s) => !s.workerId || s.workerId === workerId) ??
              payStubs[0],
            events,
            workerId,
            shifts: state.shifts,
            timesheets: state.timesheets,
            onboardingTasks: plan?.tasks ?? [],
            skills:
              state.skills.find((s) => s.workerId === workerId)?.tags ?? [],
            inboxOpen: openInboxCount(role, workerId),
            pulseSubmitted: hasSubmittedPulse(state.pulseResponses, workerId),
            pulseCampaignTitle: PULSE_CAMPAIGN.title,
            pulseCloses: PULSE_CAMPAIGN.closes,
            benefits,
            openCases:
              role === "hr_admin"
                ? state.hrCases.filter((c) => c.status !== "Resolved").length
                : state.hrCases.filter(
                    (c) => c.workerId === workerId && c.status !== "Resolved",
                  ).length,
            enrollmentDone: state.elections.some((e) => e.workerId === workerId),
            openInternalJobs: state.jobs.filter((j) => j.status === "Open")
              .length,
            assignedAssets: (state.assets ?? [])
              .filter(
                (a) => a.workerId === workerId && a.status === "Assigned",
              )
              .map((a) => ({ kind: a.kind, tag: a.tag })),
            openAccess: (state.accessRequests ?? []).filter((r) =>
              role === "hr_admin"
                ? r.status === "Open"
                : r.workerId === workerId && r.status === "Open",
            ).length,
            openMoves: (state.orgMoves ?? []).filter((m) =>
              role === "hr_admin"
                ? m.status === "Submitted"
                : m.workerId === workerId && m.status === "Submitted",
            ).length,
            nextPayDate:
              [...(state.payrollRuns ?? [])]
                .filter((r) => r.status !== "Complete")
                .sort((a, b) => a.payDate.localeCompare(b.payDate))[0]
                ?.payDate ?? "2026-10-31",
            openRunStatus:
              (state.payrollRuns ?? []).find((r) => r.status !== "Complete")
                ?.status ?? "",
            activeGarnish: (state.garnishments ?? []).filter(
              (g) => g.status === "Active",
            ).length,
            ...(() => {
              const snap = insightSnapshot({
                candidates: state.candidates,
                jobs: state.jobs,
                timesheets: state.timesheets,
                exceptions: state.exceptions,
                expenses: state.expenses,
                purchases: state.purchases,
                scenario: state.planningScenario,
              });
              return {
                insightHeadcount: snap.headcount,
                insightPipeline: snap.pipeline,
                insightOpenJobs: snap.openJobs,
                insightSpendVariance: snap.spendVariance,
                insightDrafts: snap.drafts,
              };
            })(),
            ...(() => {
              const mine = (state.learnAssignments ?? []).filter(
                (a) => a.workerId === workerId && a.status !== "Completed",
              );
              const scope =
                role === "hr_admin"
                  ? (state.learnAssignments ?? [])
                  : role === "manager"
                    ? (state.learnAssignments ?? []).filter((a) =>
                        getDirectReports(workerId).some((w) => w.id === a.workerId),
                      )
                    : mine;
              const overdue = scope.filter((a) => isOverdue(a));
              const next = mine[0];
              return {
                learnAssigned: mine.length,
                learnOverdue: overdue.length,
                learnOpenTitle: next
                  ? (courseById(next.courseId)?.title ?? next.courseId)
                  : null,
              };
            })(),
          };

          let source: AgentSource = "rules";
          let reply = runAgent(trimmed, ctx);
          if (process.env.NEXT_PUBLIC_AGENT_LLM === "1") {
            try {
              const res = await fetch("/api/agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  prompt: trimmed,
                  toolIds: AGENT_TOOL_IDS,
                }),
              });
              const data = (await res.json()) as {
                mode?: string;
                toolId?: string;
              };
              if (data.mode === "llm" && data.toolId) {
                reply = runAgentTool(data.toolId, trimmed, ctx);
                source = "llm";
              }
            } catch {
              source = "rules";
            }
          }

          appendAgentAudit({
            personaId: session?.user.personaId ?? "employee",
            role,
            toolId: reply.toolId ?? "fallback",
            prompt: trimmed,
            source,
          });

          if (reply.timeOffPrefill) {
            window.sessionStorage.setItem(
              "work-beacon-timeoff-prefill",
              JSON.stringify(reply.timeOffPrefill),
            );
          }

          let text = reply.text;
          if (reply.submitDraftTimesheet) {
            const submitted = submitLastDraftTimesheet(workerId);
            if (submitted) {
              text = `${text}\n\nSubmitted week of ${submitted.weekStart}.`;
            }
          }

          if (reply.submitExpense) {
            const row = addExpense({
              workerId,
              amount: reply.submitExpense.amount,
              merchant: reply.submitExpense.merchant,
              category: reply.submitExpense.category,
              date: new Date().toISOString().slice(0, 10),
              receiptName: "agent-software.txt",
              receiptKb: 4,
            });
            text = `${text}\n\nFiled **${row.id}** as Submitted.`;
          }

          if (reply.fileCase) {
            const row = addHrCase({
              workerId,
              category: reply.fileCase.category,
              subject: reply.fileCase.subject,
              body: "Opened from the agent.",
            });
            text = `${text}\n\nOpened **${row.id}**.`;
          }

          if (reply.completeLearnId) {
            const open = (state.learnAssignments ?? []).find(
              (a) => a.workerId === workerId && a.status !== "Completed",
            );
            if (open) {
              const cert = completeLearnAssignment(open.id);
              text = cert
                ? `${text}\n\nCertificate **${cert.id}** issued ${cert.issued}.`
                : `${text}\n\nCould not complete.`;
            }
          }

          if (reply.requestAccess) {
            const row = requestAccess({
              workerId,
              app: reply.requestAccess.app,
              roleLabel: reply.requestAccess.roleLabel,
            });
            text = row
              ? `${text}\n\nOpened **${row.id}**.`
              : `${text}\n\nYou already have an open request for that app.`;
          }

          const agentMsg: ChatMessage = {
            id: uid(),
            role: "agent",
            text,
            at: new Date().toISOString(),
            href: reply.href,
          };
          setMessages((prev) => [...prev, agentMsg]);
          setTyping(false);

          if (reply.href?.startsWith("/dashboard/time-off")) {
            router.push(reply.href);
          } else if (reply.submitDraftTimesheet) {
            router.push("/dashboard/timesheets");
          } else if (reply.href?.startsWith("/dashboard/schedule")) {
            router.push(reply.href);
          } else if (reply.href?.startsWith("/dashboard/onboarding")) {
            router.push(reply.href);
          } else if (reply.href?.startsWith("/dashboard/learning")) {
            router.push(reply.href);
          } else if (reply.href?.startsWith("/dashboard/expenses")) {
            router.push(reply.href);
          } else if (reply.href?.startsWith("/dashboard/pay")) {
            router.push(reply.href);
          } else if (reply.href?.startsWith("/dashboard/pulse")) {
            router.push(reply.href);
          } else if (reply.href?.startsWith("/dashboard/benefits")) {
            router.push(reply.href);
          } else if (reply.href?.startsWith("/dashboard/")) {
            router.push(reply.href);
          }
        })();
      }, 450);
    },
    [
      typing,
      pto,
      payStubs,
      events,
      router,
      session,
      leaveBalancesFor,
      state.shifts,
      state.timesheets,
      state.onboarding,
      state.skills,
      state.pulseResponses,
      submitLastDraftTimesheet,
      addExpense,
      addHrCase,
      requestAccess,
      completeLearnAssignment,
      state.learnAssignments,
      state.assets,
      state.accessRequests,
      state.orgMoves,
      benefits,
      openInboxCount,
      appendAgentAudit,
      state.hrCases,
      state.elections,
      state.jobs,
    ],
  );

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
      messages,
      typing,
      send,
      clearChat,
      showOnboarding: ready && showOnboarding,
      dismissOnboarding,
      skipOnboarding,
    }),
    [
      open,
      toggle,
      messages,
      typing,
      send,
      clearChat,
      ready,
      showOnboarding,
      dismissOnboarding,
      skipOnboarding,
    ],
  );

  return (
    <AgentUiContext.Provider value={value}>{children}</AgentUiContext.Provider>
  );
}

export function useAgentUi() {
  const ctx = useContext(AgentUiContext);
  if (!ctx) throw new Error("useAgentUi must be used within AgentProvider");
  return ctx;
}

export { AGENT_NAME };
