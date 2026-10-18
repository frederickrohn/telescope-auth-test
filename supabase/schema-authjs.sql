-- Auth.js variant only. Run once in the Supabase SQL editor (dev project).
-- Auth.js users aren't in auth.users, so rows are keyed by GitHub user id. RLS is on with no policies:
-- only the server-side secret key can touch this table; the app filters by github_id itself.
create table if not exists public.authjs_notes (
  id uuid primary key default gen_random_uuid(),
  github_id text not null,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists authjs_notes_github_id on public.authjs_notes (github_id);
alter table public.authjs_notes enable row level security;
