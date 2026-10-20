"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "work-beacon-promo-dismissed";

export function PromoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative z-50 bg-[var(--fg)] text-[var(--bg)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 text-sm sm:px-6">
        <p className="min-w-0 flex-1">
          <span className="font-medium">New:</span> Agentic AI for HR, finance,
          and IT — explore {""}
          <Link href="/agents/beacon" className="underline underline-offset-2">
            Work Beacon Agent
          </Link>
          .
        </p>
        <button
          type="button"
          aria-label="Dismiss announcement"
          className="shrink-0 rounded px-2 py-1 text-[var(--bg)]/80 hover:bg-white/10 hover:text-[var(--bg)]"
          onClick={() => {
            sessionStorage.setItem(KEY, "1");
            setVisible(false);
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
