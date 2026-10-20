import { BRAND } from "@/lib/brand";

export function PageHero({
  eyebrow = BRAND.name,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--fg)]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--fg-muted)]">
          {description}
        </p>
      </div>
    </header>
  );
}
