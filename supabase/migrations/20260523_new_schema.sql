-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- WARNING: Drops existing profiles table if present — run on fresh project

drop table if exists public.content cascade;
drop table if exists public.profiles cascade;
drop table if exists public.users cascade;

-- ──────────────────────────────────────────────────
-- users: basic identity + last scrape timestamp
-- ──────────────────────────────────────────────────
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  instagram_username text default '',
  language text default 'English',
  is_subscribed boolean default false,
  is_promo boolean default false,
  last_scraped_at timestamptz,
  created_at timestamptz default now()
);
alter table public.users enable row level security;
create policy "users_own" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- ──────────────────────────────────────────────────
-- profiles: full Gemini / HikerAPI analysis per user
-- ──────────────────────────────────────────────────
create table public.profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  brand_score integer default 0,
  niche text default '',
  engagement_rate numeric(6,2) default 0,
  follower_count integer default 0,
  following_count integer default 0,
  brand_identity text default '',
  brand_personality text default '',
  content_pillars text[] default '{}',
  what_makes_unique text default '',
  current_problems text[] default '{}',
  profile_score integer default 0,
  best_posting_times text[] default '{}',
  top_content_type text default '',
  format_fatigue boolean default false,
  format_fatigue_warning text default '',
  us_growth_strategy text default '',
  hispanic_to_us_shift text default '',
  filming_tips text default '',
  hashtag_strategy text default '',
  content_variations text[] default '{}',
  weekly_plan text default '',
  bio_rewrite text default '',
  audience_type text default '',
  is_hispanic_audience boolean default false,
  posting_frequency text default '',
  raw_scraped_data jsonb default '{}',
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ──────────────────────────────────────────────────
-- content: 24h-cached daily ideas + strategy per user
-- ──────────────────────────────────────────────────
create table public.content (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  date date not null default current_date,
  ideas jsonb default '[]',
  strategy jsonb default '{}',
  created_at timestamptz default now(),
  unique(user_id, date)
);
alter table public.content enable row level security;
create policy "content_own" on public.content
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
