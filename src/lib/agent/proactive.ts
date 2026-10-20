import type { DemoRole } from "@/lib/mock/org";
import type { MockStoreState } from "@/lib/mock/store";
import {
  daysUntil,
  hasSubmittedPulse,
} from "@/lib/mock/pulse";
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
    chips.push({
      id: "enroll",
      label: `Enrollment ends in ${enrollment}d`,
      prompt: "Any wellness or enrollment tips?",
    });
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

  chips.push({
    id: "help",
    label: "What can you do?",
    prompt: "What can you help with?",
  });

  return chips.slice(0, 4);
}
