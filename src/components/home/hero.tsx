import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

const PREVIEW = [
  { label: "PTO request", meta: "2 days · pending" },
  { label: "Pay statement", meta: "15 Oct 2026" },
  { label: "Security awareness", meta: "Due · overdue" },
] as const;

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 56% 42% at 92% 8%, rgba(255,107,53,0.14), transparent 52%), linear-gradient(165deg, #0b1f3a 0%, #12263f 62%, #16324f 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)]" aria-hidden />

      <div className="mx-auto grid min-h-[min(80vh,40rem)] max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
            {BRAND.name}
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {BRAND.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            For HR, finance, and IT — almost right isn&apos;t good enough. Agents
            act inside your rules, with full business context.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/request-demo">Request Demo</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="border-white/20 bg-white/8 text-white hover:bg-white/16"
            >
              <Link href="/agents/beacon">Meet the Agent</Link>
            </Button>
          </div>
        </div>

        <aside
          className="hidden rounded-md border border-white/12 bg-white/6 p-6 backdrop-blur-sm lg:block"
          aria-label="Sample employee inbox"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Today
          </p>
          <ul className="mt-4 divide-y divide-white/10">
            {PREVIEW.map((row) => (
              <li key={row.label} className="flex items-baseline justify-between gap-4 py-3">
                <span className="text-sm font-medium text-white">{row.label}</span>
                <span className="text-xs text-white/55">{row.meta}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-white/45">
            Demo inbox — same record the agent reads.
          </p>
        </aside>
      </div>
    </section>
  );
}
