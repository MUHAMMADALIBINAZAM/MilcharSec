-- Run this in Supabase SQL Editor to verify the live database configuration.
select to_regclass('public.profiles') as profiles_table;

select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'profiles'
order by policyname;

select tgname, tgenabled
from pg_trigger
where tgrelid = 'auth.users'::regclass
  and tgname = 'on_auth_user_created';
