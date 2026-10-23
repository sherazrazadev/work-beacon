# EPIC-19 — Supabase foundation

> **Status (2026-10-20):** built and verified on local Supabase; hosted rollout pending. Per-ticket status and the list of what is not done: `tickets.md` (Phase 8 status notes). Design deviations: `docs/adr/0002-governed-records-persistence.md`.

**Goal:** Stand up Supabase (local + hosted staging), the repo scaffolding, typed clients, CI, and the repository seam the migration waves use — with **no visible behavior change** until EPIC-20.  
**Gate:** `supabase start` + `db reset` green; CI runs lint, types, build, DB lint, and tests; app unchanged.  
**Plan:** `docs/SUPABASE-PLAN.md` · **ADR:** `docs/adr/0001-supabase-backend.md` (no mock mode ships; Free plan for dev/staging only).

## Part A (chunk)

### T19-01 — Confirm decisions (ADR)
- [x] ADR written; D1–D12 and D15 accepted by the owner (2026-10-20), D2/D3/D9/D10 changed
- [x] Plan tier recorded: **Free for dev/staging; Pro before any real user** (limits mapped in plan §4)
- [ ] D13 (signup model) and D14 (hosting target) answered
**Done when:** D13 and D14 recorded in the ADR.

### T19-02 — Projects and environments
- [ ] One hosted Supabase project as **staging** on Free (2 active max; keep one slot spare); region chosen and recorded. **Production is created on Pro at launch, not before.**
- [ ] Check in the dashboard and record: `pg_cron` available? SSL enforcement / network restrictions available on this plan?
- [ ] Supabase account MFA on; add a second org owner
- [ ] `.env.example` has the names in plan §11; keys go in `.env.local` only — never in git or chat
**Done when:** a teammate can create `.env.local` from `.env.example` and reach local and staging Supabase.

### T19-03 — Repo scaffolding
- [ ] Add the Supabase CLI as a **pinned dev dependency** (run via `npx supabase`; not installed globally today)
- [ ] `supabase/` with `config.toml`, `migrations/`, `seed.sql`, `tests/`; `supabase link` to staging
- [ ] npm scripts: `db:start`, `db:stop`, `db:reset`, `db:types`, `db:test`, `db:lint`
- [ ] README: Docker prerequisite (installed: 29.1.3), first-run steps
**Done when:** `npm run db:reset` creates an empty schema from migrations.

### T19-04 — Typed clients
- [ ] Read `node_modules/next/dist/docs/` for `proxy`, cookies, and Cache Components first (per `AGENTS.md`)
- [ ] Add `@supabase/supabase-js` and `@supabase/ssr`
- [ ] `src/lib/supabase/client.ts` (browser) and `server.ts` (server, cookie adapter with `setAll` try/catch)
- [ ] Cookie-reading code sits under `<Suspense>` (Cache Components); no `runtime` exports
**Done when:** a throwaway server component reads the user without a build error and without `getSession()`.

## Part B (ticket-by-ticket)

### T19-05 — Repository layer (migration seam)
- [ ] `src/lib/data/` repository interfaces per domain; a thin adapter over today's `useMock()` actions lets unmigrated domains keep working **during** the migration
- [ ] No runtime flag and no user-facing mock mode: the adapter is deleted at T22-11
**Done when:** one domain (Learning) is read through a repository with identical UI.

### T19-06 — Schema conventions
- [ ] Rules written in `supabase/README.md`: `tenant_id` on every row, `uuid` PKs, `created_at`/`updated_at` trigger, `numeric(12,2)` money, `timestamptz`, snake_case, enums for roles/statuses
- [ ] Migration naming and rollback notes
**Done when:** conventions doc reviewed; first migration (`0001_extensions_enums`) applies cleanly.

### T19-07 — Typegen
- [ ] `npm run db:types` writes `src/lib/supabase/database.types.ts`
- [ ] CI fails if generated types differ from committed
**Done when:** types file committed; drift check passes.

### T19-08 — CI
- [ ] `.github/workflows/ci.yml`: `npm ci`, `lint`, `tsc --noEmit`, `build`, `scan:brand`
- [ ] DB job: `supabase start`, `db lint`, `supabase test db`
- [ ] Fails if `SUPABASE_SERVICE_ROLE_KEY` or `service_role` appears in client bundle output
**Done when:** CI green on a PR. (Known: `eslint` currently reports 16 `set-state-in-effect` errors — decide fix vs. rule scope here so CI can be green.)

### T19-09 — QA gate
- [ ] Fresh clone → `npm ci` → `db:reset` → `dev` works; regression pass (home, pay, learning at desktop + 390)
- [ ] `docs/evidence/EPIC-19-qa.md`
**Done when:** evidence file lists commands run and results.
