# EPIC-12 — Platform QA

## Workflows

1. HR Admin → `/dashboard/workflows`. Leave is Manager → People.
2. Employee submits time off. Manager Calendar shows it. Approve → still Pending, waiting People.
3. HR Admin Calendar approve → Approved; Events log has `approved`.
4. Remove last leave step. Manager approve completes in one click.

## Reports

1. Manager/HR/Finance → `/dashboard/reports`.
2. Headcount bars, payroll table, expense age.
3. CSV buttons download files in the browser.

## Homes

1. Employee home: PTO / pay / upcoming / wellness.
2. Manager home: pending leave / expenses / team / upcoming.
3. **Pin widgets** persists per role.

## Integrations & apps

1. HR → `/dashboard/integrations` Connect Slack; reload still Connected.
2. `/dashboard/marketplace` Install Shift Swap + Kudos → nav items appear.

## API

1. `/dashboard/api-explorer` Fetch `/api/demo/workers` → 200.
2. `curl` without key → `{ "auth": "open", "data": [...] }`.

## Security

1. `/dashboard/security` — role matrix, retention 2555/365, 14 agent tools.

Brand scan + `npm run build` after this epic.
