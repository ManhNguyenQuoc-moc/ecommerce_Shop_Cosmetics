-- Fix Supabase Auth signup failure: "Database error saving new user"
-- Run this script in Supabase SQL Editor (project DB)

-- 1) Create/replace trigger function that syncs auth.users -> public."User"
create or replace function public.handle_new_user
()
returns trigger
language plpgsql
security definer
set search_path
= public
as $$
begin
    insert into public."User"
        (
        "id",
        "email",
        "full_name",
        "phone",
        "accountType",
        "provider",
        "is_verified",
        "createdAt",
        "updatedAt"
        )
    values
        (
            new.id::text,
            lower(new.email),
            nullif(new.raw_user_meta_data->>'full_name', ''),
            nullif(new.raw_user_meta_data->>'phone', ''),
            'CUSTOMER'
    ::"AccountType",
    'LOCAL'::"Provider",
    coalesce
    (new.email_confirmed_at is not null, false),
    now
    (),
    now
    ()
  )
  on conflict
    ("id") do
    update
    set
      "email" = excluded."email",
      "full_name" = coalesce(excluded."full_name", public."User"."full_name"),
      "phone" = coalesce(excluded."phone", public."User"."phone"),
      "updatedAt" = now();

    return new;
    exception
  when unique_violation then
    -- Keep auth signup alive even when app table has conflicting unique values.
    return new;
    when others then
    -- Log warning instead of breaking user signup.
    raise warning 'handle_new_user failed: %', SQLERRM;
return new;
end;
$$;

-- 2) Ensure trigger exists exactly once on auth.users

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after
insert on
auth.users
for each row
execute
function public.handle_new_user
();

-- 3) Backfill missing app users for existing auth users (safe upsert)
insert into public."User"
    (
    "id",
    "email",
    "full_name",
    "phone",
    "accountType",
    "provider",
    "is_verified",
    "createdAt",
    "updatedAt"
    )
select
    au.id::text,
    lower(au.email),
    nullif(au.raw_user_meta_data->>'full_name', ''),
    nullif(au.raw_user_meta_data->>'phone', ''),
    'CUSTOMER'
::"AccountType",
  'LOCAL'::"Provider",
  coalesce
(au.email_confirmed_at is not null, false),
  coalesce
(au.created_at, now
()),
  now
()
from auth.users au
left join public."User" u on u."id" = au.id::text
where u."id" is null
on conflict
("id") do nothing;
