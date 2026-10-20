# Target: Workday.com (inspiration only)

**Sources (public marketing):**  
- https://www.workday.com/  
- https://www.workday.com/en-us/homepage.html  

**Our product:** **Work Beacon** (folder name `workdayforge/` is not the brand).

Reimplement ourselves. Do not copy Workday code, brand, logos, customer marks, or assets.

## Product promise (ours)

- Enterprise platform story for HR, finance, and IT  
- Agentic AI assistant for employees (mock / rule-based first)  
- Public marketing site + fake employee login + dashboard demo  
- Confident + clean voice; accent `#FF6B35`

## Observed Workday homepage map (for structure — rebrand)

1. Skip link + promo banners  
2. Mega-nav: Agents · Platform · Products · Customers  
3. Utilities: More Sites · Sign In (with help copy) · Request Demo  
4. Hero: AI headline + “Ask us anything” chips  
5. Trust / logo strip  
6. Platform value props (context · trust/rules · works everywhere)  
7. Agent category cards (HR · Finance · IT · Everyone)  
8. Orchestrator agent block (Sana on source → **Work Beacon Agent** on ours)  
9. Customer stories + metrics  
10. Partners · Industries · Midsize packages  
11. Footer CTA + deep footer  
12. Cookie / privacy preference UI  

## Out of scope

- Real Workday tenant login or APIs  
- Copying Workday trademarks or visual identity  
- Real LLM backend (mock agent until separately approved)  
- Scraping or redistributing their media  

## Evidence

Store observation-only notes under `docs/evidence/`.  
REA / Cursor browser for structure; write new UI under Work Beacon.

## Confirmed (EPIC-00)

- Brand: **Work Beacon** (folder `workdayforge/` is not brand)  
- Stack: Next.js 16 + TypeScript + Tailwind 4 + shadcn-style UI  
- Auth: public + fake login only  
- Scope: marketing + login + dashboard + agent (phased by epics)

## Phase 2 (industry depth)

- Build an **original** Hire-to-Retire + Money demo platform  
- Inspired by public industry HCM/ERP categories — **not** Workday binary RE or trademark use  
- Plan: `docs/PHASE-2-INDUSTRY.md` · Epics **06–12**
