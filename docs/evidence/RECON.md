# Recon — workday.com (observation only)

Captured 2026-10-18. Sources: HTML fetch + Cursor browser a11y snapshot.  
Rebuild brand: **Work Beacon**. Do not copy assets, logos, or code.

## URLs

| URL | Result |
| --- | --- |
| https://www.workday.com/ | 200 — same marketing homepage payload as en-us |
| https://www.workday.com/en-us/homepage.html | 200 — primary homepage |

Raw HTML was fetched for parsing then discarded (gitignored). Findings live in this note only.

## Stack (observed)

- **CMS:** Adobe Experience Manager (AEM) — `/etc.clientlibs/`, `/content/dam/`
- **Client libs:** `atlas` clientlib-base / clientlib-redesign, `wd-core` global
- **UI:** React 18 UMD from unpkg (partial islands)
- **Analytics / tags:** Adobe DTM Launch, Helix RUM (`rum.hlx.page`)
- **Video:** Brightcove player
- **Forms:** Marketo forms2
- **Login detect:** `prod-unifiedlogin.mktg.workday.com`
- **Fonts (CSS):** `"Workday Body", sans-serif` (+ woff2 assets) — proprietary; we will not copy
- **Not Next.js** — AEM/Webpack clientlibs, not `/_next/`

## Colors (sampled from CSS in HTML)

| Token-ish | Hex | Note |
| --- | --- | --- |
| Deep navy | `#022043`, `#0a254d`, `#0f2e66` | Primary dark / text bands |
| Muted gray | `#525d6a` | Secondary text |
| Warm sand | `#bebbb0`, `#f6f5f1` | Light surfaces |

**Our accent (specified):** `#FF6B35` — not observed as Workday primary; Work Beacon brand choice.

## Primary navigation (structure)

- **Agents** — Agents for HR / Finance / IT & Developers / Everyone; Explore Sana
- **Platform** — Trusted Agentic Platform; Extend AI; Data Cloud; AI Governance & Trust; Ecosystem
- **Products** — HCM · Financial Management · IT & Developers
- **Customers**
- Utilities: More Sites (Community, Marketplace, Developers) · Sign In (+ help copy) · Request a Demo
- Mobile: Open menu

## Homepage section map (top → bottom)

1. Skip to main content  
2. Promo carousel banners (Rising / agentic AI news)  
3. Primary nav + Sign In + Request Demo  
4. Hero: “AI that gets work done right.” + supporting copy  
5. Ask chips: “Tell me about AI agents” · “Find industry solutions” · “What is Sana?”  
6. Trust strip: “11,500+ organizations…” + logos  
7. Platform value props carousel (context · rules · works wherever)  
8. Agents for HR / Finance / IT / Everyone (+ tabs)  
9. “Meet Sana…” orchestrator block  
10. Customer stories + metrics  
11. Partner Ecosystem · Industry Solutions · Midsize (Workday GO)  
12. Bottom CTA: Contact Sales / Request Demo  
13. Footer accordions: Agents & Products · Industries · Resources · Learn · Popular Links · Company  
14. Legal: Legal · Privacy · Accessibility · Cookie Preferences · locale  
15. Cookie / YouTube preference modal  

## Sign-in pattern (copy structure only)

- “Need help signing in?” → direct user to company HR/IT for tenant URL  
- Product logins list (Adaptive, Evisort, Peakon, etc.) — external  

## Rebuild notes (Work Beacon)

- Own stack: Next.js 16 + Tailwind (not AEM)  
- Own fonts (Syne + Manrope) — never ship “Workday Body”  
- Replace Sana → **Work Beacon Agent**  
- Replace Workday GO → **Work Beacon GO**  
- Placeholder logos only — no customer marks from source  
