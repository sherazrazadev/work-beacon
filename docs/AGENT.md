# Work Beacon Agent

Rules engine in `src/lib/agent`. Tools execute in the browser against the mock store.

## Registry (`src/lib/agent/tools.ts`)

| id | Purpose |
| --- | --- |
| `explain_paycheck` | Line items on the latest stub |
| `submit_expense` | File a software expense (default $42) |
| `request_time_off` | Prefill Time Off |
| `submit_timesheet` | Submit the draft timesheet |
| `check_schedule` | Saturday shift |
| `check_onboarding` | Open first-week tasks |
| `suggest_course` | Learning path for a skill |
| `check_pto` | Remaining leave hours |
| `last_paycheck` | Latest net / period |
| `next_events` | Upcoming deadlines |
| `pulse_status` | Beacon Pulse submit state |
| `wellness_tips` | Tips from enrollments |
| `inbox_count` | Open inbox items |
| `help` | Capability list |

## LLM (optional, off by default)

Set `NEXT_PUBLIC_AGENT_LLM=1` and `OPENAI_API_KEY` in `.env.local`.  
`POST /api/agent` only picks a tool id. If the flag or key is missing, the client keeps the rules match. Audit log records `rules` vs `llm` on Admin.
