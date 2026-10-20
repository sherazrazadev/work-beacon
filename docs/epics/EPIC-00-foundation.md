# EPIC-00 — Foundation

**Goal:** Evidence + Work Beacon brand + deployable Next.js shell + legal/cookie stubs.  
**Gate:** `npm run build` passes; `docs/TARGET.md` + evidence exist; UI brand string is **Work Beacon** only.

## Tickets

### T00-01 — Recon capture
- [x] Open https://www.workday.com/ and https://www.workday.com/en-us/homepage.html
- [x] Record routes, mega-nav, sections, fonts, colors, client libs in `docs/evidence/`
- [x] Observation only — no asset or code copying
**Done when:** evidence notes cover both URLs and homepage section map.

### T00-02 — TARGET.md
- [x] Confirm scope, brand, stack, out-of-scope in `docs/TARGET.md`
**Done when:** TARGET matches this epic set.

### T00-03 — Brand tokens
- [x] Accent `#FF6B35`, voice “confident + clean”
- [x] Typography: expressive fonts (not Inter / Roboto / Arial / system-only)
- [x] CSS variables for bg / fg / muted / accent
**Done when:** tokens live in global styles and README brand note.

### T00-04 — Scaffold
- [x] Next.js 16 + TypeScript + Tailwind + shadcn/ui in `workdayforge/`
**Done when:** `npm run dev` and `npm run build` work.

### T00-05 — Folder structure
- [x] `app/(marketing)`, `app/(auth)`, `app/(dashboard)`, `components/`, `lib/agent/`, `lib/mock/`
**Done when:** empty route groups compile.

### T00-06 — Legal stubs
- [x] Privacy, Terms, Accessibility, Cookie Preferences pages
**Done when:** linked from a stub footer.

### T00-07 — Cookie consent UI
- [x] Banner + manage-preferences panel (local state only)
**Done when:** dismiss / accept persists for session or localStorage.

### T00-08 — README
- [x] Run instructions; state brand **Work Beacon**; folder name is not brand
**Done when:** README present at repo root of this folder.

### T00-09 — Foundation QA gate
- [x] Build + smoke home stub + brand leak check (no “Workday” / “WorkForge” in UI strings)
**Done when:** ROADMAP EPIC-00 gate met.

**Gate result (T00-09):** `npm run build` OK (15 static routes). Brand leak scan on `src/` + `README.md`: no `Workday` / `WorkForge` / `Sana` UI strings. EPIC-00 ROADMAP gate met.
