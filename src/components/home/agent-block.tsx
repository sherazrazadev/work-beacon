import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export function AgentBlock() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(120deg,#163a66_0%,#0b1f3a_55%,#ff6b35_140%)] px-8 py-14 text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffb089]">
            Meet your {BRAND.name} Agent
          </p>
          <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-tight sm:text-4xl">
            Ask about PTO, pay, and deadlines — right inside the employee
            experience.
          </h2>
          <p className="mt-4 max-w-xl text-white/80">
            Demo agent reads your local dashboard data. No live model required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/login">Try it in the demo</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="border-white/25 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/agents/beacon">Learn more</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
