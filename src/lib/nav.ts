import { BRAND } from "@/lib/brand";

export type NavLink = { href: string; label: string; blurb?: string };

export type MegaColumn = { title: string; links: NavLink[] };

export type MegaItem = {
  id: string;
  label: string;
  href: string;
  columns: MegaColumn[];
};

export const MEGA_NAV: MegaItem[] = [
  {
    id: "agents",
    label: "Agents",
    href: "/agents",
    columns: [
      {
        title: "Agents for HR",
        links: [
          { href: "/agents/hr", label: "HR Agents", blurb: "Hiring, talent, workforce" },
          { href: "/agents/hr", label: "Talent Acquisition" },
          { href: "/agents/hr", label: "Workforce Management" },
        ],
      },
      {
        title: "Agents for Finance",
        links: [
          { href: "/agents/finance", label: "Finance Agents", blurb: "Spend, audit, contracts" },
          { href: "/agents/finance", label: "Procurement" },
          { href: "/agents/finance", label: "Travel" },
        ],
      },
      {
        title: "IT & Everyone",
        links: [
          { href: "/agents/it", label: "IT & Developer Agents" },
          { href: "/agents/everyone", label: "Agents for Everyone" },
          { href: "/agents/beacon", label: `${BRAND.name} Agent` },
        ],
      },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    href: "/platform",
    columns: [
      {
        title: "Extend AI",
        links: [
          { href: "/platform", label: "Trusted Agentic Platform" },
          { href: "/platform#builder", label: "Agent & App Builder" },
          { href: "/platform#tools", label: "Agent-Ready Tools" },
        ],
      },
      {
        title: "Data & Trust",
        links: [
          { href: "/platform#data", label: "Data Cloud" },
          { href: "/platform#governance", label: "AI Governance" },
          { href: "/platform#ecosystem", label: "Ecosystem" },
        ],
      },
    ],
  },
  {
    id: "products",
    label: "Products",
    href: "/products",
    columns: [
      {
        title: "Human Capital",
        links: [
          { href: "/products/hcm", label: "HCM Overview" },
          { href: "/products/payroll", label: "Payroll" },
          { href: "/products/talent", label: "Talent Management" },
        ],
      },
      {
        title: "Finance & IT",
        links: [
          { href: "/products/finance", label: "Financial Management" },
          { href: "/products/planning", label: "Planning & Analysis" },
          { href: "/products/platform", label: "Developer Platform" },
        ],
      },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    href: "/customers",
    columns: [
      {
        title: "Stories",
        links: [
          { href: "/customers", label: "All customer stories" },
          { href: "/customers/northwind", label: "Northwind Retail" },
          { href: "/industries", label: "Industry solutions" },
        ],
      },
    ],
  },
];

export const MORE_SITES: NavLink[] = [
  { href: "/community", label: "Community" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/developers", label: "Developers" },
];

export const ASK_CHIPS = [
  { label: "Tell me about AI agents", href: "/agents" },
  { label: "Find industry solutions", href: "/industries" },
  { label: `What is ${BRAND.name} Agent?`, href: "/agents/beacon" },
] as const;

export const TRUST_LOGOS = [
  "Helix Systems",
  "Cedar Peak",
  "Orbit Labs",
  "Northwind",
  "Brightline Co",
  "Summit Grid",
] as const;
