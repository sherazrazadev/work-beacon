-- Public "request a demo / request access" submissions. Written only by the
-- server (service role) through /api/leads; no client role can read or write.
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null check (length(email) <= 254 and email = lower(email)),
  name text not null check (length(name) <= 120),
  company text not null check (length(company) <= 160),
  source text not null default 'request-demo' check (source in ('request-demo', 'signup')),
  created_at timestamptz not null default now()
);
alter table public.leads add constraint leads_email_source_key unique (email, source);

alter table public.leads enable row level security;
alter table public.leads force row level security;
revoke all on public.leads from anon, authenticated;
grant all on public.leads to service_role;
