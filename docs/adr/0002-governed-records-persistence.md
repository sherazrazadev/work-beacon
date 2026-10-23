# ADR 0002 — Governed records for persistence (hybrid), per-persona demo users

Status: accepted (implementation landed on local Supabase; hosted rollout pending, see `docs/PUBLISH-CHECKLIST.md`)
Date: 2026-10-20
Builds on: ADR 0001

## Context

The app held 54 state collections in one in-browser store (`MockProvider`, ~2,000 lines, 43 files use `useAuth()`). ADR 0001 requires a real backend with no mock mode shipping. Rewriting every collection into typed tables and every action into an RPC in one pass would touch most of the app and could not be verified safely in one change.

## Decision

1. **Typed tables for identity, tenancy, authorization and audit**: `tenants`, `profiles`, `workers` (directory skeleton for manager scope), `collection_access` (permission matrix), `audit_log`, `leads`.
2. **One governed table for domain data**: `records(tenant_id, collection, id, data jsonb, owner_worker, ord, updated_by, updated_at)`. Every former state key is a `collection`. The browser never talks to it directly: `src/lib/data/records-repo.ts` loads and diff-saves.
3. **Authorization lives in Postgres**: RLS on every table (enabled and forced, no `anon` privileges). Per collection and role, `collection_access` sets read and write scope: `none | own | team | all`. `own` and `team` also include unowned (company-wide) rows. `team` = the caller plus direct reports (`workers.manager_id`). `insert_any` collections (inbox, approvals, notifications, event and agent logs) accept inserts from any signed-in role; updates and deletes still follow the write scope.
4. **Server stamps ownership**: a trigger sets `owner_worker` from the collection's owner field (or the writer) and `updated_by`; clients cannot forge them. `tenant_id` defaults from the caller's profile and is checked by policy.
5. **Roles ride in the token** via a Custom Access Token hook (`tenant_id`, `app_role`, `worker_id`) so `src/proxy.ts` can enforce `ROUTE_ROLES` before rendering. RLS still resolves role from `profiles`, not from client-supplied claims.
6. **Demo**: one shared credential (D3). Persona switching signs in as that persona's own demo user (same password), so RLS applies as that role. Per-persona users were chosen over a JWT `session_id` approach because they need no custom claims logic and make each persona's permissions real. Demo users live only in the demo tenant; `/api/demo/reset` (demo-tenant users only) re-seeds it.
7. **Self-signup is off** (D13 default: invite-only). `/signup` and `/request-demo` store a lead through a server route.

## Consequences

Good:

- The whole app persists and is permission-checked server-side now, with a small, testable seam.
- pgTAP (22 tests) and an integration suite prove cross-role and cross-tenant isolation against a real database.
- Typed tables can be extracted one collection at a time later without changing the UI contract.

Deviations from the plan, stated plainly:

- **D5 (uuid PKs) is partly deferred**: tenancy tables use uuid; `records.id` and `workers.id` are text keys carried over from the app's ids.
- **Directory is still static in the UI** (`src/lib/mock/org.ts`); only the manager-scope skeleton is in the database.
- **Business rules still run in the client** (for example approvals and pay-run calculation). The database enforces *who may read/write which rows*, not *whether a state transition is valid*. Multi-row actions are not yet atomic RPCs. This must be closed before treating the data as authoritative for real payroll.
- **Money is inside jsonb** (`numeric(12,2)` from D6 not applied). Bank accounts were already last-4 only.
- **Some visibility gaps**: peer feedback is readable by its author (and HR), not by the recipient; manager scope ignores delegations; pulse responses are team-scoped for managers instead of aggregated.
- **Optimistic client with last-write-wins**: no conflict detection between two tabs/users editing the same row. A rejected save shows a banner and reloads server state.
- **The shared demo password can be changed by any demo session** (Supabase has no per-tenant block on `updateUser`). Reset/seed restores it; schedule a periodic reset on hosted projects.
- **Kudos and Shift swap** (marketplace apps) still use localStorage.
- No invites, MFA enrolment UI, Storage, Realtime, API-key hashing, or backups yet (T20-07, T20-09, T23-04…T23-08).

## Revisit when

A collection needs reporting/joins (extract to a typed table), concurrent editing matters (add `version` column and compare-and-set), or payroll goes live (move calculation and transitions to RPCs).
