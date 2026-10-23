# EPIC-23 — Server-side agent, API, and operations

> **Status (2026-10-20):** built and verified on local Supabase; hosted rollout pending. Per-ticket status and the list of what is not done: `tickets.md` (Phase 8 status notes). Design deviations: `docs/adr/0002-governed-records-persistence.md`.

**Goal:** The agent and public API respect the caller's permissions, files and live updates use Supabase Storage and Realtime, and the system can be deployed, reset, observed, and reviewed.  
**Gate:** Agent cannot return data the signed-in user could not open; demo API uses real hashed keys; security + performance review has no open High items; **launch gate (`docs/SUPABASE-PLAN.md` §9) met** — no real user before that.  
**Plan:** `docs/SUPABASE-PLAN.md` §4 (principle 3: the agent acts as the user).

## Part A (chunk)

### T23-01 — Agent tools under the user's session
- [ ] `AgentContext` and tools read/write through repositories and RPCs (RLS applies); no service key in agent paths
- [ ] Test: Employee asks about another worker's pay → no data; Manager asks about a direct report → allowed
**Done when:** the ≥10 existing tools still work for their intended roles.

### T23-02 — Authenticated `/api/agent`
- [ ] Route requires a verified session (`getClaims()`); per-user rate limit
- [ ] LLM call sends only the prompt and tool ids (as today) — documented; key stays server-side; off by default
**Done when:** unauthenticated call returns 401; flag-off still returns `mode: "rules"`.

### T23-03 — Agent audit on the server
- [ ] `agent_audit` insert via RPC forcing `user_id = auth.uid()`; read: own rows, HR Admin all
- [ ] Admin console reads from it
**Done when:** `/dashboard/admin` audit table shows server rows; a user cannot write rows for someone else.

### T23-04 — Real demo API keys
- [ ] `api_keys` (hash only, prefix shown, scopes, tenant, revoked_at); `api_key_usage` for rate limiting
- [ ] `/api/demo/*` validates through a `SECURITY DEFINER` RPC returning only listed columns; remove the "any `wb_live_` prefix" rule in `authorizeDemo`
- [ ] Create / revoke / rotate in API explorer (HR Admin)
**Done when:** a random `wb_live_x` token returns 401; a revoked key stops working.

## Part B (ticket-by-ticket)

### T23-05 — Storage
- [ ] Private bucket `vault`; paths `tenant/worker/…`; storage RLS mirrors `vault_documents`
- [ ] Signed URLs, size and type limits
**Done when:** a user downloads their own document and cannot fetch another worker's by path.

### T23-06 — Realtime
- [ ] Inbox and notifications subscribe via Realtime (policies apply); polling fallback
**Done when:** approving in one browser updates the other's inbox without reload.

### T23-07 — Demo tenant operations
- [ ] Idempotent demo seed; scheduled reset of the demo tenant via `pg_cron` if available on the plan (T19-02), else a scheduled CI job calling a reset RPC protected by a secret
- [ ] `WF_TODAY` becomes `tenant_settings.demo_today` (demo tenant only); write limits; expire `demo_sessions` rows
**Done when:** demo returns to seed state on schedule and real tenants use real dates.

### T23-08 — Observability and backups
- [ ] **Free has no backups:** nightly `pg_dump` from a scheduled CI job to storage outside Supabase, encrypted; retention policy recorded
- [ ] **Restore tested** into a scratch project at least once, with timings written down (launch gate)
- [ ] On Pro: confirm 7-day daily backups; decide on the PITR add-on (paid) based on data volume
- [ ] Error tracking hook; where to read Auth, API, and DB logs (Free retains 1 hour to 1 day, so rely on our own `audit_log`); rollback steps per migration
**Done when:** runbook lists where to look for an auth, RLS, or RPC failure, and a restore drill is recorded.

### T23-09 — Deploy pipeline and launch gate
- [ ] Hosting target recorded (**D14, open**)
- [ ] Schema changes only through migrations; staging → prod via CI with manual approval (`supabase db push`), never dashboard edits
- [ ] **Production project on Pro**; launch gate in `docs/SUPABASE-PLAN.md` §9 ticked item by item with evidence
**Done when:** a migration reaches staging via CI and is promoted to prod by approval; every §9 box is checked.

### T23-10 — Security and performance review
- [ ] Re-run EPIC-21 attack checklist; advisors clean
- [ ] `EXPLAIN` the ten heaviest queries (manager-hierarchy checks first); add indexes
- [ ] Lighthouse ≥ 90 retest on home, login, dashboard home (last measured in EPIC-05)
**Done when:** `docs/evidence/EPIC-23-review.md` has numbers and no open High.

### T23-11 — Docs
- [ ] README: setup, env, scripts; `docs/API.md` updated for real keys; ops runbook
**Done when:** a new developer reaches a working local app + DB from the README alone.

### T23-12 — QA gate and Phase 8 closeout
- [ ] Per-role smoke on staging; `build`, `scan:brand`, `db:test`, CI green
- [ ] `docs/evidence/EPIC-23-qa.md`; roadmap + EPIC-PARTS ticked
**Done when:** Phase 8 gate in `docs/ROADMAP.md` ✅.

### T23-13 — Privacy, retention, and data lifecycle
- [ ] Privacy policy, terms, cookie page rewritten for real data processing (today they describe `localStorage`); who is controller vs. processor for a tenant's employee data is decided with counsel
- [ ] `tenant_settings.retention_days` actually enforced by a scheduled purge; data export for a worker; deletion/anonymisation path that keeps payroll records the law requires
- [ ] Sub-processor list (Supabase, SMTP provider, hosting, optional LLM)
**Done when:** each page matches real behavior and the export + deletion paths work on staging. (Legal wording needs a lawyer; this ticket delivers the mechanisms and drafts.)
