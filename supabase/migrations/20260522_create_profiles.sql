-- Run this once in your Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  instagram_handle text default '',
  niche text default '',
  language text default 'English',
  scrape_data jsonb default '{}',
  analysis_data jsonb default '{}',
  strategy_data jsonb default '{}',
  scraped_at timestamptz,
  analyzed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
