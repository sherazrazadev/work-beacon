"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { isDemoEmail } from "@/lib/demo-config";
import { getSupabase } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid work email.");
      return;
    }
    if (isDemoEmail(email.trim().toLowerCase())) {
      setError("Demo accounts use the published demo password; they have no inbox to reset.");
      return;
    }
    setError(null);
    setBusy(true);
    const { error: err } = await getSupabase().auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` },
    );
    setBusy(false);
    // Rate limits are surfaced; unknown accounts are not (no account enumeration).
    if (err && err.status === 429) {
      setError("Too many requests. Try again in a few minutes.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          If an account exists for <strong className="text-[var(--fg)]">{email}</strong>,
          we sent a reset link. The link expires after a short time.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
        Reset password
      </h1>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Enter the work email for your {BRAND.name} account.
      </p>
      <form className="mt-6 space-y-4" onSubmit={(e) => void onSubmit(e)} noValidate>
        <label className="block text-sm text-[var(--fg-muted)]">
          Work email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
            required
          />
        </label>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link href="/login" className="text-[var(--accent)]">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
