import { WF_TODAY } from "@/lib/mock/workforce";

export type LearnStatus = "Assigned" | "In progress" | "Completed";

export type LearnCourse = {
  id: string;
  title: string;
  hours: number;
  required: boolean;
  skill?: string;
};

export type LearnAssignment = {
  id: string;
  courseId: string;
  workerId: string;
  status: LearnStatus;
  progress: number;
  due: string;
  assignedAt: string;
  completedAt?: string;
  certificateId?: string;
};

export type LearnCertificate = {
  id: string;
  assignmentId: string;
  workerId: string;
  courseTitle: string;
  issued: string;
};

export const LEARN_COURSES: LearnCourse[] = [
  {
    id: "co-sec",
    title: "Security awareness 2026",
    hours: 1,
    required: true,
    skill: "APIs",
  },
  {
    id: "co-lead",
    title: "Inclusive leadership",
    hours: 3,
    required: false,
    skill: "Design systems",
  },
  {
    id: "co-mgr",
    title: "Manager essentials",
    hours: 4,
    required: false,
    skill: "Mentoring",
  },
  {
    id: "co-ts",
    title: "Advanced TypeScript for platform teams",
    hours: 6,
    required: false,
    skill: "TypeScript",
  },
  {
    id: "co-hire",
    title: "Inclusive interviewing",
    hours: 2,
    required: false,
    skill: "Hiring",
  },
];

export const SEED_LEARN_ASSIGNMENTS: LearnAssignment[] = [
  {
    id: "la-alex-sec",
    courseId: "co-sec",
    workerId: "w-alex",
    status: "Assigned",
    progress: 0,
    due: "2026-11-12",
    assignedAt: "2026-10-01",
  },
  {
    id: "la-alex-lead",
    courseId: "co-lead",
    workerId: "w-alex",
    status: "In progress",
    progress: 45,
    due: "2026-11-30",
    assignedAt: "2026-09-15",
  },
  {
    id: "la-alex-mgr",
    courseId: "co-mgr",
    workerId: "w-alex",
    status: "Completed",
    progress: 100,
    due: "2026-09-30",
    assignedAt: "2026-08-01",
    completedAt: "2026-09-20",
    certificateId: "cert-alex-mgr",
  },
  {
    id: "la-casey-sec",
    courseId: "co-sec",
    workerId: "w-casey",
    status: "Assigned",
    progress: 0,
    due: "2026-10-15",
    assignedAt: "2026-09-20",
  },
  {
    id: "la-riley-sec",
    courseId: "co-sec",
    workerId: "w-riley",
    status: "In progress",
    progress: 20,
    due: "2026-11-12",
    assignedAt: "2026-10-01",
  },
];

export const SEED_LEARN_CERTS: LearnCertificate[] = [
  {
    id: "cert-alex-mgr",
    assignmentId: "la-alex-mgr",
    workerId: "w-alex",
    courseTitle: "Manager essentials",
    issued: "2026-09-20",
  },
];

export function courseById(id: string) {
  return LEARN_COURSES.find((c) => c.id === id);
}

export function isOverdue(a: LearnAssignment, asOf = WF_TODAY) {
  return a.status !== "Completed" && a.due < asOf;
}

export function assignmentsFor(workerId: string, rows: LearnAssignment[]) {
  return rows.filter((a) => a.workerId === workerId);
}

export function openAssignments(rows: LearnAssignment[], workerId: string) {
  return rows.filter((a) => a.workerId === workerId && a.status !== "Completed");
}
