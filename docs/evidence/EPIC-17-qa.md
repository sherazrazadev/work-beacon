# EPIC-17 — Beacon Insights QA

## Employee

1. Sign in as **Employee**.
2. `/dashboard/insights` — Time board is default (People also visible). No Talent / Money tabs.
3. Switch to People — department + location + manager span.
4. CSV downloads.

## Manager

1. Persona → **Manager**.
2. Default board **Talent** — pipeline + open reqs.
3. Money tab available. Home pin **Beacon Insights** links here.
4. Agent: **What is our headcount?** → tenant count + Insights link.

## Finance

1. Persona → **Finance Analyst**.
2. Default board **Money** — plan vs actual, pending expenses, POs.
3. Agent: **spend vs plan**.

## HR Admin

1. Default **People**. Audit not required.
2. Employee cannot open Talent (tab hidden).

## Scan / build

- `npm run build`
- `npm run scan:brand`
