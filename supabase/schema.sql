-- AuthenTone MVP schema. Run in Supabase SQL editor.
-- Assumes Supabase Auth (auth.users) is enabled.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  writing_dna text default '',
  plan text default 'free' check (plan in ('free','pro')),
  created_at timestamptz default now()
);

create table if not exists public.daily_usage (
  user_id uuid references auth.users(id) on delete cascade,
  day date not null,
  rewrites int default 0,
  primary key (user_id, day)
);

alter table public.profiles enable row level security;
alter table public.daily_usage enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own usage" on public.daily_usage;
create policy "own usage" on public.daily_usage
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- Anonymous (pre-login) usage, keyed by IP hash. Only touched server-side
-- with the service_role key; no RLS needed.
create table if not exists public.anon_usage (
  ip_hash text not null,
  day date not null,
  analyzes int default 0,
  rewrites int default 0,
  primary key (ip_hash, day)
);
