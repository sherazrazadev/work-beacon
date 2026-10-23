# Work Beacon — Ticket Index

> **Source (observation only):** https://www.workday.com/ · https://www.workday.com/en-us/homepage.html  
> **Brand:** Work Beacon · Enterprise HR / Finance / IT platform with a conversational AI agent  
> **Folder:** `workdayforge/` (repo path only — product name is **Work Beacon**)  
> **Stack:** Next.js 16 + TypeScript + Tailwind + shadcn/ui  
> **Auth:** Public only — fake login UI, no real credentials, no captured auth flows  
> **Scope:** Full site — marketing + login + employee dashboard + AI agent panel  
> **Brand color:** `#FF6B35` (electric orange)  
> **Brand voice:** Confident + clean (Stripe / Vercel style)  
> **Typography:** Expressive non-default stack (no Inter / Roboto / Arial / system-only) — pick in EPIC-00  
> **Rule:** Own UI + copy. No Workday logos, assets, trademarks, or copied code.

**Work via epics:** see `docs/EPIC-PARTS.md` and `docs/epics/`. This file is the flat ticket map.

---

## EPIC-00 — Recon & Foundation → `docs/epics/EPIC-00-foundation.md`

| ID | Ticket |
| --- | --- |
| T00-01 | Capture both Workday URLs (structure, mega-nav, sections, fonts, colors, client libs) → `docs/evidence/` |
| T00-02 | Write `docs/TARGET.md` (scope, brand, routes, legal boundaries) |
| T00-03 | Work Beacon brand tokens: `#FF6B35`, voice, fonts, CSS variables |
| T00-04 | Scaffold Next.js 16 + Tailwind + shadcn/ui |
| T00-05 | App folders: `app/(marketing)`, `app/(auth)`, `app/(dashboard)`, `components/`, `lib/agent/`, `lib/mock/` |
| T00-06 | Legal stubs: Privacy, Terms, Accessibility, Cookie Preferences |
| T00-07 | Cookie consent banner (accept / manage preferences UI) |
| T00-08 | `README.md` run instructions + brand naming note |
| T00-09 | Foundation QA gate |

## EPIC-01 — Marketing Site → `docs/epics/EPIC-01-marketing.md`

| ID | Ticket |
| --- | --- |
| T01-01 | Global header + mega-nav: Agents · Platform · Products · Customers |
| T01-02 | Header utilities: More Sites, Sign In help, Request Demo, Contact Sales |
| T01-03 | Promo / announcement banner strip |
| T01-04 | Homepage hero: brand-level headline + sub + dual CTA |
| T01-05 | Hero “Ask us anything” prompt + suggestion chips |
| T01-06 | Logo / trust strip (“organizations trust Work Beacon”) |
| T01-07 | Platform value props (context · governance · works where you work) |
| T01-08 | Agents hub section (HR · Finance · IT & Developers · Everyone) |
| T01-09 | “Meet the agent” orchestrator block (Sana-equivalent — branded Work Beacon Agent) |
| T01-10 | Customer stories carousel (3 stories: quote + metric + logo placeholder) |
| T01-11 | Partner ecosystem teaser |
| T01-12 | Industry solutions teaser |
| T01-13 | Midsize packages teaser (Work Beacon GO) |
| T01-14 | Bottom CTA band (Contact Sales / Request Demo) |
| T01-15 | Global footer (Agents & Products · Industries · Resources · Learn · Company · Legal · locale) |
| T01-16 | Agents landing + category templates |
| T01-17 | Platform landing (builder · data · governance · ecosystem) |
| T01-18 | Products index + product detail template |
| T01-19 | Customers / case studies index + detail |
| T01-20 | Solutions by industry template |
| T01-21 | Resources hub (stories · demos · events · webinars · library) |
| T01-22 | Pricing page (3-tier enterprise) |
| T01-23 | About · Company · Careers |
| T01-24 | Search overlay (UI only, mock results) |
| T01-25 | Mobile nav + responsive marketing QA |

## EPIC-02 — Auth (Fake Login) → `docs/epics/EPIC-02-auth.md`

| ID | Ticket |
| --- | --- |
| T02-01 | `/login` (email + password + SSO buttons) |
| T02-02 | Sign-in help panel (“ask your HR/IT for company link” pattern — own copy) |
| T02-03 | Product login stubs list (UI only) |
| T02-04 | `/signup` / Request Demo form |
| T02-05 | `/forgot-password` |
| T02-06 | Mock auth context (localStorage session) |
| T02-07 | Protected wrapper for `/dashboard/*` |
| T02-08 | Logout |
| T02-09 | Demo account one-click enter |

## EPIC-03 — Employee Dashboard → `docs/epics/EPIC-03-dashboard.md`

| ID | Ticket |
| --- | --- |
| T03-01 | Dashboard shell (left nav + top bar + content) |
| T03-02 | Home widgets: PTO · pay stub · events · quick actions |
| T03-03 | Time Off: balance · request · history |
| T03-04 | Pay: stubs list + detail modal |
| T03-05 | Benefits: enrollments · beneficiaries · docs |
| T03-06 | Performance: goals · check-ins · reviews |
| T03-07 | Learning: assigned · in-progress · completed |
| T03-08 | Profile: personal · emergency · settings |
| T03-09 | Notifications center |
| T03-10 | Manager toggle: team · approvals · analytics |
| T03-11 | Mock data fixtures in `lib/mock/` |

## EPIC-04 — AI Agent → `docs/epics/EPIC-04-agent.md`

| ID | Ticket |
| --- | --- |
| T04-01 | Agent slide-over panel (chat UI) |
| T04-02 | Floating trigger on all dashboard pages |
| T04-03 | Chat thread (user/agent · typing indicator) |
| T04-04 | Quick prompts (PTO · pay stub · time off · events) |
| T04-05 | Rule-based mock backend (no LLM required) |
| T04-06 | Action: query PTO |
| T04-07 | Action: show latest pay stub |
| T04-08 | Action: start time-off request from chat |
| T04-09 | Action: upcoming events / deadlines |
| T04-10 | Context badge (“can see dashboard data”) |
| T04-11 | Marketing teaser: “Meet your Work Beacon Agent” |
| T04-12 | First-open onboarding |
| T04-13 | Cmd/Ctrl+K open agent |
| T04-14 | Conversation history (localStorage) |

## EPIC-05 — Polish & Ship → `docs/epics/EPIC-05-polish.md`

| ID | Ticket |
| --- | --- |
| T05-01 | Responsive pass |
| T05-02 | Accessibility (keyboard · ARIA · contrast) |
| T05-03 | SEO (meta · sitemap · robots · OG) |
| T05-04 | Performance (images · lazy · Lighthouse ≥ 90) |
| T05-05 | 404 + error pages |
| T05-06 | Loading / skeleton states |
| T05-07 | Empty states |
| T05-08 | Dark mode toggle (optional) |
| T05-09 | Analytics stub (Plausible / PostHog ready) |
| T05-10 | Final copy pass — Work Beacon voice only |
| T05-11 | Legal + cookie QA |
| T05-12 | Brand leak scan (no Workday / WorkForge strings in UI) |

---

## Phase 2 — Industry depth (planned)

See `docs/PHASE-2-INDUSTRY.md`. Original Work Beacon features inspired by public HCM/suite categories.

## EPIC-06 — Marketing depth → `docs/epics/EPIC-06-marketing-depth.md` ✅

| ID | Ticket | Status |
| --- | --- | --- |
| T06-01 | Agents deep content | ✅ |
| T06-02 | Platform narrative | ✅ |
| T06-03 | Product detail depth | ✅ |
| T06-04 | Customer stories media | ✅ |
| T06-05 | Industries playbooks | ✅ |
| T06-06 | Resources library (≥6) | ✅ |
| T06-07 | Pricing matrix | ✅ |
| T06-08 | Company credibility | ✅ |
| T06-09 | Community / Marketplace / Developers shells | ✅ |
| T06-10 | Marketing QA | ✅ |

## EPIC-07 — Tenant foundation → `docs/epics/EPIC-07-tenant-foundation.md` ✅

| ID | Ticket | Status |
| --- | --- | --- |
| T07-01 | Demo org seed | ✅ |
| T07-02 | Personas & RBAC | ✅ |
| T07-03 | Persona switcher | ✅ |
| T07-04 | SSO theater | ✅ |
| T07-05 | Worker directory | ✅ |
| T07-06 | Org chart | ✅ |
| T07-07 | Job & employment history | ✅ |
| T07-08 | Documents vault | ✅ |
| T07-09 | Task inbox | ✅ |
| T07-10 | Admin console shell | ✅ |
| T07-11 | Foundation QA | ✅ |

## EPIC-08 — Workforce ops → `docs/epics/EPIC-08-workforce-ops.md` ✅

| ID | Ticket | Status |
| --- | --- | --- |
| T08-01 | Leave policy engine | ✅ |
| T08-02 | Leave calendar | ✅ |
| T08-03 | Timesheets | ✅ |
| T08-04 | Time clock | ✅ |
| T08-05 | Scheduling / roster | ✅ |
| T08-06 | Overtime & exceptions | ✅ |
| T08-07 | Workforce agent tools | ✅ |
| T08-08 | QA gate | ✅ |

## EPIC-09 — Talent lifecycle → `docs/epics/EPIC-09-talent-lifecycle.md` ✅

| ID | Ticket | Status |
| --- | --- | --- |
| T09-01 | Recruiting board | ✅ |
| T09-02 | Job req form | ✅ |
| T09-03 | Interview / offer stubs | ✅ |
| T09-04 | Onboarding checklist | ✅ |
| T09-05 | Offboarding | ✅ |
| T09-06 | Performance cycles | ✅ |
| T09-07 | Skills & career | ✅ |
| T09-08 | Succession | ✅ |
| T09-09 | Talent agent tools | ✅ |
| T09-10 | QA gate | ✅ |

## EPIC-10 — Money → `docs/epics/EPIC-10-money.md` ✅

| ID | Ticket | Status |
| --- | --- | --- |
| T10-01 | Pay statement detail | ✅ |
| T10-02 | Direct deposit & tax forms UI | ✅ |
| T10-03 | Compensation / total rewards | ✅ |
| T10-04 | Expenses | ✅ |
| T10-05 | Procurement lite | ✅ |
| T10-06 | GL / journal lite | ✅ |
| T10-07 | FP&A planning board | ✅ |
| T10-08 | Close checklist | ✅ |
| T10-09 | Money agent tools | ✅ |
| T10-10 | QA gate | ✅ |

## EPIC-11 — Experience & Agent v2 → `docs/epics/EPIC-11-experience-agent.md`

| ID | Ticket | |
| --- | --- | --- |
| T11-01 | Beacon Pulse survey | ✅ |
| T11-02 | Manager pulse dashboard | ✅ |
| T11-03 | Action plans | ✅ |
| T11-04 | Wellness / benefits tips | ✅ |
| T11-05 | Agent tool registry | ✅ |
| T11-06 | Agent audit log | ✅ |
| T11-07 | Optional LLM adapter | ✅ |
| T11-08 | Proactive suggestions | ✅ |
| T11-09 | Guided tours | ✅ |
| T11-10 | QA gate | ✅ |

## EPIC-12 — Platform → `docs/epics/EPIC-12-platform.md`

| ID | Ticket | |
| --- | --- | --- |
| T12-01 | Workflow builder lite | ✅ |
| T12-02 | Business process events | ✅ |
| T12-03 | Report gallery | ✅ |
| T12-04 | Dashboards builder | ✅ |
| T12-05 | Integrations catalog | ✅ |
| T12-06 | Webhooks / API explorer | ✅ |
| T12-07 | Marketplace apps | ✅ |
| T12-08 | Developer portal | ✅ |
| T12-09 | Security & compliance center | ✅ |
| T12-10 | Platform QA + Phase 2 wrap | ✅ |

## EPIC-13 — People ops → `docs/epics/EPIC-13-people-ops.md`

| ID | Ticket | |
| --- | --- | --- |
| T13-01 | HR cases | ✅ |
| T13-02 | Delegations | ✅ |
| T13-03 | Compensation cycle | ✅ |
| T13-04 | Job architecture | ✅ |
| T13-05 | Internal mobility | ✅ |
| T13-06 | Open enrollment wizard | ✅ |
| T13-07 | Policy knowledge base | ✅ |
| T13-08 | Contingent workers | ✅ |
| T13-09 | Agent tools | ✅ |
| T13-10 | QA gate | ✅ |

## EPIC-14 — Org change, assets & identity → `docs/epics/EPIC-14-org-assets.md`

| ID | Ticket | |
| --- | --- | --- |
| T14-01 | Positions / FTE | ✅ |
| T14-02 | Transfer request | ✅ |
| T14-03 | Promotion proposal | ✅ |
| T14-04 | IT assets | ✅ |
| T14-05 | Checkout / return | ✅ |
| T14-06 | Access requests | ✅ |
| T14-07 | Work eligibility | ✅ |
| T14-08 | Offboarding recall | ✅ |
| T14-09 | Agent tools | ✅ |
| T14-10 | QA gate | ✅ |

## EPIC-15 — Payroll operations → `docs/epics/EPIC-15-payroll-ops.md`

| ID | Ticket | |
| --- | --- | --- |
| T15-01 | Pay groups | ✅ |
| T15-02 | Pay calendar | ✅ |
| T15-03 | Payroll run | ✅ |
| T15-04 | Off-cycle pay | ✅ |
| T15-05 | Garnishments | ✅ |
| T15-06 | Tax pack | ✅ |
| T15-07 | Stubs from run | ✅ |
| T15-08 | Retro | ✅ |
| T15-09 | Agent tools | ✅ |
| T15-10 | QA gate | ✅ |

## EPIC-16 — Enterprise UI/UX → `docs/epics/EPIC-16-enterprise-ux.md`

| ID | Ticket | |
| --- | --- | --- |
| T16-01 | Marketing visual system | ✅ |
| T16-02 | Dashboard density | ✅ |
| T16-03 | Data tables | ✅ |
| T16-04 | Forms & approvals | ✅ |
| T16-05 | Agent panel | ✅ |
| T16-06 | Auth / demo entry | ✅ |
| T16-07 | Visual QA + leak scan | ✅ |

## EPIC-17 — Beacon Insights → `docs/epics/EPIC-17-insights.md`

| ID | Ticket | |
| --- | --- | --- |
| T17-01 | People board | ✅ |
| T17-02 | Talent funnel | ✅ |
| T17-03 | Time ops | ✅ |
| T17-04 | Money vs plan | ✅ |
| T17-05 | Saved board | ✅ |
| T17-06 | Home pin | ✅ |
| T17-07 | Agent tools | ✅ |
| T17-08 | QA gate | ✅ |

## EPIC-18 — Learning operations → `docs/epics/EPIC-18-learning-ops.md`

| ID | Ticket | |
| --- | --- | --- |
| T18-01 | Catalog + assignments | ✅ |
| T18-02 | Start / complete | ✅ |
| T18-03 | Certificates | ✅ |
| T18-04 | Team learning | ✅ |
| T18-05 | Compliance inbox | ✅ |
| T18-06 | Home pin | ✅ |
| T18-07 | Agent tools | ✅ |
| T18-08 | QA gate | ✅ |

---

# Phase 8 — Supabase backend

Plan, decisions, and risks: `docs/SUPABASE-PLAN.md`. No custom backend service — Supabase (Postgres + Auth + RLS + Storage + Realtime) is the backend. Pending items are blank in the last column. ◐ = partly done (see the note under the table); ✅ only when verified.

## EPIC-19 — Supabase foundation → `docs/epics/EPIC-19-supabase-foundation.md`

| ID | Ticket | |
| --- | --- | --- |
| T19-01 | Confirm decisions (ADR) — D13 signup model + D14 hosting still open | ◐ |
| T19-02 | Projects and environments | ◐ |
| T19-03 | Repo scaffolding (`supabase/`, scripts) | ✅ |
| T19-04 | Typed clients (`@supabase/ssr`) | ◐ |
| T19-05 | Repository layer (migration seam; no mock mode ships) | ✅ |
| T19-06 | Schema conventions | ◐ |
| T19-07 | Typegen + drift check | ✅ |
| T19-08 | CI (lint, types, build, DB lint/tests) | ◐ |
| T19-09 | QA gate | ◐ |

## EPIC-20 — Auth and tenancy → `docs/epics/EPIC-20-auth-tenancy.md`

| ID | Ticket | |
| --- | --- | --- |
| T20-01 | Tenancy schema (tenants, profiles, memberships) | ◐ |
| T20-02 | Auth configuration | ◐ |
| T20-03 | `proxy.ts` session refresh | ✅ |
| T20-04 | Server-side route guard | ✅ |
| T20-05 | Login, signup, reset wired | ◐ |
| T20-06 | `AuthProvider` rewrite | ✅ |
| T20-07 | Invites (server-only service key) | |
| T20-08 | Demo tenant + persona switcher | ✅ |
| T20-09 | Privileged-role hardening (MFA) | |
| T20-10 | QA gate | ◐ |

## EPIC-21 — Authorization (RLS) → `docs/epics/EPIC-21-authorization-rls.md`

| ID | Ticket | |
| --- | --- | --- |
| T21-01 | Helper functions (tenant, role, manager-of) | ✅ |
| T21-02 | Policy conventions | ✅ |
| T21-03 | Policy matrix | ◐ |
| T21-04 | Sensitive data classes | ◐ |
| T21-05 | Views and functions safety | ✅ |
| T21-06 | pgTAP suite (grows each wave) | ✅ |
| T21-07 | Audit log | ◐ |
| T21-08 | CI gates (RLS on every table) | ✅ |
| T21-09 | Attack checklist | ◐ |
| T21-10 | QA gate | ◐ |

## EPIC-22 — Domain migration → `docs/epics/EPIC-22-domain-migration.md`

| ID | Ticket | |
| --- | --- | --- |
| T22-01 | Org core | ◐ |
| T22-02 | Inbox, notifications, approvals, documents, prefs | ◐ |
| T22-03 | Time and leave | ◐ |
| T22-04 | Talent | ◐ |
| T22-05 | Money | ◐ |
| T22-06 | Payroll | ◐ |
| T22-07 | People ops | ◐ |
| T22-08 | Org ops | ◐ |
| T22-09 | Platform | ◐ |
| T22-10 | Experience and learning | ◐ |
| T22-11 | Delete the local store (no mock mode ships) | ◐ |
| T22-12 | QA gate | ◐ |

## EPIC-23 — Server-side agent, API, ops → `docs/epics/EPIC-23-agent-api-ops.md`

| ID | Ticket | |
| --- | --- | --- |
| T23-01 | Agent tools under the user's session | ◐ |
| T23-02 | Authenticated `/api/agent` | ✅ |
| T23-03 | Agent audit on the server | ◐ |
| T23-04 | Real demo API keys | |
| T23-05 | Storage (vault) | |
| T23-06 | Realtime inbox | |
| T23-07 | Demo tenant operations | ✅ |
| T23-08 | Observability and backups | |
| T23-09 | Deploy pipeline + launch gate (Pro, backups tested) | |
| T23-10 | Security and performance review | |
| T23-11 | Docs | ◐ |
| T23-12 | QA gate + Phase 8 closeout | |
| T23-13 | Privacy, retention, data lifecycle | |

**Status notes (2026-10-20, local Supabase; nothing deployed to a hosted project yet)**

- ✅ means built and verified locally: `npm run test:unit` (5), `supabase test db` (22 pgTAP), `npm run test:integration` (4, real database), build, brand scan, and a browser sweep of every sidebar route for all five demo personas.
- ◐ T19-02 local only; hosted staging/production not created. ◐ T19-04 clients exist (browser, server, admin) but are not typed with the generated `Database` generics. ◐ T19-06 conventions applied in migrations; D5 uuid keys only for tenancy tables. ◐ T19-08 `.github/workflows/ci.yml` written but not yet run on GitHub; ESLint is not a CI step because 15 pre-existing `set-state-in-effect` errors remain. ◐ T19-09 / T20-10 / T21-10 / T22-12 wait for owner QA.
- ◐ T20-01 profile carries one tenant and role (no `memberships` table). ◐ T20-02 local config only (signup off, min password 10, TOTP enabled); hosted settings are in `docs/PUBLISH-CHECKLIST.md`. ◐ T20-05 sign-in and reset are wired; signup is invite-only and `/signup` stores a lead. Not built: T20-07 invites, T20-09 MFA enrolment UI.
- ◐ T21-03 matrix is collection-level with own/team/all scopes; per-state-transition rules are not enforced by the database. ◐ T21-04 bank data is last-4 only but money sits in jsonb. ◐ T21-07 every record write is audited; no viewer yet. ◐ T21-09 attack checklist partly covered by pgTAP.
- ◐ T22-01…T22-11 all collections persist through governed `records` (ADR 0002), not typed tables. Directory is still static. Kudos and Shift swap still use localStorage, so T22-11 is not finished.
- ◐ T23-01 the agent reads and writes only what the signed-in user's session allows; it is still client-side. ◐ T23-03 agent log is stored through the same permission-checked path, not written by a server. ✅ T23-02 `/api/agent` requires sign-in. ✅ T23-07 `npm run db:seed` and `/api/demo/reset`. Not built: T23-04 API keys, T23-05 Storage, T23-06 Realtime, T23-08 backups, T23-09 deploy, T23-10 review, T23-13 retention.

---

## Acceptance Criteria (every ticket)

- Renders on mobile + desktop  
- Work Beacon brand only — **no Workday assets, logos, or copied code**  
- Empty + loading states where data exists  
- Keyboard accessible  
- Copy matches “confident + clean”

## Definition of Done

### Phase 1
- EPIC-00 → EPIC-05 gates passed  
- Brand leak scan clean  

### Phase 2
- EPIC-06 → EPIC-12 gates passed (`docs/ROADMAP.md`)  
- Multi-persona demo + Hire-to-Retire + Money paths documented  
- Agent tools ≥10; LLM optional and off by default  

### Phase 3
- EPIC-13 gates passed (cases, enrollment, merit, internal jobs)  
- EPIC-14 gates passed (moves, assets, access, eligibility)  
- EPIC-15 gates passed (pay run, stubs, garnishments)  

### Phase 5–7
- EPIC-16 gate passed (enterprise UI/UX; responsive pass at 390 / 768 / 320 in `docs/evidence/EPIC-16-qa.md`)  
- EPIC-17 gate passed (role-default insights board, CSV, 3 insight tools)  
- EPIC-18 gate passed (employee completes a course and gets a certificate; manager assigns and sees overdue)  

### Phase 8
- EPIC-19 → EPIC-23 gates passed (`docs/ROADMAP.md`, `docs/SUPABASE-PLAN.md` §7)  
- Every `public` table has RLS enabled; pgTAP proves cross-worker and cross-tenant isolation  
- Editing browser storage grants no access; permissions are enforced by the database  
- No mock mode ships; local store deleted (T22-11)  
- Launch gate met (`docs/SUPABASE-PLAN.md` §9): Pro, tested restore, custom SMTP, privacy pages updated  
- Agent and public API cannot exceed the caller's permissions  
- CI green: lint, types, build, brand scan, DB lint, DB tests  
- No Supabase service key in the client bundle  
