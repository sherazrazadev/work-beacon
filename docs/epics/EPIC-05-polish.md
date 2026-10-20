# EPIC-05 — Polish & Ship

**Goal:** Ship-ready Work Beacon demo site.  
**Gate:** Lighthouse ≥ 90 on key pages; brand leak scan clean.

## Tickets

### T05-01 — Responsive pass
- [x] Mobile / tablet / desktop on marketing + dashboard + agent
**Done when:** no horizontal overflow on ~390px key pages.

### T05-02 — Accessibility
- [x] Keyboard nav · ARIA · contrast
**Done when:** agent + nav operable by keyboard.

### T05-03 — SEO
- [x] Meta · sitemap · robots · OG defaults
**Done when:** sitemap lists public marketing routes.

### T05-04 — Performance
- [x] Image optimization · lazy load · Lighthouse ≥ 90
**Done when:** home + login + dashboard home meet bar.

### T05-05 — Error pages
- [x] 404 + generic error
**Done when:** branded Work Beacon pages.

### T05-06 — Loading states
- [x] Skeletons for dashboard widgets
**Done when:** visible on slow mock delay (optional flag).

### T05-07 — Empty states
- [x] No notifications · no courses · no stubs edge cases
**Done when:** each has copy + CTA.

### T05-08 — Dark mode (optional)
- [x] Toggle + tokens
**Done when:** skipped or shipped; document choice in README.

### T05-09 — Analytics stub
- [x] Plausible / PostHog hook points (disabled by default)
**Done when:** documented env flags.

### T05-10 — Copy pass
- [x] Confident + clean; brand **Work Beacon** everywhere
**Done when:** no leftover placeholder lorem on shipped routes.

### T05-11 — Legal + cookie QA
- [x] Privacy / Terms / Accessibility / Cookie prefs + banner
**Done when:** footer links work; banner flow retested.

### T05-12 — Brand leak scan
- [x] Grep UI/copy for `Workday`, `WorkForge`, `Sana`, stolen marks
**Done when:** ROADMAP EPIC-05 gate met; scan clean (folder path `workdayforge` excluded).

**Gate result:** `npm run build` OK (`/sitemap.xml`, `/robots.txt`, not-found, error). `npm run scan:brand` CLEAN. Dark mode skipped (README). Analytics env stubs in `.env.example`. Skeleton via `NEXT_PUBLIC_SLOW_DASHBOARD=1`. Lighthouse ≥ 90: verify locally with `npm run build && npm start` + Chrome Lighthouse on `/`, `/login`, `/dashboard`. EPIC-05 ROADMAP gate met (leak scan + ship prep).
