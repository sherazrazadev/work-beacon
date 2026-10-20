# EPIC-11 — Pulse + Agent v2 QA

LLM flag unset (`NEXT_PUBLIC_AGENT_LLM` off). Tools run locally.

## Employee

1. Sign in as **Employee**.
2. Home shows wellness tips from Medical / Dental / 401(k) / open enrollment.
3. `/dashboard/pulse` — answer 5 Likert items, submit. Reload still shows submitted.
4. Agent (⌘K): **Have I submitted Beacon Pulse?** → already submitted.
5. Proactive chips include enrollment / timesheet / Pulse as applicable.
6. Header **Tour** — employee steps: Home → Time → Pay → Pulse → Agent. Skip persists.

## Manager

1. Persona → **Manager**.
2. `/dashboard/pulse/insights` — theme averages, no worker names. Growth is lowest on seed.
3. **Create action plan** on a theme → Inbox task `Pulse action: improve …`.
4. Employee cannot open insights (restricted).
5. Tour (manager): Inbox → Team → Pulse insights → Agent.

## Admin

1. Persona → **HR Admin**.
2. `/dashboard/admin` — Agent audit log lists tool id, persona, source=`rules`.
3. Ask the agent anything; a new row appears.

## LLM-off path

- Without `NEXT_PUBLIC_AGENT_LLM=1`, `/api/agent` is unused; replies still work.
- With the flag and no `OPENAI_API_KEY`, route returns `{ mode: "rules" }` and the client keeps the rules tool.
