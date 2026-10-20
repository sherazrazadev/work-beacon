"use client";

import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAgentUi, AGENT_NAME } from "@/components/agent/agent-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { QUICK_PROMPTS, proactiveChips } from "@/lib/agent";
import { cn } from "@/lib/utils";

function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[var(--fg)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function AgentPanel() {
  const { open, setOpen, messages, typing, send, clearChat } = useAgentUi();
  const { session } = useAuth();
  const { state } = useMock();
  const [draft, setDraft] = useState("");
  const chips = useMemo(
    () =>
      proactiveChips(
        state,
        session?.user.role ?? "employee",
        session?.user.workerId ?? "w-alex",
      ),
    [state, session],
  );
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, setOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  if (!open) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(draft);
    setDraft("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-stretch">
      <button
        type="button"
        className="absolute inset-0 top-14 bg-[color-mix(in_oklab,var(--fg)_28%,transparent)] sm:top-0"
        aria-label="Close agent"
        onClick={() => setOpen(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative flex max-h-[min(85dvh,40rem)] w-full flex-col border-t border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:h-full sm:max-h-none sm:max-w-md sm:border-t-0 sm:border-l",
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
          <div>
            <h2
              id={titleId}
              className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--fg)]"
            >
              {AGENT_NAME}
            </h2>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--fg-muted)]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                aria-hidden
              />
              Can see your dashboard data
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={clearChat}
            >
              Clear
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 border-b border-[var(--border)] px-4 py-3">
          {chips.map((p) => (
            <button
              key={p.id}
              type="button"
              className="min-h-8 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs text-[var(--fg)] hover:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              onClick={() => send(p.prompt)}
            >
              {p.label}
            </button>
          ))}
          {QUICK_PROMPTS.slice(0, 4).map((p) => (
            <button
              key={p.id}
              type="button"
              className="min-h-8 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              onClick={() => send(p.text)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">
              Ask about PTO, pay, time off, or upcoming events. Shortcut: ⌘K /
              Ctrl+K.
            </p>
          ) : null}
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[90%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                m.role === "user"
                  ? "ml-auto bg-[var(--fg)] text-[var(--bg)]"
                  : "mr-auto bg-[var(--surface-muted)] text-[var(--fg)]",
              )}
            >
              {m.role === "agent" ? renderText(m.text) : m.text}
              {m.href && m.role === "agent" ? (
                <Link
                  href={m.href}
                  className="mt-2 block text-xs font-medium text-[var(--accent)]"
                  onClick={() => setOpen(false)}
                >
                  Open related page →
                </Link>
              ) : null}
            </div>
          ))}
          {typing ? (
            <div className="mr-auto rounded-2xl bg-[var(--surface-muted)] px-3 py-2 text-sm text-[var(--fg-muted)]">
              Thinking…
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={onSubmit}
          className="flex gap-2 border-t border-[var(--border)] p-3"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask the agent…"
            className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <Button type="submit" disabled={typing || !draft.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
