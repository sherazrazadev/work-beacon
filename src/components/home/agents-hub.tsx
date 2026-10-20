import Link from "next/link";

const AGENTS = [
  {
    href: "/agents/hr",
    title: "Agents for HR",
    body: "Better people decisions, faster hiring, less routine work.",
  },
  {
    href: "/agents/finance",
    title: "Agents for Finance",
    body: "Manage spend, control costs, and streamline processes.",
  },
  {
    href: "/agents/it",
    title: "Agents for IT & Developers",
    body: "Support employees faster and build securely on the platform.",
  },
  {
    href: "/agents/everyone",
    title: "Agents for Everyone",
    body: "Ask for help, complete everyday tasks, see what needs attention.",
  },
] as const;

export function AgentsHub() {
  return (
    <section className="bg-[var(--navy)] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
          Put AI agents to work for you, and your people.
        </h2>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-md border border-white/12 bg-white/12 sm:grid-cols-2">
          {AGENTS.map((a, i) => (
            <li key={a.href} className="bg-[var(--navy)]">
              <Link
                href={a.href}
                className="group block border-l-2 border-transparent p-6 transition-colors duration-150 ease-out hover:border-[var(--accent)] hover:bg-white/4 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]"
              >
                <p className="text-xs font-semibold tabular-nums text-white/40">
                  0{i + 1}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {a.body}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-[var(--accent)]">
                  Explore →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
