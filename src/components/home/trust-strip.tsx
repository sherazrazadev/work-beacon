import { BRAND } from "@/lib/brand";
import { TRUST_LOGOS } from "@/lib/nav";

export function TrustStrip() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
          11,500+ organizations worldwide trust {BRAND.name}.
        </p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {TRUST_LOGOS.map((name) => (
            <li
              key={name}
              className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide text-[var(--fg)]/40"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
