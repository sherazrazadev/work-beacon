# EPIC-07 — Demo tenant foundation

**Goal:** Multi-persona demo org with RBAC — industry ESS/MSS baseline ([TechTarget self-service](https://www.techtarget.com/enterprise-software/tip/20-must-have-HR-software-features-and-system-requirements), Hire-to-Retire core).  
**Gate:** Switch between Employee / Manager / HR Admin / Finance personas; org chart + worker record pages work offline.

**Status:** ✅ Complete

## Tickets

### T07-01 — Demo org seed
- [x] Company “Northstar Labs”: departments, locations, cost centers in `lib/mock`
**Done when:** single seed powers all Phase 2 modules.

### T07-02 — Personas & RBAC
- [x] Roles: Employee, Manager, HR Admin, Finance Analyst; route guards by role
**Done when:** unauthorized routes redirect with explanation.

### T07-03 — Persona switcher
- [x] Header control to switch demo user without re-login
**Done when:** dashboard chrome updates for role.

### T07-04 — SSO theater
- [x] Login: “Continue with Company IdP” mock flow (screens only)
**Done when:** lands in dashboard with session flag `ssoDemo: true`.

### T07-05 — Worker directory
- [x] Searchable people list + worker profile (job, manager, location)
**Done when:** directory usable on mobile.

### T07-06 — Org chart
- [x] Interactive tree from seed reporting lines
**Done when:** expand/collapse + link to worker profile.

### T07-07 — Job & employment history
- [x] Timeline of role changes / comp events (mock)
**Done when:** visible on worker profile.

### T07-08 — Documents vault
- [x] Offer letters, policies, tax docs — metadata only (no real PII files)
**Done when:** list + “download stub” success toast.

### T07-09 — Task inbox
- [x] Unified inbox: approvals, to-dos, onboarding steps
**Done when:** badge count on shell; mark complete persists.

### T07-10 — Admin console shell
- [x] `/dashboard/admin` tenants settings, feature flags, seed reset
**Done when:** HR Admin can reset mock store.

### T07-11 — Foundation QA
- [x] Role matrix test checklist in docs
**Done when:** gate met.

Evidence: `docs/evidence/EPIC-07-role-matrix.md`
