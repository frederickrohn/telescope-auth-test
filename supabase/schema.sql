-- Run once in the Supabase SQL editor (dev project only).
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notes enable row level security;

drop policy if exists "read own notes" on public.notes;
drop policy if exists "insert own notes" on public.notes;
drop policy if exists "update own notes" on public.notes;
drop policy if exists "delete own notes" on public.notes;

create policy "read own notes" on public.notes for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own notes" on public.notes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own notes" on public.notes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own notes" on public.notes for delete to authenticated using ((select auth.uid()) = user_id);
