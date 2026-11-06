-- ==============================================================================
-- TRADING RESEARCH LAB (TRL) — ROW LEVEL SECURITY (RLS) POLICIES
-- Migration: 002_rls_policies.sql
-- Description: Enforces strict data isolation. Authenticated users can only
--              SELECT, INSERT, UPDATE, and DELETE their own records.
-- ==============================================================================

-- 1. PROFILES RLS
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2. TRADING PLANS RLS
alter table public.trading_plans enable row level security;

create policy "Users can select their own trading plans"
  on public.trading_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own trading plans"
  on public.trading_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own trading plans"
  on public.trading_plans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own trading plans"
  on public.trading_plans for delete
  using (auth.uid() = user_id);

-- 3. STRATEGIES RLS
alter table public.strategies enable row level security;

create policy "Users can select their own strategies"
  on public.strategies for select
  using (auth.uid() = user_id);

create policy "Users can insert their own strategies"
  on public.strategies for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own strategies"
  on public.strategies for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own strategies"
  on public.strategies for delete
  using (auth.uid() = user_id);

-- 4. STRATEGY VERSIONS RLS
alter table public.strategy_versions enable row level security;

create policy "Users can select their own strategy versions"
  on public.strategy_versions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own strategy versions"
  on public.strategy_versions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own strategy versions"
  on public.strategy_versions for delete
  using (auth.uid() = user_id);

-- 5. JOURNAL ENTRIES RLS
alter table public.journal_entries enable row level security;

create policy "Users can select their own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- 6. TRADES RLS
alter table public.trades enable row level security;

create policy "Users can select their own trades"
  on public.trades for select
  using (auth.uid() = user_id);

create policy "Users can insert their own trades"
  on public.trades for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own trades"
  on public.trades for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own trades"
  on public.trades for delete
  using (auth.uid() = user_id);

