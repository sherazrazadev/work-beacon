import { WORKERS } from "@/lib/mock/org";
import { WF_TODAY } from "@/lib/mock/workforce";

export const ENROLLMENT_CLOSES = "2026-10-31";

export type CaseCategory = "Payroll" | "Benefits" | "Time" | "Other";
export type CaseStatus = "Open" | "In progress" | "Resolved";

export type HrCase = {
  id: string;
  workerId: string;
  category: CaseCategory;
  subject: string;
  body: string;
  status: CaseStatus;
  createdAt: string;
  inboxTaskId: string;
};

export type DelegationScope = "leave" | "expense" | "all";

export type Delegation = {
  id: string;
  fromWorkerId: string;
  toWorkerId: string;
  scope: DelegationScope;
  start: string;
  end: string;
  inboxTaskId: string;
};

export type CompWorksheet = {
  id: string;
  cycleId: string;
  workerId: string;
  managerId: string;
  current: number;
  proposed: number;
  status: "Draft" | "Submitted";
};

export type JobProfile = {
  id: string;
  family: string;
  titles: string[];
  bandMin: number;
  bandMid: number;
  bandMax: number;
};

export type InternalApplication = {
  id: string;
  workerId: string;
  jobId: string;
  at: string;
  status: "Applied" | "Withdrawn";
  inboxTaskId: string;
};

export type BenefitElection = {
  workerId: string;
  medical: string;
  dental: boolean;
  k401Pct: number;
  submittedAt: string;
};

export type ContingentWorker = {
  id: string;
  name: string;
  vendor: string;
  title: string;
  managerId: string;
  endDate: string;
  status: "Active" | "Ending";
};

export type PolicyArticle = {
  id: string;
  title: string;
  category: string;
  body: string;
};

export const CASE_CATEGORIES: CaseCategory[] = [
  "Payroll",
  "Benefits",
  "Time",
  "Other",
];

export const MEDICAL_PLANS = [
  "Beacon PPO Gold",
  "Beacon HMO Silver",
  "Waive medical",
] as const;

export const COMP_CYCLE = {
  id: "comp-2026",
  name: "2026 annual merit",
  due: "2026-11-14",
} as const;

export const JOB_PROFILES: JobProfile[] = [
  {
    id: "jp-ceo",
    family: "Executive",
    titles: ["Chief Executive Officer"],
    bandMin: 280000,
    bandMid: 340000,
    bandMax: 420000,
  },
  {
    id: "jp-eng-mgr",
    family: "Engineering leadership",
    titles: ["Director of Engineering"],
    bandMin: 210000,
    bandMid: 245000,
    bandMax: 290000,
  },
  {
    id: "jp-eng-sr",
    family: "Engineering IC",
    titles: ["Senior Software Engineer"],
    bandMin: 155000,
    bandMid: 175000,
    bandMax: 205000,
  },
  {
    id: "jp-eng",
    family: "Engineering IC",
    titles: ["Software Engineer", "Software Engineer (incoming)"],
    bandMin: 125000,
    bandMid: 145000,
    bandMax: 165000,
  },
  {
    id: "jp-des",
    family: "Design",
    titles: ["Product Designer"],
    bandMin: 130000,
    bandMid: 150000,
    bandMax: 175000,
  },
  {
    id: "jp-pm",
    family: "Product",
    titles: ["Product Manager"],
    bandMin: 140000,
    bandMid: 165000,
    bandMax: 195000,
  },
  {
    id: "jp-hr",
    family: "People",
    titles: ["HR Administrator", "People Partner"],
    bandMin: 110000,
    bandMid: 130000,
    bandMax: 155000,
  },
  {
    id: "jp-fin",
    family: "Finance",
    titles: ["Finance Analyst"],
    bandMin: 115000,
    bandMid: 135000,
    bandMax: 160000,
  },
];

export const CURRENT_SALARY: Record<string, number> = {
  "w-ceo": 340000,
  "w-morgan": 248000,
  "w-alex": 168000,
  "w-casey": 142000,
  "w-riley": 152000,
  "w-taylor": 162000,
  "w-priya": 128000,
  "w-devon": 134000,
  "w-sam": 126000,
  "w-jordan": 138000,
};

export const SEED_CASES: HrCase[] = [
  {
    id: "case-1",
    workerId: "w-casey",
    category: "Payroll",
    subject: "Missing overtime on Oct stub",
    body: "Saturday hours from 4 Oct are not on the 15 Oct stub.",
    status: "Open",
    createdAt: "2026-10-16",
    inboxTaskId: "in-case-1",
  },
];

export const SEED_DELEGATIONS: Delegation[] = [];

export const SEED_COMP: CompWorksheet[] = [
  {
    id: "cw-casey",
    cycleId: COMP_CYCLE.id,
    workerId: "w-casey",
    managerId: "w-morgan",
    current: CURRENT_SALARY["w-casey"],
    proposed: CURRENT_SALARY["w-casey"],
    status: "Draft",
  },
  {
    id: "cw-alex",
    cycleId: COMP_CYCLE.id,
    workerId: "w-alex",
    managerId: "w-morgan",
    current: CURRENT_SALARY["w-alex"],
    proposed: CURRENT_SALARY["w-alex"],
    status: "Draft",
  },
  {
    id: "cw-riley",
    cycleId: COMP_CYCLE.id,
    workerId: "w-riley",
    managerId: "w-morgan",
    current: CURRENT_SALARY["w-riley"],
    proposed: CURRENT_SALARY["w-riley"],
    status: "Draft",
  },
];

export const SEED_INTERNAL_APPS: InternalApplication[] = [];
export const SEED_ELECTIONS: BenefitElection[] = [];

export const SEED_CONTINGENT: ContingentWorker[] = [
  {
    id: "ct-1",
    name: "Quinn Alvarez",
    vendor: "Northshore Staffing",
    title: "Data engineer (contract)",
    managerId: "w-morgan",
    endDate: "2026-12-31",
    status: "Active",
  },
  {
    id: "ct-2",
    name: "Reese Okonkwo",
    vendor: "Beacon Contractors",
    title: "Payroll specialist (contract)",
    managerId: "w-priya",
    endDate: "2026-11-15",
    status: "Ending",
  },
];

export const POLICY_ARTICLES: PolicyArticle[] = [
  {
    id: "pol-pto",
    title: "Time off and holidays",
    category: "Time",
    body: "Vacation accrues monthly to a cap. Sick is for personal or family health. Submit requests before the first day of leave when possible.",
  },
  {
    id: "pol-remote",
    title: "Remote work",
    category: "Workplace",
    body: "Remote US workers keep Austin core hours overlap 10:00–15:00 CT. Equipment is issued at hire. Camera on for customer calls.",
  },
  {
    id: "pol-pay",
    title: "Pay and overtime",
    category: "Pay",
    body: "Non-exempt overtime is 1.5× after 40h in a week. Stubs publish on pay date. Questions go through an HR case, not email.",
  },
  {
    id: "pol-enroll",
    title: "Open enrollment",
    category: "Benefits",
    body: `The ${ENROLLMENT_CLOSES} window covers medical, dental, and 401(k). Mid-year changes need a qualifying event.`,
  },
  {
    id: "pol-conduct",
    title: "Conduct and reporting",
    category: "People",
    body: "Raise concerns as an HR case marked Other. Retaliation is not permitted. People Operations acknowledges within two business days in this demo.",
  },
];

export function profileForTitle(title: string): JobProfile | undefined {
  return JOB_PROFILES.find((p) =>
    p.titles.some((t) => t.toLowerCase() === title.toLowerCase()),
  );
}

export function meritPct(current: number, proposed: number) {
  if (!current) return 0;
  return ((proposed - current) / current) * 100;
}

export function workerName(id: string) {
  return WORKERS.find((w) => w.id === id)?.name ?? id;
}

export function searchPolicies(q: string) {
  const n = q.trim().toLowerCase();
  if (!n) return POLICY_ARTICLES;
  return POLICY_ARTICLES.filter(
    (p) =>
      p.title.toLowerCase().includes(n) ||
      p.body.toLowerCase().includes(n) ||
      p.category.toLowerCase().includes(n),
  );
}

export function enrollmentOpen(asOf = WF_TODAY) {
  return asOf <= ENROLLMENT_CLOSES;
}
