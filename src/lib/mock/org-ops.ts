import { DEPARTMENTS, WORKERS } from "@/lib/mock/org";
import { WF_TODAY } from "@/lib/mock/workforce";

export type PositionStatus = "Filled" | "Open" | "Frozen";

export type Position = {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  fte: number;
  incumbentWorkerId: string | null;
  status: PositionStatus;
};

export type OrgMoveKind = "Transfer" | "Promotion";
export type OrgMoveStatus = "Submitted" | "Approved" | "Denied";

export type OrgMove = {
  id: string;
  kind: OrgMoveKind;
  workerId: string;
  fromTitle: string;
  toTitle: string;
  toDepartmentId: string;
  status: OrgMoveStatus;
  createdAt: string;
  inboxTaskId: string;
};

export type AssetKind = "Laptop" | "Badge" | "Phone";
export type AssetStatus = "Assigned" | "Available" | "Returned";

export type ItAsset = {
  id: string;
  kind: AssetKind;
  tag: string;
  workerId: string | null;
  status: AssetStatus;
};

export type AccessApp = "GitHub" | "VPN" | "Finance ledger" | "People admin";
export type AccessStatus = "Open" | "Approved" | "Denied";

export type AccessRequest = {
  id: string;
  workerId: string;
  app: AccessApp;
  roleLabel: string;
  status: AccessStatus;
  createdAt: string;
  inboxTaskId: string;
};

export type EligibilityStatus = "Complete" | "Missing";

export type Eligibility = {
  workerId: string;
  status: EligibilityStatus;
  docs: string[];
  updatedAt: string;
};

export const ACCESS_APPS: AccessApp[] = [
  "GitHub",
  "VPN",
  "Finance ledger",
  "People admin",
];

export const SEED_POSITIONS: Position[] = [
  {
    id: "pos-1",
    code: "ENG-IC3",
    title: "Staff Engineer",
    departmentId: "dep-eng",
    fte: 1,
    incumbentWorkerId: "w-alex",
    status: "Filled",
  },
  {
    id: "pos-2",
    code: "ENG-IC2",
    title: "Software Engineer",
    departmentId: "dep-eng",
    fte: 1,
    incumbentWorkerId: "w-casey",
    status: "Filled",
  },
  {
    id: "pos-3",
    code: "ENG-SR-OPEN",
    title: "Senior Engineer",
    departmentId: "dep-eng",
    fte: 1,
    incumbentWorkerId: null,
    status: "Open",
  },
  {
    id: "pos-4",
    code: "PROD-PM",
    title: "Product Manager",
    departmentId: "dep-prod",
    fte: 1,
    incumbentWorkerId: "w-riley",
    status: "Filled",
  },
  {
    id: "pos-5",
    code: "OPS-FROZEN",
    title: "Operations Lead",
    departmentId: "dep-ops",
    fte: 0.5,
    incumbentWorkerId: null,
    status: "Frozen",
  },
];

export const SEED_MOVES: OrgMove[] = [];

export const SEED_ASSETS: ItAsset[] = [
  {
    id: "ast-1",
    kind: "Laptop",
    tag: "NS-L-1042",
    workerId: "w-alex",
    status: "Assigned",
  },
  {
    id: "ast-2",
    kind: "Badge",
    tag: "NS-B-19",
    workerId: "w-alex",
    status: "Assigned",
  },
  {
    id: "ast-3",
    kind: "Phone",
    tag: "NS-P-7",
    workerId: null,
    status: "Available",
  },
  {
    id: "ast-4",
    kind: "Laptop",
    tag: "NS-L-2201",
    workerId: "w-casey",
    status: "Assigned",
  },
  {
    id: "ast-5",
    kind: "Laptop",
    tag: "NS-L-0091",
    workerId: null,
    status: "Available",
  },
];

export const SEED_ACCESS: AccessRequest[] = [
  {
    id: "acc-1",
    workerId: "w-casey",
    app: "GitHub",
    roleLabel: "org admin",
    status: "Open",
    createdAt: "2026-10-18",
    inboxTaskId: "in-acc-1",
  },
];

export const SEED_ELIGIBILITY: Eligibility[] = [
  {
    workerId: "w-alex",
    status: "Complete",
    docs: ["I-9 Section 1", "List A: passport"],
    updatedAt: "2024-04-12",
  },
  {
    workerId: "w-jordan",
    status: "Missing",
    docs: [],
    updatedAt: WF_TODAY,
  },
];

export function departmentName(id: string) {
  return DEPARTMENTS.find((d) => d.id === id)?.name ?? id;
}

export function workerTitle(id: string) {
  return WORKERS.find((w) => w.id === id)?.title ?? "Unknown";
}
