"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { useAuth } from "@/components/auth/auth-provider";
import {
  DEMO_ACCOUNT,
  PRODUCT_LOGINS,
  SIGN_IN_HELP,
  validateLogin,
} from "@/lib/auth";
import { BRAND } from "@/lib/brand";

export function LoginForm() {
  const { signIn, session, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => {
    const n = searchParams.get("next");
    return n && n.startsWith("/") ? n : "/dashboard";
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [ssoStep, setSsoStep] = useState<"idle" | "idp" | "consent">("idle");

  useEffect(() => {
    if (ready && session) router.replace(nextPath);
  }, [ready, session, router, nextPath]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validateLogin(email, password);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    signIn(email.trim(), { personaId: "employee" });
    router.push(nextPath);
  }

  function enterDemo() {
    setError(null);
    signIn(DEMO_ACCOUNT.email, {
      demo: true,
      name: DEMO_ACCOUNT.name,
      personaId: "employee",
    });
    router.push(nextPath);
  }

  function finishSso() {
    setError(null);
    signIn(DEMO_ACCOUNT.email, {
      demo: true,
      personaId: "employee",
      ssoDemo: true,
    });
    router.push(nextPath);
  }

  return (
    <div className="w-full max-w-md rounded-md border border-[var(--border)] bg-[var(--surface)] p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
        Northstar Labs
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
        Sign in to {BRAND.name}
      </h1>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Demo auth only — nothing leaves this browser.
      </p>

      <div className="mt-6 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4">
        <p className="text-sm font-medium text-[var(--fg)]">
          Fastest path for the product demo
        </p>
        <p className="mt-1 text-xs text-[var(--fg-muted)]">
          {DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.password}
        </p>
        <Button type="button" className="mt-3 w-full" onClick={enterDemo}>
          Enter demo account
        </Button>
      </div>

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
        <Button type="submit" variant="secondary" className="w-full">
          Sign in
        </Button>
      </form>

      <div className="mt-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          Or continue with SSO
        </p>
        {ssoStep === "idle" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSsoStep("idp")}
            >
              Continue with Company IdP
            </Button>
            <Button type="button" variant="secondary" disabled>
              Passkey (demo stub)
            </Button>
          </div>
        ) : null}
        {ssoStep === "idp" ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm">
            <p className="font-medium text-[var(--fg)]">Northstar Labs IdP</p>
            <p className="mt-2 text-[var(--fg-muted)]">
              Mock identity provider — no real SSO call. Choose an account to
              continue.
            </p>
            <Button
              type="button"
              className="mt-4 w-full"
              onClick={() => setSsoStep("consent")}
            >
              Use Alex Rivera (demo)
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => setSsoStep("idle")}
            >
              Cancel
            </Button>
          </div>
        ) : null}
        {ssoStep === "consent" ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm">
            <p className="font-medium text-[var(--fg)]">Allow Work Beacon?</p>
            <p className="mt-2 text-[var(--fg-muted)]">
              Share name, email, and groups with the demo tenant.
            </p>
            <Button type="button" className="mt-4 w-full" onClick={finishSso}>
              Allow and continue
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => setSsoStep("idle")}
            >
              Deny
            </Button>
          </div>
        ) : null}
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

        <button
          type="button"
          className="block text-[var(--fg-muted)] hover:text-[var(--fg)]"
          onClick={() => setProductsOpen((v) => !v)}
          aria-expanded={productsOpen}
        >
          Product logins
        </button>
        {productsOpen ? (
          <ul className="space-y-2 rounded-lg border border-[var(--border)] p-3">
            {PRODUCT_LOGINS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="w-full text-left text-[var(--fg)] hover:text-[var(--accent)]"
                  onClick={() =>
                    window.alert(
                      `${p.label} is a UI stub. Use Enter demo account for the employee dashboard.`,
                    )
                  }
                >
                  {p.label}
                  <span className="mt-0.5 block text-xs text-[var(--fg-muted)]">
                    {p.hint}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 text-[var(--fg-muted)]">
          <Link href="/forgot-password" className="hover:text-[var(--fg)]">
            Forgot password
          </Link>
          <Link href="/request-demo" className="hover:text-[var(--fg)]">
            Request a demo
          </Link>
          <Link href="/signup" className="hover:text-[var(--fg)]">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
