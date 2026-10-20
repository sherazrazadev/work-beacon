"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const ROLES = [
  "Product Designer · Remote",
  "Platform Engineer · Remote",
  "Customer Success · Hybrid",
] as const;

export function CareersApplyForm() {
  const [role, setRole] = useState<string>(ROLES[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <p className="border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--fg-muted)]">
        Thanks{name ? `, ${name}` : ""}. This is a mock application — nothing was
        submitted. We stored your interest for {role} in the demo UI only.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <label className="block text-sm">
        <span className="text-[var(--fg-muted)]">Role</span>
        <select
          className="mt-1 w-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-[var(--fg-muted)]">Name</span>
        <input
          required
          className="mt-1 w-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--fg-muted)]">Email</span>
        <input
          required
          type="email"
          className="mt-1 w-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--fg-muted)]">Why Work Beacon?</span>
        <textarea
          rows={3}
          className="mt-1 w-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <Button type="submit">Submit application (mock)</Button>
    </form>
  );
}
