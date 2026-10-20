import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[min(88vh,52rem)] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 85% 20%, rgba(255,107,53,0.28), transparent 55%), radial-gradient(ellipse 70% 50% at 10% 80%, rgba(11,31,58,0.18), transparent 50%), linear-gradient(135deg, #0b1f3a 0%, #163a66 42%, #ff6b35 160%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full max-w-xl opacity-40 mix-blend-overlay sm:w-1/2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-18deg, transparent, transparent 18px, rgba(255,255,255,0.06) 18px, rgba(255,255,255,0.06) 19px)",
        }}
      />

      <div className="mx-auto flex min-h-[min(88vh,52rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
          {BRAND.name}
        </p>
        <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
          {BRAND.tagline}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/80">
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
            className="border-white/25 bg-white/10 text-white hover:bg-white/20"
          >
            <Link href="/agents/beacon">Meet the Agent</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
