begin;
select plan(22);

create schema tests;
create function tests.as_user(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims',
    json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
end $$;
create function tests.rows_affected(q text) returns bigint language plpgsql as $$
declare n bigint;
begin
  execute q;
  get diagnostics n = row_count;
  return n;
end $$;
grant usage on schema tests to public;
create function tests.as_anon() returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', '{}', true);
  set local role anon;
end $$;

-- ---------------------------------------------------------------- fixtures
insert into public.tenants (id, slug, name) values
  ('aaaaaaaa-0000-4000-8000-000000000001', 'tenant-a', 'Tenant A'),
  ('bbbbbbbb-0000-4000-8000-000000000002', 'tenant-b', 'Tenant B');

insert into auth.users (id, aud, role, email) values
  ('a1000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'emp@a.test'),
  ('a1000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'mgr@a.test'),
  ('a1000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'hr@a.test'),
  ('a1000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'fin@a.test'),
  ('b1000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'emp@b.test');

insert into public.profiles (id, tenant_id, email, full_name, role, worker_id) values
  ('a1000000-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000001', 'emp@a.test', 'Emp A', 'employee', 'w-e1'),
  ('a1000000-0000-4000-8000-000000000002', 'aaaaaaaa-0000-4000-8000-000000000001', 'mgr@a.test', 'Mgr A', 'manager', 'w-m1'),
  ('a1000000-0000-4000-8000-000000000003', 'aaaaaaaa-0000-4000-8000-000000000001', 'hr@a.test', 'HR A', 'hr_admin', 'w-hr'),
  ('a1000000-0000-4000-8000-000000000004', 'aaaaaaaa-0000-4000-8000-000000000001', 'fin@a.test', 'Fin A', 'finance', 'w-fin'),
  ('b1000000-0000-4000-8000-000000000001', 'bbbbbbbb-0000-4000-8000-000000000002', 'emp@b.test', 'Emp B', 'employee', 'w-b1');

insert into public.workers (tenant_id, id, name, manager_id) values
  ('aaaaaaaa-0000-4000-8000-000000000001', 'w-m1', 'Mgr A', null),
  ('aaaaaaaa-0000-4000-8000-000000000001', 'w-e1', 'Emp A', 'w-m1'),
  ('aaaaaaaa-0000-4000-8000-000000000001', 'w-e2', 'Emp A2', 'w-m1'),
  ('aaaaaaaa-0000-4000-8000-000000000001', 'w-x', 'Other', null),
  ('bbbbbbbb-0000-4000-8000-000000000002', 'w-b1', 'Emp B', null);

insert into public.records (tenant_id, collection, id, data) values
  ('aaaaaaaa-0000-4000-8000-000000000001', 'timeOff', 't1', '{"id":"t1","workerId":"w-e1"}'),
  ('aaaaaaaa-0000-4000-8000-000000000001', 'timeOff', 't2', '{"id":"t2","workerId":"w-e2"}'),
  ('aaaaaaaa-0000-4000-8000-000000000001', 'timeOff', 't3', '{"id":"t3","workerId":"w-x"}'),
  ('aaaaaaaa-0000-4000-8000-000000000001', 'documents', 'd-shared', '{"id":"d-shared"}'),
  ('aaaaaaaa-0000-4000-8000-000000000001', 'journals', 'j1', '{"id":"j1"}'),
  ('bbbbbbbb-0000-4000-8000-000000000002', 'timeOff', 'tb1', '{"id":"tb1","workerId":"w-b1"}');
update public.records set owner_worker = 'w-e1'
  where collection = 'banks' or id = 't1';

-- ------------------------------------------------------------ structure
select is(
  (select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind in ('r', 'p')
     and not (c.relrowsecurity and c.relforcerowsecurity)),
  0::bigint, 'every public table has RLS enabled and forced');

select is(
  (select count(*) from public.collection_access), 216::bigint,
  'matrix covers 54 collections x 4 roles');

select is(
  (select count(*) from (
    select collection from public.collection_access group by collection having count(*) <> 4
  ) x), 0::bigint, 'every collection has all four role rows');

select is(
  public.custom_access_token_hook(jsonb_build_object(
    'user_id', 'a1000000-0000-4000-8000-000000000002', 'claims', '{}'::jsonb
  )) -> 'claims' ->> 'app_role',
  'manager', 'token hook adds app_role');

-- ------------------------------------------------------------------ anon
select tests.as_anon();
select throws_ok('select * from public.records', '42501', null, 'anon cannot read records');
select throws_ok('select * from public.profiles', '42501', null, 'anon cannot read profiles');
reset role;

-- -------------------------------------------------------------- employee A
select tests.as_user('a1000000-0000-4000-8000-000000000001');
select is((select count(*) from public.records where collection = 'timeOff'), 1::bigint,
  'employee sees only own leave');
select is((select count(*) from public.records where collection = 'journals'), 0::bigint,
  'employee cannot read finance journals');
select is((select count(*) from public.records where collection = 'documents'), 1::bigint,
  'employee sees unowned company documents');
select is((select count(*) from public.records where tenant_id = 'bbbbbbbb-0000-4000-8000-000000000002'), 0::bigint,
  'employee cannot see another tenant');
select throws_ok(
  $$insert into public.records (collection, id, data) values ('timeOff', 'x1', '{"id":"x1","workerId":"w-e2"}')$$,
  '42501', null, 'employee cannot create leave for someone else');
select lives_ok(
  $$insert into public.records (collection, id, data) values ('timeOff', 'x2', '{"id":"x2","workerId":"w-e1"}')$$,
  'employee can create own leave');
select throws_ok(
  $$insert into public.records (tenant_id, collection, id, data)
    values ('bbbbbbbb-0000-4000-8000-000000000002', 'timeOff', 'x3', '{"id":"x3","workerId":"w-e1"}')$$,
  '42501', null, 'employee cannot write into another tenant');
select is(
  tests.rows_affected($q$update public.records set data = '{"id":"j1"}' where collection = 'journals'$q$),
  0::bigint, 'employee cannot update finance journals');
select throws_ok($$update public.profiles set role = 'hr_admin'$$, '42501', null,
  'employee cannot escalate role');
select throws_ok(
  $$insert into public.collection_access (collection, role) values ('x', 'employee')$$,
  '42501', null, 'employee cannot edit the permission matrix');
select is((select count(*) from public.audit_log), 0::bigint, 'employee cannot read audit log');
reset role;

-- ------------------------------------------------------------------ manager
select tests.as_user('a1000000-0000-4000-8000-000000000002');
select is((select count(*) from public.records where collection = 'timeOff' and tenant_id = 'aaaaaaaa-0000-4000-8000-000000000001' and id in ('t1','t2','t3')), 2::bigint,
  'manager sees direct reports leave, not others');
select is(
  tests.rows_affected($q$update public.records set data = '{"id":"t3","workerId":"w-x","s":1}' where id = 't3'$q$),
  0::bigint, 'manager cannot edit non-report leave');
reset role;

-- ------------------------------------------------------ finance / hr / B
select tests.as_user('a1000000-0000-4000-8000-000000000004');
select is((select count(*) from public.records where collection = 'journals'), 1::bigint,
  'finance reads journals');
reset role;

select tests.as_user('a1000000-0000-4000-8000-000000000003');
select ok((select count(*) from public.audit_log) > 0, 'hr_admin reads audit log');
reset role;

select tests.as_user('b1000000-0000-4000-8000-000000000001');
select is((select count(*) from public.records where collection = 'timeOff'), 1::bigint,
  'tenant B employee sees only tenant B data');
reset role;

select * from finish();
rollback;
