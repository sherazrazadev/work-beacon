import type { BenefitEnrollment, DashboardEvent } from "@/lib/mock/data";
import type { DemoRole } from "@/lib/mock/org";
import { WF_TODAY } from "@/lib/mock/workforce";

export const PULSE_CAMPAIGN = {
  id: "pulse-q4-2026",
  title: "Q4 Beacon Pulse",
  closes: "2026-11-15",
  scale: "1 = strongly disagree · 5 = strongly agree",
} as const;

export const PULSE_THEMES = [
  "Workload",
  "Manager support",
  "Growth",
  "Belonging",
  "Tools",
] as const;

export type PulseTheme = (typeof PULSE_THEMES)[number];

export type PulseQuestion = {
  id: string;
  theme: PulseTheme;
  prompt: string;
};

export const PULSE_QUESTIONS: PulseQuestion[] = [
  {
    id: "q1",
    theme: "Workload",
    prompt: "I can finish my work in a reasonable week.",
  },
  {
    id: "q2",
    theme: "Manager support",
    prompt: "My manager gives useful, timely feedback.",
  },
  {
    id: "q3",
    theme: "Growth",
    prompt: "I see a path to grow at Northstar Labs.",
  },
  {
    id: "q4",
    theme: "Belonging",
    prompt: "I feel I belong on this team.",
  },
  {
    id: "q5",
    theme: "Tools",
    prompt: "I have the tools I need to do my job well.",
  },
];

export type PulseScores = Record<string, number>;

export type PulseResponse = {
  id: string;
  campaignId: string;
  /** Stored to block double-submit. Never shown on manager dashboards. */
  workerId: string;
  scores: PulseScores;
  submittedAt: string;
};

export type PulseActionPlan = {
  id: string;
  theme: PulseTheme;
  title: string;
  ownerRoles: DemoRole[];
  createdAt: string;
  inboxTaskId: string;
  note: string;
};

export type AgentAuditEntry = {
  id: string;
  at: string;
  personaId: string;
  role: DemoRole;
  toolId: string;
  prompt: string;
  source: "rules" | "llm";
};

export type ThemeAverage = {
  theme: PulseTheme;
  avg: number;
  n: number;
};

export type WellnessTip = {
  id: string;
  title: string;
  body: string;
  href: string;
};

/** Seeded anonymous-style responses so insights are not empty on first load. */
export const SEED_PULSE_RESPONSES: PulseResponse[] = [
  {
    id: "pr-casey",
    campaignId: PULSE_CAMPAIGN.id,
    workerId: "w-casey",
    scores: { q1: 3, q2: 4, q3: 3, q4: 4, q5: 4 },
    submittedAt: "2026-10-12T14:00:00.000Z",
  },
  {
    id: "pr-riley",
    campaignId: PULSE_CAMPAIGN.id,
    workerId: "w-riley",
    scores: { q1: 2, q2: 3, q3: 4, q4: 4, q5: 3 },
    submittedAt: "2026-10-13T15:20:00.000Z",
  },
  {
    id: "pr-taylor",
    campaignId: PULSE_CAMPAIGN.id,
    workerId: "w-taylor",
    scores: { q1: 4, q2: 5, q3: 4, q4: 5, q5: 4 },
    submittedAt: "2026-10-14T11:05:00.000Z",
  },
  {
    id: "pr-priya",
    campaignId: PULSE_CAMPAIGN.id,
    workerId: "w-priya",
    scores: { q1: 3, q2: 4, q3: 2, q4: 3, q5: 4 },
    submittedAt: "2026-10-15T09:40:00.000Z",
  },
  {
    id: "pr-devon",
    campaignId: PULSE_CAMPAIGN.id,
    workerId: "w-devon",
    scores: { q1: 4, q2: 4, q3: 4, q4: 4, q5: 3 },
    submittedAt: "2026-10-16T16:10:00.000Z",
  },
  {
    id: "pr-sam",
    campaignId: PULSE_CAMPAIGN.id,
    workerId: "w-sam",
    scores: { q1: 5, q2: 4, q3: 3, q4: 4, q5: 5 },
    submittedAt: "2026-10-17T13:30:00.000Z",
  },
];

export const SEED_PULSE_PLANS: PulseActionPlan[] = [];
export const SEED_AGENT_AUDIT: AgentAuditEntry[] = [];

export function hasSubmittedPulse(
  responses: PulseResponse[],
  workerId: string,
  campaignId = PULSE_CAMPAIGN.id,
) {
  return responses.some(
    (r) => r.workerId === workerId && r.campaignId === campaignId,
  );
}

export function themeAverages(responses: PulseResponse[]): ThemeAverage[] {
  const campaign = responses.filter((r) => r.campaignId === PULSE_CAMPAIGN.id);
  return PULSE_QUESTIONS.map((q) => {
    const values = campaign
      .map((r) => r.scores[q.id])
      .filter((n): n is number => typeof n === "number");
    const n = values.length;
    const avg = n ? values.reduce((a, b) => a + b, 0) / n : 0;
    return { theme: q.theme, avg, n };
  });
}

export function lowestTheme(responses: PulseResponse[]): ThemeAverage | null {
  const avgs = themeAverages(responses).filter((t) => t.n > 0);
  if (avgs.length === 0) return null;
  return avgs.reduce((a, b) => (b.avg < a.avg ? b : a));
}

export function daysUntil(fromIso: string, toIso: string) {
  const a = new Date(`${fromIso}T12:00:00`);
  const b = new Date(`${toIso}T12:00:00`);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function wellnessTips(
  benefits: BenefitEnrollment[],
  events: DashboardEvent[],
  asOf = WF_TODAY,
): WellnessTip[] {
  const tips: WellnessTip[] = [];
  const medical = benefits.find((b) => b.name === "Medical");
  const dental = benefits.find((b) => b.name === "Dental");
  const k401 = benefits.find((b) => /401/.test(b.name));
  const enrollment = events.find((e) => /open enrollment/i.test(e.title));

  if (enrollment) {
    const days = daysUntil(asOf, enrollment.date);
    tips.push({
      id: "enroll",
      title: "Open enrollment",
      body:
        days >= 0
          ? `${enrollment.title} in ${days} day${days === 1 ? "" : "s"} (${enrollment.date}).`
          : `${enrollment.title} — window closed.`,
      href: "/dashboard/benefits",
    });
  }
  if (medical) {
    tips.push({
      id: "medical",
      title: medical.plan,
      body: "Preventive visits are covered — book a checkup before year-end.",
      href: "/dashboard/benefits",
    });
  }
  if (dental) {
    tips.push({
      id: "dental",
      title: dental.plan,
      body: "Two cleanings a year are included. Schedule the second before December.",
      href: "/dashboard/benefits",
    });
  }
  if (k401) {
    tips.push({
      id: "401k",
      title: k401.plan,
      body: "You are contributing 6%. That typically captures the full match.",
      href: "/dashboard/benefits",
    });
  }
  return tips;
}
