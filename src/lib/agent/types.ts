import type { BenefitEnrollment, DashboardEvent, PayStub } from "@/lib/mock";
import type { Shift, Timesheet } from "@/lib/mock/workforce";
import type { OnboardingTask } from "@/lib/mock/talent";

export type ChatRole = "user" | "agent";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  at: string;
  href?: string;
};

export type AgentContext = {
  vacationHours: number;
  sickHours: number;
  personalHours: number;
  latestPay: PayStub;
  events: DashboardEvent[];
  workerId: string;
  shifts: Shift[];
  timesheets: Timesheet[];
  onboardingTasks: OnboardingTask[];
  skills: string[];
  inboxOpen: number;
  pulseSubmitted: boolean;
  pulseCampaignTitle: string;
  pulseCloses: string;
  benefits: BenefitEnrollment[];
};

export type AgentSource = "rules" | "llm";

export type AgentReply = {
  text: string;
  href?: string;
  toolId?: string;
  /** Optional time-off prefill when navigating to the form */
  timeOffPrefill?: {
    type: "Vacation" | "Sick" | "Personal";
    start?: string;
    end?: string;
    hours?: number;
  };
  submitDraftTimesheet?: boolean;
  submitExpense?: {
    amount: number;
    merchant: string;
    category: string;
  };
};
