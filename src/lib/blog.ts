export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  minutes: number;
  topic: "HR" | "Finance" | "IT" | "Agents";
  author: string;
  body: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-legacy-erps-fail-midsize-companies",
    title: "Why legacy ERPs fail growing midsize companies",
    summary:
      "Monolithic enterprise suites demand multi-year deployments and armies of consultants. Midsize teams need a unified record that delivers value in weeks, not years.",
    date: "2026-10-23",
    minutes: 6,
    topic: "HR",
    author: "Avery Chen",
    body: [
      "Growing companies with 200 to 2,000 employees frequently hit a painful inflection point. Basic small-business payroll tools no longer handle multi-state compliance, complex cost centers, or structured review cycles. In response, leadership often looks upward toward the multi-million dollar monolithic ERPs built for Fortune 500 conglomerates. That decision almost always triggers eighteen months of implementation delays, budget overruns, and administrative frustration.",
      "Monolithic enterprise systems were designed around a different business era. They assume an organization has dedicated teams of certified system administrators, external systems integrators billing hundreds of dollars an hour, and employees who tolerate clunky, multi-step portals just to view a paystub or log time off. When midsize teams attempt to deploy these behemoths, they end up paying enterprise licensing fees while using less than twenty percent of the underlying functionality.",
      "The core issue is architectural rigidity. In a traditional legacy suite, making a routine change—such as updating an approval chain, modeling a new compensation tier, or modifying a leave policy—requires weeks of specialized configuration. Meanwhile, department heads resort to shadow spreadsheets to get actual work done, immediately breaking the promise of a single source of truth.",
      "Mid-market organizations do not need bloated monoliths; they need a single, honest record connecting people, money, and operations. When employee identity, compensation, leave balances, and general ledger accounts share one unified graph, routine operational tasks become self-service. Onboarding flows directly into asset provisioning. Timesheets feed pay statements without manual CSV reconciliations. Real-time headcount variance replaces outdated quarterly board decks.",
      "Modern workplace agents further widen this efficiency gap. In an architecture built with human-in-the-loop guardrails, an assistant can draft an expense categorization, summarize team leave, or guide a manager through a promotion packet in seconds. Because the agent reads directly from a unified record and operates on a propose-then-approve model, compliance and audit trails remain airtight.",
      "Before committing to a seven-figure legacy ERP contract, ask a simple question: will this system make everyday work simpler for your people on day thirty, or will it create a new administrative department just to keep the software running? For midsize companies, speed, clarity, and trust in the primary record always beat monolithic complexity.",
    ],
  },
  {
    slug: "one-record-people-and-money",
    title: "People and money belong on one record",
    summary:
      "Leave, pay, and headcount stay honest when HR and finance share the same worker graph.",
    date: "2026-10-14",
    minutes: 6,
    topic: "HR",
    author: "Avery Chen",
    body: [
      "Most midsize teams still reconcile people data in a spreadsheet after the fact. A hire lands in one system, a cost center in another, and the close pack is a week of copy-paste.",
      "A single worker record is the cheapest control you can buy. Title, manager, location, and pay group stay in one place. Leave balances and expense policy read the same row the payroll calendar uses.",
      "Agents only help if that record is complete. An assistant that books PTO without seeing the pay period will create more tickets than it closes.",
      "Start with identity, then pay statements, then time. Do not connect ten vendors before employees trust the stub they already have.",
    ],
  },
  {
    slug: "agent-writes-need-approvals",
    title: "Let agents propose. Keep humans on the write.",
    summary:
      "Payroll, compensation, and terminations stay propose-then-approve — with an audit row every time.",
    date: "2026-10-08",
    minutes: 5,
    topic: "Agents",
    author: "Reese Okonkwo",
    body: [
      "A workplace agent that can read a balance is useful. One that can change pay without a second pair of eyes is a control failure.",
      "Treat every tool call as an event: actor, intent, target, and outcome. Employees see their own data. Managers see the team. Finance sees the run. Nobody else.",
      "Propose-then-approve is the default for money and employment status. The demo agent in Work Beacon follows that rule — it can complete training or draft an expense, not fire someone.",
      "If you cannot explain the last ten agent actions to an auditor in one table, the agent is not ready for production.",
    ],
  },
  {
    slug: "close-without-the-export",
    title: "Close the month without the Friday export",
    summary:
      "Owners, exceptions, and a narrative pack beat a shared drive full of tab names.",
    date: "2026-09-29",
    minutes: 7,
    topic: "Finance",
    author: "Morgan Ellison",
    body: [
      "Month-end fails in the same three places: open expenses above threshold, missing cost-center owners, and a narrative that lives in someone's inbox.",
      "Give each ledger area one owner and a due date on a visible calendar. Block the close when exceptions sit over the policy line. Do not hide them in a sidebar.",
      "A variance snapshot is enough for an agent to draft the first narrative. A human still signs the pack.",
      "If your close still starts with “export to CSV,” the system of record is not the system people trust.",
    ],
  },
  {
    slug: "overdue-training-is-a-control",
    title: "Overdue training is a control, not a nag",
    summary:
      "Security awareness with a due date belongs next to access reviews — and in the inbox.",
    date: "2026-09-18",
    minutes: 4,
    topic: "IT",
    author: "Reese Okonkwo",
    body: [
      "Security courses that live in a separate LMS get ignored. The control only works when the same inbox that holds PTO also holds the assignment.",
      "Managers need a team view of overdue rows. HR assigns. Completing the course issues a certificate dated today and closes the related inbox item.",
      "That loop is how learning ops earns a seat next to access reviews. It is not a content marketplace.",
      "If the certificate cannot be found from the employee profile, the training did not happen.",
    ],
  },
  {
    slug: "what-to-buy-first-midsize",
    title: "What midsize teams should buy first",
    summary:
      "Self-service, pay, and time before planning, pulse, and a marketplace.",
    date: "2026-09-04",
    minutes: 5,
    topic: "HR",
    author: "Avery Chen",
    body: [
      "Lean teams do not need every module on day one. They need employees to see pay, request time, and finish onboarding without emailing HR.",
      "Work Beacon GO packages that path: self-service, payroll, and a starter agent. Planning, pulse, and marketplace wait until the stub is trusted.",
      "A demo tenant with four personas is enough to prove the loop. Do not sell a platform tour before someone can complete a leave request.",
      "Buy the record. Add agents after the record is honest.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function latestBlogPosts(n = 3) {
  return [...BLOG_POSTS]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, n);
}
