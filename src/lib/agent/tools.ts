import type { AgentContext, AgentReply } from "@/lib/agent/types";
import { wellnessTips } from "@/lib/mock/pulse";
import { suggestCourse } from "@/lib/mock/talent";
import {
  WF_TODAY,
  addDaysIso,
  saturdayOfWeek,
  timesheetTotal,
  weekStartMonday,
} from "@/lib/mock/workforce";

const DEMO_TODAY = WF_TODAY;

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function addDays(isoDate: string, days: number) {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export type AgentTool = {
  id: string;
  description: string;
  match: (q: string) => boolean;
  run: (q: string, ctx: AgentContext) => AgentReply;
};

export const AGENT_TOOLS: AgentTool[] = [
  {
    id: "explain_paycheck",
    description: "Break down the latest pay stub into earnings, taxes, deductions.",
    match: (q) =>
      /\bexplain\b/.test(q) && /\b(pay|paycheck|stub)\b/.test(q),
    run: (_q, ctx) => {
      const p = ctx.latestPay;
      const earn = p.earnings
        .map((l) => `• ${l.label} ${money(l.amount)}`)
        .join("\n");
      const tax = p.taxLines
        .map((l) => `• ${l.label} ${money(l.amount)}`)
        .join("\n");
      const ded = p.deductionLines
        .map((l) => `• ${l.label} ${money(l.amount)}`)
        .join("\n");
      return {
        text: `**${p.period}** paid ${p.payDate}.\n\nEarnings:\n${earn}\n\nTaxes:\n${tax}\n\nDeductions:\n${ded}\n\nNet **${money(p.net)}**.`,
        href: `/dashboard/pay/${p.id}`,
      };
    },
  },
  {
    id: "submit_expense",
    description: "File a software expense from the prompt amount (default $42).",
    match: (q) => /\bsubmit\b/.test(q) && /\b(expense|\$?42)\b/.test(q),
    run: (q) => {
      const amountMatch = q.match(/\$?\s*(\d+(?:\.\d{1,2})?)/);
      const amount = amountMatch ? Number(amountMatch[1]) : 42;
      return {
        text: `Submitting a **${money(amount)}** software expense (receipt metadata: agent-software.txt).`,
        href: "/dashboard/expenses",
        submitExpense: {
          amount,
          merchant: "Beacon Software",
          category: "Software",
        },
      };
    },
  },
  {
    id: "request_time_off",
    description: "Prefill a vacation/sick/personal time-off request.",
    match: (q) =>
      /\b(request|book|take|schedule).*(time.?off|vacation|pto|leave)\b/.test(q) ||
      /\b(time.?off|vacation|pto).*(request|book|take)\b/.test(q) ||
      q.includes("request time off"),
    run: (q) => {
      const type = /\bsick\b/.test(q)
        ? "Sick"
        : /\bpersonal\b/.test(q)
          ? "Personal"
          : "Vacation";
      const start = addDays(DEMO_TODAY, 7);
      const end = addDays(DEMO_TODAY, 8);
      return {
        text: `I can start a **${type}** request for ${start} → ${end} (16h suggested). Opening Time Off with those fields filled — submit when ready.`,
        href: "/dashboard/time-off?prefill=1",
        timeOffPrefill: { type, start, end, hours: 16 },
      };
    },
  },
  {
    id: "submit_timesheet",
    description: "Submit the current draft timesheet.",
    match: (q) =>
      /\bsubmit\b/.test(q) && /\b(timesheet|time sheet|last week)\b/.test(q),
    run: (_q, ctx) => {
      const thisWeek = weekStartMonday(DEMO_TODAY);
      const lastWeek = addDaysIso(thisWeek, -7);
      const last = ctx.timesheets.find(
        (t) => t.workerId === ctx.workerId && t.weekStart === lastWeek,
      );
      const draft = ctx.timesheets.find(
        (t) => t.workerId === ctx.workerId && t.status === "Draft",
      );
      if (last && last.status !== "Draft") {
        const extra = draft
          ? ` This week's draft is **${timesheetTotal(draft)}h** — submitting that now.`
          : "";
        return {
          text: `Last week (${lastWeek}) is already **${last.status}** (${timesheetTotal(last)}h).${extra}`,
          href: "/dashboard/timesheets",
          submitDraftTimesheet: Boolean(draft),
        };
      }
      if (draft) {
        return {
          text: `Submitting your draft timesheet for week of ${draft.weekStart} (${timesheetTotal(draft)}h).`,
          href: "/dashboard/timesheets",
          submitDraftTimesheet: true,
        };
      }
      return {
        text: `No draft timesheet to submit. Open Timesheets to enter hours.`,
        href: "/dashboard/timesheets",
      };
    },
  },
  {
    id: "check_schedule",
    description: "Say whether the worker is scheduled Saturday.",
    match: (q) =>
      /\b(am i|i'?m)?\s*(scheduled|working|on the roster)\b/.test(q) ||
      /\bsaturday\b/.test(q),
    run: (q, ctx) => {
      const sat = saturdayOfWeek(weekStartMonday(DEMO_TODAY));
      const shifts = ctx.shifts.filter(
        (s) =>
          s.workerId === ctx.workerId &&
          s.published &&
          (s.date === sat || /\bsaturday\b/.test(q)),
      );
      const satShift = shifts.find((s) => s.date === sat);
      if (satShift) {
        return {
          text: `Yes — you're scheduled **Saturday ${sat}** ${satShift.start}–${satShift.end} at ${satShift.location}.`,
          href: "/dashboard/schedule",
        };
      }
      return {
        text: `No published Saturday (${sat}) shift for you this week.`,
        href: "/dashboard/schedule",
      };
    },
  },
  {
    id: "check_onboarding",
    description: "List open first-week onboarding tasks.",
    match: (q) => /\b(onboarding|first.?week|what'?s left)\b/.test(q),
    run: (_q, ctx) => {
      const open = ctx.onboardingTasks.filter((t) => !t.done);
      if (open.length === 0) {
        return {
          text:
            ctx.onboardingTasks.length === 0
              ? "No onboarding plan on this persona. Hire Jordan on Recruiting, then switch to New hire."
              : "Onboarding is complete — no open first-week tasks.",
          href: "/dashboard/onboarding",
        };
      }
      const lines = open.map((t) => `• ${t.title} (due ${t.due})`).join("\n");
      return {
        text: `Open onboarding items:\n${lines}`,
        href: "/dashboard/onboarding",
      };
    },
  },
  {
    id: "suggest_course",
    description: "Suggest a learning course for a skill.",
    match: (q) =>
      /\b(course|learning|suggest).*\bfor\b/.test(q) ||
      /\bsuggest a course\b/.test(q),
    run: (q, ctx) => {
      const forMatch = q.match(/\bfor\s+(.+)$/);
      const skill = (forMatch?.[1] ?? ctx.skills[0] ?? "TypeScript")
        .replace(/[?.!]/g, "")
        .trim();
      const path = suggestCourse(skill);
      return {
        text: `For **${skill}**, try **${path.courseTitle}** (path skill: ${path.skill}).`,
        href: "/dashboard/learning",
      };
    },
  },
  {
    id: "check_pto",
    description: "Report remaining vacation, sick, and personal hours.",
    match: (q) =>
      /\b(pto|vacation|time off|leave balance|how much leave)\b/.test(q),
    run: (_q, ctx) => ({
      text: `You have **${ctx.vacationHours}h** vacation, **${ctx.sickHours}h** sick, and **${ctx.personalHours}h** personal time remaining (policy minus used).`,
      href: "/dashboard/time-off",
    }),
  },
  {
    id: "last_paycheck",
    description: "Show the latest net pay and period.",
    match: (q) => /\b(pay|paycheck|stub|salary|net pay)\b/.test(q),
    run: (_q, ctx) => {
      const p = ctx.latestPay;
      return {
        text: `Your latest stub (${p.period}) paid **${money(p.net)}** net on ${p.payDate} (gross ${money(p.gross)}). Ask me to **explain my last paycheck** for the line items.`,
        href: "/dashboard/pay",
      };
    },
  },
  {
    id: "next_events",
    description: "List upcoming dashboard events and deadlines.",
    match: (q) =>
      /\b(event|deadline|upcoming|calendar|what's next|whats next)\b/.test(q),
    run: (_q, ctx) => {
      const lines = ctx.events
        .slice(0, 5)
        .map((e) => `• ${e.date} — ${e.title}`)
        .join("\n");
      return {
        text: `Upcoming items:\n${lines}`,
        href: "/dashboard",
      };
    },
  },
  {
    id: "pulse_status",
    description: "Whether this worker has submitted the current Pulse survey.",
    match: (q) => /\b(pulse|engagement|survey)\b/.test(q),
    run: (_q, ctx) => {
      if (ctx.pulseSubmitted) {
        return {
          text: `You already submitted **${ctx.pulseCampaignTitle}**. Managers see theme averages only — no names.`,
          href: "/dashboard/pulse",
        };
      }
      return {
        text: `**${ctx.pulseCampaignTitle}** is open until ${ctx.pulseCloses}. Five Likert questions; answers are aggregated.`,
        href: "/dashboard/pulse",
      };
    },
  },
  {
    id: "wellness_tips",
    description: "Benefits and wellness tips from current enrollments.",
    match: (q) =>
      /\b(wellness|benefits tip|checkup|401|enrollment)\b/.test(q),
    run: (_q, ctx) => {
      const tips = wellnessTips(ctx.benefits, ctx.events);
      if (tips.length === 0) {
        return {
          text: "No wellness tips on this persona. Open Benefits to review enrollments.",
          href: "/dashboard/benefits",
        };
      }
      const lines = tips.map((t) => `• **${t.title}** — ${t.body}`).join("\n");
      return {
        text: `From your enrollments:\n${lines}`,
        href: "/dashboard/benefits",
      };
    },
  },
  {
    id: "inbox_count",
    description: "Count open inbox tasks for this persona.",
    match: (q) => /\b(inbox|to-?do|open tasks?)\b/.test(q),
    run: (_q, ctx) => ({
      text:
        ctx.inboxOpen === 0
          ? "Inbox is clear."
          : `You have **${ctx.inboxOpen}** open inbox item${ctx.inboxOpen === 1 ? "" : "s"}.`,
      href: "/dashboard/inbox",
    }),
  },
  {
    id: "help",
    description: "List what the agent can do.",
    match: (q) => /\b(help|what can you|capabilities)\b/.test(q),
    run: () => ({
      text: `I can check PTO, pay, **explain my last paycheck**, submit a **$42 software expense**, schedule, timesheets, **onboarding**, **Pulse**, wellness tips, inbox, and **suggest a course**.`,
    }),
  },
];

export const AGENT_TOOL_IDS = AGENT_TOOLS.map((t) => t.id);

export function matchAgentTool(input: string): AgentTool | undefined {
  const q = input.toLowerCase();
  return AGENT_TOOLS.find((t) => t.match(q));
}

export function runAgentTool(
  toolId: string,
  input: string,
  ctx: AgentContext,
): AgentReply | null {
  const tool = AGENT_TOOLS.find((t) => t.id === toolId);
  if (!tool) return null;
  return { ...tool.run(input.toLowerCase(), ctx), toolId: tool.id };
}

export function fallbackReply(): AgentReply {
  return {
    toolId: "fallback",
    text: `I didn't catch that. Try **explain my last paycheck**, **Submit $42 software expense**, **What's left in my onboarding?**, **Beacon Pulse**, or **Suggest a course for TypeScript**.`,
  };
}
