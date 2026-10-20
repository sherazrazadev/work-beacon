import type { ChatMessage } from "@/lib/agent/types";

export const HISTORY_KEY = "work-beacon-agent-history";
export const ONBOARDING_KEY = "work-beacon-agent-onboarded";

export function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(messages: ChatMessage[]) {
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-80)));
}

export function clearHistory() {
  window.localStorage.removeItem(HISTORY_KEY);
}
