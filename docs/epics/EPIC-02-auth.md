# EPIC-02 — Auth (Fake Login)

**Goal:** Demo-only auth that unlocks the employee dashboard.  
**Gate:** Demo one-click reaches `/dashboard`; no real credentials or Workday tenants.

## Tickets

### T02-01 — Login page
- [x] `/login` email + password + SSO button stubs
**Done when:** form validates locally; submit uses mock auth.

### T02-02 — Sign-in help
- [x] Help panel: company-specific link pattern (own copy, not Workday text)
**Done when:** help opens from Sign In UX.

### T02-03 — Product login stubs
- [x] List of product login placeholders (UI only)
**Done when:** visible from Sign In area.

### T02-04 — Request Demo / signup
- [x] `/signup` or `/request-demo` form
**Done when:** submit shows success state (no backend).

### T02-05 — Forgot password
- [x] `/forgot-password` flow UI
**Done when:** success state without email send.

### T02-06 — Mock auth context
- [x] localStorage session + provider
**Done when:** refresh keeps session.

### T02-07 — Protected routes
- [x] Guard `/dashboard/*`
**Done when:** unauthenticated users redirect to `/login`.

### T02-08 — Logout
- [x] Clears session → marketing or login
**Done when:** dashboard inaccessible after logout.

### T02-09 — Demo account
- [x] One-click “Enter demo” fills/skips into dashboard
**Done when:** ROADMAP EPIC-02 gate met.

**Gate result:** `npm run build` OK. Demo button → `/dashboard`. Unauthenticated `/dashboard` redirects to `/login?next=…`. Logout clears `work-beacon-auth-session`. EPIC-02 ROADMAP gate met.
