-- Work Beacon: tenancy, identity, governed records, audit log.
-- Principles: default deny, RLS enabled AND forced on every public table,
-- no privileges for `anon`, helper functions live in a non-exposed schema,
-- SECURITY DEFINER functions pin search_path, policy columns are indexed.

create schema if not exists app;
revoke all on schema app from public;
grant usage on schema app to authenticated, service_role;

create type public.app_role as enum ('employee', 'manager', 'hr_admin', 'finance');
create type public.access_scope as enum ('none', 'own', 'team', 'all');

-- ---------------------------------------------------------------- tenants
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,40}$'),
  name text not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------- profiles
-- One row per auth user. Role and tenant are assigned by the server (invite /
-- seed), never by the client: `authenticated` has SELECT only on this table.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  tenant_id uuid not null references public.tenants (id) on delete restrict,
  email text not null,
  full_name text not null,
  role public.app_role not null,
  worker_id text,
  persona_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_tenant_idx on public.profiles (tenant_id);

-- ---------------------------------------------------------------- workers
-- Directory skeleton used for manager scope (`team`). Rich worker data stays
-- in the app seed for now (see ADR 0002).
create table public.workers (
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  id text not null,
  name text not null,
  email text,
  manager_id text,
  primary key (tenant_id, id)
);
create index workers_manager_idx on public.workers (tenant_id, manager_id);

-- ------------------------------------------------------ collection_access
-- Server-side permission matrix: per collection and role, what may be read and
-- written. Changed only through migrations.
create table public.collection_access (
  collection text not null,
  role public.app_role not null,
  read_scope public.access_scope not null default 'none',
  write_scope public.access_scope not null default 'none',
  owner_field text,
  insert_any boolean not null default false,
  primary key (collection, role)
);

-- ------------------------------------------------------- helper functions
-- Resolved from the caller's profile row (not from client-supplied claims).
create function app.tenant_id() returns uuid
language sql stable security definer set search_path = ''
as $$ select p.tenant_id from public.profiles p where p.id = (select auth.uid()) $$;

create function app.role() returns public.app_role
language sql stable security definer set search_path = ''
as $$ select p.role from public.profiles p where p.id = (select auth.uid()) $$;

create function app.worker_id() returns text
language sql stable security definer set search_path = ''
as $$ select p.worker_id from public.profiles p where p.id = (select auth.uid()) $$;

create function app.is_report(target text) returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.workers w
    where w.tenant_id = app.tenant_id()
      and w.id = target
      and w.manager_id is not null
      and w.manager_id = app.worker_id()
  )
$$;

create function app.read_ok(coll text, owner text) returns boolean
language sql stable security definer set search_path = ''
as $$
  select case ca.read_scope
    when 'all' then true
    -- `own`/`team` also include unowned (company-wide) rows
    when 'own' then owner is null or owner = app.worker_id()
    when 'team' then owner is null or owner = app.worker_id() or app.is_report(owner)
    else false
  end
  from public.collection_access ca
  where ca.collection = coll and ca.role = app.role()
$$;

create function app.write_ok(coll text, owner text) returns boolean
language sql stable security definer set search_path = ''
as $$
  select case ca.write_scope
    when 'all' then true
    when 'own' then owner is not null and owner = app.worker_id()
    when 'team' then owner is not null and (owner = app.worker_id() or app.is_report(owner))
    else false
  end
  from public.collection_access ca
  where ca.collection = coll and ca.role = app.role()
$$;

create function app.insert_any(coll text) returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce(bool_or(ca.insert_any), false)
  from public.collection_access ca
  where ca.collection = coll and ca.role = app.role()
$$;

grant execute on all functions in schema app to authenticated, service_role;

-- ---------------------------------------------------------------- records
create table public.records (
  tenant_id uuid not null default app.tenant_id() references public.tenants (id) on delete cascade,
  collection text not null,
  id text not null,
  data jsonb not null check (pg_column_size(data) < 262144),
  owner_worker text,
  -- list position within a collection (fractional so inserts need no re-number)
  ord double precision not null default 0,
  updated_by uuid,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, collection, id)
);
create index records_owner_idx on public.records (tenant_id, collection, owner_worker);

create table public.audit_log (
  id bigint generated always as identity primary key,
  tenant_id uuid,
  actor uuid,
  action text not null,
  collection text,
  record_id text,
  at timestamptz not null default now()
);
create index audit_log_tenant_at_idx on public.audit_log (tenant_id, at desc);

-- Stamp ownership and authorship server-side so clients cannot forge them.
create function app.records_stamp() returns trigger
language plpgsql set search_path = ''
as $$
declare
  field text;
  from_data text;
begin
  select ca.owner_field into field
  from public.collection_access ca
  where ca.collection = new.collection and ca.owner_field is not null
  limit 1;

  if field is not null then
    from_data := nullif(new.data ->> field, '');
  end if;

  new.owner_worker := coalesce(from_data, new.owner_worker, app.worker_id());
  new.updated_by := (select auth.uid());
  new.updated_at := now();
  return new;
end
$$;

create trigger records_stamp
before insert or update on public.records
for each row execute function app.records_stamp();

create function app.records_audit() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.audit_log (tenant_id, actor, action, collection, record_id)
  values (
    coalesce(new.tenant_id, old.tenant_id),
    (select auth.uid()),
    tg_op,
    coalesce(new.collection, old.collection),
    coalesce(new.id, old.id)
  );
  return null;
end
$$;

create trigger records_audit
after insert or update or delete on public.records
for each row execute function app.records_audit();

-- ------------------------------------------------ custom access token hook
-- Adds tenant/role/worker claims so the proxy can enforce route roles without
-- a database round trip. Claims refresh with each token refresh/sign-in.
create function public.custom_access_token_hook(event jsonb) returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  claims jsonb := event -> 'claims';
  p record;
begin
  select pr.tenant_id, pr.role, pr.worker_id into p
  from public.profiles pr
  where pr.id = (event ->> 'user_id')::uuid;

  if found then
    claims := claims || jsonb_build_object(
      'tenant_id', p.tenant_id,
      'app_role', p.role,
      'worker_id', p.worker_id
    );
  end if;

  return jsonb_set(event, '{claims}', claims);
end
$$;

revoke execute on function public.custom_access_token_hook(jsonb) from public, anon, authenticated;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;

-- -------------------------------------------------------------------- RLS
alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.workers enable row level security;
alter table public.collection_access enable row level security;
alter table public.records enable row level security;
alter table public.audit_log enable row level security;

alter table public.tenants force row level security;
alter table public.profiles force row level security;
alter table public.workers force row level security;
alter table public.collection_access force row level security;
alter table public.records force row level security;
alter table public.audit_log force row level security;

create policy tenants_select on public.tenants for select to authenticated
  using (id = (select app.tenant_id()));

create policy profiles_select on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or (tenant_id = (select app.tenant_id()) and (select app.role()) = 'hr_admin')
  );

create policy workers_select on public.workers for select to authenticated
  using (tenant_id = (select app.tenant_id()));

create policy collection_access_select on public.collection_access for select to authenticated
  using (true);

create policy records_select on public.records for select to authenticated
  using (tenant_id = (select app.tenant_id()) and app.read_ok(collection, owner_worker));

create policy records_insert on public.records for insert to authenticated
  with check (
    tenant_id = (select app.tenant_id())
    and (app.write_ok(collection, owner_worker) or app.insert_any(collection))
  );

create policy records_update on public.records for update to authenticated
  using (tenant_id = (select app.tenant_id()) and app.write_ok(collection, owner_worker))
  with check (tenant_id = (select app.tenant_id()) and app.write_ok(collection, owner_worker));

create policy records_delete on public.records for delete to authenticated
  using (tenant_id = (select app.tenant_id()) and app.write_ok(collection, owner_worker));

create policy audit_log_select on public.audit_log for select to authenticated
  using (tenant_id = (select app.tenant_id()) and (select app.role()) = 'hr_admin');

-- ------------------------------------------------------------- privileges
-- Default deny: strip Supabase's default grants, then grant the minimum.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated;

grant select on public.tenants, public.profiles, public.workers,
  public.collection_access, public.audit_log to authenticated;
grant select, insert, update, delete on public.records to authenticated;
grant all on all tables in schema public to service_role;
grant select on public.profiles to supabase_auth_admin;
