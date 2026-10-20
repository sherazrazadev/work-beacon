import Link from "next/link";

const STORIES = [
  {
    href: "/customers/northwind",
    quote:
      "The time savings is mind-boggling. We’re thrilled to give those hours back to the stores.",
    role: "Head of Talent Acquisition",
    org: "Northwind Retail",
    metrics: [
      { value: "2M+", label: "hours saved annually" },
      { value: "85%", label: "applicants scheduled in under an hour" },
    ],
  },
  {
    href: "/customers/orbit",
    quote:
      "We fully automated talent review and gained clearer insight into skills and career interest.",
    role: "Senior Director, HR Operations",
    org: "Orbit Labs",
    metrics: [
      { value: "$4.5M", label: "saved by decommissioning systems" },
      { value: "26%", label: "higher review completion" },
    ],
  },
  {
    href: "/customers/summit",
    quote:
      "A system of record with agents across modules on one platform is incredibly powerful.",
    role: "Chief Accounting Officer",
    org: "Summit Grid",
    metrics: [
      { value: "7,000+", label: "employees supported" },
      { value: "43", label: "legal entities scaled" },
    ],
  },
] as const;

export function CustomerStories() {
  return (
    <section className="border-t border-[var(--border)] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--fg)] sm:text-4xl">
              Our customers are turning AI into ROI.
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--fg-muted)]">
              From midsize teams to global enterprises — fictional demo stories
              for this rebuild.
            </p>
          </div>
          <Link
            href="/customers"
            className="text-sm font-medium text-[var(--accent)]"
          >
            Read more stories →
          </Link>
        </div>
        <ul className="mt-12 grid gap-8 lg:grid-cols-3">
          {STORIES.map((s) => (
            <li
              key={s.href}
              className="flex flex-col border-t border-[var(--border)] pt-6"
            >
              <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                {s.org}
              </p>
              <blockquote className="mt-4 flex-1 text-[var(--fg)]">
                “{s.quote}”
              </blockquote>
              <p className="mt-4 text-sm text-[var(--fg-muted)]">{s.role}</p>
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {s.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--accent)]">
                      {m.value}
                    </dt>
                    <dd className="text-xs text-[var(--fg-muted)]">{m.label}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href={s.href}
                className="mt-6 text-sm font-medium text-[var(--accent)]"
              >
                Read story →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
