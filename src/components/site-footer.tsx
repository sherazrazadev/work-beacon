"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const COLUMNS = [
  {
    title: "Agents & Products",
    links: [
      { href: "/products/finance", label: "Financial Management" },
      { href: "/products/planning", label: "FP&A" },
      { href: "/products/hcm", label: "HCM" },
      { href: "/products/payroll", label: "Payroll" },
      { href: "/agents/beacon", label: `${BRAND.name} Agent` },
      { href: "/go", label: `${BRAND.name} GO` },
      { href: "/products", label: "All products" },
    ],
  },
  {
    title: "Industries",
    links: [
      { href: "/industries/financial-services", label: "Financial Services" },
      { href: "/industries/healthcare", label: "Healthcare" },
      { href: "/industries/higher-education", label: "Higher Education" },
      { href: "/industries/manufacturing", label: "Manufacturing" },
      { href: "/industries/retail", label: "Retail" },
      { href: "/industries", label: "All industries" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/customers", label: "Customer Stories" },
      { href: "/resources/demos", label: "Demos" },
      { href: "/resources/events", label: "Events" },
      { href: "/resources/webinars", label: "Webinars" },
      { href: "/resources", label: "Resource Library" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/company", label: "Company" },
      { href: "/careers", label: "Careers" },
      { href: "/pricing", label: "Pricing" },
      { href: "/contact-sales", label: "Contact Sales" },
      { href: "/login", label: "Login Help" },
    ],
  },
] as const;

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/cookie-preferences", label: "Cookie Preferences" },
] as const;

export function SiteFooter() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--fg)]">
              {BRAND.name}
            </p>
            <p className="mt-1 max-w-sm text-sm text-[var(--fg-muted)]">
              {BRAND.description}
            </p>
          </div>
          <label className="text-sm text-[var(--fg-muted)]">
            Locale
            <select
              className="ml-2 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[var(--fg)]"
              defaultValue="en-US"
              aria-label="Locale"
            >
              <option value="en-US">United States (English)</option>
              <option value="en-GB">United Kingdom (English)</option>
              <option value="de-DE">Germany (Deutsch)</option>
            </select>
          </label>
        </div>

        <div className="mt-10 hidden gap-8 md:grid md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg)]">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-2 md:hidden">
          {COLUMNS.map((col) => {
            const expanded = open === col.title;
            return (
              <div key={col.title} className="border-b border-[var(--border)]">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-[var(--fg)]"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : col.title)}
                >
                  {col.title}
                  <span aria-hidden>{expanded ? "−" : "+"}</span>
                </button>
                <ul
                  className={cn(
                    "space-y-2 pb-3",
                    expanded ? "block" : "hidden",
                  )}
                >
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-[var(--fg-muted)]"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <nav
          aria-label="Legal"
          className="mt-10 flex flex-wrap gap-4 border-t border-[var(--border)] pt-6 text-sm"
        >
          {LEGAL.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[var(--fg-muted)] hover:text-[var(--fg)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-[var(--border)] px-4 py-4 text-center text-xs text-[var(--fg-muted)] sm:px-6">
        © 2026 {BRAND.name}. Demo rebuild — not affiliated with any third-party
        HR platform.
      </div>
    </footer>
  );
}
