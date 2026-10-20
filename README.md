# Work Beacon

Enterprise HR / Finance / IT marketing site + fake employee dashboard + conversational agent demo.

**Brand:** Work Beacon (accent `#FF6B35`)  
**Folder:** `workdayforge/` — path only; do not use the folder name in UI copy.

Inspired by public enterprise marketing structure. Own UI, copy, and code — not affiliated with any third-party HR platform.

## Stack

- Next.js 16 + TypeScript + Tailwind 4
- shadcn-style UI primitives (`components/ui` + `components.json`)
- Fonts: Syne (display) · Manrope (body)

## Run

```bash
cd workdayforge
cp .env.example .env.local   # optional
npm install
npm run dev
```

Open http://localhost:3000

```bash
npm run build
npm start
```

Demo login: **Enter demo account** on `/login` (`demo@workbeacon.app` / `demo`).

## Polish notes (EPIC-05)

- **Dark mode:** skipped — light atmospheric theme only (documented choice).
- **Analytics:** off by default. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and/or `NEXT_PUBLIC_POSTHOG_KEY` in `.env.local` (see `.env.example`).
- **Loading skeletons:** set `NEXT_PUBLIC_SLOW_DASHBOARD=1` to force a ~1.2s dashboard skeleton.
- **SEO:** `/sitemap.xml`, `/robots.txt`, Open Graph defaults via `metadataBase` (`NEXT_PUBLIC_SITE_URL`).
- **Brand leak scan:**

```bash
bash scripts/brand-leak-scan.sh
```

## Agent (EPIC-11)

- **14 tools** in `src/lib/agent/tools.ts` (see `docs/AGENT.md`).
- **LLM off by default.** Optional: `NEXT_PUBLIC_AGENT_LLM=1` + `OPENAI_API_KEY` — server only picks a tool id; execution stays local.
- Audit log: `/dashboard/admin` (HR Admin).
- Beacon Pulse: `/dashboard/pulse` (employee) · `/dashboard/pulse/insights` (manager / HR).

- **Perf:** next/font with `display: swap`; no heavy hero image assets; Lighthouse target ≥ 90 on home / login / dashboard (verify in Chrome DevTools after `npm run build && npm start`).

## Docs

| Doc | Purpose |
| --- | --- |
| `docs/TARGET.md` | Scope + brand boundaries |
| `docs/EPIC-PARTS.md` | Epic order |
| `docs/epics/` | Ticket checklists |
| `docs/evidence/RECON.md` | Observation-only recon |
| `tickets.md` | Flat ticket index |

## Status

- **Phase 1:** Epics **00–05** complete  
- **Phase 2:** Epics **06–11** complete · **EPIC-12** next (`docs/PHASE-2-INDUSTRY.md`)  
