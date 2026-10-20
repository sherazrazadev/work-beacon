# EPIC-16 — Enterprise UI/UX QA

Tokens: `docs/DESIGN.md`. Paper `#F3F4F6`, ink `#0C1524`, accent `#FF6B35` as 10% (CTAs, current nav, 4px hero bar).

## Desktop (1280)

1. `/` — navy hero, Syne heading, Manrope body; mega-nav hover + keyboard.
2. `/login` — demo account is the primary CTA.
3. `/dashboard` (Employee / Manager / Finance) — grouped left nav, current item left bar.
4. `/dashboard/pay` — statements table, numeric net, row hover.
5. `/dashboard/timesheets` — week grid + history table.

## Tablet (768)

- Marketing: Menu in header (lg breakpoint).
- Dashboard: hamburger; sidebar hidden until `lg`.

## Mobile (390)

- Agent: header **Agent** button; panel is a bottom sheet under the top bar (does not cover Inbox / Tour).
- FAB hidden below `sm`.

## Scan / build

- `npm run scan:brand` CLEAN (2026-10-20)
- `npm run build` green

## Recheck 2026-10-20

- Nav groups unique: Workspace, Time, Money, Experience, People, Talent, Platform (no repeats).
- `/dashboard/pay` statements table: Period / Paid / Net / Details.
- `/dashboard/timesheets` week table + history (Draft / Approved).
- 768: Menu hamburger; drawer under header; sidebar `hidden` until `lg`.
- 390: header Agent; dialog `Work Beacon Agent`; Inbox/Tour stay in the top bar.
- `/login` a11y: **Enter demo account** is the first button (session then redirects if already signed in).
- Next.js cacheComponents overlay can blank a screenshot; a11y tree still has the page.

## T16-01 recheck 2026-10-20

- Home: navy hero + Today preview (desktop); orange bar + CTAs only.
- Mega-nav includes Resources → Blog. Mobile Menu lists Blog.
- `/blog` + 5 posts. Home teaser after customer stories.
- No Inter/Roboto. No purple glow. No orange flood on body.

## Responsive pass 2026-10-20

Method: same-origin hidden iframes at a fixed width; flagged any element past the viewport that is not inside a clipping scroll container, plus content-pane `scrollWidth > clientWidth`.

| Scope | Width | Result |
|-------|-------|--------|
| Marketing + auth routes | 390 | no overflow |
| Dashboard, 56 routes, Employee / HR Admin / Finance | 390 | no overflow (after header fix) |
| Dashboard, 56 routes, Manager | 390 | no overflow; 11 HR-only routes show "Access restricted" |
| Dashboard, 56 routes, HR Admin | 768 | no overflow |

Fixes:
- `dashboard/shell.tsx`: header no longer overflows at 390 (name hidden <sm; Tour/Log out moved into the Menu drawer; Agent button added <sm); content pane `min-w-0`.
- `persona-switcher.tsx`: compact select on mobile.
- Tap targets raised to >=40px on mobile (>=32px desktop): home widget links, pay/profile back links, calendar Prev/Next, org chart toggle + names, performance rating, pay-adjustments inputs, recruiting stage select + names.
- Recruiting board: stages stack vertically <md (board with scroll from md).
- Pay: YTD and total-rewards tiles 2-up on mobile.

Stacked tables (<640px, one card per row, labels from `<th>`): new `components/ui/stack-table.tsx` + `.wb-stack-wrap` CSS in `globals.css`. Used by `DataTable` (pay, timesheets, learning, team learning, insights) and raw tables on `/admin`, `/reports`, `/planning`, `/schedule`, `/time-off`. Verified at 390: all cells labelled, no wrapper overflow, no page overflow (HR Admin).
Kept as scrolling grids on purpose: `/security` role matrix (25 paths x 5 roles) and `/calendar` month grid. Pay statement lines table is 2 columns and already fits.
Inline text links inside sentences left under 32px.

Extended pass (57 routes each; iframe overflow measurement): Employee 768, Manager 768, Finance 768, HR Admin 320, Employee 320 — no page or element overflow, no errors. Stacked tables seen with all cells labelled on `/insights`, `/learning`, `/learning/team`, `/pay`, `/planning`, `/reports`, `/schedule`, `/time-off`, `/timesheets`, `/admin`.
Not run: 768 for Employee/Manager/Finance, 320px.
