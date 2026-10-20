import type { TimeOffRequest } from "@/lib/mock/data";

/** Demo "today" for deterministic workforce screens. */
export const WF_TODAY = "2026-10-20";

export type LeaveType = TimeOffRequest["type"];

export type LeavePolicy = {
  type: LeaveType;
  accrualHoursPerMonth: number;
  annualCap: number;
  startingBalance: number;
  note: string;
};

export const LEAVE_POLICIES: LeavePolicy[] = [
  {
    type: "Vacation",
    accrualHoursPerMonth: 10,
    annualCap: 160,
    startingBalance: 80,
    note: "Accrues 10h/month; cap 160h.",
  },
  {
    type: "Sick",
    accrualHoursPerMonth: 4,
    annualCap: 64,
    startingBalance: 24,
    note: "Accrues 4h/month; cap 64h.",
  },
  {
    type: "Personal",
    accrualHoursPerMonth: 0,
    annualCap: 16,
    startingBalance: 16,
    note: "16h granted Jan 1; no monthly accrual.",
  },
];

export type TimesheetDay = {
  date: string;
  hours: number;
  costCenterId?: string;
  project?: string;
};

export type Timesheet = {
  id: string;
  workerId: string;
  weekStart: string;
  days: TimesheetDay[];
  status: "Draft" | "Submitted" | "Approved";
};

export type Punch = {
  id: string;
  workerId: string;
  at: string;
  kind: "in" | "out";
};

export type Shift = {
  id: string;
  workerId: string;
  date: string;
  start: string;
  end: string;
  location: string;
  published: boolean;
};

export type TimeException = {
  id: string;
  workerId: string;
  kind: "overtime" | "missing_punch";
  detail: string;
  weekStart: string;
  resolved: boolean;
};

export const SEED_TEAM_LEAVE: TimeOffRequest[] = [
  {
    id: "to-c1",
    workerId: "w-casey",
    type: "Vacation",
    start: "2026-10-22",
    end: "2026-10-23",
    hours: 16,
    status: "Approved",
  },
  {
    id: "to-r1",
    workerId: "w-riley",
    type: "Sick",
    start: "2026-10-20",
    end: "2026-10-20",
    hours: 8,
    status: "Pending",
  },
];

export const SEED_TIMESHEETS: Timesheet[] = [
  {
    id: "ts-alex-1012",
    workerId: "w-alex",
    weekStart: "2026-10-12",
    status: "Approved",
    days: [
      { date: "2026-10-12", hours: 8, costCenterId: "cc-eng", project: "Platform" },
      { date: "2026-10-13", hours: 8, costCenterId: "cc-eng", project: "Platform" },
      { date: "2026-10-14", hours: 8, costCenterId: "cc-eng", project: "Platform" },
      { date: "2026-10-15", hours: 8, costCenterId: "cc-eng", project: "Platform" },
      { date: "2026-10-16", hours: 8, costCenterId: "cc-eng", project: "Platform" },
      { date: "2026-10-17", hours: 0 },
      { date: "2026-10-18", hours: 0 },
    ],
  },
  {
    id: "ts-alex-1019",
    workerId: "w-alex",
    weekStart: "2026-10-19",
    status: "Draft",
    days: [
      { date: "2026-10-19", hours: 8, costCenterId: "cc-eng", project: "Platform" },
      { date: "2026-10-20", hours: 6, costCenterId: "cc-eng", project: "Platform" },
      { date: "2026-10-21", hours: 0, costCenterId: "cc-eng" },
      { date: "2026-10-22", hours: 0 },
      { date: "2026-10-23", hours: 0 },
      { date: "2026-10-24", hours: 0 },
      { date: "2026-10-25", hours: 0 },
    ],
  },
  {
    id: "ts-casey-1012",
    workerId: "w-casey",
    weekStart: "2026-10-12",
    status: "Submitted",
    days: [
      { date: "2026-10-12", hours: 10, costCenterId: "cc-eng" },
      { date: "2026-10-13", hours: 10, costCenterId: "cc-eng" },
      { date: "2026-10-14", hours: 10, costCenterId: "cc-eng" },
      { date: "2026-10-15", hours: 10, costCenterId: "cc-eng" },
      { date: "2026-10-16", hours: 8, costCenterId: "cc-eng" },
      { date: "2026-10-17", hours: 0 },
      { date: "2026-10-18", hours: 0 },
    ],
  },
];

export const SEED_PUNCHES: Punch[] = [
  {
    id: "p-1",
    workerId: "w-alex",
    at: "2026-10-20T13:02:00.000Z",
    kind: "in",
  },
  {
    id: "p-2",
    workerId: "w-riley",
    at: "2026-10-20T14:11:00.000Z",
    kind: "in",
  },
];

export const SEED_SHIFTS: Shift[] = [
  {
    id: "sh-a-mon",
    workerId: "w-alex",
    date: "2026-10-19",
    start: "09:00",
    end: "17:00",
    location: "Austin HQ",
    published: true,
  },
  {
    id: "sh-a-tue",
    workerId: "w-alex",
    date: "2026-10-20",
    start: "09:00",
    end: "17:00",
    location: "Austin HQ",
    published: true,
  },
  {
    id: "sh-a-wed",
    workerId: "w-alex",
    date: "2026-10-21",
    start: "09:00",
    end: "17:00",
    location: "Austin HQ",
    published: true,
  },
  {
    id: "sh-a-sat",
    workerId: "w-alex",
    date: "2026-10-24",
    start: "10:00",
    end: "16:00",
    location: "Austin HQ",
    published: true,
  },
  {
    id: "sh-c-sat",
    workerId: "w-casey",
    date: "2026-10-24",
    start: "10:00",
    end: "18:00",
    location: "Remote US",
    published: true,
  },
  {
    id: "sh-r-wed",
    workerId: "w-riley",
    date: "2026-10-21",
    start: "11:00",
    end: "19:00",
    location: "San Francisco",
    published: false,
  },
];

export const SEED_EXCEPTIONS: TimeException[] = [
  {
    id: "ex-1",
    workerId: "w-casey",
    kind: "overtime",
    detail: "48h submitted week of Oct 12 (8h over 40h threshold).",
    weekStart: "2026-10-12",
    resolved: false,
  },
  {
    id: "ex-2",
    workerId: "w-riley",
    kind: "missing_punch",
    detail: "Clocked in Oct 20 with no matching clock-out.",
    weekStart: "2026-10-19",
    resolved: false,
  },
];

export function monthsElapsed(asOf: string) {
  const d = new Date(`${asOf}T12:00:00`);
  return d.getMonth() + 1;
}

export function leaveBalanceFor(
  type: LeaveType,
  requests: TimeOffRequest[],
  asOf = WF_TODAY,
) {
  const policy = LEAVE_POLICIES.find((p) => p.type === type)!;
  const accrued = policy.startingBalance + policy.accrualHoursPerMonth * monthsElapsed(asOf);
  const granted = Math.min(policy.annualCap, accrued);
  const used = requests
    .filter((r) => r.type === type && r.status !== "Denied")
    .reduce((sum, r) => sum + r.hours, 0);
  return {
    type,
    granted,
    used,
    remaining: Math.max(0, granted - used),
    policy,
  };
}

export function allLeaveBalances(requests: TimeOffRequest[], asOf = WF_TODAY) {
  return LEAVE_POLICIES.map((p) => leaveBalanceFor(p.type, requests, asOf));
}

export function weekStartMonday(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function weekDates(weekStart: string) {
  const start = new Date(`${weekStart}T12:00:00`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function addDaysIso(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function timesheetTotal(ts: Timesheet) {
  return ts.days.reduce((sum, d) => sum + d.hours, 0);
}

export function emptyWeekTimesheet(workerId: string, weekStart: string): Timesheet {
  return {
    id: `ts-${workerId}-${weekStart}`,
    workerId,
    weekStart,
    status: "Draft",
    days: weekDates(weekStart).map((date) => ({ date, hours: 0 })),
  };
}

export function saturdayOfWeek(weekStart: string) {
  return addDaysIso(weekStart, 5);
}
