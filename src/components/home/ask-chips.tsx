"use client";

import { useState } from "react";
import Link from "next/link";
import { ASK_CHIPS } from "@/lib/nav";
import { SearchOverlay } from "@/components/search-overlay";

export function AskChips() {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState("");

  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)] py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--fg)]">
          Ask us anything
        </p>
        <button
          type="button"
          onClick={() => {
            setSeed("");
            setOpen(true);
          }}
          className="mt-3 flex min-h-12 w-full max-w-xl items-center rounded-md border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-left text-[var(--fg-muted)] transition-colors duration-150 ease-out hover:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Search products, agents, industries…
          <span className="ml-auto hidden text-xs sm:inline">⌘K</span>
        </button>
        <div className="mt-4 flex flex-wrap gap-2">
          {ASK_CHIPS.map((chip) => (
            <Link
              key={chip.href}
              href={chip.href}
              className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--fg-muted)] transition hover:border-[var(--accent)] hover:text-[var(--fg)]"
            >
              {chip.label}
            </Link>
          ))}
          <button
            type="button"
            className="rounded-md border border-dashed border-[var(--border)] px-3 py-1.5 text-sm text-[var(--fg-muted)] hover:border-[var(--accent)]"
            onClick={() => {
              setSeed("agents");
              setOpen(true);
            }}
          >
            Open search
          </button>
        </div>
      </div>
      <SearchOverlay
        open={open}
        onClose={() => setOpen(false)}
        initialQuery={seed}
      />
    </section>
  );
}
