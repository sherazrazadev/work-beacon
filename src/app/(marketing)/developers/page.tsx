import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { BRAND } from "@/lib/brand";
import { DEV_ENDPOINTS } from "@/lib/marketing-content";
import { DEMO_API_KEY_DEFAULT } from "@/lib/mock/platform";

export const metadata: Metadata = { title: "Developers" };

const SDKS = [
  { name: "TypeScript", status: "Demo snippets in docs/API.md" },
  { name: "Python", status: "Coming — use REST" },
  { name: "Go", status: "Coming — use REST" },
];

export default function DevelopersPage() {
  return (
    <>
      <PageHero
        title="Developer Platform"
        description={`APIs, demo keys, and agent hooks to extend ${BRAND.name} in this rebuild.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          Demo API keys
        </h2>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Default key (rotate it in the signed-in API explorer):
        </p>
        <p className="mt-3 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-mono text-sm">
          {DEMO_API_KEY_DEFAULT}
        </p>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          Send <code className="font-mono">Authorization: Bearer &lt;key&gt;</code>.
          Missing key still returns 200 with <code className="font-mono">auth: &quot;open&quot;</code>.
          Unknown keys return 401. Rate limit copy: <strong>60 requests / minute / key</strong> (not enforced in demo).
        </p>

        <h2 className="mt-12 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Working GET routes
        </h2>
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
          OpenAPI (subset)
        </h2>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs">
{`openapi: 3.0.3
info:
  title: Work Beacon Demo API
  version: 0.1.0
paths:
  /api/demo/workers:
    get:
      security: [{ bearerAuth: [] }]
      responses: { "200": { description: Worker list } }
  /api/demo/events:
    get:
      responses: { "200": { description: Process events } }
  /api/demo/time-off:
    get:
      responses: { "200": { description: Leave requests } }`}
        </pre>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Full file: <code className="font-mono">docs/API.md</code>
        </p>

        <h2 className="mt-12 font-[family-name:var(--font-display)] text-2xl font-semibold">
          SDKs
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-[var(--fg-muted)]">
          {SDKS.map((s) => (
            <li key={s.name}>
              <strong className="text-[var(--fg)]">{s.name}</strong> — {s.status}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/login">Open API explorer</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/marketplace">Marketplace</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
