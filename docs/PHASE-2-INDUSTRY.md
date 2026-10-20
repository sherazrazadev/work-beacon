# Phase 2 — Industry-level Work Beacon (original)

**Goal:** Grow Work Beacon from a marketing + thin ESS demo into an industry-credible **Hire-to-Retire + Money** demo platform — **our** product, not a Workday clone.

**Research basis (public only):**
- Workday suite marketing / SEC capability narrative (HCM, Payroll, Financial Management, Adaptive Planning, spend, AI agents) — [Workday Suite](https://www.workday.com/en-au/products/suite.html), [HCM overview](https://www.workday.com/en-us/products/human-capital-management/overview.html), [Adaptive Planning](https://www.workday.com/en-us/products/adaptive-planning/overview.html), [SEC 10-K](https://www.sec.gov/Archives/edgar/data/1327811/000132781125000056/wday-20250131.htm)
- Industry HCM norms: ESS/MSS, workflows, core HR, leave, payroll, WFM — [TechTarget HR features](https://www.techtarget.com/enterprise-software/tip/20-must-have-HR-software-features-and-system-requirements), [AU ERP HCM standard (Hire-to-Retire)](https://architecture.digital.gov.au/standard/erp-human-capital-management), [SAP HCM buyer’s guide themes](https://www.sap.com/resources/hcm-software-buyers-guide)

**Hard rules:**
- No Workday trademarks, logos, assets, AEM/media scrape, or tenant binary RE  
- Mock/local data first; optional real DB later  
- Stack stays Next.js unless a later epic explicitly changes it  

## Gap map (have → need)

| Area | Have now | Phase 2 target |
| --- | --- | --- |
| Marketing | Thin stubs | Deep content + demos + resource library |
| Auth | Single fake user | Roles, SSO *theater*, multi-persona demo switcher |
| Core HR | Profile form | Workers, jobs, org chart, docs, history |
| Time | PTO request | Policies, balances by type, calendar, timesheets |
| Pay | Stub list | Comp statements, YTD, tax forms UI, direct deposit |
| Talent | Goals / learning lists | Recruiting pipeline, onboarding checklist, succession |
| Finance | None | Expenses, GL lite, FP&A planning board |
| Engagement | None | Pulse surveys / action plans |
| Agent | Rule chat | Task inbox, more tools, optional LLM, audit log |
| Platform | None | Workflows, reports, integrations, admin |

## Suggested build order

1. **EPIC-06** Marketing depth (credibility for sales story)  
2. **EPIC-07** Demo tenant foundation (roles + org + workers)  
3. **EPIC-08** Workforce ops (time / attendance / scheduling)  
4. **EPIC-09** Talent lifecycle (recruit → onboard → grow)  
5. **EPIC-10** Money (payroll depth + spend + planning lite)  
6. **EPIC-11** Experience & Agent v2  
7. **EPIC-12** Platform (reports, workflows, integrations, admin)

Gates stay sequential unless blocked.
