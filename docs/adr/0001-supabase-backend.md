# ADR 0001 — Supabase as the backend

**Date:** 2026-10-20  
**Status:** Accepted, except D13 and D14 (open — see below). T19-01 closes when both are answered.  
**Plan:** `docs/SUPABASE-PLAN.md`

## Context

Work Beacon is a browser-only demo: fake login (any email + password `demo`), permissions enforced only in client code, all data in one `localStorage` blob. The owner wants the product **live for real users** with official auth, data, and permissions, and does not want a custom backend service.

## Decision

Use **Supabase** (Postgres, Auth, Row Level Security, Storage, Realtime) as the backend. Next.js remains the app host; `proxy.ts`, route handlers, and server actions are thin glue. Postgres RLS is the permission system.

## Accepted decisions (owner, 2026-10-20)

| # | Decision |
| --- | --- |
| D1 | "No backend" means no separate server or service. Next.js server code stays as thin Supabase glue. |
| D2 | **No mock mode in the product.** Everything is official and real. Browser-only data is migration scaffolding only and is deleted at T22-11. |
| D3 | One shared demo credential in a dedicated `demo` tenant (fake data only). |
| D4 | Multi-tenant from the first migration (`tenant_id` on every row). |
| D5 | `uuid` primary keys; URLs and QA docs that cite `w-*` ids are refreshed. |
| D6 | Money is `numeric(12,2)`; bank accounts store last 4 only. |
| D7 | `date` / `timestamptz`; the demo clock applies to the demo tenant only. |
| D8 | Roles `employee, manager, hr_admin, finance`; manager scope from `workers.manager_id` + delegations. |
| D11 | First pass uses client repositories under RLS; Server Component reads are a later optimisation. |
| D12 | Local dev with Supabase CLI + Docker. Docker 29.1.3 is installed; the CLI is not yet (pin it as a dev dependency in T19-03). |
| D15 | **Supabase Free plan** for development and staging only. Real users and real HR/payroll data require **Pro** first (launch gate, T23-09). |

## Open (blocks closing T19-01)

| # | Question | Default if no answer |
| --- | --- | --- |
| D13 | Who can sign up? Open self-serve (anyone creates a company) or invite-only (we create tenants; HR Admin invites employees; `/signup` becomes "request access")? | Invite-only |
| D14 | Hosting target (decides redirect URLs and the deploy pipeline). | None — T23-09 stays blocked |

## Consequences

- Free plan limits drive concrete work (custom SMTP, own backups, own audit trail, app-side idle logout, no leaked-password check) — listed in `SUPABASE-PLAN.md` §4 with the ticket that handles each.
- A production project on Pro is a hard prerequisite for any real user.
- Existing copy that says data "stays in this browser" and the cookie/privacy pages must change at cutover (T22-12, T23-13).
- Phase 8 work lands on an integration branch and merges to `main` only at the EPIC-22 gate, so `main` never ships a half-migrated app.
