/** Northstar Labs — single demo tenant seed for Phase 2. */

export type DemoRole = "employee" | "manager" | "hr_admin" | "finance";

export type Department = {
  id: string;
  name: string;
  costCenterId: string;
};

export type Location = {
  id: string;
  name: string;
  city: string;
  region: string;
};

export type CostCenter = {
  id: string;
  code: string;
  name: string;
};

export type JobEvent = {
  id: string;
  date: string;
  kind: "hire" | "promotion" | "transfer" | "comp";
  title: string;
  detail: string;
};

export type VaultDoc = {
  id: string;
  name: string;
  category: "Offer" | "Policy" | "Tax" | "Other";
  updated: string;
  workerId?: string;
};

export type InboxTask = {
  id: string;
  title: string;
  kind: "approval" | "todo" | "onboarding";
  due: string;
  done: boolean;
  forRoles: DemoRole[];
  workerId?: string;
};

export type Worker = {
  id: string;
  email: string;
  name: string;
  preferredName: string;
  title: string;
  departmentId: string;
  locationId: string;
  costCenterId: string;
  managerId: string | null;
  personaRole: DemoRole;
  hireDate: string;
  phone: string;
  history: JobEvent[];
};

export const TENANT = {
  id: "northstar",
  name: "Northstar Labs",
  legalName: "Northstar Labs, Inc.",
} as const;

export const COST_CENTERS: CostCenter[] = [
  { id: "cc-eng", code: "CC-100", name: "Engineering" },
  { id: "cc-prod", code: "CC-200", name: "Product" },
  { id: "cc-hr", code: "CC-300", name: "People" },
  { id: "cc-fin", code: "CC-400", name: "Finance" },
  { id: "cc-ops", code: "CC-500", name: "Operations" },
];

export const DEPARTMENTS: Department[] = [
  { id: "dep-eng", name: "Engineering", costCenterId: "cc-eng" },
  { id: "dep-prod", name: "Product", costCenterId: "cc-prod" },
  { id: "dep-hr", name: "People Operations", costCenterId: "cc-hr" },
  { id: "dep-fin", name: "Finance", costCenterId: "cc-fin" },
  { id: "dep-ops", name: "Operations", costCenterId: "cc-ops" },
];

export const LOCATIONS: Location[] = [
  { id: "loc-aus", name: "Austin HQ", city: "Austin", region: "TX" },
  { id: "loc-sf", name: "San Francisco", city: "San Francisco", region: "CA" },
  { id: "loc-remote", name: "Remote US", city: "Remote", region: "US" },
];

export const WORKERS: Worker[] = [
  {
    id: "w-ceo",
    email: "avery.chen@northstar.demo",
    name: "Avery Chen",
    preferredName: "Avery",
    title: "Chief Executive Officer",
    departmentId: "dep-ops",
    locationId: "loc-aus",
    costCenterId: "cc-ops",
    managerId: null,
    personaRole: "manager",
    hireDate: "2019-03-01",
    phone: "+1 (555) 010-1000",
    history: [
      {
        id: "h-ceo-1",
        date: "2019-03-01",
        kind: "hire",
        title: "Joined as CEO",
        detail: "Founding leadership",
      },
    ],
  },
  {
    id: "w-morgan",
    email: "morgan.lee@northstar.demo",
    name: "Morgan Lee",
    preferredName: "Morgan",
    title: "Director of Engineering",
    departmentId: "dep-eng",
    locationId: "loc-aus",
    costCenterId: "cc-eng",
    managerId: "w-ceo",
    personaRole: "manager",
    hireDate: "2020-06-15",
    phone: "+1 (555) 010-2200",
    history: [
      {
        id: "h-m-1",
        date: "2020-06-15",
        kind: "hire",
        title: "Engineering Manager",
        detail: "Joined Engineering",
      },
      {
        id: "h-m-2",
        date: "2023-01-01",
        kind: "promotion",
        title: "Director of Engineering",
        detail: "Promo + scope expansion",
      },
      {
        id: "h-m-3",
        date: "2025-04-01",
        kind: "comp",
        title: "Compensation review",
        detail: "Merit + equity refresh (demo)",
      },
    ],
  },
  {
    id: "w-alex",
    email: "demo@workbeacon.app",
    name: "Alex Rivera",
    preferredName: "Alex",
    title: "Senior Software Engineer",
    departmentId: "dep-eng",
    locationId: "loc-aus",
    costCenterId: "cc-eng",
    managerId: "w-morgan",
    personaRole: "employee",
    hireDate: "2022-02-14",
    phone: "+1 (555) 010-2040",
    history: [
      {
        id: "h-a-1",
        date: "2022-02-14",
        kind: "hire",
        title: "Software Engineer",
        detail: "Joined Platform team",
      },
      {
        id: "h-a-2",
        date: "2024-03-01",
        kind: "promotion",
        title: "Senior Software Engineer",
        detail: "IC ladder promo",
      },
      {
        id: "h-a-3",
        date: "2025-10-01",
        kind: "comp",
        title: "Annual merit",
        detail: "Base adjustment (demo)",
      },
    ],
  },
  {
    id: "w-casey",
    email: "casey.nguyen@northstar.demo",
    name: "Casey Nguyen",
    preferredName: "Casey",
    title: "Software Engineer",
    departmentId: "dep-eng",
    locationId: "loc-remote",
    costCenterId: "cc-eng",
    managerId: "w-morgan",
    personaRole: "employee",
    hireDate: "2023-05-08",
    phone: "+1 (555) 010-3311",
    history: [
      {
        id: "h-c-1",
        date: "2023-05-08",
        kind: "hire",
        title: "Software Engineer",
        detail: "Joined Core Services",
      },
    ],
  },
  {
    id: "w-riley",
    email: "riley.brooks@northstar.demo",
    name: "Riley Brooks",
    preferredName: "Riley",
    title: "Product Designer",
    departmentId: "dep-prod",
    locationId: "loc-sf",
    costCenterId: "cc-prod",
    managerId: "w-morgan",
    personaRole: "employee",
    hireDate: "2021-09-20",
    phone: "+1 (555) 010-4422",
    history: [
      {
        id: "h-r-1",
        date: "2021-09-20",
        kind: "hire",
        title: "Product Designer",
        detail: "Joined Design",
      },
      {
        id: "h-r-2",
        date: "2024-06-01",
        kind: "transfer",
        title: "Platform Design",
        detail: "Moved to Platform pod",
      },
    ],
  },
  {
    id: "w-taylor",
    email: "taylor.kim@northstar.demo",
    name: "Taylor Kim",
    preferredName: "Taylor",
    title: "Product Manager",
    departmentId: "dep-prod",
    locationId: "loc-sf",
    costCenterId: "cc-prod",
    managerId: "w-ceo",
    personaRole: "employee",
    hireDate: "2020-11-02",
    phone: "+1 (555) 010-5533",
    history: [
      {
        id: "h-t-1",
        date: "2020-11-02",
        kind: "hire",
        title: "Associate PM",
        detail: "Joined Product",
      },
      {
        id: "h-t-2",
        date: "2022-08-01",
        kind: "promotion",
        title: "Product Manager",
        detail: "Promo",
      },
    ],
  },
  {
    id: "w-priya",
    email: "priya.shah@northstar.demo",
    name: "Priya Shah",
    preferredName: "Priya",
    title: "HR Administrator",
    departmentId: "dep-hr",
    locationId: "loc-aus",
    costCenterId: "cc-hr",
    managerId: "w-ceo",
    personaRole: "hr_admin",
    hireDate: "2021-01-11",
    phone: "+1 (555) 010-6644",
    history: [
      {
        id: "h-p-1",
        date: "2021-01-11",
        kind: "hire",
        title: "HR Generalist",
        detail: "Joined People Ops",
      },
      {
        id: "h-p-2",
        date: "2023-09-01",
        kind: "promotion",
        title: "HR Administrator",
        detail: "Expanded systems ownership",
      },
    ],
  },
  {
    id: "w-devon",
    email: "devon.okafor@northstar.demo",
    name: "Devon Okafor",
    preferredName: "Devon",
    title: "Finance Analyst",
    departmentId: "dep-fin",
    locationId: "loc-aus",
    costCenterId: "cc-fin",
    managerId: "w-ceo",
    personaRole: "finance",
    hireDate: "2022-07-18",
    phone: "+1 (555) 010-7755",
    history: [
      {
        id: "h-d-1",
        date: "2022-07-18",
        kind: "hire",
        title: "Finance Analyst",
        detail: "Joined FP&A",
      },
      {
        id: "h-d-2",
        date: "2025-01-15",
        kind: "comp",
        title: "Market adjustment",
        detail: "Comp band refresh (demo)",
      },
    ],
  },
  {
    id: "w-sam",
    email: "sam.ortiz@northstar.demo",
    name: "Sam Ortiz",
    preferredName: "Sam",
    title: "People Partner",
    departmentId: "dep-hr",
    locationId: "loc-remote",
    costCenterId: "cc-hr",
    managerId: "w-priya",
    personaRole: "employee",
    hireDate: "2024-04-01",
    phone: "+1 (555) 010-8866",
    history: [
      {
        id: "h-s-1",
        date: "2024-04-01",
        kind: "hire",
        title: "People Partner",
        detail: "Joined People Ops",
      },
    ],
  },
  {
    id: "w-jordan",
    email: "jordan.hale@northstar.demo",
    name: "Jordan Hale",
    preferredName: "Jordan",
    title: "Software Engineer (incoming)",
    departmentId: "dep-eng",
    locationId: "loc-aus",
    costCenterId: "cc-eng",
    managerId: "w-morgan",
    personaRole: "employee",
    hireDate: "2026-10-27",
    phone: "+1 (555) 010-9900",
    history: [],
  },
];

export type Persona = {
  id: string;
  label: string;
  role: DemoRole;
  workerId: string;
  blurb: string;
};

export const PERSONAS: Persona[] = [
  {
    id: "employee",
    label: "Employee",
    role: "employee",
    workerId: "w-alex",
    blurb: "Alex Rivera — ESS self-service",
  },
  {
    id: "manager",
    label: "Manager",
    role: "manager",
    workerId: "w-morgan",
    blurb: "Morgan Lee — team approvals",
  },
  {
    id: "hr_admin",
    label: "HR Admin",
    role: "hr_admin",
    workerId: "w-priya",
    blurb: "Priya Shah — admin console",
  },
  {
    id: "finance",
    label: "Finance Analyst",
    role: "finance",
    workerId: "w-devon",
    blurb: "Devon Okafor — finance views",
  },
  {
    id: "new_hire",
    label: "New hire",
    role: "employee",
    workerId: "w-jordan",
    blurb: "Jordan Hale — first-week onboarding",
  },
];

export const SEED_VAULT_DOCS: VaultDoc[] = [
  {
    id: "doc-1",
    name: "Offer Letter — Alex Rivera.pdf",
    category: "Offer",
    updated: "2022-02-01",
    workerId: "w-alex",
  },
  {
    id: "doc-2",
    name: "Employee Handbook 2026.pdf",
    category: "Policy",
    updated: "2026-01-05",
  },
  {
    id: "doc-3",
    name: "W-4 Election (stub).pdf",
    category: "Tax",
    updated: "2026-01-12",
    workerId: "w-alex",
  },
  {
    id: "doc-4",
    name: "Remote Work Policy.pdf",
    category: "Policy",
    updated: "2025-11-01",
  },
  {
    id: "doc-5",
    name: "Offer Letter — Casey Nguyen.pdf",
    category: "Offer",
    updated: "2023-04-20",
    workerId: "w-casey",
  },
  {
    id: "doc-6",
    name: "Form W-2 Packet (stub).pdf",
    category: "Tax",
    updated: "2026-01-31",
  },
];

export const SEED_INBOX: InboxTask[] = [
  {
    id: "in-1",
    title: "Approve Casey Nguyen time off (Nov 20–21)",
    kind: "approval",
    due: "2026-10-22",
    done: false,
    forRoles: ["manager", "hr_admin"],
  },
  {
    id: "in-2",
    title: "Complete security awareness training",
    kind: "todo",
    due: "2026-11-12",
    done: false,
    forRoles: ["employee", "manager", "hr_admin", "finance"],
  },
  {
    id: "in-3",
    title: "Upload emergency contact (onboarding)",
    kind: "onboarding",
    due: "2026-10-25",
    done: false,
    forRoles: ["employee"],
    workerId: "w-alex",
  },
  {
    id: "in-4",
    title: "Review expense exception — Riley Brooks",
    kind: "approval",
    due: "2026-10-21",
    done: false,
    forRoles: ["manager", "finance", "hr_admin"],
  },
  {
    id: "in-case-1",
    title: "HR case: Missing overtime on Oct stub",
    kind: "todo",
    due: "2026-10-23",
    done: false,
    forRoles: ["hr_admin"],
  },
  {
    id: "in-5",
    title: "Confirm cost center mapping for CC-200",
    kind: "todo",
    due: "2026-10-28",
    done: false,
    forRoles: ["finance", "hr_admin"],
  },
  {
    id: "in-acc-1",
    title: "Access request: GitHub org admin — Casey Nguyen",
    kind: "todo",
    due: "2026-10-22",
    done: false,
    forRoles: ["hr_admin"],
  },
];

export function getWorker(id: string) {
  return WORKERS.find((w) => w.id === id);
}

export function getDepartment(id: string) {
  return DEPARTMENTS.find((d) => d.id === id);
}

export function getLocation(id: string) {
  return LOCATIONS.find((l) => l.id === id);
}

export function getCostCenter(id: string) {
  return COST_CENTERS.find((c) => c.id === id);
}

export function getPersona(id: string) {
  return PERSONAS.find((p) => p.id === id);
}

export function getDirectReports(managerId: string) {
  return WORKERS.filter((w) => w.managerId === managerId);
}

export function roleLabel(role: DemoRole) {
  switch (role) {
    case "employee":
      return "Employee";
    case "manager":
      return "Manager";
    case "hr_admin":
      return "HR Admin";
    case "finance":
      return "Finance Analyst";
  }
}
