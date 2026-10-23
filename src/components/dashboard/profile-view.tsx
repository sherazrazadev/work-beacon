"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useMock } from "@/components/dashboard/mock-provider";
import { LEARNING_PATHS } from "@/lib/mock/talent";

export function ProfileView() {
  const { session } = useAuth();
  const { state, updateProfile, ready } = useMock();
  const workerId = session?.user.workerId ?? "w-alex";
  const skills =
    state.skills.find((s) => s.workerId === workerId)?.tags ?? [];
  const [form, setForm] = useState(state.profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (ready) setForm(state.profile);
  }, [ready, state.profile]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
          Profile
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Personal info and emergency contacts — saved to your account.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="max-w-xl space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        {(
          [
            ["preferredName", "Preferred name"],
            ["phone", "Phone"],
            ["location", "Location"],
            ["timezone", "Timezone"],
            ["emergencyName", "Emergency contact"],
            ["emergencyPhone", "Emergency phone"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm text-[var(--fg-muted)]">
            {label}
            <input
              value={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
            />
          </label>
        ))}
        {saved ? (
          <p className="text-sm text-[var(--accent)]" role="status">
            Saved.
          </p>
        ) : null}
        <Button type="submit">Save profile</Button>
      </form>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Skills
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {skills.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm"
            >
              {tag}
            </li>
          ))}
          {skills.length === 0 ? (
            <li className="text-sm text-[var(--fg-muted)]">No skills tagged.</li>
          ) : null}
        </ul>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          Suggested paths:{" "}
          {skills
            .map((s) => LEARNING_PATHS.find((p) => p.skill === s)?.courseTitle)
            .filter(Boolean)
            .join(" · ") || "none"}
          .{" "}
          <Link href="/dashboard/learning" className="text-[var(--accent)]">
            Learning
          </Link>
        </p>
      </section>
    </div>
  );
}
