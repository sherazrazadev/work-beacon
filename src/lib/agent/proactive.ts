import type { DemoRole } from "@/lib/mock/org";
import type { MockStoreState } from "@/lib/mock/store";
import { daysUntil, hasSubmittedPulse } from "@/lib/mock/pulse";
import { isOverdue, openAssignments } from "@/lib/mock/learn";
import { WF_TODAY, weekStartMonday } from "@/lib/mock/workforce";

export type AgentChip = {
  id: string;
  label: string;
  prompt: string;
};

export function proactiveChips(
  state: MockStoreState,
  role: DemoRole,
  workerId: string,
): AgentChip[] {
  const chips: AgentChip[] = [];
  const thisWeek = weekStartMonday(WF_TODAY);

  const openLearn = openAssignments(state.learnAssignments ?? [], workerId);
  if (openLearn.length > 0) {
    chips.push({
      id: "learning",
      label:
        openLearn.filter((a) => isOverdue(a)).length > 0
          ? "Training overdue"
          : "Open training",
      prompt: "What courses are assigned to me?",
    });
  }

  if (!hasSubmittedPulse(state.pulseResponses, workerId)) {
    chips.push({
      id: "pulse",
      label: "Take Pulse survey",
      prompt: "Have I submitted Beacon Pulse?",
    });
  }

  const draft = state.timesheets.find(
    (t) =>
      t.workerId === workerId &&
      t.status === "Draft" &&
      t.weekStart === thisWeek,
  );
  if (draft) {
    chips.push({
      id: "timesheet",
      label: "Submit timesheet",
      prompt: "Submit last week's timesheet",
    });
  }

  const enrollment = daysUntil(WF_TODAY, "2026-10-31");
  if (enrollment >= 0 && enrollment <= 14) {
    const done = state.elections.some((e) => e.workerId === workerId);
    chips.push({
      id: "enroll",
      label: done
        ? `Enrollment ends in ${enrollment}d`
        : `Enroll — ${enrollment}d left`,
      prompt: "Have I submitted open enrollment?",
    });
  }

  const mineAssets = (state.assets ?? []).filter(
    (a) => a.workerId === workerId && a.status === "Assigned",
  ).length;
  if (mineAssets === 0) {
    chips.push({
      id: "assets",
      label: "Check out an asset",
      prompt: "What assets are assigned to me?",
    });
  }

  if (role === "hr_admin") {
    const openAcc = (state.accessRequests ?? []).filter((r) => r.status === "Open")
      .length;
    if (openAcc > 0) {
      chips.push({
        id: "access",
        label: `${openAcc} access request${openAcc === 1 ? "" : "s"}`,
        prompt: "What's in my inbox?",
      });
    }
    const openCases = state.hrCases.filter((c) => c.status !== "Resolved").length;
    if (openCases > 0) {
      chips.push({
        id: "cases",
        label: `${openCases} HR case${openCases === 1 ? "" : "s"} open`,
        prompt: "How many open HR cases do I have?",
      });
    }
  }

  if (role === "manager" || role === "hr_admin") {
    const pendingTime = state.timeOff.filter(
      (t) => t.status === "Pending" && t.workerId && t.workerId !== workerId,
    ).length;
    if (pendingTime > 0) {
      chips.push({
        id: "approvals",
        label: `${pendingTime} time-off to review`,
        prompt: "What's in my inbox?",
      });
    }
  }

  if (role === "manager" || role === "finance" || role === "hr_admin") {
    const pendingExp = state.expenses.filter(
      (e) => e.status === "Submitted",
    ).length;
    if (pendingExp > 0) {
      chips.push({
        id: "expenses",
        label: `${pendingExp} expense${pendingExp === 1 ? "" : "s"} waiting`,
        prompt: "What's in my inbox?",
      });
    }
  }

  if (role === "manager" || role === "hr_admin" || role === "finance") {
    chips.push({
      id: "insights",
      label: "Insights snapshot",
      prompt: "What is our headcount?",
    });
  }

  chips.push({
    id: "help",
    label: "What can you do?",
    prompt: "What can you help with?",
  });

  return chips.slice(0, 4);
}
