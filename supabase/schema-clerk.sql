-- Clerk variant only. Run once in the Supabase SQL editor (dev project).
-- Rows are keyed by Clerk's user id (user_...). RLS on with no policies: only the server-side secret key can
-- touch this table; the app filters by user_id itself.
create table if not exists public.clerk_notes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clerk_notes_user_id on public.clerk_notes (user_id);
alter table public.clerk_notes enable row level security;
