import type { InboxTask } from "@/lib/mock/org";

export const CANDIDATE_STAGES = [
  "Applied",
  "Interview",
  "Offer",
  "Hired",
] as const;

export type CandidateStage = (typeof CANDIDATE_STAGES)[number];

export type JobReq = {
  id: string;
  title: string;
  departmentId: string;
  hiringManagerId: string;
  headcount: number;
  status: "Open" | "Filled";
};

export type Scorecard = {
  communication: number;
  craft: number;
  collaboration: number;
  notes: string;
};

export type OfferPacket = {
  salary: number;
  startDate: string;
  generatedAt: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  jobId: string;
  stage: CandidateStage;
  workerId?: string;
  scorecard?: Scorecard;
  offer?: OfferPacket;
};

export type OnboardingTask = {
  id: string;
  title: string;
  due: string;
  done: boolean;
  kind: "i9" | "equipment" | "training" | "other";
};

export type OnboardingPlan = {
  workerId: string;
  candidateId?: string;
  tasks: OnboardingTask[];
};

export type OffboardingTask = {
  id: string;
  title: string;
  done: boolean;
  revoke?: boolean;
};

export type OffboardingPlan = {
  id: string;
  workerId: string;
  initiatedBy: string;
  status: "Open" | "Complete";
  tasks: OffboardingTask[];
};

export type SkillTag = {
  workerId: string;
  tags: string[];
};

export type LearningPath = {
  skill: string;
  courseTitle: string;
};

export type SuccessionBox = {
  id: string;
  roleTitle: string;
  incumbentWorkerId: string;
  readyNow: string[];
  ready1yr: string[];
};

export type GoalRating = {
  goalId: string;
  workerId: string;
  rating: number;
};

export type PeerFeedback = {
  id: string;
  fromWorkerId: string;
  toWorkerId: string;
  text: string;
  date: string;
};

export const SEED_JOBS: JobReq[] = [
  {
    id: "job-swe",
    title: "Senior Software Engineer",
    departmentId: "dep-eng",
    hiringManagerId: "w-morgan",
    headcount: 2,
    status: "Open",
  },
  {
    id: "job-des",
    title: "Product Designer",
    departmentId: "dep-prod",
    hiringManagerId: "w-morgan",
    headcount: 1,
    status: "Open",
  },
];

export const SEED_CANDIDATES: Candidate[] = [
  {
    id: "cand-jordan",
    name: "Jordan Hale",
    email: "jordan.hale@example.com",
    jobId: "job-swe",
    stage: "Offer",
    workerId: "w-jordan",
    scorecard: {
      communication: 4,
      craft: 5,
      collaboration: 4,
      notes: "Strong systems depth. Hire if band fits.",
    },
  },
  {
    id: "cand-kai",
    name: "Kai Patel",
    email: "kai.patel@example.com",
    jobId: "job-swe",
    stage: "Interview",
  },
  {
    id: "cand-dana",
    name: "Dana Ruiz",
    email: "dana.ruiz@example.com",
    jobId: "job-des",
    stage: "Applied",
  },
];

export const SEED_ONBOARDING: OnboardingPlan[] = [];

export const SEED_OFFBOARDING: OffboardingPlan[] = [];

export const SEED_SKILLS: SkillTag[] = [
  { workerId: "w-alex", tags: ["TypeScript", "Platform", "Mentoring"] },
  { workerId: "w-casey", tags: ["TypeScript", "APIs"] },
  { workerId: "w-riley", tags: ["Design systems", "Figma"] },
  { workerId: "w-morgan", tags: ["Engineering leadership", "Hiring"] },
  { workerId: "w-jordan", tags: ["TypeScript", "Distributed systems"] },
];

export const LEARNING_PATHS: LearningPath[] = [
  { skill: "TypeScript", courseTitle: "Advanced TypeScript for platform teams" },
  { skill: "Mentoring", courseTitle: "Manager essentials" },
  { skill: "Hiring", courseTitle: "Inclusive interviewing" },
  { skill: "Design systems", courseTitle: "Inclusive leadership" },
  { skill: "APIs", courseTitle: "Security awareness 2026" },
];

export const SEED_SUCCESSION: SuccessionBox[] = [
  {
    id: "suc-eng-dir",
    roleTitle: "Director of Engineering",
    incumbentWorkerId: "w-morgan",
    readyNow: ["w-alex"],
    ready1yr: ["w-casey"],
  },
  {
    id: "suc-pm",
    roleTitle: "Product Manager",
    incumbentWorkerId: "w-taylor",
    readyNow: [],
    ready1yr: ["w-riley"],
  },
];

export const SEED_GOAL_RATINGS: GoalRating[] = [
  { goalId: "g-1", workerId: "w-alex", rating: 4 },
  { goalId: "g-2", workerId: "w-alex", rating: 3 },
];

export const SEED_FEEDBACK: PeerFeedback[] = [
  {
    id: "fb-1",
    fromWorkerId: "w-casey",
    toWorkerId: "w-alex",
    text: "Clear design docs on the agent tools work.",
    date: "2026-10-08",
  },
];

export function onboardingTemplate(workerId: string): OnboardingTask[] {
  return [
    {
      id: `ob-${workerId}-i9`,
      title: "Complete I-9 verification (stub)",
      due: "2026-10-27",
      done: false,
      kind: "i9",
    },
    {
      id: `ob-${workerId}-eq`,
      title: "Request laptop and badge",
      due: "2026-10-27",
      done: false,
      kind: "equipment",
    },
    {
      id: `ob-${workerId}-tr`,
      title: "Start security awareness training",
      due: "2026-10-28",
      done: false,
      kind: "training",
    },
    {
      id: `ob-${workerId}-em`,
      title: "Add emergency contact",
      due: "2026-10-28",
      done: false,
      kind: "other",
    },
  ];
}

export function onboardingInbox(workerId: string, tasks: OnboardingTask[]): InboxTask[] {
  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    kind: "onboarding" as const,
    due: t.due,
    done: t.done,
    forRoles: ["employee"] as InboxTask["forRoles"],
    workerId,
  }));
}

export function offboardingTemplate(workerId: string, initiatedBy: string): OffboardingPlan {
  return {
    id: `off-${workerId}`,
    workerId,
    initiatedBy,
    status: "Open",
    tasks: [
      { id: `${workerId}-exit-it`, title: "Revoke SSO / laptop access", done: false, revoke: true },
      { id: `${workerId}-exit-hr`, title: "Collect badge and keys", done: false },
      { id: `${workerId}-exit-know`, title: "Knowledge transfer notes", done: false },
      { id: `${workerId}-exit-pay`, title: "Final pay and PTO payout stub", done: false },
    ],
  };
}

export function suggestCourse(skillQuery: string) {
  const q = skillQuery.toLowerCase();
  return (
    LEARNING_PATHS.find((p) => p.skill.toLowerCase().includes(q) || q.includes(p.skill.toLowerCase())) ??
    LEARNING_PATHS.find((p) => q.includes(p.courseTitle.toLowerCase())) ??
    LEARNING_PATHS[0]
  );
}
