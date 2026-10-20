# Work Beacon Agent

Rules engine in `src/lib/agent`. Tools execute in the browser against the mock store.

## Registry (`src/lib/agent/tools.ts`)

| id                 | Purpose                               |
| ------------------ | ------------------------------------- |
| `explain_paycheck` | Line items on the latest stub         |
| `submit_expense`   | File a software expense (default $42) |
| `request_time_off` | Prefill Time Off                      |
| `submit_timesheet` | Submit the draft timesheet            |
| `check_schedule`   | Saturday shift                        |
| `check_onboarding` | Open first-week tasks                 |
| `suggest_course`   | Learning path for a skill             |
| `my_learning`        | Open assigned courses                 |
| `complete_learning`  | Complete the next open course         |
| `overdue_learning`   | Team overdue assignments              |
| `check_pto`        | Remaining leave hours                 |
| `last_paycheck`    | Latest net / period                   |
| `next_events`      | Upcoming deadlines                    |
| `pulse_status`     | Beacon Pulse submit state             |
| `file_hr_case`       | File a People Operations case         |
| `case_status`        | Open HR case count                    |
| `enrollment_status`  | Open enrollment window                |
| `internal_jobs`      | Open internal reqs                    |
| `my_assets`          | Assigned IT assets                    |
| `request_access`     | Open an access request                |
| `move_status`        | Submitted transfers / promotions      |
| `wellness_tips`      | Tips from enrollments                 |
| `inbox_count`        | Open inbox items                      |
| `next_pay_date`      | Next scheduled pay date               |
| `payroll_run_status` | Open payroll run                      |
| `garnish_status`     | Active garnishments                   |
| `people_headcount`   | Tenant headcount                      |
| `talent_pipeline`    | Candidates + open reqs                |
| `spend_variance`     | Actual vs plan spend                  |
| `help`               | Capability list                       |

## LLM (optional, off by default)

Set `NEXT_PUBLIC_AGENT_LLM=1` and `OPENAI_API_KEY` in `.env.local`.  
`POST /api/agent` only picks a tool id. If the flag or key is missing, the client keeps the rules match. Audit log records `rules` vs `llm` on Admin.
