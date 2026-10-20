# EPIC-03 — Employee Dashboard

**Goal:** Fake employee experience for demos (not a Workday tenant clone).  
**Gate:** Home + Time Off + Pay usable on mobile with mock data.

## Tickets

### T03-01 — Shell
- [x] Left nav + top bar + main content
**Done when:** all dashboard routes share shell.

### T03-02 — Home widgets
- [x] PTO balance · latest pay stub · upcoming events · quick actions
**Done when:** widgets render from mock data.

### T03-03 — Time Off
- [x] Balance · request form · history table
**Done when:** request appends to mock history.

### T03-04 — Pay
- [x] Stubs list + detail modal
**Done when:** open/close detail works.

### T03-05 — Benefits
- [x] Enrollments · beneficiaries · documents list
**Done when:** page shipped with mock rows.

### T03-06 — Performance
- [x] Goals · check-ins · reviews
**Done when:** page shipped.

### T03-07 — Learning
- [x] Assigned · in-progress · completed
**Done when:** page shipped.

### T03-08 — Profile
- [x] Personal info · emergency contacts · settings
**Done when:** edits persist in localStorage mock.

### T03-09 — Notifications
- [x] Notification center panel/page
**Done when:** mark-read works locally.

### T03-10 — Manager toggle
- [x] Team list · approvals queue · team analytics
**Done when:** toggle switches employee/manager chrome.

### T03-11 — Mock fixtures
- [x] Central `lib/mock/` data for all widgets
**Done when:** ROADMAP EPIC-03 gate met; no hardcoded duplicate datasets.

**Gate result:** `npm run build` OK. Routes under `/dashboard/*` share shell + mobile menu. Home/Time Off/Pay use `lib/mock` + `MockProvider`. EPIC-03 ROADMAP gate met.
