import { BRAND } from "@/lib/brand";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--fg)]">
        {title}
      </h1>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        {BRAND.name} · demo policy stub
      </p>
      <div className="prose-legal mt-8 space-y-4 text-[var(--fg-muted)]">
        {children}
      </div>
    </article>
  );
}
