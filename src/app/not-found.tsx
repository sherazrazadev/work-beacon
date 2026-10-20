import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        {BRAND.name}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--fg)]">
        Page not found
      </h1>
      <p className="mt-3 text-[var(--fg-muted)]">
        That URL isn&apos;t part of this demo. Head home or sign in to the
        employee experience.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </main>
  );
}
