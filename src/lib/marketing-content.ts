import { BRAND } from "@/lib/brand";

export type Faq = { q: string; a: string };

export const AGENT_DETAILS: Record<
  string,
  {
    problem: string;
    capabilities: string[];
    outcomes: string[];
    faqs: Faq[];
  }
> = {
  hr: {
    problem:
      "HR teams drown in scheduling, status chasing, and policy lookups while hiring managers wait.",
    capabilities: [
      "Screen and schedule candidates against role requirements",
      "Draft offer packets from approved templates",
      "Answer policy questions with cited handbook sections",
      "Flag missing onboarding tasks before day one",
      "Summarize attrition risk signals for people partners",
    ],
    outcomes: [
      "Faster time-to-schedule",
      "Fewer “where is my offer?” pings",
      "Consistent policy answers",
    ],
    faqs: [
      {
        q: "Does it change employee records on its own?",
        a: "No. Agents propose actions inside your permissions; sensitive writes stay approval-gated in the demo.",
      },
      {
        q: "Can managers use it?",
        a: "Yes — managers get hiring and team status prompts scoped to their org.",
      },
    ],
  },
  finance: {
    problem:
      "Close pressure, expense exceptions, and contract reviews pull analysts into repetitive triage.",
    capabilities: [
      "Classify expense exceptions and suggest next steps",
      "Draft variance narratives from ledger snapshots",
      "Check purchase requests against policy thresholds",
      "Prepare audit sample packs from mock journals",
      "Remind owners of open close tasks",
    ],
    outcomes: [
      "Shorter exception queues",
      "Cleaner month-end narratives",
      "Fewer policy misses",
    ],
    faqs: [
      {
        q: "Is this a replacement for your GL?",
        a: `${BRAND.name} Finance agents sit on top of finance data in the demo — they do not replace core accounting.`,
      },
      {
        q: "How is spend controlled?",
        a: "Thresholds and approval chains are configurable in the platform governance story.",
      },
    ],
  },
  it: {
    problem:
      "IT fields repetitive access requests while builders need a safe way to extend HR and finance workflows.",
    capabilities: [
      "Triage access requests with role recommendations",
      "Open change tickets with suggested owners",
      "Explain integration health from connector status",
      "Scaffold agent tools against the developer platform",
      "Surface stale service accounts in audits",
    ],
    outcomes: [
      "Faster employee support",
      "Safer automation paths",
      "Clearer integration signal",
    ],
    faqs: [
      {
        q: "Can developers build custom agents?",
        a: "Yes — the Developer Platform story covers tools, APIs, and marketplace packaging.",
      },
    ],
  },
  everyone: {
    problem:
      "Employees bounce between portals for pay, time, learning, and “who approves this?” questions.",
    capabilities: [
      "Answer PTO, pay, and benefits questions from your record",
      "Start time-off and expense requests from chat",
      "Surface deadlines and assigned learning",
      "Route “who can help?” to the right people partner",
      "Remember conversation context in the demo session",
    ],
    outcomes: [
      "Fewer ticket detours",
      "Clearer next actions",
      "One conversational front door",
    ],
    faqs: [
      {
        q: "Does it see everyone’s data?",
        a: "No. The demo agent only sees the signed-in employee’s mock record and permitted team data for managers.",
      },
    ],
  },
  beacon: {
    problem:
      "Specialized agents only help if something orchestrates them under policy, audit, and shared context.",
    capabilities: [
      "Route intents to HR, Finance, IT, or self-service tools",
      "Carry business context across modules",
      "Enforce guardrails before side effects",
      "Log tool calls for admin review",
      "Offer proactive chips for overdue work",
    ],
    outcomes: [
      "One agent experience",
      "Governed actions",
      "Auditable assistance",
    ],
    faqs: [
      {
        q: `How is ${BRAND.name} Agent different from category agents?`,
        a: "It orchestrates them — employees ask once; the right specialist tool runs under your rules.",
      },
      {
        q: "Is there a live LLM?",
        a: "Default demo is rule-based. Optional LLM can be enabled later behind an env flag.",
      },
    ],
  },
};

export const PLATFORM_SECTIONS = [
  {
    id: "builder",
    title: "Extend AI",
    body: "Ship governed apps and agents without forking your system of record.",
    features: [
      "Agent & app builder with typed tools",
      "Reusable action catalog (time, pay, expenses, approvals)",
      "Sandbox runs with mock data before publish",
      "Versioned releases per tenant demo",
    ],
  },
  {
    id: "data",
    title: "Data Cloud",
    body: "One context layer so people, money, and plans stay consistent.",
    features: [
      "Worker, org, and cost-center graph",
      "Live query views for dashboards and agents",
      "Event stream for hire, pay, approve, terminate",
      "Exportable CSV extracts for analysts",
    ],
  },
  {
    id: "governance",
    title: "AI Governance & Trust",
    body: "Treat agents like first-class identities with passports and audits.",
    features: [
      "Agent system of record and ownership",
      "Permission-aware tool execution",
      "Full prompt/tool audit log (demo)",
      "Responsible AI policy center",
    ],
  },
  {
    id: "ecosystem",
    title: "Ecosystem",
    body: "Partners and builders extend Work Beacon without brittle glue code.",
    features: [
      "Marketplace installables that add nav modules",
      "IdP, ATS, chat, and bank connector stubs",
      "Developer portal with demo API keys",
      "Partner success playbooks",
    ],
  },
] as const;

export const PRODUCT_DETAILS: Record<
  string,
  {
    modules: { name: string; detail: string }[];
    outcomes: string[];
    who: string;
  }
> = {
  hcm: {
    who: "CHRO, HR ops, people partners",
    modules: [
      { name: "Core HR", detail: "Workers, jobs, locations, documents" },
      { name: "Org management", detail: "Supervisory orgs and cost centers" },
      { name: "Workforce planning", detail: "Headcount plans tied to finance" },
      { name: "Employee experience", detail: "ESS tasks, inbox, and agent" },
    ],
    outcomes: [
      "Single worker record",
      "Cleaner manager self-service",
      "Fewer spreadsheet orgs",
    ],
  },
  payroll: {
    who: "Payroll leads, controllers",
    modules: [
      { name: "Pay calculation", detail: "Gross-to-net with mock tax lines" },
      { name: "Multi-entity", detail: "Separate legal entities in one demo" },
      { name: "Self-service stubs", detail: "Pay history and deposit prefs" },
      { name: "Compliance pack", detail: "Form lists and filing reminders" },
    ],
    outcomes: ["On-time demo pays", "Transparent statements", "Audit-ready trails"],
  },
  talent: {
    who: "Talent leaders, L&D",
    modules: [
      { name: "Goals & feedback", detail: "Cycles, check-ins, calibration lite" },
      { name: "Learning", detail: "Assigned paths and completions" },
      { name: "Skills", detail: "Inventory and suggested growth" },
      { name: "Succession", detail: "Ready-now / ready-later boxes" },
    ],
    outcomes: ["Visible skills", "Higher goal completion", "Clearer successors"],
  },
  finance: {
    who: "CFO, controllers, AP",
    modules: [
      { name: "Accounting center", detail: "Journals and chart of accounts lite" },
      { name: "Spend", detail: "Expenses and procurement requests" },
      { name: "Close", detail: "Month-end checklist and owners" },
      { name: "Reporting", detail: "Operational finance extracts" },
    ],
    outcomes: ["Faster close demos", "Governed spend", "Shared actuals"],
  },
  planning: {
    who: "FP&A, workforce planners",
    modules: [
      { name: "Headcount plans", detail: "Plan vs actual by department" },
      { name: "Scenarios", detail: "Base / upside / downside toggles" },
      { name: "Driver models", detail: "Simple ratio planning boards" },
      { name: "Collaboration", detail: "Owner comments on plan cells" },
    ],
    outcomes: ["One planning canvas", "Fewer spreadsheet forks", "Aligned HR+Finance"],
  },
  platform: {
    who: "CIO, platform engineers",
    modules: [
      { name: "APIs", detail: "Demo REST for workers, time, pay" },
      { name: "Tools & MCP-ready hooks", detail: "Agent tool registry" },
      { name: "Workflows", detail: "Configurable approval chains" },
      { name: "Marketplace", detail: "Installable extension apps" },
    ],
    outcomes: ["Safe extensibility", "Observable agents", "Partner velocity"],
  },
};

export const INDUSTRY_DETAILS: Record<
  string,
  {
    challenges: string[];
    modules: string[];
    playbook: string;
  }
> = {
  "financial-services": {
    challenges: [
      "Strict access control on people and money data",
      "Audit evidence for compensation and expenses",
      "Front-office hiring velocity without policy slips",
    ],
    modules: ["HCM", "Payroll", "Financial Management", "Governance"],
    playbook:
      "Start with governed ESS/MSS, tighten expense thresholds, then layer finance agents for exception triage.",
  },
  healthcare: {
    challenges: [
      "Credential tracking for clinical staff",
      "24/7 scheduling and float pools",
      "Benefits complexity across worker types",
    ],
    modules: ["HCM", "Workforce ops", "Benefits", "Learning"],
    playbook:
      "Prioritize scheduling + credentials, then onboarding checklists for traveling clinicians.",
  },
  "higher-education": {
    challenges: [
      "Faculty vs staff employment patterns",
      "Grant-aware costing",
      "Seasonal student hiring",
    ],
    modules: ["HCM", "Payroll", "Planning", "Talent"],
    playbook:
      "Model academic orgs clearly, then connect student-worker hiring to onboarding and pay.",
  },
  manufacturing: {
    challenges: [
      "Plant-level supervisory orgs",
      "Shift work and overtime visibility",
      "Skills for certified roles",
    ],
    modules: ["Workforce ops", "HCM", "Learning", "Payroll"],
    playbook:
      "Stand up time & attendance first, then skills + learning for certified line roles.",
  },
  retail: {
    challenges: [
      "High-volume hourly hiring",
      "Store schedules that change weekly",
      "Consistent policy answers at the edge",
    ],
    modules: ["Recruiting", "Scheduling", "Payroll", "Everyone Agent"],
    playbook:
      "Optimize hire-to-schedule, then put Everyone Agent in front of store associates.",
  },
  technology: {
    challenges: [
      "Skills-based org design",
      "Equity and total rewards clarity",
      "Remote-first onboarding",
    ],
    modules: ["Talent", "HCM", "Planning", "Platform"],
    playbook:
      "Invest in skills + compensation statements, then planning scenarios for headcount bets.",
  },
};

export const CUSTOMER_STORIES = [
  {
    slug: "northwind",
    name: "Northwind Retail",
    industry: "Retail",
    logo: { letters: "NR", hue: 12 },
    challenge:
      "Store managers spent nights chasing interview slots while HR juggled three ATS exports.",
    solution:
      `${BRAND.name} recruiting board + Everyone Agent scheduling prompts cut handoffs between HR and stores.`,
    result:
      "Interview scheduling moved from days to hours in the demo narrative — with clear audit on who approved offers.",
    quote:
      "The time savings is mind-boggling. We’re thrilled to give those hours back to the stores.",
    role: "Head of Talent Acquisition",
    metrics: [
      { value: "2M+", label: "associate hours redirected (story metric)" },
      { value: "85%", label: "candidates scheduled in under an hour" },
    ],
  },
  {
    slug: "orbit",
    name: "Orbit Labs",
    industry: "Technology",
    logo: { letters: "OL", hue: 210 },
    challenge:
      "Performance reviews lived in slides; skills data never made it into planning.",
    solution:
      "Talent cycles, skills tags, and planning boards shared one worker graph.",
    result:
      "Leaders saw ready-now successors and learning gaps in one place.",
    quote:
      "Automated talent review gave us clearer skills and career-interest insight.",
    role: "Senior Director, HR Operations",
    metrics: [
      { value: "$4.5M", label: "legacy tool spend avoided (story)" },
      { value: "26%", label: "review completion lift" },
    ],
  },
  {
    slug: "summit",
    name: "Summit Grid",
    industry: "Manufacturing",
    logo: { letters: "SG", hue: 150 },
    challenge:
      "Plants ran separate time systems; finance never trusted headcount actuals.",
    solution:
      "Workforce ops + payroll + finance lite on one demo tenant with shared cost centers.",
    result:
      "Controllers and plant HR finally argued from the same numbers.",
    quote:
      "Agents across modules on one system of record will be transformative.",
    role: "Chief Accounting Officer",
    metrics: [
      { value: "7,000+", label: "employees in the story org" },
      { value: "43", label: "legal entities modeled" },
    ],
  },
] as const;

export const RESOURCE_ARTICLES = [
  {
    slug: "ess-mss-checklist",
    title: "ESS/MSS checklist for midsize rollouts",
    topic: "HCM",
    minutes: 6,
    summary: "What every employee and manager portal should cover before go-live.",
    body: [
      "Employee self-service should cover profile, pay, time, benefits documents, and learning — with clear empty states.",
      "Manager self-service needs approvals, team calendar, and local reporting without exporting to spreadsheets.",
      "Role-based permissions prevent accidental cross-org visibility in demos and production alike.",
    ],
  },
  {
    slug: "agent-guardrails",
    title: "Guardrails for workplace agents",
    topic: "AI",
    minutes: 5,
    summary: "How to keep assistants helpful without unsupervised writes.",
    body: [
      "Treat every tool call as an audited event with actor, intent, and outcome.",
      "Prefer propose-then-approve for payroll, compensation, and terminations.",
      "Scope data to the signed-in worker unless the role is explicitly managerial.",
    ],
  },
  {
    slug: "close-calendar",
    title: "A practical finance close calendar",
    topic: "Finance",
    minutes: 7,
    summary: "Owners, dependencies, and status for a demo month-end.",
    body: [
      "List tasks by ledger area with a single accountable owner.",
      "Block close on open expense exceptions above threshold.",
      "Publish a narrative pack agents can draft from variance snapshots.",
    ],
  },
  {
    slug: "scheduling-retail",
    title: "Retail scheduling without chaos",
    topic: "Workforce",
    minutes: 5,
    summary: "Publish shifts, handle swaps, and keep labor visible.",
    body: [
      "Publish a week grid early; allow constrained swaps with manager confirm.",
      "Surface overtime exceptions before payroll lock.",
      "Connect hiring velocity to open shifts so stores see the gap.",
    ],
  },
  {
    slug: "onboarding-day-one",
    title: "Day-one onboarding that actually finishes",
    topic: "Talent",
    minutes: 4,
    summary: "Checklist design for I-9 stubs, equipment, and first training.",
    body: [
      "Put tasks in the employee inbox with due dates, not email threads.",
      "Auto-assign security and culture courses on hire.",
      "Managers see blockers without chasing HR for status.",
    ],
  },
  {
    slug: "total-rewards-story",
    title: "Telling the total rewards story",
    topic: "Payroll",
    minutes: 5,
    summary: "Base, bonus, and employer benefit cost in one statement.",
    body: [
      "Employees understand retention when they see employer-paid value.",
      "Keep YTD figures next to the latest stub for trust.",
      "Link learning and wellness tips without drowning the statement.",
    ],
  },
  {
    slug: "integration-map",
    title: "Integration map for HR+Finance platforms",
    topic: "Platform",
    minutes: 6,
    summary: "IdP, ATS, banks, and chat — what to connect first.",
    body: [
      "Start with identity — SSO theater builds executive confidence.",
      "ATS → hire event keeps the worker graph honest.",
      "Bank and expense connectors matter only after pay statements feel real.",
    ],
  },
] as const;

export const PRICING_FEATURES = [
  { name: "Employee self-service", go: true, enterprise: true, plus: true },
  { name: "Manager approvals", go: true, enterprise: true, plus: true },
  { name: "Payroll & pay statements", go: true, enterprise: true, plus: true },
  { name: "Workforce scheduling", go: false, enterprise: true, plus: true },
  { name: "Recruiting & onboarding", go: false, enterprise: true, plus: true },
  { name: "Financial management lite", go: false, enterprise: true, plus: true },
  { name: "Beacon Planning (FP&A)", go: false, enterprise: true, plus: true },
  { name: "Beacon Pulse engagement", go: false, enterprise: true, plus: true },
  { name: "Agent orchestration + audit", go: "Starter", enterprise: true, plus: true },
  { name: "Marketplace & APIs", go: false, enterprise: "Limited", plus: true },
  { name: "Premier success & sandbox", go: false, enterprise: false, plus: true },
] as const;

export const ABOUT_TIMELINE = [
  { year: "2024", text: "Work Beacon concept — people and money on one demo graph." },
  { year: "2025", text: "ESS/MSS shell, agent v1, and industry marketing system." },
  { year: "2026", text: "Phase 2 industry depth: tenant personas, workforce, talent, money." },
] as const;

export const LEADERSHIP = [
  { name: "Avery Chen", title: "Chief Executive Officer", blurb: "Ex-operator focused on clarity over complexity." },
  { name: "Morgan Ellison", title: "Chief Product Officer", blurb: "Owns Hire-to-Retire and agent experience." },
  { name: "Reese Okonkwo", title: "Chief Technology Officer", blurb: "Platform, governance, and developer ecosystem." },
] as const;

export const MARKETPLACE_APPS = [
  { name: "Shift Swap", category: "Workforce", blurb: "Let associates propose shift trades with manager confirm." },
  { name: "Offer Desk", category: "Talent", blurb: "Template offers with compensation bands." },
  { name: "Expense Lens", category: "Finance", blurb: "Highlight policy outliers before approval." },
  { name: "Org Pulse", category: "Experience", blurb: "Lightweight team health check-ins." },
] as const;

export const COMMUNITY_THREADS = [
  { title: "How do you structure cost centers for multi-entity payroll?", replies: 24, tag: "Payroll" },
  { title: "Agent audit logs — what do auditors actually ask for?", replies: 18, tag: "AI" },
  { title: "Sharing a retail scheduling template", replies: 41, tag: "Workforce" },
] as const;

export const DEV_ENDPOINTS = [
  { method: "GET", path: "/api/demo/workers", desc: "List demo workers" },
  { method: "GET", path: "/api/demo/events", desc: "List process events" },
  { method: "GET", path: "/api/demo/time-off", desc: "List leave requests" },
] as const;
