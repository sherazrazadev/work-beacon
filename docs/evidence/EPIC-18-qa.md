# EPIC-18 — Learning operations QA

Demo today is `2026-10-20`. Reset mock store if assignments look stale.

## Employee

1. Sign in as **Employee**.
2. Home Learning widget (or Pin widgets → Learning) → `/dashboard/learning`.
3. **Security awareness 2026** is Assigned. **Start** → In progress 25%.
4. **Complete** → certificate issued; Inbox “Complete security awareness training” is done.
5. Agent: **What courses are assigned to me?** lists remaining open courses.

## Manager

1. Persona → **Manager**.
2. `/dashboard/learning/team` — Casey’s Security awareness is overdue (due 2026-10-15).
3. Assign Inclusive interviewing to Casey with a future due date. Row appears.
4. Employee cannot open `/dashboard/learning/team` (Access restricted).
5. Agent: **Who is overdue on training?** → overdue count.

## Build

- `npm run build`
- `npm run scan:brand`
