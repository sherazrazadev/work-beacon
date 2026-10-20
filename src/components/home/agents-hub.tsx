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
    <section className="bg-[var(--fg)] py-20 text-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
          Put AI agents to work for you, and your people.
        </h2>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2">
          {AGENTS.map((a) => (
            <li key={a.href}>
              <Link href={a.href} className="group block">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold group-hover:text-[var(--accent)]">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-white/70">{a.body}</p>
                <span className="mt-3 inline-block text-sm text-[var(--accent)]">
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
