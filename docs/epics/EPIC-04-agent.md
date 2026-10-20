# EPIC-04 — AI Agent

**Goal:** Conversational Work Beacon Agent (rule-based) on dashboard + marketing teaser.  
**Gate:** Actions T04-06–T04-09 work; Cmd/Ctrl+K opens panel.

## Tickets

### T04-01 — Panel UI
- [x] Right slide-over chat panel
**Done when:** open/close animated; focus trapped.

### T04-02 — Trigger
- [x] Floating button on every dashboard page
**Done when:** opens panel.

### T04-03 — Chat thread
- [x] User + agent bubbles · typing indicator
**Done when:** messages append in order.

### T04-04 — Quick prompts
- [x] PTO · pay stub · time off · events chips
**Done when:** chip sends prompt.

### T04-05 — Mock backend
- [x] Rule-based matcher in `lib/agent/` (no LLM required)
**Done when:** unknown prompts get a safe fallback reply.

### T04-06 — Action: PTO
- [x] Returns balance from mock data
**Done when:** reply includes numeric balance.

### T04-07 — Action: pay stub
- [x] Shows latest stub summary / opens pay detail
**Done when:** reply or deep-link works.

### T04-08 — Action: time off
- [x] Prefills Time Off request from chat
**Done when:** form opens with suggested dates/type when parseable.

### T04-09 — Action: events
- [x] Lists upcoming deadlines/events
**Done when:** reply lists ≥1 mock event.

### T04-10 — Context badge
- [x] “Can see your dashboard data” indicator
**Done when:** visible in panel header.

### T04-11 — Marketing teaser
- [x] Homepage/section “Meet your Work Beacon Agent”
**Done when:** CTA to product or demo login.

### T04-12 — Onboarding
- [x] First dashboard open intro
**Done when:** shown once (localStorage flag).

### T04-13 — Shortcut
- [x] Cmd+K / Ctrl+K toggles agent
**Done when:** works on dashboard routes.

### T04-14 — History
- [x] Persist conversation in localStorage
**Done when:** ROADMAP EPIC-04 gate met; history survives refresh.

**Gate result:** `npm run build` OK. Agent panel + FAB on dashboard; rule engine for PTO/pay/time-off/events; ⌘K toggle; history + onboarding flags. EPIC-04 ROADMAP gate met.
