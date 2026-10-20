import { BRAND } from "@/lib/brand";

export const AGENT_NAME = `${BRAND.name} Agent`;

export const QUICK_PROMPTS = [
  { id: "pto", label: "How much PTO do I have?", text: "How much PTO do I have?" },
  {
    id: "pay",
    label: "Show my last pay stub",
    text: "Show my last pay stub",
  },
  {
    id: "explain-pay",
    label: "Explain my last paycheck",
    text: "Explain my last paycheck",
  },
  {
    id: "expense-42",
    label: "Submit $42 software expense",
    text: "Submit $42 software expense",
  },
  {
    id: "timeoff",
    label: "Request time off",
    text: "I want to request vacation time off next week",
  },
  {
    id: "saturday",
    label: "Am I scheduled Saturday?",
    text: "Am I scheduled Saturday?",
  },
  {
    id: "timesheet",
    label: "Submit last week's timesheet",
    text: "Submit last week's timesheet",
  },
  {
    id: "onboarding",
    label: "What's left in my onboarding?",
    text: "What's left in my onboarding?",
  },
  {
    id: "course",
    label: "Suggest a course",
    text: "Suggest a course for TypeScript",
  },
  {
    id: "events",
    label: "Upcoming events",
    text: "What upcoming events or deadlines do I have?",
  },
  {
    id: "pulse",
    label: "Beacon Pulse",
    text: "Have I submitted Beacon Pulse?",
  },
  {
    id: "wellness",
    label: "Wellness tips",
    text: "Any wellness or enrollment tips?",
  },
] as const;
