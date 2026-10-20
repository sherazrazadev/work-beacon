# EPIC-16 — Work Beacon enterprise UI/UX

**Niche:** Enterprise HR / Finance / IT marketing + fake employee dashboard + agent.  
**Look:** Confident + clean (Stripe / Vercel), accent `#FF6B35`, Syne + Manrope. Dense **product** UI on dashboard; marketing stays spacious.  
**Skills:** `website/docs/UI-UX-SKILLS.md`, `using-ui-stack`, `visual-qa-testing`, `responsive-testing`. **No Magic UI. No 3D. No consumer “tool card” look.**  
**Model:** Claude Sonnet 5.5 High or Claude Opus 5.5 Medium.  
**Brand leak:** `bash scripts/brand-leak-scan.sh` after visual tickets.

**Gate:** Homepage and dashboard feel like one enterprise product; tables/nav/agent usable on laptop + 768px; no Workday marks.

## Tickets

### T16-01 — Marketing visual system pass
- [x] Home hero, mega-nav, trust strip, agent cards — spacing 8px grid, type scale
- [x] Orange used as 10% accent, not flood
**Done when:** no Inter/Roboto; no purple-glow; desktop + mobile nav works.

### T16-02 — Dashboard density
- [x] Left nav + top bar: current item, collapse on tablet
- [x] Home widgets: alignment, empty/loading
**Done when:** Employee / Manager / Finance homes look like one shell.

### T16-03 — Data tables (HR/Finance)
- [x] Shared table chrome: header, numeric align, row hover/focus, empty
- [x] Apply on 2 money or workforce tables (pay stub list + timesheet or equivalent)
**Done when:** scanable; not card-soup.

### T16-04 — Forms & approvals
- [x] Leave / expense (or current equivalent): labels, errors, primary/secondary
- [x] 5-state buttons
**Done when:** keyboard complete path.

### T16-05 — Agent panel
- [x] Chat + tool chips readable; does not cover primary page actions on mobile
**Done when:** demo chat usable at 390px.

### T16-06 — Auth / demo entry
- [x] Login looks enterprise, not consumer SaaS candy
- [x] Demo account CTA obvious
**Done when:** `/login` visual QA pass.

### T16-07 — Visual QA + leak scan
- [x] Home, login, dashboard home, one finance table
- [x] `bash scripts/brand-leak-scan.sh` clean
**Done when:** notes in this epic; `npm run build` green.

QA notes: `docs/evidence/EPIC-16-qa.md`.
