-- Prevent demo users from changing the shared demo password via auth.updateUser.
-- Non-demo users and administrative operations (seeds/resets) are unaffected.

create or replace function public.prevent_demo_password_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.encrypted_password is distinct from old.encrypted_password
     and (select auth.role()) = 'authenticated' then
    if exists (
      select 1
      from public.profiles p
      join public.tenants t on t.id = p.tenant_id
      where p.id = new.id and t.is_demo = true
    ) then
      raise exception 'Password changes are not permitted for demo accounts.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_demo_password_change on auth.users;
create trigger prevent_demo_password_change
before update on auth.users
for each row
execute function public.prevent_demo_password_change();
