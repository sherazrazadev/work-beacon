import type { DemoRole } from "@/lib/mock/org";

export type TourStep = {
  id: string;
  title: string;
  body: string;
  href: string;
};

export const TOUR_KEY_PREFIX = "work-beacon-tour-v1";

export function tourStorageKey(role: DemoRole) {
  return `${TOUR_KEY_PREFIX}-${role}`;
}

export function tourStepsFor(role: DemoRole): TourStep[] {
  if (role === "manager" || role === "hr_admin") {
    return [
      {
        id: "inbox",
        title: "Inbox first",
        body: "Approvals and Pulse action plans land here. Clear them before they age.",
        href: "/dashboard/inbox",
      },
      {
        id: "team",
        title: "Your team",
        body: "Time-off, exceptions, and directory for the people you manage.",
        href: "/dashboard/team",
      },
      {
        id: "pulse",
        title: "Pulse insights",
        body: "Theme averages only — no names. Create an action plan for the lowest score.",
        href: "/dashboard/pulse/insights",
      },
      {
        id: "agent",
        title: "Ask the agent",
        body: "⌘K / Ctrl+K. Proactive chips appear when Pulse, timesheets, or approvals are waiting.",
        href: "/dashboard",
      },
    ];
  }
  return [
    {
      id: "home",
      title: "Your home",
      body: "PTO, latest pay, upcoming deadlines, and wellness tips from your enrollments.",
      href: "/dashboard",
    },
    {
      id: "time",
      title: "Time",
      body: "Request leave, fill the draft timesheet, and check Saturday's shift.",
      href: "/dashboard/time-off",
    },
    {
      id: "pay",
      title: "Pay",
      body: "Open a stub, then ask the agent to explain earnings, taxes, and deductions.",
      href: "/dashboard/pay",
    },
    {
      id: "pulse",
      title: "Beacon Pulse",
      body: "Five Likert questions. Your name stays off the manager dashboard.",
      href: "/dashboard/pulse",
    },
    {
      id: "agent",
      title: "The agent",
      body: "⌘K / Ctrl+K anytime. Try “How much PTO do I have?” or “Take Pulse survey”.",
      href: "/dashboard",
    },
  ];
}
