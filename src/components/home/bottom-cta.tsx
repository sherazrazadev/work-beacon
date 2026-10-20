import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export function BottomCta() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--fg)] sm:text-4xl">
          Discover what {BRAND.name}
          <br className="hidden sm:block" /> can do for you.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/contact-sales">Contact Sales</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/request-demo">Request a Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
