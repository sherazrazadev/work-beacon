"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { MEGA_NAV, MORE_SITES } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { SearchOverlay } from "@/components/search-overlay";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setOpenMega(null);
        setMoreOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
          <Link
            href="/"
            className="shrink-0 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--fg)]"
          >
            {BRAND.name}
          </Link>

          <nav
            aria-label="Primary"
            className="ml-2 hidden flex-1 items-center gap-0 lg:flex"
            onMouseLeave={() => setOpenMega(null)}
          >
            {MEGA_NAV.map((item) => {
              const expanded = openMega === item.id;
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setOpenMega(item.id)}
                >
                  <button
                    type="button"
                    className={cn(
                      "min-h-10 rounded-md px-3 py-2 text-sm text-[var(--fg-muted)] transition-colors duration-150 ease-out hover:bg-[var(--surface-muted)] hover:text-[var(--fg)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                      expanded && "bg-[var(--surface-muted)] text-[var(--fg)]",
                    )}
                    aria-expanded={expanded}
                    onClick={() => setOpenMega(expanded ? null : item.id)}
                  >
                    {item.label}
                  </button>
                  {expanded ? (
                    <div className="absolute left-0 top-full z-50 mt-1 w-[min(90vw,40rem)] rounded-md border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
                      <div
                        className={cn(
                          "grid gap-6",
                          item.columns.length > 2
                            ? "grid-cols-3"
                            : "grid-cols-2",
                        )}
                      >
                        {item.columns.map((col) => (
                          <div key={col.title}>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                              {col.title}
                            </p>
                            <ul className="mt-3 space-y-2">
                              {col.links.map((link) => (
                                <li key={`${col.title}-${link.label}`}>
                                  <Link
                                    href={link.href}
                                    className="block rounded-md px-1 py-1 text-sm text-[var(--fg)] hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                    onClick={() => setOpenMega(null)}
                                  >
                                    {link.label}
                                    {link.blurb ? (
                                      <span className="mt-0.5 block text-xs text-[var(--fg-muted)]">
                                        {link.blurb}
                                      </span>
                                    ) : null}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <Link
                        href={item.href}
                        className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
                        onClick={() => setOpenMega(null)}
                      >
                        Explore {item.label} →
                      </Link>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              className="hidden min-h-10 rounded-md px-2 py-2 text-sm text-[var(--fg-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--fg)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:inline"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              Search
            </button>

            <div className="relative hidden md:block">
              <button
                type="button"
                className="min-h-10 rounded-md px-2 py-2 text-sm text-[var(--fg-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--fg)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((v) => !v)}
              >
                More Sites
              </button>
              {moreOpen ? (
                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg">
                  {MORE_SITES.map((site) => (
                    <Link
                      key={site.href}
                      href={site.href}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-[var(--surface-muted)]"
                      onClick={() => setMoreOpen(false)}
                    >
                      {site.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/contact-sales">Contact Sales</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/request-demo">Request Demo</Link>
            </Button>

            <button
              type="button"
              className="min-h-10 rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--surface-muted)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls={menuId}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div
            id={menuId}
            className="max-h-[calc(100dvh-4rem)] overflow-auto border-t border-[var(--border)] bg-[var(--surface)] lg:hidden"
          >
            <div className="space-y-4 px-4 py-4">
              {MEGA_NAV.map((item) => (
                <div key={item.id}>
                  <Link
                    href={item.href}
                    className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--fg)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  <ul className="mt-2 space-y-1 border-l border-[var(--border)] pl-3">
                    {item.columns.flatMap((c) =>
                      c.links.map((link) => (
                        <li key={`${item.id}-${link.label}`}>
                          <Link
                            href={link.href}
                            className="block min-h-11 py-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
                            onClick={() => setMobileOpen(false)}
                          >
                            {link.label}
                          </Link>
                        </li>
                      )),
                    )}
                  </ul>
                </div>
              ))}
              <div className="flex flex-col gap-2 border-t border-[var(--border)] pt-4">
                <Button asChild>
                  <Link href="/request-demo" onClick={() => setMobileOpen(false)}>
                    Request Demo
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/contact-sales" onClick={() => setMobileOpen(false)}>
                    Contact Sales
                  </Link>
                </Button>
                <button
                  type="button"
                  className="min-h-11 text-left text-sm text-[var(--fg-muted)]"
                  onClick={() => {
                    setMobileOpen(false);
                    setSearchOpen(true);
                  }}
                >
                  Search / Ask us anything
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
