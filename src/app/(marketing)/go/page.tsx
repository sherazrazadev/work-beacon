import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: `${BRAND.name} GO` };

export default function GoPage() {
  return (
    <>
      <PageHero
        title={`${BRAND.name} GO`}
        description="Trusted HR, payroll, finance, and AI in simplified packages for lean teams."
      />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="text-[var(--fg-muted)]">
          Designed for organizations that want enterprise capability without
          enterprise sprawl — demo packaging only.
        </p>
        <Button asChild className="mt-8">
          <Link href="/pricing">See packages</Link>
        </Button>
      </section>
    </>
  );
}
