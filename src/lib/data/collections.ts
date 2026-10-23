import type { MockStoreState } from "@/lib/mock/store";

/**
 * Persisted collections. Every key of the app state (except the deprecated
 * `managerMode`) maps to rows in `public.records` under one collection name.
 * Access is enforced in Postgres by `public.collection_access` + RLS.
 */
export type SyncedKey = Exclude<keyof MockStoreState, "managerMode">;

type ListSpec = {
  kind: "list";
  /** Stable row id; defaults to `item.id`. */
  key?: (item: never) => string;
};
type SingleSpec = { kind: "single" };
export type CollectionSpec = ListSpec | SingleSpec;

const list = (key?: (item: never) => string): ListSpec => ({ kind: "list", key });
const single: SingleSpec = { kind: "single" };
const byWorker = (x: { workerId: string }) => x.workerId;

/** Record every key explicitly so a new state key fails to compile until it is mapped. */
export const COLLECTIONS: Record<SyncedKey, CollectionSpec> = {
  timeOff: list(),
  profile: single,
  notifications: list(),
  approvals: list(),
  inbox: list(),
  documents: list(),
  featureFlags: single,
  timesheets: list(),
  punches: list(),
  shifts: list(),
  exceptions: list(),
  jobs: list(),
  candidates: list(),
  onboarding: list(byWorker as (item: never) => string),
  offboarding: list(),
  skills: list(byWorker as (item: never) => string),
  succession: list(),
  goalRatings: list(((x: { goalId: string; workerId: string }) =>
    `${x.goalId}|${x.workerId}`) as (item: never) => string),
  feedback: list(),
  banks: list(),
  expenses: list(),
  purchases: list(),
  journals: list(),
  closeTasks: list(),
  planningScenario: single,
  pulseResponses: list(),
  pulsePlans: list(),
  agentAudit: list(),
  workflows: list(),
  processEvents: list(),
  connectedIntegrations: single,
  installedApps: single,
  homePins: single,
  demoApiKey: single,
  retentionDays: single,
  hrCases: list(),
  delegations: list(),
  compWorksheets: list(),
  internalApps: list(),
  elections: list(byWorker as (item: never) => string),
  contingent: list(),
  positions: list(),
  orgMoves: list(),
  assets: list(),
  accessRequests: list(),
  eligibility: list(byWorker as (item: never) => string),
  payrollRuns: list(),
  garnishments: list(),
  offCyclePays: list(),
  retroAdjustments: list(),
  extraPayStubs: list(),
  insightView: single,
  learnAssignments: list(),
  learnCertificates: list(),
};

export const SYNCED_KEYS = Object.keys(COLLECTIONS) as SyncedKey[];

/** Row id used for single-value collections. */
export const SINGLE_ID = "_";

export function rowKey(key: SyncedKey, item: unknown): string {
  const spec = COLLECTIONS[key];
  if (spec.kind !== "list") return SINGLE_ID;
  if (spec.key) return spec.key(item as never);
  return String((item as { id: string }).id);
}

/** Database payload for a single-value collection. */
export const wrapSingle = (value: unknown) => ({ value });
export const unwrapSingle = (data: unknown) => (data as { value: unknown }).value;
