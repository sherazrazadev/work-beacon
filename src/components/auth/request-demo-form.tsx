"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export function RequestDemoForm() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || !company.trim()) {
      setError("Name, work email, and company are required.");
      return;
    }
    setError(null);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
          Request received
        </h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Thanks{name ? `, ${name}` : ""}. This is a demo — no email was sent.
          You can explore the employee experience now.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild>
            <Link href="/login">Go to sign in</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--fg)]">
        Request a {BRAND.name} demo
      </h1>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Tell us about your team. Submissions stay in this browser only.
      </p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <label className="block text-sm text-[var(--fg-muted)]">
          Full name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
            required
          />
        </label>
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
        <label className="block text-sm text-[var(--fg-muted)]">
          Company
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
            required
          />
        </label>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full">
          Submit request
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-[var(--fg-muted)]">
        Already exploring?{" "}
        <Link href="/login" className="text-[var(--accent)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
