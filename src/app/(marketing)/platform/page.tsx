import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { BRAND } from "@/lib/brand";
import { PLATFORM_SECTIONS } from "@/lib/marketing-content";

export const metadata: Metadata = { title: "Platform" };

export default function PlatformPage() {
  return (
    <>
      <PageHero
        title="One AI-native foundation"
        description={`Build, manage, and deploy specialized apps and agents on ${BRAND.name} — simply and securely.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="grid gap-12 md:grid-cols-2">
          {PLATFORM_SECTIONS.map((b) => (
            <li key={b.id} id={b.id} className="scroll-mt-28">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--fg)]">
                {b.title}
              </h2>
              <p className="mt-3 text-[var(--fg-muted)]">{b.body}</p>
              <ul className="mt-5 space-y-2">
                {b.features.map((f) => (
                  <li
                    key={f}
                    className="border-l-2 border-[var(--accent)] pl-3 text-sm text-[var(--fg-muted)]"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mt-14 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/developers">Visit Developers</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/request-demo">Request Demo</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
