import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { BRAND } from "@/lib/brand";
import { COMMUNITY_THREADS } from "@/lib/marketing-content";

export const metadata: Metadata = { title: "Community" };

export default function CommunityPage() {
  return (
    <>
      <PageHero
        title={`${BRAND.name} Community`}
        description="Practitioners sharing playbooks for HR, finance, workforce, and agents."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
              Recent threads
            </h2>
            <ul className="mt-6 space-y-5">
              {COMMUNITY_THREADS.map((t) => (
                <li
                  key={t.title}
                  className="border-t border-[var(--border)] pt-4"
                >
                  <p className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
                    {t.tag} · {t.replies} replies
                  </p>
                  <h3 className="mt-2 font-medium text-[var(--fg)]">
                    {t.title}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
          <aside className="border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="font-semibold">Join the hub</h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Demo community — no account creation required for browsing.
            </p>
            <Button asChild className="mt-6">
              <Link href="/request-demo">Request access</Link>
            </Button>
            <Link
              href="/resources"
              className="mt-4 block text-sm text-[var(--accent)]"
            >
              Browse guides →
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
