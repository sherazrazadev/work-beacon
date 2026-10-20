# EPIC-01 — Marketing Site

**Goal:** Public Work Beacon marketing site mirroring Workday.com *structure*, not brand.  
**Gate:** Homepage first viewport is brand-first; mega-nav + mobile nav work; no Workday marks.

## Tickets

### T01-01 — Header + mega-nav
- [x] Agents · Platform · Products · Customers mega-menus
**Done when:** desktop mega-nav opens and lists own-branded links.

### T01-02 — Header utilities
- [x] More Sites · Sign In · Request Demo · Contact Sales
**Done when:** all reachable (stubs OK).

### T01-03 — Promo banner
- [x] Dismissible announcement strip
**Done when:** shows above header; dismiss persists session.

### T01-04 — Hero
- [x] Brand-level name + one headline + one sub + dual CTAs
**Done when:** brand is hero-level (not nav-only).

### T01-05 — Ask chips
- [x] “Ask us anything” input + suggestion chips (UI only)
**Done when:** chips navigate or open search overlay mock.

### T01-06 — Trust strip
- [x] “Organizations trust Work Beacon” + logo placeholders
**Done when:** strip present; no real Workday customer logos.

### T01-07 — Platform value props
- [x] Three props: context · rules/governance · works where you work
**Done when:** one section, one purpose.

### T01-08 — Agents hub
- [x] HR · Finance · IT & Developers · Everyone cards
**Done when:** cards link to agent landings/stubs.

### T01-09 — Orchestrator agent block
- [x] “Meet Work Beacon Agent” (not Sana / Workday names)
**Done when:** CTA to agent product page.

### T01-10 — Customer stories
- [x] Three stories: quote + metric + placeholder logo
**Done when:** carousel or static trio works on mobile.

### T01-11 — Partners teaser
- [x] Partner ecosystem section + CTA
**Done when:** section shipped.

### T01-12 — Industries teaser
- [x] Industry solutions grid teaser
**Done when:** links to industry template stubs.

### T01-13 — Midsize packages
- [x] Work Beacon GO packages teaser
**Done when:** section + CTA.

### T01-14 — Bottom CTA
- [x] Contact Sales / Request Demo band
**Done when:** both CTAs work.

### T01-15 — Footer
- [x] Full columns + legal + locale switcher UI
**Done when:** all footer links resolve or stub.

### T01-16 — Agents pages
- [x] Agents landing + category templates
**Done when:** at least one category page renders.

### T01-17 — Platform landing
- [x] Builder · data · governance · ecosystem
**Done when:** platform page shipped.

### T01-18 — Products
- [x] Index + dynamic product detail template
**Done when:** ≥2 sample products.

### T01-19 — Customers
- [x] Index + case study detail
**Done when:** ≥1 case study page.

### T01-20 — Industries template
- [x] Reusable industry solution page
**Done when:** ≥1 industry example.

### T01-21 — Resources hub
- [x] Stories · demos · events · webinars · library stubs
**Done when:** hub index exists.

### T01-22 — Pricing
- [x] Three-tier enterprise layout
**Done when:** page shipped (no real billing).

### T01-23 — Company pages
- [x] About · Company · Careers
**Done when:** three pages linked from footer.

### T01-24 — Search overlay
- [x] UI only, mock results
**Done when:** open/close + keyboard.

### T01-25 — Mobile marketing QA
- [x] Mobile nav + homepage + one landing at ~390px
**Done when:** ROADMAP EPIC-01 gate met.

**Gate result:** `npm run build` OK (~56 routes). `src/` leak scan clean (no Workday / WorkForge / Sana). Mega-nav + mobile Menu + homepage sections shipped. EPIC-01 ROADMAP gate met.
