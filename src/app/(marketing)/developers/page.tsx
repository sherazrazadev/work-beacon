import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { BRAND } from "@/lib/brand";
import { DEV_ENDPOINTS } from "@/lib/marketing-content";

export const metadata: Metadata = { title: "Developers" };

export default function DevelopersPage() {
  return (
    <>
      <PageHero
        title="Developer Platform"
        description={`APIs, tools, and agent hooks to extend ${BRAND.name} safely.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          Demo API surface
        </h2>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Sample endpoints for the marketing rebuild. Keys are fictional.
        </p>
        <ul className="mt-6 space-y-4 font-mono text-sm">
          {DEV_ENDPOINTS.map((e) => (
            <li
              key={e.path}
              className="border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            >
              <span className="text-[var(--accent)]">{e.method}</span>{" "}
              <span className="text-[var(--fg)]">{e.path}</span>
              <p className="mt-1 font-sans text-[var(--fg-muted)]">{e.desc}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Getting started
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[var(--fg-muted)]">
          <li>Create a demo API key in the portal (mock).</li>
          <li>Register tools against the agent registry.</li>
          <li>Package an installable for the Marketplace.</li>
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/request-demo">Get a sandbox</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/marketplace">See Marketplace</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/platform">Platform overview</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
