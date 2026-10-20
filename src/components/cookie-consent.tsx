"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

const STORAGE_KEY = "work-beacon-cookie-consent";

type Consent = "accepted" | "essential" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Consent;
    setConsent(stored === "accepted" || stored === "essential" ? stored : null);
    setReady(true);
  }, []);

  function persist(value: Exclude<Consent, null>) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    setManageOpen(false);
  }

  if (!ready || consent) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_-8px_30px_rgba(2,32,67,0.12)] sm:p-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--fg)]">
            Cookies on {BRAND.name}
          </p>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            We use essential cookies to run this demo. Optional analytics stay
            off until you accept. Manage details anytime on{" "}
            <Link
              href="/cookie-preferences"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Cookie Preferences
            </Link>
            .
          </p>
          {manageOpen ? (
            <ul className="mt-3 space-y-1 text-sm text-[var(--fg-muted)]">
              <li>
                <strong className="text-[var(--fg)]">Essential</strong> —
                required for session and preferences.
              </li>
              <li>
                <strong className="text-[var(--fg)]">Analytics</strong> — off by
                default in this demo.
              </li>
            </ul>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setManageOpen((v) => !v)}
          >
            {manageOpen ? "Hide details" : "Manage"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => persist("essential")}
          >
            Essential only
          </Button>
          <Button type="button" size="sm" onClick={() => persist("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
