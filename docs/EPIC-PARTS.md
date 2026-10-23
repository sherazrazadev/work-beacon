# Epic work in two parts

**Brand:** Work Beacon  

Rule: finish **Part A** as a chunk, then **Part B one ticket at a time**, then next epic.

## Phase 1 (done)

| Epic | Part A | Part B |
| --- | --- | --- |
| EPIC-00–05 | — | ✅ Complete |

## Phase 2

| Epic | Part A (chunk) | Part B (ticket-by-ticket) |
| --- | --- | --- |
| **EPIC-06** Marketing depth | ✅ T06-01 → T06-03 | ✅ T06-04…T06-10 |
| **EPIC-07** Tenant foundation | ✅ T07-01 → T07-04 | ✅ T07-05…T07-11 |
| **EPIC-08** Workforce ops | ✅ T08-01 → T08-03 | ✅ T08-04…T08-08 |
| **EPIC-09** Talent lifecycle | ✅ T09-01 → T09-04 | ✅ T09-05…T09-10 |
| **EPIC-10** Money | ✅ T10-01 → T10-04 | ✅ T10-05…T10-10 |
| **EPIC-11** Experience & Agent | ✅ T11-01 → T11-05 — pulse + tool registry | ✅ T11-06…T11-10 audit, LLM, tours → QA |
| **EPIC-12** Platform | ✅ T12-01 → T12-04 — workflows, events, reports, dashboards | ✅ T12-05…T12-10 integrations → wrap |

## Phase 3

| Epic | Part A (chunk) | Part B (ticket-by-ticket) |
| --- | --- | --- |
| **EPIC-13** People ops | ✅ T13-01 → T13-05 — cases, delegations, comp, jobs, mobility | ✅ T13-06…T13-10 enrollment → QA |
| **EPIC-14** Org / assets | ✅ T14-01 → T14-05 — positions, moves, assets | ✅ T14-06…T14-10 access → QA |

## Phase 4

| Epic | Part A (chunk) | Part B (ticket-by-ticket) |
| --- | --- | --- |
| **EPIC-15** Payroll ops | ✅ T15-01 → T15-05 — groups, calendar, run, off-cycle, garnish | ✅ T15-06…T15-10 tax pack, stubs, retro, agent → QA |

| **EPIC-16** Enterprise UI/UX | ✅ T16-01 → T16-04 marketing, density, tables, forms | ✅ T16-05…T16-07 agent, login, QA |
| **EPIC-17** Insights | ✅ T17-01 → T17-04 boards | ✅ T17-05…T17-08 saved view, pin, agent → QA |

## Phase 7

| Epic | Part A (chunk) | Part B (ticket-by-ticket) |
| --- | --- | --- |
| **EPIC-18** Learning ops | ✅ T18-01 → T18-04 catalog, complete, certs, team | ✅ T18-05…T18-08 inbox, pin, agent → QA |

## Phase 8 — Supabase backend (`SUPABASE-PLAN.md`)

| Epic | Part A (chunk) | Part B (ticket-by-ticket) |
| --- | --- | --- |
| **EPIC-19** Foundation | ◐ T19-01 → T19-04 decisions (ADR done; D13/D14 open), projects, scaffolding, clients | ⬜ T19-05…T19-09 repository seam, conventions, types, CI → QA |
| **EPIC-20** Auth + tenancy | ⬜ T20-01 → T20-04 schema, auth config, `proxy.ts`, route guard | ⬜ T20-05…T20-10 login, provider, invites, demo tenant, MFA → QA |
| **EPIC-21** Authorization (RLS) | ⬜ T21-01 → T21-04 helpers, conventions, matrix, sensitive classes | ⬜ T21-05…T21-10 views, pgTAP, audit, CI, attacks → QA |
| **EPIC-22** Domain migration | ⬜ T22-01 → T22-04 org, inbox/prefs, time/leave, talent | ⬜ T22-05…T22-12 money, payroll, people ops, org ops, platform, experience, retire store → QA |
| **EPIC-23** Agent, API, ops | ⬜ T23-01 → T23-04 agent session, authed route, audit, API keys | ⬜ T23-05…T23-13 storage, realtime, demo ops, backups, deploy + launch gate, review, docs, privacy → QA |

Order: 19 → 20 → 21 → 22 (waves A→F; each adds its own policies and tests) → 23.

**Done:** Phase 1 + Phase 2 + EPIC-13 + EPIC-14 + EPIC-15 + EPIC-16 + EPIC-17 + EPIC-18. **Phase 8:** running on local Supabase (see `tickets.md` status notes); hosted rollout and launch gate pending (`docs/PUBLISH-CHECKLIST.md`).
