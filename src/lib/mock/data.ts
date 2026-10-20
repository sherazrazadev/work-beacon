export type PayLine = {
  label: string;
  amount: number;
};

export type PayStub = {
  id: string;
  period: string;
  payDate: string;
  net: number;
  gross: number;
  taxes: number;
  deductions: number;
  earnings: PayLine[];
  taxLines: PayLine[];
  deductionLines: PayLine[];
};

export type TimeOffRequest = {
  id: string;
  workerId?: string;
  type: "Vacation" | "Sick" | "Personal";
  start: string;
  end: string;
  hours: number;
  status: "Approved" | "Pending" | "Denied";
};

export type DashboardEvent = {
  id: string;
  title: string;
  date: string;
  kind: "deadline" | "meeting" | "hr";
};

export type BenefitEnrollment = {
  id: string;
  name: string;
  plan: string;
  status: "Active" | "Pending";
};

export type Beneficiary = {
  id: string;
  name: string;
  relationship: string;
  percent: number;
};

export type BenefitDoc = {
  id: string;
  name: string;
  updated: string;
};

export type Goal = {
  id: string;
  title: string;
  progress: number;
  due: string;
};

export type CheckIn = {
  id: string;
  with: string;
  date: string;
  note: string;
};

export type Review = {
  id: string;
  cycle: string;
  status: "Open" | "Complete";
  due: string;
};

export type Course = {
  id: string;
  title: string;
  status: "Assigned" | "In progress" | "Completed";
  progress: number;
};

export type ProfileData = {
  preferredName: string;
  phone: string;
  location: string;
  emergencyName: string;
  emergencyPhone: string;
  timezone: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  ptoDays: number;
};

export type ApprovalItem = {
  id: string;
  employee: string;
  type: string;
  detail: string;
  status: "Pending" | "Approved";
};

export const SEED_PTO = {
  vacationHours: 86,
  sickHours: 40,
  personalHours: 16,
};

export const SEED_PAY_STUBS: PayStub[] = [
  {
    id: "pay-2026-10-15",
    period: "Oct 1–15, 2026",
    payDate: "2026-10-15",
    net: 3240.18,
    gross: 4800,
    taxes: 1104.5,
    deductions: 455.32,
    earnings: [
      { label: "Regular", amount: 4000 },
      { label: "Overtime", amount: 800 },
    ],
    taxLines: [
      { label: "Federal income", amount: 720 },
      { label: "State income", amount: 240 },
      { label: "FICA", amount: 144.5 },
    ],
    deductionLines: [
      { label: "401(k)", amount: 288 },
      { label: "Medical", amount: 167.32 },
    ],
  },
  {
    id: "pay-2026-09-30",
    period: "Sep 16–30, 2026",
    payDate: "2026-09-30",
    net: 3188.4,
    gross: 4800,
    taxes: 1120.1,
    deductions: 491.5,
    earnings: [
      { label: "Regular", amount: 4000 },
      { label: "Overtime", amount: 800 },
    ],
    taxLines: [
      { label: "Federal income", amount: 732.6 },
      { label: "State income", amount: 243 },
      { label: "FICA", amount: 144.5 },
    ],
    deductionLines: [
      { label: "401(k)", amount: 288 },
      { label: "Medical", amount: 203.5 },
    ],
  },
  {
    id: "pay-2026-09-15",
    period: "Sep 1–15, 2026",
    payDate: "2026-09-15",
    net: 3210.02,
    gross: 4800,
    taxes: 1110.0,
    deductions: 479.98,
    earnings: [
      { label: "Regular", amount: 4200 },
      { label: "Bonus", amount: 600 },
    ],
    taxLines: [
      { label: "Federal income", amount: 726 },
      { label: "State income", amount: 239.5 },
      { label: "FICA", amount: 144.5 },
    ],
    deductionLines: [
      { label: "401(k)", amount: 288 },
      { label: "Medical", amount: 191.98 },
    ],
  },
];

export const SEED_TIME_OFF: TimeOffRequest[] = [
  {
    id: "to-1",
    workerId: "w-alex",
    type: "Vacation",
    start: "2026-09-02",
    end: "2026-09-05",
    hours: 32,
    status: "Approved",
  },
  {
    id: "to-2",
    workerId: "w-alex",
    type: "Sick",
    start: "2026-08-12",
    end: "2026-08-12",
    hours: 8,
    status: "Approved",
  },
];

export const SEED_EVENTS: DashboardEvent[] = [
  {
    id: "ev-1",
    title: "Open enrollment ends",
    date: "2026-10-31",
    kind: "deadline",
  },
  {
    id: "ev-2",
    title: "Q4 goals check-in",
    date: "2026-11-05",
    kind: "meeting",
  },
  {
    id: "ev-3",
    title: "Compliance training due",
    date: "2026-11-12",
    kind: "hr",
  },
];

export const SEED_BENEFITS: BenefitEnrollment[] = [
  {
    id: "ben-1",
    name: "Medical",
    plan: "Beacon PPO Gold",
    status: "Active",
  },
  {
    id: "ben-2",
    name: "Dental",
    plan: "Beacon Dental Plus",
    status: "Active",
  },
  {
    id: "ben-3",
    name: "401(k)",
    plan: "6% contribution",
    status: "Active",
  },
];

export const SEED_BENEFICIARIES: Beneficiary[] = [
  { id: "bf-1", name: "Jordan Rivera", relationship: "Spouse", percent: 70 },
  { id: "bf-2", name: "Sam Rivera", relationship: "Child", percent: 30 },
];

export const SEED_BENEFIT_DOCS: BenefitDoc[] = [
  { id: "bd-1", name: "2026 Benefits Summary.pdf", updated: "2026-01-10" },
  { id: "bd-2", name: "FSA Claim Form.pdf", updated: "2026-03-02" },
];

export const SEED_GOALS: Goal[] = [
  {
    id: "g-1",
    title: "Ship Q4 platform milestones",
    progress: 72,
    due: "2026-12-15",
  },
  {
    id: "g-2",
    title: "Mentor two engineers",
    progress: 50,
    due: "2026-12-31",
  },
];

export const SEED_CHECKINS: CheckIn[] = [
  {
    id: "c-1",
    with: "Morgan Lee",
    date: "2026-10-08",
    note: "Aligned on roadmap priorities.",
  },
  {
    id: "c-2",
    with: "Morgan Lee",
    date: "2026-09-10",
    note: "Discussed career growth plan.",
  },
];

export const SEED_REVIEWS: Review[] = [
  {
    id: "r-1",
    cycle: "2026 Mid-year",
    status: "Complete",
    due: "2026-07-01",
  },
  {
    id: "r-2",
    cycle: "2026 Year-end",
    status: "Open",
    due: "2026-12-20",
  },
];

export const SEED_COURSES: Course[] = [
  {
    id: "co-1",
    title: "Security awareness 2026",
    status: "Assigned",
    progress: 0,
  },
  {
    id: "co-2",
    title: "Inclusive leadership",
    status: "In progress",
    progress: 45,
  },
  {
    id: "co-3",
    title: "Manager essentials",
    status: "Completed",
    progress: 100,
  },
];

export const SEED_PROFILE: ProfileData = {
  preferredName: "Alex",
  phone: "+1 (555) 010-2040",
  location: "Austin, TX",
  emergencyName: "Jordan Rivera",
  emergencyPhone: "+1 (555) 010-8899",
  timezone: "America/Chicago",
};

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "Time off approved",
    body: "Your Sep 2–5 vacation was approved.",
    at: "2026-08-20T14:00:00Z",
    read: false,
  },
  {
    id: "n-2",
    title: "New pay stub",
    body: "Oct 15 pay stub is available.",
    at: "2026-10-15T12:00:00Z",
    read: false,
  },
  {
    id: "n-3",
    title: "Learning reminder",
    body: "Security awareness is still assigned.",
    at: "2026-10-10T09:00:00Z",
    read: true,
  },
];

export const SEED_TEAM: TeamMember[] = [
  { id: "tm-1", name: "Casey Nguyen", role: "Engineer", ptoDays: 12 },
  { id: "tm-2", name: "Riley Brooks", role: "Designer", ptoDays: 8 },
  { id: "tm-3", name: "Taylor Kim", role: "PM", ptoDays: 15 },
];

export const SEED_APPROVALS: ApprovalItem[] = [
  {
    id: "ap-1",
    employee: "Casey Nguyen",
    type: "Time off",
    detail: "Nov 20–21 · Vacation · 16h",
    status: "Pending",
  },
  {
    id: "ap-2",
    employee: "Riley Brooks",
    type: "Expense",
    detail: "Design conference · $420",
    status: "Pending",
  },
];
