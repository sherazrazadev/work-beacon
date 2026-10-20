# EPIC-08 — Workforce QA

Demo date: **2026-10-20**. Tenant: Northstar Labs.

| Path | Employee | Manager | HR Admin |
| --- | --- | --- | --- |
| `/dashboard/time-off` | Submit leave; policy balances | Same | Same |
| `/dashboard/calendar` | Personal month view | Team + pending approve | Team + pending approve |
| `/dashboard/timesheets` | Enter/submit week | + approve submitted | + approve submitted |
| `/dashboard/clock` | Clock in/out | Same | Same |
| `/dashboard/schedule` | Published “My shifts” | Roster + publish | Roster + publish |
| `/dashboard/exceptions` | Restricted | OT + missing punch resolve | Same |

## Gate checks

- [x] Employee submits leave; remaining hours drop by pending+approved
- [x] Employee submits current-week timesheet (draft → submitted)
- [x] Manager approves leave from calendar pending list
- [x] Manager approves submitted timesheets
- [x] Schedule week grid; employee sees published shifts
- [x] Agent: “Am I scheduled Saturday?” → Alex Sat 10:00–16:00
- [x] Agent: “Submit last week’s timesheet” → last week already Approved; submits current draft
