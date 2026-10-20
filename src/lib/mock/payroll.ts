import type { PayStub } from "@/lib/mock/data";
import { TENANT, WORKERS } from "@/lib/mock/org";
import { CURRENT_SALARY } from "@/lib/mock/people-ops";
import { moneyUsd } from "@/lib/mock/money";

export type PayCadence = "semi" | "biweekly";
export type PayRunStatus = "Draft" | "Calculated" | "Complete";
export type GarnishmentStatus = "Active" | "Released";
export type OffCycleStatus = "Draft" | "Paid";

export type PayGroup = {
  id: string;
  name: string;
  cadence: PayCadence;
  periodsPerYear: number;
};

export type PayPeriod = {
  id: string;
  groupId: string;
  start: string;
  end: string;
  payDate: string;
  status: "Paid" | "Open";
};

export type PayResult = {
  workerId: string;
  gross: number;
  retro: number;
  taxes: number;
  deductions: number;
  garnish: number;
  net: number;
};

export type PayRun = {
  id: string;
  groupId: string;
  periodId: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  status: PayRunStatus;
  results: PayResult[];
};

export type Garnishment = {
  id: string;
  workerId: string;
  agency: string;
  amountPerPeriod: number;
  status: GarnishmentStatus;
};

export type OffCyclePay = {
  id: string;
  workerId: string;
  amount: number;
  reason: string;
  payDate: string;
  status: OffCycleStatus;
};

export type RetroAdjustment = {
  id: string;
  workerId: string;
  amount: number;
  note: string;
  periodLabel: string;
  appliedToRunId?: string;
};

export const PAY_GROUPS: PayGroup[] = [
  {
    id: "pg-sm",
    name: "Semi-monthly salaried",
    cadence: "semi",
    periodsPerYear: 24,
  },
  {
    id: "pg-bw",
    name: "Biweekly operations",
    cadence: "biweekly",
    periodsPerYear: 26,
  },
];

export function groupIdForWorker(workerId: string) {
  return workerId === "w-casey" || workerId === "w-sam" ? "pg-bw" : "pg-sm";
}

export function workersInGroup(groupId: string) {
  return WORKERS.filter((w) => groupIdForWorker(w.id) === groupId);
}

export const SEED_PAY_PERIODS: PayPeriod[] = [
  {
    id: "per-sm-1015",
    groupId: "pg-sm",
    start: "2026-10-01",
    end: "2026-10-15",
    payDate: "2026-10-15",
    status: "Paid",
  },
  {
    id: "per-sm-1031",
    groupId: "pg-sm",
    start: "2026-10-16",
    end: "2026-10-31",
    payDate: "2026-10-31",
    status: "Open",
  },
  {
    id: "per-bw-1023",
    groupId: "pg-bw",
    start: "2026-10-10",
    end: "2026-10-23",
    payDate: "2026-10-23",
    status: "Open",
  },
];

export const SEED_PAYROLL_RUNS: PayRun[] = [
  {
    id: "run-sm-1031",
    groupId: "pg-sm",
    periodId: "per-sm-1031",
    periodStart: "2026-10-16",
    periodEnd: "2026-10-31",
    payDate: "2026-10-31",
    status: "Draft",
    results: [],
  },
];

export const SEED_GARNISHMENTS: Garnishment[] = [
  {
    id: "gar-1",
    workerId: "w-riley",
    agency: "Travis County child support",
    amountPerPeriod: 220,
    status: "Active",
  },
];

export const SEED_OFF_CYCLE: OffCyclePay[] = [];

export const SEED_RETRO: RetroAdjustment[] = [
  {
    id: "ret-1",
    workerId: "w-alex",
    amount: 250,
    note: "Missed overtime from week of Oct 6",
    periodLabel: "Oct 1–15, 2026",
  },
];

export const SEED_EXTRA_STUBS: PayStub[] = [];

export function periodLabel(start: string, end: string) {
  const a = new Date(`${start}T12:00:00`);
  const b = new Date(`${end}T12:00:00`);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(a)}–${fmt(b)}, ${b.getFullYear()}`;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function grossFor(workerId: string, group: PayGroup) {
  const salary = CURRENT_SALARY[workerId] ?? 120000;
  return round2(salary / group.periodsPerYear);
}

export function calculateResults(
  groupId: string,
  garnishments: Garnishment[],
  retros: RetroAdjustment[],
): PayResult[] {
  const group = PAY_GROUPS.find((g) => g.id === groupId);
  if (!group) return [];
  return workersInGroup(groupId).map((w) => {
    const gross = grossFor(w.id, group);
    const retro = retros
      .filter((r) => r.workerId === w.id && !r.appliedToRunId)
      .reduce((s, r) => s + r.amount, 0);
    const base = gross + retro;
    const taxes = round2(base * 0.2765);
    const deductions = round2(180 + base * 0.06);
    const garnish = garnishments
      .filter((g) => g.workerId === w.id && g.status === "Active")
      .reduce((s, g) => s + g.amountPerPeriod, 0);
    const net = round2(Math.max(0, base - taxes - deductions - garnish));
    return {
      workerId: w.id,
      gross,
      retro: round2(retro),
      taxes,
      deductions,
      garnish: round2(garnish),
      net,
    };
  });
}

export function resultToStub(run: PayRun, row: PayResult): PayStub {
  return {
    id: `pay-${run.payDate}-${row.workerId}`,
    workerId: row.workerId,
    period: periodLabel(run.periodStart, run.periodEnd),
    payDate: run.payDate,
    net: row.net,
    gross: row.gross + row.retro,
    taxes: row.taxes,
    deductions: row.deductions + row.garnish,
    earnings: [
      { label: "Regular", amount: row.gross },
      ...(row.retro
        ? [{ label: "Retro", amount: row.retro }]
        : []),
    ],
    taxLines: [
      { label: "Federal income", amount: round2(row.taxes * 0.54) },
      { label: "State income", amount: round2(row.taxes * 0.18) },
      { label: "FICA", amount: round2(row.taxes * 0.28) },
    ],
    deductionLines: [
      { label: "401(k)", amount: round2((row.gross + row.retro) * 0.06) },
      { label: "Medical", amount: 180 },
      ...(row.garnish
        ? [{ label: "Garnishment", amount: row.garnish }]
        : []),
    ],
  };
}

export function nextOpenPeriod(periods: PayPeriod[]) {
  return [...periods]
    .filter((p) => p.status === "Open")
    .sort((a, b) => a.payDate.localeCompare(b.payDate))[0];
}

export function taxPackHtml(run: PayRun) {
  const group = PAY_GROUPS.find((g) => g.id === run.groupId);
  const rows = run.results
    .map((r) => {
      const w = WORKERS.find((x) => x.id === r.workerId);
      return `<tr><td>${w?.name ?? r.workerId}</td><td>${moneyUsd(r.gross + r.retro)}</td><td>${moneyUsd(r.taxes)}</td><td>${moneyUsd(r.deductions + r.garnish)}</td><td>${moneyUsd(r.net)}</td></tr>`;
    })
    .join("");
  const tot = run.results.reduce(
    (a, r) => ({
      gross: a.gross + r.gross + r.retro,
      taxes: a.taxes + r.taxes,
      net: a.net + r.net,
    }),
    { gross: 0, taxes: 0, net: 0 },
  );
  return `<!doctype html><html><head><title>Beacon tax pack ${run.payDate}</title></head><body>
<h1>${TENANT.name} — tax pack</h1>
<p>${group?.name ?? run.groupId} · ${periodLabel(run.periodStart, run.periodEnd)} · paid ${run.payDate}</p>
<table border="1" cellpadding="6"><thead><tr><th>Worker</th><th>Gross</th><th>Taxes</th><th>Deductions</th><th>Net</th></tr></thead>
<tbody>${rows}</tbody></table>
<p>Totals gross ${moneyUsd(tot.gross)} · taxes ${moneyUsd(tot.taxes)} · net ${moneyUsd(tot.net)}</p>
<p>Demo file — not a filing.</p>
</body></html>`;
}
