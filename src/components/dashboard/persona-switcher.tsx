"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { PERSONAS, roleLabel } from "@/lib/mock/org";

export function PersonaSwitcher() {
  const { session, switchPersona } = useAuth();
  if (!session) return null;

  return (
    <label className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
      <span className="hidden sm:inline">Persona</span>
      <select
        aria-label="Switch demo persona"
        className="max-w-[10rem] truncate rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--fg)] sm:max-w-none"
        value={session.user.personaId}
        onChange={(e) => switchPersona(e.target.value)}
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
