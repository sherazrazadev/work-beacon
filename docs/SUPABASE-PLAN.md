# Work Beacon — Supabase backend plan (Phase 8)

> **Implementation status (2026-10-20):** the plan below is implemented on local Supabase with a hybrid design (typed identity/authorization tables + governed `records`), recorded in `docs/adr/0002-governed-records-persistence.md`. Where code differs from this plan, the ADR and `tickets.md` status notes are authoritative. Publish-time values: `docs/PUBLISH-CHECKLIST.md`.

**Rule:** no custom backend service. Data, auth, and permissions live in Supabase (Postgres + Auth + RLS + Storage + Realtime). Next.js stays the app host; its server code (`proxy.ts`, route handlers, server actions) is thin glue only.  
**Goal:** a real product for real users — **no mock mode ships**.  
Decisions are recorded in `docs/adr/0001-supabase-backend.md`. Epics: **19** foundation · **20** auth + tenancy · **21** authorization (RLS) · **22** domain migration · **23** agent, API, ops/launch. Tickets: `../tickets.md`.

## 1. Where we are (verified in code, 2026-10-20)

| Area | Today | Problem |
| --- | --- | --- |
| Session | `localStorage` key `work-beacon-auth-session` (`src/lib/auth.ts`); any email + the password `demo` is accepted by `validateLogin` | Anyone can edit it and become `hr_admin` |
| Permissions | `ROUTE_ROLES` in `src/lib/rbac.ts`, enforced only by client wrappers (`require-auth.tsx`, `require-role.tsx`) | No server check; data is in the browser anyway |
| Data | One blob `MockStoreState` (55 keys) in `localStorage` key `work-beacon-mock-store`; `mock-provider.tsx` is ~2,000 lines of actions | Per-browser, no sharing between users, no real approvals |
| Agent | Tools run in the browser against that store (`src/lib/agent/tools.ts`); `/api/agent` only picks a tool id via an optional LLM | No user-scoped data access |
| Public API | `/api/demo/*`; `authorizeDemo` accepts the fixed key **or any token starting `wb_live_`** | Not a real key check |
| Other | No `proxy.ts`, no `.github/` CI, no `@supabase/*` dependency; Docker 29.1.3 installed, Supabase CLI not | — |
| Copy | Pages say demo data "stays in this browser"; privacy/cookie pages describe `localStorage` | Wrong once data is real (T22-12, T23-13) |

The biggest single risk today: **permissions are a client-side convention**. Phase 8 makes Postgres the authority.

## 2. Verified platform facts (Supabase docs, checked 2026-10-20)

- Next.js 16 renamed `middleware.ts` to `proxy.ts` (`export function proxy`). `@supabase/ssr` code inside is unchanged. On Next 15 or older `proxy.ts` is never called.
- The proxy refreshes the session with `supabase.auth.getClaims()`, copies refreshed cookies onto request **and** response, and applies the cache headers (`Cache-Control`, `Expires`, `Pragma`) so a CDN never caches a session.
- **Never trust `supabase.auth.getSession()` in server code.** Use `getClaims()`.
- Env names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Two clients: browser and server (`@supabase/ssr`).
- This app runs `cacheComponents: true` + `partialPrefetching: true`. Cookie-reading code must sit under `<Suspense>`; route files must not export `runtime`.
- `AGENTS.md` requires reading `node_modules/next/dist/docs/` before writing Next code (Next 16.4.1 differs from older versions) — do this at T19-04 and T20-03.
- Production checklist (Supabase "Going into prod"): RLS on all tables, SSL enforcement, account MFA + 2+ org owners, email confirmations, OTP expiry ≤ 1 h, **custom SMTP**, CAPTCHA on auth endpoints, Security + Performance Advisors, indexes, load test, backups. Each is mapped to a ticket below.

## 3. Decisions

Accepted by the owner on 2026-10-20 — see the ADR. Summary:

| # | Decision | Status |
| --- | --- | --- |
| D1 | No separate backend service; Next server code is thin glue | Accepted |
| D2 | **No mock mode ships.** Browser-only data is migration scaffolding, deleted at T22-11 | Accepted (changed) |
| D3 | **One shared demo credential** in a `demo` tenant, fake data only | Accepted (changed) |
| D4 | Multi-tenant from the first migration | Accepted |
| D5 | `uuid` PKs; URLs and QA docs citing `w-*` ids are refreshed | Accepted |
| D6 | `numeric(12,2)` money; bank accounts store last 4 only | Accepted |
| D7 | `date`/`timestamptz`; demo clock only for the demo tenant | Accepted |
| D8 | Roles `employee, manager, hr_admin, finance`; manager scope via `manager_id` + delegations | Accepted |
| D9 | Persona switching is demo-tenant only, **per browser session**, on the single demo login (see T20-08) | Accepted (changed to fit D3) |
| D10 | Email + password, reset, optional magic link. **No fake SSO buttons** in a live product; SAML is not on Free | Accepted |
| D11 | First pass: client repositories under RLS; Server Component reads later | Accepted |
| D12 | Local dev: Supabase CLI (pinned dev dependency) + Docker | Accepted |
| D13 | Signup model: open self-serve vs invite-only | **Open** (default invite-only) |
| D14 | Hosting target | **Open** (blocks T23-09) |
| D15 | **Free plan for dev/staging only; Pro before any real user** | Accepted |

## 4. Free plan: what it means for a live product

Verified on supabase.com/pricing and docs, 2026-10-20.

| Free-plan fact | Impact on a live product | Handling |
| --- | --- | --- |
| Projects pause after ~1 week of low activity | Users locked out until restored | **Launch blocker → Pro** (T23-09) |
| No automatic backups, none downloadable | HR/payroll data loss risk | Interim: nightly `pg_dump` to external storage from CI (T23-08); Pro = 7-day daily backups; PITR is a paid add-on |
| 500 MB DB, 1 GB storage, 50 MB max upload, 5 GB egress | Fine for dev/staging | Revisit at Pro (8 GB disk) |
| Built-in email: 2/hour, **only to project-team addresses** | Signup, reset, invites fail for real users | **Custom SMTP required** (T20-02); custom SMTP default 30 emails/hour (adjustable) |
| No leaked-password protection | Weak/breached passwords accepted | Own password policy (min length, classes) + launch gate on Pro (T20-02) |
| No single-session or session-timeout settings | Cannot force expiry server-side | App-side idle sign-out (T20-09); Pro setting at launch |
| Auth audit logs 1 hour; API/DB logs 1 day | Almost no forensics | Own `audit_log` (T21-07) + agent audit (T23-03); log drain is paid |
| No branching, no custom domain / vanity URL | No preview DBs | Migrations tested in local Docker + CI (T19-08) |
| No SAML SSO | Enterprise SSO unavailable | Not offered; remove fake SSO buttons (T20-05) |
| 2 active projects max | Dev/staging + one spare | Use one hosted project as staging now; create **prod on Pro** at launch |
| Included on Free: basic (TOTP) MFA, custom SMTP, Auth hooks (custom access token), Realtime (200 connections), Edge Functions (500k/mo), anonymous sign-ins | — | Used where planned |
| Not verified | `pg_cron` on Free, SSL enforcement / network restrictions on Free | Check Dashboard → Database → Extensions / Settings in T19-02; fallback for demo reset = scheduled CI job calling an RPC (T23-07) |

## 5. Architecture

```
Browser ── @supabase/ssr (cookies) ──► Supabase Auth ── JWT ─┐
   │                                                          ▼
   └── repositories (src/lib/data/*) ──────────────► PostgREST ► Postgres + RLS
Next proxy.ts: refresh session (getClaims), redirect unauthenticated /dashboard
Next route handlers: /api/agent (auth'd), /api/demo/* (key via RPC)
Edge Functions: only if a secret or privileged call cannot live in Postgres
```

Principles:
1. **RLS is the permission system.** App code may hide buttons; only policies grant access. Every table: RLS enabled + forced, `anon` has no table privileges, default deny.
2. **Multi-row business actions are Postgres functions (RPC)**: `decide_time_off`, `submit_timesheet`, `hire_candidate`, `post_journal`, `run_payroll`, `complete_learning`. Each checks the caller's role inside the function.
3. **The agent acts as the user.** Tools use the same repositories/RPCs, so RLS bounds what the agent sees. No service key in agent paths.
4. **Service role never reaches the browser or the bundle.** CI greps for it. Used only server-side, behind an HR-Admin check, for user invites (T20-07).
5. Views use `security_invoker = true`; helper functions live in a non-exposed schema, `SECURITY DEFINER`, `set search_path = ''`.
6. In policies wrap auth calls as `(select auth.uid())`; index every column a policy filters on (`tenant_id`, `worker_id`, `manager_id`).
7. Secrets only in env/secret stores, never in git or chat. Migrations are the only way schema changes (no dashboard edits).

## 6. Role → data classes (seed for the T21-03 policy matrix)

Derived from `ROUTE_ROLES`; the matrix ticket confirms every row.

| Class | Employee | Manager | HR Admin | Finance |
| --- | --- | --- | --- | --- |
| Own records (pay stubs, time off, timesheets, profile, learning) | read/write own | own | own | own |
| Direct reports (timesheets, leave, goals, learning assignments) | — | read + approve (via `manager_id` / delegation) | all | — |
| People admin (workflows, events, integrations, security, positions, job architecture, succession, admin) | — | — | read/write | — |
| Money admin (payroll, ledger, planning, close) | — | — | — | read/write |
| Shared pay setup (pay setup, pay adjustments, tax packs) | — | — | read/write | read/write |
| Reports | — | read | read | read |
| Sensitive: comp worksheets, garnishments, HR cases | own only | comp: reports; cases: TBD in T21-04 | read/write | garnishments: read |

Unknown rules (HR-case visibility to managers, pulse anonymity threshold) are assigned to T21-04 / T22-10 — not assumed.

## 7. Store key → table map (all 55 `MockStoreState` keys)

| Store key | Table(s) | Wave |
| --- | --- | --- |
| *(static in `lib/mock/org.ts`)* `WORKERS, DEPARTMENTS, LOCATIONS, COST_CENTERS, TENANT, PERSONAS` | `tenants, workers, departments, locations, cost_centers` | T22-01 |
| `profile` | `worker_profiles` | T22-01 |
| `notifications, approvals, inbox, documents` | `notifications, approvals, inbox_tasks, vault_documents` | T22-02 |
| `featureFlags, retentionDays, homePins` | `tenant_settings, user_prefs` | T22-02 |
| `managerMode` *(deprecated)* | dropped | T22-02 |
| `timeOff` *(+ `LEAVE_POLICIES`)* | `leave_policies, time_off_requests` | T22-03 |
| `timesheets, punches, shifts, exceptions` | `timesheets (+lines), punches, shifts, time_exceptions` | T22-03 |
| `jobs, candidates` | `job_reqs, candidates` | T22-04 |
| `onboarding, offboarding, skills, succession, goalRatings, feedback` | `onboarding_plans, offboarding_plans (+tasks), worker_skills, succession_boxes, goal_ratings, peer_feedback` | T22-04 |
| `banks, expenses, purchases, journals, closeTasks, planningScenario` | `bank_accounts, expenses, purchase_requests, journals (+lines), close_tasks, planning_scenarios` | T22-05 |
| `payrollRuns, garnishments, offCyclePays, retroAdjustments, extraPayStubs` *(+ seed stubs in `data.ts`)* | `pay_runs, pay_stubs (+lines), garnishments, off_cycle_pays, retro_adjustments` | T22-06 |
| `hrCases, delegations, compWorksheets, internalApps, elections, contingent` | `hr_cases, delegations, comp_worksheets, internal_applications, benefit_elections, contingent_workers` | T22-07 |
| `positions, orgMoves, assets, accessRequests, eligibility` | `positions, org_moves, it_assets, access_requests, eligibility` | T22-08 |
| `workflows, processEvents, connectedIntegrations, installedApps, demoApiKey` | `workflows (+steps), process_events, tenant_integrations, tenant_apps, api_keys (hashed)` | T22-09 |
| `pulseResponses, pulsePlans, learnAssignments, learnCertificates, insightView` *(+ `LEARN_COURSES`)* | `pulse_responses, pulse_action_plans, learn_courses, learn_assignments, learn_certificates, insight_views` | T22-10 |
| `agentAudit` | `agent_audit` | T23-03 |

Net-new (no store key): `profiles, memberships` (EPIC-20), `demo_sessions` (T20-08), `audit_log` (T21-07), `api_key_usage` (T23-04), `access_requests_leads` for signup/request-access per D13 (T20-05), Storage bucket `vault` (T23-05).

## 8. Order and gates

```
EPIC-19 foundation ──► EPIC-20 auth + tenancy ──► EPIC-21 RLS framework ──► EPIC-22 waves (A→F) ──► EPIC-23 agent/API/ops + LAUNCH GATE
                                                      ▲ each wave adds its own policies + pgTAP tests (T21-06 grows with it)
```

Branching: work lands on an integration branch and merges to `main` at the EPIC-22 gate, so `main` never ships a half-migrated app (ADR, consequences).

| Epic | Gate |
| --- | --- |
| 19 | `supabase start` + `db reset` green; CI runs; app unchanged |
| 20 | Unauthenticated `/dashboard` redirects server-side; **editing browser storage grants nothing**; real signup/reset emails arrive via custom SMTP |
| 21 | Every public table has RLS; pgTAP proves Employee cannot read another worker's pay and tenant A cannot read tenant B |
| 22 | All EPIC-07…18 QA paths pass on Supabase per role; **local store deleted**; no copy says data stays in the browser |
| 23 | Agent cannot exceed caller's permissions; real hashed API keys; no open High findings; **launch gate** (§9) met |

## 9. Launch gate (no real user before all are true)

- [ ] Production project on **Pro** (no pausing, 7-day daily backups); a **restore has been tested**
- [ ] Custom SMTP on a domain we control (SPF, DKIM, DMARC), link tracking off
- [ ] Leaked-password protection on; session timeout / single-session set; CAPTCHA on auth
- [ ] SSL enforcement on; Supabase account MFA; at least 2 org owners
- [ ] Security Advisor and Performance Advisor clean; EPIC-21 attack checklist clean
- [ ] Privacy policy, terms, and cookie page updated for real data; data export/deletion path exists (T23-13)
- [ ] Load test on staging; Lighthouse ≥ 90 on home, login, dashboard home
- [ ] Hosting target chosen (D14) and redirect URLs set per environment

## 10. Risks

| Risk | Mitigation |
| --- | --- |
| `mock-provider.tsx` (~2,000 lines) is one context for everything | Wave migration behind repository interfaces (T19-05); shrink it ticket by ticket |
| Half-migrated app between waves | Integration branch; `main` only at EPIC-22 gate |
| Policy mistakes leak data | Matrix review (T21-03), negative pgTAP tests, RLS-on CI check |
| RLS recursion / slow manager checks | Helper functions + indexes; measure in T23-10 |
| Shared demo login: visitors share data and could collide | Per-session persona (T20-08), nightly reset, write limits, no privileged actions (invites, API keys) in demo tenant |
| Pulse survey anonymity | Aggregate view with minimum group size; threshold confirmed in T22-10 |
| Free-plan pause / no backups reaching real users | Launch gate §9 |
| Email deliverability | Custom SMTP, DNS records, test inbox placement before launch |
| Real personal and payroll data | Privacy update, retention, deletion path (T23-13); least-privilege RLS; audit log |
| Cache Components + cookies | Cookie reads under Suspense; verified in T19-04 |

## 11. Env (names only — never commit or paste values)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server only; user invites; never NEXT_PUBLIC_. Confirm key name in dashboard.
SMTP_*                          # configured in the Supabase dashboard, not in the app
```
