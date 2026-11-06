-- ==============================================================================
-- TRADING RESEARCH LAB (TRL) — INITIAL DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- Description: Core tables for profiles, trading plans, strategies,
--              strategy versions, journal entries, and execution trades.
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
-- References auth.users on delete cascade
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, created_at, updated_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    now(),
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. TRADING PLANS TABLE
create table if not exists public.trading_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  authorized_markets jsonb default '["FUTURES", "FOREX", "EQUITY", "CRYPTO"]'::jsonb not null,
  trading_sessions jsonb default '[]'::jsonb not null,
  daily_loss_limit numeric(12, 2) default 1500.00 not null,
  weekly_loss_limit numeric(12, 2) default 4500.00 not null,
  risk_per_trade numeric(5, 2) default 1.00 not null,
  max_trades_per_day int default 4 not null,
  timeframe_hierarchy jsonb default '[]'::jsonb not null,
  entry_rules jsonb default '[]'::jsonb not null,
  exit_rules jsonb default '[]'::jsonb not null,
  psychology_rules jsonb default '[]'::jsonb not null,
  no_trade_conditions jsonb default '[]'::jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. STRATEGIES TABLE
create table if not exists public.strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  market text not null,
  symbol text,
  timeframe text not null,
  status text default 'TESTING' not null check (status in ('ACTIVE', 'TESTING', 'ARCHIVED', 'TEMPLATE', 'LIVE')),
  current_version text default 'v1.0.0' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 4. STRATEGY VERSIONS TABLE
create table if not exists public.strategy_versions (
  id uuid primary key default gen_random_uuid(),
  strategy_id uuid not null references public.strategies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  version text not null,
  rules jsonb default '{}'::jsonb not null,
  parameters jsonb default '{}'::jsonb not null,
  created_at timestamptz default now() not null
);

-- 5. JOURNAL ENTRIES TABLE
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  trade_date timestamptz not null default now(),
  symbol text not null,
  direction text not null check (direction in ('LONG', 'SHORT')),
  strategy_id uuid references public.strategies(id) on delete set null,
  entry_price numeric(16, 5) not null,
  stop_loss numeric(16, 5) not null,
  take_profit numeric(16, 5) not null,
  exit_price numeric(16, 5),
  result text check (result in ('WIN', 'LOSS', 'BREAKEVEN', 'PENDING')),
  r_multiple numeric(8, 2),
  pnl numeric(14, 2),
  emotion text,
  mistake text,
  notes text,
  screenshot_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 6. TRADES TABLE (Execution & Forward Paper Data)
create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  strategy_id uuid references public.strategies(id) on delete set null,
  symbol text not null,
  direction text not null check (direction in ('LONG', 'SHORT')),
  entry_price numeric(16, 5) not null,
  exit_price numeric(16, 5),
  stop_loss numeric(16, 5) not null,
  take_profit numeric(16, 5) not null,
  quantity numeric(14, 4) not null,
  risk_amount numeric(14, 2) default 0.00 not null,
  r_multiple numeric(8, 2) default 0.00,
  pnl numeric(14, 2) default 0.00,
  status text default 'CLOSED' not null check (status in ('OPEN', 'CLOSED', 'CANCELLED', 'PENDING')),
  entry_time timestamptz not null default now(),
  exit_time timestamptz,
  created_at timestamptz default now() not null
);

-- Indexes for high-performance multi-tenant filtering
create index if not exists idx_trading_plans_user on public.trading_plans(user_id);
create index if not exists idx_strategies_user on public.strategies(user_id);
create index if not exists idx_strategy_versions_strategy on public.strategy_versions(strategy_id);
create index if not exists idx_journal_entries_user on public.journal_entries(user_id);
create index if not exists idx_journal_entries_date on public.journal_entries(trade_date desc);
create index if not exists idx_trades_user on public.trades(user_id);
create index if not exists idx_trades_date on public.trades(entry_time desc);

