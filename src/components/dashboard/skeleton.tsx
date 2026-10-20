export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-live="polite">
      <div className="h-8 w-48 rounded-md bg-[var(--surface-muted)]" />
      <div className="h-4 w-72 rounded-md bg-[var(--surface-muted)]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="h-3 w-20 rounded bg-[var(--surface-muted)]" />
            <div className="mt-4 h-8 w-16 rounded bg-[var(--surface-muted)]" />
            <div className="mt-3 h-3 w-28 rounded bg-[var(--surface-muted)]" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading dashboard…</span>
    </div>
  );
}
