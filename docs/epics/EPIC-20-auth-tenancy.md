# EPIC-20 — Auth and tenancy

> **Status (2026-10-20):** built and verified on local Supabase; hosted rollout pending. Per-ticket status and the list of what is not done: `tickets.md` (Phase 8 status notes). Design deviations: `docs/adr/0002-governed-records-persistence.md`.

**Goal:** Real sign-in with Supabase Auth, tenant + role membership in the database, and server-side route protection — replacing the localStorage session and the "any email + `demo`" login.  
**Gate:** Unauthenticated `/dashboard/*` redirects on the server; editing localStorage no longer changes access; Employee, Manager, HR Admin, and Finance each sign in and see only their routes.  
**Plan:** `docs/SUPABASE-PLAN.md` §2–§4.

## Part A (chunk)

### T20-01 — Tenancy schema
- [ ] `tenants`, `profiles` (1:1 with `auth.users`), `memberships` (`user_id`, `tenant_id`, `role app_role`, `worker_id`)
- [ ] Trigger creates a `profiles` row on `auth.users` insert
- [ ] Seed tenant 1 = Northstar Labs (from `TENANT` in `lib/mock/org.ts`)
**Done when:** `db:reset` yields a tenant and role enum matching `DemoRole`.

### T20-02 — Auth configuration
- [ ] Email + password with **email confirmation on**; OTP expiry ≤ 3600 s; redirect URLs per environment
- [ ] **Custom SMTP** on a domain we control (SPF, DKIM, DMARC; **link tracking off**). Built-in Supabase email is 2/hour and only reaches team addresses, so nothing works for real users without this
- [ ] Email templates in Work Beacon voice (confirm, reset, invite); link points to a confirm page on our domain so email scanners don't burn the one-time link
- [ ] Password policy (min length, character classes). Leaked-password protection is **not on Free** → launch gate on Pro
- [ ] CAPTCHA on signup, sign-in, and reset; rate limits reviewed
**Done when:** a real, non-team email address receives and completes signup and reset on staging; settings recorded in `supabase/config.toml` (local) and a checklist (hosted).

### T20-03 — `proxy.ts` session refresh
- [ ] `src/proxy.ts` (`export function proxy`): refresh with `getClaims()`, copy cookies to request and response, apply cache headers
- [ ] Matcher skips static assets and public marketing
**Done when:** session survives a token expiry; logs show no `getSession()` use server-side.

### T20-04 — Server-side route guard
- [ ] `/dashboard/**`: unauthenticated → `/login?next=…` decided on the server
- [ ] Role check on the server using the same `ROUTE_ROLES` table, reading the caller's membership
- [ ] Client `RequireAuth` / `RequireRole` remain as UX only
**Done when:** `curl` to `/dashboard/admin` without cookies returns a redirect; as Employee returns the restricted state.

## Part B (ticket-by-ticket)

### T20-05 — Login, signup, reset
- [ ] `/login`, `/forgot-password` call Supabase; add `/auth/callback` and `/reset-password`
- [ ] `/signup` follows **D13** (default invite-only: becomes "request access", stored as a lead; accounts are created by invite)
- [ ] Remove the fake SSO buttons and the "product login stubs" (D10) — a live product must not show sign-in methods that don't work
- [ ] Real error and loading states; generic messages (no account enumeration)
**Done when:** an invited user accepts, signs in, and resets a password.

### T20-06 — `AuthProvider` rewrite (no browser-stored session)
- [ ] Replace localStorage with `onAuthStateChange`; keep the `useAuth()` shape (`session`, `ready`, `signIn`, `signOut`, `switchPersona`) so the 43 consumers need no change
- [ ] Delete `validateLogin` and the "any email + `demo`" path; the demo credential is a normal Supabase user in the `demo` tenant
**Done when:** `rg "work-beacon-auth-session" src` returns nothing outside `mock` mode.

### T20-07 — Invites
- [ ] HR Admin invites a user and links them to a `workers` row and role
- [ ] Uses the service key **server-side only**, behind an HR-Admin check
**Done when:** invited user lands in the right tenant with the right role; Employee cannot call the route.

### T20-08 — Demo tenant: one shared credential
- [ ] Seed a `demo` tenant (fake data only) with **one** demo user; credentials shown on the login page (D3)
- [ ] Persona switching is **per browser session**, not per user: table `demo_sessions(session_id, persona)`; the role/worker helper functions use it only when the tenant is `demo` and the JWT carries a matching `session_id` claim. Spike first: confirm Supabase access tokens carry `session_id`; fallback = one demo user per persona
- [ ] Switcher exists only in the demo tenant; real tenants never see it, and the demo user cannot invite users, create API keys, or change tenant settings
**Done when:** two browsers signed in as the same demo user can view different personas at once; a non-demo user cannot call the switch function.

### T20-09 — Privileged-role hardening
- [ ] TOTP MFA (included on Free) required (AAL2) for `hr_admin` and `finance` in real tenants; demo tenant exempt
- [ ] App-side idle sign-out (server session timeout is not on Free; set it on Pro at launch)
- [ ] Sign out everywhere; cookie flags reviewed
**Done when:** a real-tenant HR Admin without MFA is blocked from `/dashboard/admin`.

### T20-10 — QA gate
- [ ] Forged localStorage test; direct-URL test per role; expired-session test
- [ ] `docs/evidence/EPIC-20-qa.md`
**Done when:** each check recorded with result.
