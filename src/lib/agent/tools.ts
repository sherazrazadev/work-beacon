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
    description:
      "Break down the latest pay stub into earnings, taxes, deductions.",
    match: (q) => /\bexplain\b/.test(q) && /\b(pay|paycheck|stub)\b/.test(q),
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
    description:
      "File a software expense from the prompt amount (default $42).",
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
      /\b(request|book|take|schedule).*(time.?off|vacation|pto|leave)\b/.test(
        q,
      ) ||
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
    id: "complete_learning",
    description: "Complete the worker's open assigned training.",
    match: (q) =>
      /\b(complete|finish)\b/.test(q) &&
      /\b(course|training|security awareness|learning)\b/.test(q),
    run: (_q, ctx) => {
      if (!ctx.learnOpenTitle) {
        return {
          text: "No open assigned course to complete.",
          href: "/dashboard/learning",
        };
      }
      return {
        text: `Completing **${ctx.learnOpenTitle}**. A certificate is issued if this is the first completion.`,
        href: "/dashboard/learning",
        completeLearnId: "open",
      };
    },
  },
  {
    id: "my_learning",
    description: "List open assigned courses and overdue count.",
    match: (q) =>
      /\b(my learning|assigned course|training due|what courses|learning due)\b/.test(
        q,
      ),
    run: (_q, ctx) => ({
      text:
        ctx.learnAssigned === 0
          ? "No open assigned courses."
          : `You have **${ctx.learnAssigned}** open course${ctx.learnAssigned === 1 ? "" : "s"}${ctx.learnOpenTitle ? ` (next: **${ctx.learnOpenTitle}**)` : ""}. **${ctx.learnOverdue}** overdue.`,
      href: "/dashboard/learning",
    }),
  },
  {
    id: "overdue_learning",
    description: "Team overdue learning count for managers.",
    match: (q) =>
      /\b(overdue).*(course|training|learning)\b/.test(q) ||
      /\bwho is overdue\b/.test(q),
    run: (_q, ctx) => ({
      text: `**${ctx.learnOverdue}** open assignment${ctx.learnOverdue === 1 ? "" : "s"} overdue (due before demo today). Open Team learning to assign.`,
      href: "/dashboard/learning/team",
    }),
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
    id: "next_pay_date",
    description: "Next scheduled pay date from the calendar.",
    match: (q) =>
      /\b(next pay|payday|pay date|when (do|am) i (get )?paid)\b/.test(q),
    run: (_q, ctx) => ({
      text: ctx.nextPayDate
        ? `Next pay date is **${ctx.nextPayDate}**.`
        : "No open pay period on the calendar.",
      href: "/dashboard/pay",
    }),
  },
  {
    id: "payroll_run_status",
    description: "Status of the open payroll run.",
    match: (q) => /\b(payroll run|pay run|has payroll)\b/.test(q),
    run: (_q, ctx) => ({
      text: ctx.openRunStatus
        ? `Open run is **${ctx.openRunStatus}**. Finance completes it on Payroll.`
        : "No open payroll run.",
      href: "/dashboard/payroll",
    }),
  },
  {
    id: "garnish_status",
    description: "Count of active garnishments.",
    match: (q) => /\b(garnish|child support|levy)\b/.test(q),
    run: (_q, ctx) => ({
      text:
        ctx.activeGarnish === 0
          ? "No active garnishments."
          : `**${ctx.activeGarnish}** active garnishment${ctx.activeGarnish === 1 ? "" : "s"}. Applied on calculate.`,
      href: "/dashboard/pay-adjustments",
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
    id: "file_hr_case",
    description: "File a People Operations case from the prompt.",
    match: (q) =>
      /\b(file|create)\b/.test(q) && /\b(case|hr ticket)\b/.test(q),
    run: (q) => {
      const subject = q.replace(/^.*?(case|ticket)\s*(about|for|:)?\s*/i, "").trim();
      return {
        text: `Filing an HR case${subject ? ` about **${subject}**` : ""}. People Operations will see it in Inbox.`,
        href: "/dashboard/cases",
        fileCase: {
          category: /\bpay/.test(q)
            ? "Payroll"
            : /\bbenefit/.test(q)
              ? "Benefits"
              : /\btime/.test(q)
                ? "Time"
                : "Other",
          subject: subject || "Agent-filed case",
        },
      };
    },
  },
  {
    id: "case_status",
    description: "Count open HR cases for this worker or (HR) the queue.",
    match: (q) => /\b(case|ticket)\b/.test(q),
    run: (_q, ctx) => ({
      text:
        ctx.openCases === 0
          ? "No open HR cases on this view."
          : `**${ctx.openCases}** open HR case${ctx.openCases === 1 ? "" : "s"}.`,
      href: "/dashboard/cases",
    }),
  },
  {
    id: "enrollment_status",
    description: "Open enrollment window and whether this worker submitted.",
    match: (q) => /\b(enroll|election|medical plan|401)\b/.test(q),
    run: (_q, ctx) => ({
      text: ctx.enrollmentDone
        ? "Your open-enrollment elections are on file. Open Enrollment to change them before the window closes."
        : "Open enrollment is still open. I can take you to the medical / dental / 401(k) wizard.",
      href: "/dashboard/enrollment",
    }),
  },
  {
    id: "internal_jobs",
    description: "How many internal reqs are open.",
    match: (q) =>
      /\b(internal job|internal req|open reqs?|mobility)\b/.test(q),
    run: (_q, ctx) => ({
      text: `**${ctx.openInternalJobs}** open internal req${ctx.openInternalJobs === 1 ? "" : "s"}. Apply from Internal jobs.`,
      href: "/dashboard/mobility",
    }),
  },
  {
    id: "my_assets",
    description: "List IT assets assigned to this worker.",
    match: (q) => /\b(assets?|laptops?|badges?|phones?|checkout)\b/.test(q),
    run: (_q, ctx) => {
      if (ctx.assignedAssets.length === 0) {
        return {
          text: "No assets assigned. Open IT assets to check one out.",
          href: "/dashboard/assets",
        };
      }
      const lines = ctx.assignedAssets
        .map((a) => `• ${a.kind} ${a.tag}`)
        .join("\n");
      return {
        text: `Assigned to you:\n${lines}`,
        href: "/dashboard/assets",
      };
    },
  },
  {
    id: "request_access",
    description: "Open an access request (default VPN member).",
    match: (q) =>
      /\b(request|need)\b/.test(q) && /\b(access|vpn|github|entitlement)\b/.test(q),
    run: (q) => {
      const app = /\bgithub\b/.test(q)
        ? "GitHub"
        : /\bledger\b/.test(q)
          ? "Finance ledger"
          : /\bpeople\b/.test(q)
            ? "People admin"
            : "VPN";
      return {
        text: `Opening an access request for **${app}**.`,
        href: "/dashboard/access",
        requestAccess: { app, roleLabel: "member" },
      };
    },
  },
  {
    id: "move_status",
    description: "Count submitted transfers and promotions.",
    match: (q) =>
      /\b(transfer|promotion|org change|move status)\b/.test(q),
    run: (_q, ctx) => ({
      text:
        ctx.openMoves === 0
          ? "No submitted transfers or promotions on this view."
          : `**${ctx.openMoves}** org-change request${ctx.openMoves === 1 ? "" : "s"} in Submitted.`,
      href: "/dashboard/moves",
    }),
  },
  {
    id: "wellness_tips",
    description: "Benefits and wellness tips from current enrollments.",
    match: (q) => /\b(wellness|benefits tip|checkup|401|enrollment)\b/.test(q),
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
    id: "people_headcount",
    description: "Company headcount from Beacon Insights.",
    match: (q) =>
      /\b(headcount|how many people|workforce size|people insights)\b/.test(q),
    run: (_q, ctx) => ({
      text: `Northstar headcount is **${ctx.insightHeadcount}** across the demo tenant. Open Insights for department and location mix.`,
      href: "/dashboard/insights",
    }),
  },
  {
    id: "talent_pipeline",
    description: "Recruiting pipeline and open reqs.",
    match: (q) =>
      /\b(pipeline|candidates|funnel|open reqs?)\b/.test(q),
    run: (_q, ctx) => ({
      text: `**${ctx.insightPipeline}** candidates in the funnel · **${ctx.insightOpenJobs}** open reqs.`,
      href: "/dashboard/insights",
    }),
  },
  {
    id: "spend_variance",
    description: "Spend vs Beacon Planning scenario.",
    match: (q) =>
      /\b(spend variance|vs plan|budget vs|labor cost|money insights)\b/.test(q),
    run: (_q, ctx) => {
      const n = ctx.insightSpendVariance;
      const dir = n > 0 ? "over" : n < 0 ? "under" : "on";
      return {
        text: `Actual spend is **${dir}** plan by **${money(Math.abs(n))}**. ${ctx.insightDrafts} draft timesheets on the time board.`,
        href: "/dashboard/insights",
      };
    },
  },
  {
    id: "help",
    description: "List what the agent can do.",
    match: (q) => /\b(help|what can you|capabilities)\b/.test(q),
    run: () => ({
      text: `I can check PTO, pay, **headcount**, **pipeline**, **spend vs plan**, **next payday**, **assigned courses**, **complete training**, overdue learning, **payroll run**, garnishments, expenses, schedule, timesheets, onboarding, Pulse, HR cases, enrollment, jobs, assets, access, moves, inbox, and courses.`,
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
