"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { useAuth } from "@/components/auth/auth-provider";
import { validateNewPassword } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const { session, ready } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const bad = validateNewPassword(password);
    if (bad) return setError(bad);
    if (password !== confirm) return setError("Passwords do not match.");
    setError(null);
    setBusy(true);
    const sb = getSupabase();
    const { error: err } = await sb.auth.updateUser({ password });
    if (err) {
      setBusy(false);
      return setError(err.message);
    }
    await sb.auth.signOut();
    router.replace("/login?notice=password-updated");
  }

  const shell = "w-full max-w-md rounded-md border border-[var(--border)] bg-[var(--surface)] p-8";

  if (ready && !session) {
    return (
      <div className={shell}>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
          Link expired
        </h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          This reset link is invalid or has expired. Request a new one.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={shell}>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
        Choose a new password
      </h1>
      <form className="mt-6 space-y-4" onSubmit={(e) => void onSubmit(e)} noValidate>
        <Field label="New password">
          <TextInput
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Field label="Confirm password" error={error}>
          <TextInput
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </Field>
        <Button type="submit" className="w-full" disabled={busy || !ready}>
          {busy ? "Saving…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
