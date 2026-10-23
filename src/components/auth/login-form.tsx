"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { useAuth } from "@/components/auth/auth-provider";
import { SIGN_IN_HELP, validateLogin } from "@/lib/auth";
import { BRAND } from "@/lib/brand";
import { DEMO_LOGIN_EMAIL, DEMO_PASSWORD } from "@/lib/demo-config";

export function LoginForm() {
  const { signIn, session, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => {
    const n = searchParams.get("next");
    // same-origin paths only (blocks //evil.com and absolute URLs)
    return n && n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard";
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const notice = searchParams.get("notice");

  useEffect(() => {
    if (ready && session) router.replace(nextPath);
  }, [ready, session, router, nextPath]);

  async function submit(addr: string, pass: string) {
    const err = validateLogin(addr, pass);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setBusy(true);
    const failure = await signIn(addr, pass);
    setBusy(false);
    if (failure) {
      setError(failure);
      return;
    }
    router.push(nextPath);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void submit(email, password);
  }

  return (
    <div className="w-full max-w-md rounded-md border border-[var(--border)] bg-[var(--surface)] p-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
        Sign in to {BRAND.name}
      </h1>
      {notice === "password-updated" ? (
        <p role="status" className="mt-2 text-sm text-[var(--accent)]">
          Password updated. Sign in with your new password.
        </p>
      ) : null}

      {notice === "link-invalid" ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          That email link is invalid or has expired. Request a new one.
        </p>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <Field label="Work email">
          <TextInput
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />
        </Field>
        <Field label="Password" error={error}>
          <TextInput
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </Field>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-6 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4">
        <p className="text-sm font-medium text-[var(--fg)]">Demo workspace</p>
        <p className="mt-1 text-xs text-[var(--fg-muted)]">
          Northstar Labs, fake data only. Shared demo credential:
        </p>
        <p className="mt-1 break-all font-mono text-xs text-[var(--fg)]">
          {DEMO_LOGIN_EMAIL} / {DEMO_PASSWORD}
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-3 w-full"
          disabled={busy}
          onClick={() => void submit(DEMO_LOGIN_EMAIL, DEMO_PASSWORD)}
        >
          Enter demo workspace
        </Button>
      </div>

      <div className="mt-6 space-y-3 border-t border-[var(--border)] pt-4 text-sm">
        <button
          type="button"
          className="text-[var(--accent)] hover:underline"
          onClick={() => setHelpOpen((v) => !v)}
          aria-expanded={helpOpen}
        >
          {SIGN_IN_HELP.title}
        </button>
        {helpOpen ? (
          <div className="rounded-lg bg-[var(--surface-muted)] p-3 text-[var(--fg-muted)]">
            <p>{SIGN_IN_HELP.body}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 text-[var(--fg-muted)]">
          <Link href="/forgot-password" className="hover:text-[var(--fg)]">
            Forgot password
          </Link>
          <Link href="/request-demo" className="hover:text-[var(--fg)]">
            Request a demo
          </Link>
          <Link href="/signup" className="hover:text-[var(--fg)]">
            Request access
          </Link>
        </div>
      </div>
    </div>
  );
}
