"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { ASK_CHIPS, MEGA_NAV } from "@/lib/nav";
import { BRAND } from "@/lib/brand";

type Props = {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
};

const CATALOG = [
  ...MEGA_NAV.flatMap((m) =>
    m.columns.flatMap((c) =>
      c.links.map((l) => ({ title: l.label, href: l.href, group: m.label })),
    ),
  ),
  { title: "Pricing", href: "/pricing", group: "Company" },
  { title: "About", href: "/about", group: "Company" },
  { title: "Blog", href: "/blog", group: "Resources" },
  { title: "Resources", href: "/resources", group: "Resources" },
  { title: "Contact Sales", href: "/contact-sales", group: "Sales" },
];

export function SearchOverlay({ open, onClose, initialQuery = "" }: Props) {
  const titleId = useId();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (open) setQuery(initialQuery);
  }, [open, initialQuery]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATALOG.slice(0, 8);
    return CATALOG.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q),
    ).slice(0, 10);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-[color-mix(in_oklab,var(--fg)_45%,transparent)] p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-[var(--border)] p-4">
          <p id={titleId} className="sr-only">
            Search {BRAND.name}
          </p>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask us anything…"
            className="w-full bg-transparent text-lg text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {ASK_CHIPS.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                onClick={onClose}
                className="rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--fg)]"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
        <ul className="max-h-72 overflow-auto p-2">
          {results.map((item) => (
            <li key={`${item.href}-${item.title}`}>
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-[var(--surface-muted)]"
              >
                <span className="text-[var(--fg)]">{item.title}</span>
                <span className="text-xs text-[var(--fg-muted)]">
                  {item.group}
                </span>
              </Link>
            </li>
          ))}
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-[var(--fg-muted)]">
              No matches — try Agents, Platform, or Pricing.
            </li>
          ) : null}
        </ul>
        <div className="border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--fg-muted)]">
          Esc to close · mock results only
        </div>
      </div>
    </div>
  );
}
