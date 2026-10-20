import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/60 px-6 py-10 text-center">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--fg)]">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--fg-muted)]">
        {body}
      </p>
      {actionHref && actionLabel ? (
        <Button asChild className="mt-5" size="sm" variant="secondary">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
