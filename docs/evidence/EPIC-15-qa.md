# EPIC-15 — Payroll operations QA

Verified 2026-10-20 on `http://localhost:3012`. Build + `scan:brand` CLEAN.

## Finance

1. Persona → **Finance Analyst**.
2. `/dashboard/pay-setup` — Semi-monthly (8 workers) + Biweekly (Casey, Sam). Oct 31 **Paid** after complete; biweekly Oct 23 still Open.
3. `/dashboard/payroll` — `run-sm-1031` **Complete**. Alex retro $250 net **$4,630.37**. Riley garnish $220 net **$3,802.16**. Net total **$39,145.22**. Inbox 4.
4. `/dashboard/tax-packs` — Semi-monthly Oct 16–31 pack with **Download pack**.
5. `/dashboard/pay-adjustments` — Draft off-cycle $400 Spot bonus for Alex → Pay → status **Paid**.

## Employee

1. Persona → **Employee** (Alex Rivera).
2. `/dashboard/pay` — only Alex stubs: Off-cycle 2026-10-20 **$312.00**; Oct 16–31 **$4,630.37**; plus three seed periods. Other workers’ run stubs hidden (`PayStub.workerId`).
3. Agent: **When is my next payday?** → **Next pay date is 2026-10-31.**
4. `/dashboard/payroll` and `/dashboard/tax-packs` — Access restricted.

## HR Admin

1. `/dashboard/pay-setup` + `/dashboard/pay-adjustments` — Riley Travis County child support $220 Active; **Release** → Released. No off-cycle form (Finance only).
2. `/dashboard/payroll` restricted (Finance Analyst).

## Manager

1. `/dashboard/payroll` and `/dashboard/tax-packs` restricted.
