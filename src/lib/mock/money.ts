import type { PayStub } from "@/lib/mock/data";
import { TENANT } from "@/lib/mock/org";

export function moneyUsd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function payYtd(stubs: PayStub[]) {
  return stubs.reduce(
    (acc, s) => ({
      gross: acc.gross + s.gross,
      taxes: acc.taxes + s.taxes,
      deductions: acc.deductions + s.deductions,
      net: acc.net + s.net,
    }),
    { gross: 0, taxes: 0, deductions: 0, net: 0 },
  );
}

export type BankAccount = {
  id: string;
  nickname: string;
  routing: string;
  last4: string;
  kind: "Checking" | "Savings";
  primary: boolean;
};

export type TaxForm = {
  id: string;
  kind: "W-2" | "1099-NEC";
  year: number;
  workerId: string;
  issued: string;
};

export type TotalRewards = {
  year: number;
  base: number;
  bonus: number;
  benefitsEmployer: number;
};

export type ExpenseStatus = "Submitted" | "Approved" | "Denied";

export type Expense = {
  id: string;
  workerId: string;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  receiptName: string;
  receiptKb: number;
  status: ExpenseStatus;
};

export type CatalogItem = {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
};

export type PurchaseRequest = {
  id: string;
  itemId: string;
  qty: number;
  requestedBy: string;
  status: "Requested" | "Approved" | "Ordered";
  poNumber?: string;
};

export type GlAccount = {
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
};

export type JournalLine = {
  accountCode: string;
  debit: number;
  credit: number;
};

export type Journal = {
  id: string;
  date: string;
  memo: string;
  status: "Draft" | "Posted";
  lines: JournalLine[];
};

export type PlanningScenario = "baseline" | "stretch";

export type PlanningRow = {
  department: string;
  planHeadcount: number;
  actualHeadcount: number;
  planSpend: number;
  actualSpend: number;
};

export type CloseTask = {
  id: string;
  period: string;
  title: string;
  done: boolean;
};

export const SEED_BANKS: BankAccount[] = [
  {
    id: "ba-1",
    nickname: "Payroll checking",
    routing: "021000021",
    last4: "4412",
    kind: "Checking",
    primary: true,
  },
];

export const SEED_TAX_FORMS: TaxForm[] = [
  {
    id: "tf-w2-2025",
    kind: "W-2",
    year: 2025,
    workerId: "w-alex",
    issued: "2026-01-31",
  },
  {
    id: "tf-1099-2025",
    kind: "1099-NEC",
    year: 2025,
    workerId: "w-alex",
    issued: "2026-01-31",
  },
];

export const SEED_TOTAL_REWARDS: TotalRewards = {
  year: 2026,
  base: 124800,
  bonus: 12000,
  benefitsEmployer: 18480,
};

export const SEED_EXPENSES: Expense[] = [
  {
    id: "ex-1",
    workerId: "w-alex",
    amount: 86.4,
    merchant: "Caltrain",
    category: "Travel",
    date: "2026-10-08",
    receiptName: "caltrain-oct.pdf",
    receiptKb: 124,
    status: "Approved",
  },
  {
    id: "ex-2",
    workerId: "w-alex",
    amount: 54.0,
    merchant: "Northstar Cafe",
    category: "Meals",
    date: "2026-10-12",
    receiptName: "cafe-lunch.jpg",
    receiptKb: 410,
    status: "Submitted",
  },
];

export const SEED_CATALOG: CatalogItem[] = [
  { id: "cat-1", name: "Laptop stand", category: "Hardware", unitPrice: 89 },
  { id: "cat-2", name: "Annual design tool seat", category: "Software", unitPrice: 144 },
  { id: "cat-3", name: "Noise-cancelling headset", category: "Hardware", unitPrice: 219 },
];

export const SEED_PURCHASES: PurchaseRequest[] = [
  {
    id: "pr-1",
    itemId: "cat-2",
    qty: 1,
    requestedBy: "w-alex",
    status: "Requested",
  },
];

export const CHART_OF_ACCOUNTS: GlAccount[] = [
  { code: "1000", name: "Operating cash", type: "Asset" },
  { code: "1100", name: "Accounts receivable", type: "Asset" },
  { code: "2000", name: "Accounts payable", type: "Liability" },
  { code: "3000", name: "Retained earnings", type: "Equity" },
  { code: "4000", name: "Product revenue", type: "Revenue" },
  { code: "5000", name: "Payroll expense", type: "Expense" },
  { code: "5100", name: "Software expense", type: "Expense" },
];

export const SEED_JOURNALS: Journal[] = [
  {
    id: "je-1",
    date: "2026-10-01",
    memo: "September payroll accrual",
    status: "Posted",
    lines: [
      { accountCode: "5000", debit: 24800, credit: 0 },
      { accountCode: "2000", debit: 0, credit: 24800 },
    ],
  },
];

export const SEED_PLANNING: PlanningRow[] = [
  {
    department: "Engineering",
    planHeadcount: 42,
    actualHeadcount: 40,
    planSpend: 420000,
    actualSpend: 398000,
  },
  {
    department: "Product",
    planHeadcount: 12,
    actualHeadcount: 12,
    planSpend: 110000,
    actualSpend: 108400,
  },
  {
    department: "People",
    planHeadcount: 6,
    actualHeadcount: 5,
    planSpend: 52000,
    actualSpend: 48000,
  },
  {
    department: "Finance",
    planHeadcount: 5,
    actualHeadcount: 5,
    planSpend: 48000,
    actualSpend: 47500,
  },
];

export const CLOSE_PERIOD = "2026-10";

export const SEED_CLOSE: CloseTask[] = [
  {
    id: "cl-1",
    period: CLOSE_PERIOD,
    title: "Lock payroll for the period",
    done: true,
  },
  {
    id: "cl-2",
    period: CLOSE_PERIOD,
    title: "Post expense accruals",
    done: false,
  },
  {
    id: "cl-3",
    period: CLOSE_PERIOD,
    title: "Reconcile operating cash",
    done: false,
  },
  {
    id: "cl-4",
    period: CLOSE_PERIOD,
    title: "Review intercompany (demo stub)",
    done: false,
  },
];

export function nextPoNumber(existing: PurchaseRequest[]) {
  const used = existing
    .map((p) => p.poNumber)
    .filter((n): n is string => Boolean(n))
    .map((n) => Number(n.replace(/\D/g, "")))
    .filter((n) => !Number.isNaN(n));
  const next = (used.length ? Math.max(...used) : 1000) + 1;
  return `PO-2026-${next}`;
}

export function journalBalanced(lines: JournalLine[]) {
  const debit = lines.reduce((s, l) => s + l.debit, 0);
  const credit = lines.reduce((s, l) => s + l.credit, 0);
  return Math.abs(debit - credit) < 0.005 && debit > 0;
}

export function scenarioRows(
  rows: PlanningRow[],
  scenario: PlanningScenario,
): PlanningRow[] {
  if (scenario === "baseline") return rows;
  return rows.map((r) => ({
    ...r,
    planHeadcount: Math.round(r.planHeadcount * 1.12),
    planSpend: Math.round(r.planSpend * 1.12),
  }));
}

export function taxFormHtml(form: TaxForm, workerName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${form.kind} ${form.year} — ${TENANT.legalName}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 2rem; color: #111; }
    h1 { font-size: 1.25rem; }
    table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
    th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
  </style>
</head>
<body>
  <p>${TENANT.legalName} · demo form · not for filing</p>
  <h1>${form.kind} for tax year ${form.year}</h1>
  <table>
    <tr><th>Recipient</th><td>${workerName}</td></tr>
    <tr><th>Issued</th><td>${form.issued}</td></tr>
    <tr><th>Form</th><td>${form.kind}</td></tr>
    <tr><th>Wages / nonemployee (demo)</th><td>$124,800.00</td></tr>
  </table>
</body>
</html>`;
}

export function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
