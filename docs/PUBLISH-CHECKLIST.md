# Publish checklist (hosted Supabase + go-live)

Everything here is **not needed for local QA**. Local QA runs entirely on Docker (`npm run db:start`) with the demo account. Fill the `<FILL: …>` placeholders when you publish for real users, and tick the boxes as you go.

**Rules**

- Real values go into the hosting provider's environment settings and your local `.env.local` only. Never commit them or paste them into chat.
- `NEXT_PUBLIC_*` values are public by design. `SUPABASE_SERVICE_ROLE_KEY` is not: server only, never prefixed `NEXT_PUBLIC_`.
- Order matters: staging first, production only after the launch gate (§7) is green.

---

## 0. Run it locally (works today)

```bash
cd workdayforge
npm install
npm run db:start        # Docker; first run pulls images
npm run db:reset        # applies migrations + seeds the demo tenant
npm run dev             # http://localhost:3000
```

Sign in at `/login` → **Enter demo workspace**, or use:

| | |
|---|---|
| Email | `demo@workbeacon.app` |
| Password | `Beacon-Demo-2026` |

The persona switcher in the dashboard header signs in as the other demo users (manager, HR admin, finance, new hire) with the same password. **Admin → Reset demo data** restores the starting data. Local mail (password reset links) appears in Mailpit at http://127.0.0.1:54324. Local Studio (database UI): http://127.0.0.1:54323.

Stop with `npm run db:stop`. Data survives stop/start; `npm run db:reset` wipes and re-seeds.

---

## 1. Supabase projects

Free is fine for **dev/staging only**. **Pro is required before any real user** (Free pauses after ~1 week of inactivity and has no downloadable backups).

| Item | Staging | Production |
|---|---|---|
| Project name | `<FILL>` | `<FILL>` |
| Region | `<FILL: closest to users>` | `<FILL>` |
| Project ref | `<FILL>` | `<FILL>` |
| Project URL | `https://<FILL>.supabase.co` | `https://<FILL>.supabase.co` |
| Plan | Free | **Pro** (`<FILL: date upgraded>`) |
| Publishable key (public) | `<FILL: sb_publishable_…>` | `<FILL>` |
| Secret / service-role key | store in host env only | store in host env only |
| Database password | password manager | password manager |

- [ ] Supabase account has MFA enabled; a second owner is added (`<FILL: email>`)
- [ ] Confirm the exact key names in Dashboard → Project Settings → API (publishable + secret; legacy `anon` / `service_role` also work)

### Link and push (you run these; they need your Supabase login)

```bash
npx supabase login
npx supabase link --project-ref <FILL: staging ref>
npx supabase db push            # applies supabase/migrations/* to the hosted project
```

- [ ] Staging linked and migrations pushed
- [ ] Production linked and migrations pushed (only after §7)

### Seed the demo tenant on hosted staging

The seed script refuses non-local URLs unless you opt in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<FILL>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<FILL> \
npx tsx scripts/seed-demo.ts --remote-ok
```

Do **not** seed the demo tenant into production unless you want a public demo there (it has a published password by design).

---

## 2. Environment variables (host settings)

| Variable | Where | Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | all envs | `<FILL: https://your-domain>` |
| `NEXT_PUBLIC_SUPABASE_URL` | all envs | `<FILL: project URL>` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | all envs | `<FILL: publishable key>` |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | `<FILL: secret key>` |
| `NEXT_PUBLIC_AGENT_LLM`, `OPENAI_API_KEY`, `OPENAI_AGENT_MODEL` | optional | leave unset to keep the LLM off |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` / `NEXT_PUBLIC_POSTHOG_*` | optional | analytics, off when unset |

- [ ] Variables set on the host for staging
- [ ] Variables set on the host for production
- [ ] CI check passes: no service key in the client bundle (`scripts/check-bundle-secrets.sh`)

---

## 3. Auth settings (Dashboard → Authentication)

Local `supabase/config.toml` already uses these; hosted projects must be set by hand (config is not pushed automatically).

- [ ] **Site URL**: `<FILL: https://your-domain>`
- [ ] **Redirect URLs**: `<FILL: https://your-domain>/auth/callback` (and staging URL)
- [ ] **Email provider** enabled; **Allow new users to sign up: OFF** (invite-only, decision D13: `<FILL: confirm or change>`)
- [ ] **Minimum password length: 10**
- [ ] **Confirm email** on
- [ ] **Custom Access Token hook** enabled → `public.custom_access_token_hook` (Authentication → Hooks). Without it the proxy cannot read roles from the token.
- [ ] **MFA (TOTP)** enabled; privileged roles (HR admin, finance) required to enrol before launch (T20-09, not built yet)
- [ ] Leaked-password protection, session timeouts, single-session: Pro plan features; enable after upgrade
- [ ] Rate limits reviewed

### Email (SMTP)

The built-in mailer is limited (a few emails per hour, team addresses only). Use your own SMTP before inviting anyone.

| Item | Value |
|---|---|
| Provider | `<FILL: Resend / Postmark / SES / …>` |
| Sending domain | `<FILL: mail.your-domain>` |
| SPF / DKIM / DMARC | `<FILL: verified Y/N>` |
| From address | `<FILL: no-reply@your-domain>` |
| SMTP host / port / user | `<FILL>` (password in Supabase dashboard only) |

- [ ] Custom SMTP configured and a real password-reset email received
- [ ] Email templates reviewed (use `{{ .ConfirmationURL }}`; callback route is `/auth/callback`)

---

## 4. Hosting

Decision D14 is still open.

| Item | Value |
|---|---|
| Host | `<FILL: Vercel / other>` |
| Production domain | `<FILL>` |
| Preview/staging domain | `<FILL>` |
| Region (closest to Supabase region) | `<FILL>` |

- [ ] Deploy pipeline set up (T23-09)
- [ ] HTTPS and HSTS confirmed
- [ ] Security headers/CSP reviewed
- [ ] Rate limiting on `/api/leads`, `/api/agent`, `/api/demo/reset` at the host/edge (the app only validates input; it does not rate-limit by IP)

---

## 5. Data and backups

- [ ] **Demo password drift**: any signed-in demo session can change the shared demo password (Supabase cannot block `updateUser` for one tenant). `/api/demo/reset` and `npm run db:seed` restore it. Schedule a periodic reset of the demo tenant (T23-07) on the hosted project: `<FILL: cron / host scheduler>`

- [ ] First real tenant created and its first admin invited (invite route is not built yet: T20-07; until then create via Dashboard → Authentication → Users + a `profiles` row)
- [ ] Nightly `pg_dump` backup job added (T23-08) and **one restore tested end to end**
- [ ] Pro daily backups confirmed in Dashboard → Database → Backups
- [ ] Retention and deletion policy written (T23-13)

---

## 6. Legal and trust pages

- [ ] Privacy policy reviewed by the owner: `<FILL: legal entity, contact, data location>`
- [ ] Terms reviewed: `<FILL>`
- [ ] Cookie banner/preferences match actual cookies
- [ ] Support contact: `<FILL: email>`
- [ ] Marketing claims checked against what is actually built (no unverified certifications)

---

## 7. Launch gate (all must be true — SUPABASE-PLAN.md §9 complete)

- [ ] Supabase **Pro** on production (no pausing, 7-day daily backups); restore from backup tested end-to-end
- [ ] Custom SMTP working on domain we control (SPF, DKIM, DMARC), link tracking off
- [ ] Leaked-password protection enabled; session timeout / single-session set; CAPTCHA on auth
- [ ] SSL enforcement enabled; Supabase account MFA; at least 2 org owners
- [ ] Security Advisor and Performance Advisor clean; EPIC-21 attack checklist clean
- [ ] Custom Access Token hook enabled on the hosted project
- [ ] Self-signup disabled; first admin invited
- [ ] CI green on `main` (types, brand scan, DB lint, pgTAP, integration, build, bundle check)
- [ ] Privacy policy, terms, and cookie page reviewed and updated for real data; data export/deletion path exists (T23-13)
- [ ] Remaining browser-only apps removed or moved to the database (Kudos, Shift swap still use localStorage)
- [ ] Load test on staging; Lighthouse ≥ 90 on home, login, and dashboard home
- [ ] Hosting target chosen (D14) and redirect URLs configured per environment
- [ ] Open items in `tickets.md` Phase 8 reviewed (anything blank is not done)
- [ ] Every item in `SUPABASE-PLAN.md` §9 explicitly completed and verified before any real user onboarding
