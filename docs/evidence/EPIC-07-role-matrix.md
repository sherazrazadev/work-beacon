# EPIC-07 — Role matrix QA checklist

Tenant: **Northstar Labs**. Personas switch via header without re-login.

| Route | Employee | Manager | HR Admin | Finance |
| --- | --- | --- | --- | --- |
| `/dashboard` | ✓ | ✓ | ✓ | ✓ |
| `/dashboard/inbox` | ✓ | ✓ | ✓ | ✓ |
| `/dashboard/directory` | ✓ | ✓ | ✓ | ✓ |
| `/dashboard/org` | ✓ | ✓ | ✓ | ✓ |
| `/dashboard/people/[id]` | ✓ | ✓ | ✓ | ✓ |
| `/dashboard/documents` | ✓ | ✓ | ✓ | ✓ |
| `/dashboard/team` | ✗ redirect | ✓ | ✓ | ✗ redirect |
| `/dashboard/admin` | ✗ redirect | ✗ redirect | ✓ | ✗ redirect |
| ESS modules (pay, PTO, …) | ✓ | ✓ | ✓ | ✓ |

## Manual checks

- [x] Seed: departments, locations, cost centers, workers in `src/lib/mock/org.ts`
- [x] Persona switcher updates chrome role label + nav
- [x] Unauthorized route shows explanation + link home
- [x] SSO theater sets `ssoDemo: true` on session
- [x] Directory search works on mobile-width layout
- [x] Org chart expand/collapse + profile links
- [x] Worker profile shows job history timeline
- [x] Documents “Download stub” toast
- [x] Inbox mark complete persists (localStorage)
- [x] HR Admin can reset mock store
