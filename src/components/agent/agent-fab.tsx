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
      className="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
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
