# EPIC-12 — Platform, reporting & extensibility

**Goal:** “System of work” credibility: workflows, reports, integrations, marketplace — industry platform layer.  
**Gate:** Configurable approval workflow for leave; 3 standard reports export CSV; Integrations page lists connectors.

## Tickets

### T12-01 — Workflow builder lite
- [x] Visual steps for Leave / Expense approvals (edit JSON or simple UI)
**Done when:** changing steps changes runtime approvals.

### T12-02 — Business process events
- [x] Event log: hired, paid, approved, terminated
**Done when:** Admin searchable log.

### T12-03 — Report gallery
- [x] Headcount, attrition, payroll register, expense age — tables + CSV
**Done when:** 3+ reports.

### T12-04 — Dashboards builder
- [x] Pin widgets to role home (counts, charts via CSS/SVG)
**Done when:** Manager/HR homes differ.

### T12-05 — Integrations catalog
- [x] Slack, IdP, ATS, banks — connect/disconnect stubs
**Done when:** status persisted.

### T12-06 — Webhooks / API explorer
- [x] Documented mock REST endpoints under `/api/demo/*`
**Done when:** OpenAPI-ish markdown + 3 working GETs.

### T12-07 — Marketplace apps
- [x] Installable demo apps that add a nav item
**Done when:** 2 sample apps.

### T12-08 — Developer portal content
- [x] Auth for APIs (demo keys), rate limits copy, SDKs list
**Done when:** `/developers` complete.

### T12-09 — Security & compliance center
- [x] Roles matrix, retention settings, AI agent registry UI
**Done when:** Admin page.

### T12-10 — Platform QA + Phase 2 wrap
- [x] Full regression + brand leak scan + README Phase 2 status
**Done when:** ROADMAP Phase 2 complete.
