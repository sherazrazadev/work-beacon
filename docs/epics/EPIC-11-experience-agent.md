# EPIC-11 — Experience & Agent v2

**Goal:** Engagement (Peakon-class *category*) + stronger agentic assistant — original “Beacon Pulse” + Agent.  
**Gate:** Pulse survey completable; Agent has ≥10 tools + optional LLM behind env flag.

## Tickets

### T11-01 — Beacon Pulse survey
- [x] Confidential Likert survey + themes
**Done when:** employee completes; scores stored anonymized in mock.

### T11-02 — Manager pulse dashboard
- [x] Team heat themes + suggested actions
**Done when:** Manager persona only.

### T11-03 — Action plans
- [x] Create/assign follow-ups from pulse themes
**Done when:** appears in task inbox.

### T11-04 — Wellness / benefits tips (demo)
- [x] Personalized tips from enrollments
**Done when:** home widget.

### T11-05 — Agent tool registry
- [x] Formal tool list: PTO, pay, time, expenses, onboarding, schedule, pulse…
**Done when:** docs + typed registry in `lib/agent`.

### T11-06 — Agent audit log
- [x] Every tool call recorded (who/when/input/output summary)
**Done when:** Admin can view log.

### T11-07 — Optional LLM adapter
- [x] `NEXT_PUBLIC_AGENT_LLM=1` + server route; fallback to rules if off
**Done when:** documented; default remains rules-only.

### T11-08 — Proactive suggestions
- [x] Agent home chips: overdue timesheet, open enrollment, pending approval
**Done when:** context-aware chips.

### T11-09 — In-app help / guided tours
- [x] First-run tours for Employee vs Manager
**Done when:** dismissible, once.

### T11-10 — QA gate
- [x] Rules path + LLM-off path verified
**Done when:** gate met.
