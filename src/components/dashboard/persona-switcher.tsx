"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { PERSONAS, roleLabel } from "@/lib/mock/org";

export function PersonaSwitcher() {
  const { session, switchPersona } = useAuth();
  // Persona switching signs in as another demo user; it exists only in the demo workspace.
  if (!session?.user.demo) return null;

  return (
    <label className="flex min-w-0 items-center gap-2 text-xs text-[var(--fg-muted)]">
      <span className="hidden sm:inline">Persona</span>
      <select
        aria-label="Switch demo persona"
        className="h-10 min-w-0 max-w-[7.5rem] truncate rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 text-xs text-[var(--fg)] sm:h-8 sm:max-w-none"
        value={session.user.personaId}
        onChange={(e) => void switchPersona(e.target.value)}
      >
        {PERSONAS.map((p) => (
          <option key={p.id} value={p.id}>
            {roleLabel(p.role)}
          </option>
        ))}
      </select>
    </label>
  );
}
