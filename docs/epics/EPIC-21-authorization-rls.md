# EPIC-21 — Authorization (Row Level Security)

> **Status (2026-10-20):** built and verified on local Supabase; hosted rollout pending. Per-ticket status and the list of what is not done: `tickets.md` (Phase 8 status notes). Design deviations: `docs/adr/0002-governed-records-persistence.md`.

**Goal:** Postgres enforces who can read and write what. App-side role checks become UX only.  
**Gate:** Every `public` table has RLS enabled and forced; pgTAP proves an Employee cannot read another worker's pay and tenant A cannot read tenant B; CI blocks a table without RLS.  
**Plan:** `docs/SUPABASE-PLAN.md` §4–§5.

## Part A (chunk)

### T21-01 — Helper functions
- [ ] In a non-exposed schema: `tenant_id()`, `role()`, `worker_id()`, `has_role(app_role[])`, `is_manager_of(worker)`
- [ ] `is_manager_of` walks `workers.manager_id` and includes active `delegations`
- [ ] `SECURITY DEFINER`, `set search_path = ''`, `revoke execute … from public`
**Done when:** unit tests cover direct report, skip-level, delegated, and unrelated worker.

### T21-02 — Policy conventions
- [ ] Default deny; `ENABLE` + `FORCE ROW LEVEL SECURITY`; `anon` has no table privileges
- [ ] One policy per command; auth calls wrapped as `(select auth.uid())`
- [ ] Index every policy column (`tenant_id`, `worker_id`, `manager_id`)
**Done when:** a template migration and a checklist exist in `supabase/README.md`.

### T21-03 — Policy matrix
- [ ] `docs/evidence/EPIC-21-policy-matrix.md`: one row per table × role × select/insert/update/delete, derived from `ROUTE_ROLES` and plan §5
- [ ] Owner reviews and signs off
**Done when:** every table planned in plan §6 has a row; no "TBD" left except items assigned to T21-04 / T22-10.

### T21-04 — Sensitive data classes
- [ ] Decide and record: HR-case visibility to managers; garnishment visibility; comp worksheet scope; succession visibility
- [ ] Bank accounts: last 4 only (D6)
**Done when:** each rule is in the matrix with the owner's decision (not assumed).

## Part B (ticket-by-ticket)

### T21-05 — Views and functions safety
- [ ] Views use `security_invoker = true`
- [ ] No `SECURITY DEFINER` function is callable without an inside check; grant lists reviewed
**Done when:** a SQL check lists exposed functions/views and each is justified.

### T21-06 — pgTAP suite (grows each wave)
- [ ] Positive and negative case per table per role
- [ ] Two seeded tenants for isolation tests
- [ ] Named cases: Employee ↛ other worker's stub; Manager ↛ peer's timesheet; Finance ↛ performance ratings; HR Admin ↛ other tenant
**Done when:** `npm run db:test` passes; each EPIC-22 wave adds its tests before merge.

### T21-07 — Audit log
- [ ] Append-only `audit_log` (actor, tenant, table, row id, action, old/new for pay, comp, garnishment, role changes)
- [ ] No update/delete grants; HR Admin read only
**Done when:** changing a role writes an entry that cannot be edited.

### T21-08 — CI gates
- [ ] Query fails CI if any `public` table has `rowsecurity = false`
- [ ] Supabase security advisor run with zero errors
**Done when:** adding a table without RLS makes CI fail.

### T21-09 — Attack checklist
- [ ] Manual run: IDOR via URL ids, forged/expired JWT, role-change staleness, cross-tenant ids, service key in bundle
- [ ] `docs/evidence/EPIC-21-attacks.md`
**Done when:** every item has a result and any finding has a ticket.

### T21-10 — QA gate
- [ ] pgTAP green; matrix signed; attack checklist clean
- [ ] `docs/evidence/EPIC-21-qa.md`
**Done when:** evidence file complete.
