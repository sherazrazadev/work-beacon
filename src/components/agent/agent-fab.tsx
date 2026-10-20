"use client";

import { useAgentUi, AGENT_NAME } from "@/components/agent/agent-provider";

export function AgentFab() {
  const { open, toggle } = useAgentUi();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-label={open ? `Close ${AGENT_NAME}` : `Open ${AGENT_NAME}`}
      className="fixed bottom-4 right-4 z-40 hidden h-12 items-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 sm:flex"
    >
      <span aria-hidden className="text-lg">
        ✦
      </span>
      Agent
      <span className="hidden text-[10px] font-normal text-white/80 sm:inline">
        ⌘K
      </span>
    </button>
  );
}
