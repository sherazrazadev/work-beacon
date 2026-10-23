# EPIC-22 — Domain migration (store → Supabase)

> **Status (2026-10-20):** built and verified on local Supabase; hosted rollout pending. Per-ticket status and the list of what is not done: `tickets.md` (Phase 8 status notes). Design deviations: `docs/adr/0002-governed-records-persistence.md`.

**Goal:** Move all 55 `MockStoreState` keys to Postgres, one domain wave at a time, then retire the localStorage store.  
**Gate:** Every EPIC-07…18 QA path passes on Supabase for each role; the local store is deleted (no mock mode ships); no page claims data stays in the browser. Merges from the integration branch to `main`.  
**Plan:** `docs/SUPABASE-PLAN.md` §6 (key → table map).

**Every wave ticket includes the same five items:**
1. Migration: tables, constraints, indexes
2. RLS policies + pgTAP tests (EPIC-21 template)
3. RPCs for multi-row actions (role checked inside)
4. Repository supabase adapter + seed from the matching `lib/mock/*.ts`
5. Remove that key from `MockProvider`; page QA at desktop + 390 as the right personas

## Part A (chunk)

### T22-01 — Org core
- [ ] `workers` (with `manager_id`), `departments`, `locations`, `cost_centers`, `worker_profiles`, `job_events`
- [ ] Directory, org chart, people page, profile read/write
**Done when:** `/dashboard/directory`, `/org`, `/people/<id>`, `/profile` served from Supabase.

### T22-02 — Inbox, notifications, approvals, documents, prefs
- [ ] `inbox_tasks`, `notifications`, `approvals`, `vault_documents`, `tenant_settings`, `user_prefs` (home pins)
- [ ] Drop deprecated `managerMode`
**Done when:** inbox + notifications + home pins persist per user across browsers.

### T22-03 — Time and leave
- [ ] `leave_policies`, `time_off_requests`, `timesheets` (+lines), `punches`, `shifts`, `time_exceptions`
- [ ] RPCs: `request_time_off`, `decide_time_off`, `submit_timesheet`, `approve_timesheet`
**Done when:** manager approves a report's leave; employee sees the result on another device.

### T22-04 — Talent
- [ ] `job_reqs`, `candidates`, `onboarding_plans`, `offboarding_plans` (+tasks), `worker_skills`, `succession_boxes`, `goal_ratings`, `peer_feedback`
- [ ] RPC `hire_candidate` (candidate → worker + onboarding + inbox, atomic)
**Done when:** hire → onboard happy path (EPIC-09 gate) passes.

## Part B (ticket-by-ticket)

### T22-05 — Money
- [ ] `bank_accounts` (last 4 only), `expenses`, `purchase_requests`, `journals` (+lines), `close_tasks`, `planning_scenarios`
- [ ] Constraint/trigger: a journal's debits equal its credits; RPCs `approve_expense`, `post_journal`
**Done when:** EPIC-10 money paths pass; an unbalanced journal is rejected by the database.

### T22-06 — Payroll
- [ ] `pay_runs`, `pay_stubs` (+lines), `garnishments`, `off_cycle_pays`, `retro_adjustments`
- [ ] RPC `run_payroll`: one transaction, idempotent per run, Finance only; stubs readable by their worker only
**Done when:** Finance completes a run and the employee sees the new stub (EPIC-15 gate); re-running does not duplicate.

### T22-07 — People ops
- [ ] `hr_cases`, `delegations`, `comp_worksheets`, `internal_applications`, `benefit_elections`, `contingent_workers`
**Done when:** EPIC-13 gates pass (case, enrollment, merit, delegate).

### T22-08 — Org ops
- [ ] `positions`, `org_moves`, `it_assets`, `access_requests`, `eligibility`
**Done when:** EPIC-14 gates pass (transfer, assets, access, eligibility).

### T22-09 — Platform
- [ ] `workflows` (+steps), `process_events` (written by triggers), `tenant_integrations`, `tenant_apps`, `api_keys` (hashed; wired in T23-04)
- [ ] Reports as `security_invoker` views
**Done when:** EPIC-12 gate passes (workflow + 3 reports + connectors).

### T22-10 — Experience and learning
- [ ] `pulse_responses`, `pulse_action_plans`, `learn_courses`, `learn_assignments`, `learn_certificates`, `insight_views`
- [ ] Manager/HR see pulse only through an aggregate view with a minimum group size — **owner to confirm the threshold**
- [ ] RPC `complete_learning` (certificate + inbox row closed, atomic)
**Done when:** EPIC-11, 17, 18 gates pass.

### T22-11 — Delete the local store (D2: no mock mode ships)
- [ ] Delete `MockProvider` persistence, the repository mock adapter, `lib/mock/store.ts`, and `lib/mock/*` seed data used at runtime (seed content moves to `supabase/seed.sql`)
- [ ] Remove the `work-beacon-mock-store` and `work-beacon-auth-session` keys; one-time cleanup of leftover keys in returning browsers
**Done when:** `rg "work-beacon-mock-store|work-beacon-auth-session" src` finds only the cleanup code.

### T22-12 — QA gate
- [ ] Re-run EPIC-07…18 evidence paths per persona; refresh docs that cite `w-*` ids
- [ ] Copy sweep: remove every "demo data stays in this browser" / localStorage claim (e.g. Pay subtitle, privacy and cookie pages feed T23-13)
- [ ] Responsive recheck (390 / 768) on migrated pages; `build`, `scan:brand`, `db:test`
- [ ] `docs/evidence/EPIC-22-qa.md`
**Done when:** evidence lists each epic's path and result.
