import { BRAND } from "@/lib/brand";

export const PRODUCTS = [
  {
    slug: "hcm",
    name: "Human Capital Management",
    summary: "Hire, pay, develop, and retain people on one system of record.",
    bullets: ["HR management", "Talent & skills", "Workforce planning"],
  },
  {
    slug: "payroll",
    name: "Payroll",
    summary: "Accurate, compliant payroll with audit-ready trails.",
    bullets: ["Multi-entity payroll", "Tax readiness", "Employee self-service"],
  },
  {
    slug: "talent",
    name: "Talent Management",
    summary: "Grow careers with goals, feedback, and skills intelligence.",
    bullets: ["Performance", "Learning paths", "Succession"],
  },
  {
    slug: "finance",
    name: "Financial Management",
    summary: "Close books faster with real-time finance operations.",
    bullets: ["General ledger", "Spend management", "Accounting center"],
  },
  {
    slug: "planning",
    name: "Planning & Analysis",
    summary: "Model scenarios and align plans across HR and finance.",
    bullets: ["FP&A", "Workforce plans", "Rolling forecasts"],
  },
  {
    slug: "platform",
    name: "Developer Platform",
    summary: "Extend Work Beacon with secure apps, agents, and integrations.",
    bullets: ["App builder", "APIs & MCP-ready tools", "Partner connectors"],
  },
] as const;

export type ProductSlug = (typeof PRODUCTS)[number]["slug"];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const AGENT_CATEGORIES = [
  {
    slug: "hr",
    name: "Agents for HR",
    summary: "Accelerate hiring and free teams from routine people work.",
  },
  {
    slug: "finance",
    name: "Agents for Finance",
    summary: "Control spend and streamline audit, contracts, and procurement.",
  },
  {
    slug: "it",
    name: "Agents for IT & Developers",
    summary: "Support employees faster and build on a governed foundation.",
  },
  {
    slug: "everyone",
    name: "Agents for Everyone",
    summary: "Personalized help for everyday tasks and priorities.",
  },
  {
    slug: "beacon",
    name: `${BRAND.name} Agent`,
    summary:
      "The orchestrator experience that anticipates, advises, and acts within your rules.",
  },
] as const;

export function getAgentCategory(slug: string) {
  return AGENT_CATEGORIES.find((a) => a.slug === slug);
}

export const CUSTOMERS = [
  {
    slug: "northwind",
    name: "Northwind Retail",
    industry: "Retail",
    quote:
      "The time savings is mind-boggling. We’re thrilled to give those hours back to the stores.",
    role: "Head of Talent Acquisition",
    metrics: [
      { value: "2M+", label: "hours saved annually" },
      { value: "85%", label: "applicants scheduled fast" },
    ],
  },
  {
    slug: "orbit",
    name: "Orbit Labs",
    industry: "Technology",
    quote:
      "Automated talent review gave us clearer skills and career-interest insight.",
    role: "Senior Director, HR Operations",
    metrics: [
      { value: "$4.5M", label: "systems savings" },
      { value: "26%", label: "review completion lift" },
    ],
  },
  {
    slug: "summit",
    name: "Summit Grid",
    industry: "Manufacturing",
    quote:
      "Agents across modules on one system of record will be transformative.",
    role: "Chief Accounting Officer",
    metrics: [
      { value: "7,000+", label: "employees supported" },
      { value: "43", label: "legal entities" },
    ],
  },
] as const;

export function getCustomer(slug: string) {
  return CUSTOMERS.find((c) => c.slug === slug);
}

export const INDUSTRIES = [
  {
    slug: "financial-services",
    name: "Financial Services",
    summary: "Governed AI for risk-aware HR and finance operations.",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    summary: "Staffing, compliance, and clinical support workforce needs.",
  },
  {
    slug: "higher-education",
    name: "Higher Education",
    summary: "Faculty, staff, and student workforce on one platform.",
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    summary: "Scale plants and people with shared financial context.",
  },
  {
    slug: "retail",
    name: "Retail",
    summary: "Hire faster and keep store teams focused on customers.",
  },
  {
    slug: "technology",
    name: "Technology",
    summary: "Grow engineering orgs with skills-aware talent systems.",
  },
] as const;

export function getIndustry(slug: string) {
  return INDUSTRIES.find((i) => i.slug === slug);
}

export const RESOURCE_SECTIONS = [
  { slug: "demos", name: "Product & Agent Demos", blurb: "Watch guided walkthroughs." },
  { slug: "events", name: "Events", blurb: "Upcoming sessions and summits." },
  { slug: "webinars", name: "Webinars", blurb: "On-demand learning." },
  { slug: "library", name: "Resource Library", blurb: "Guides and briefs." },
] as const;
