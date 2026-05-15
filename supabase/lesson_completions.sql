-- Run in Supabase SQL editor if lesson_completions is missing.
-- Tracks completion for static lesson IDs (e.g. py-getting-started, dj-intro).

create table if not exists public.lesson_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  time_spent_seconds integer,
  unique (user_id, lesson_id)
);

create index if not exists lesson_completions_user_id_idx on public.lesson_completions (user_id);

alter table public.lesson_completions enable row level security;

create policy "Users read own completions"
  on public.lesson_completions for select
  using (auth.uid() = user_id);

create policy "Users insert own completions"
  on public.lesson_completions for insert
  with check (auth.uid() = user_id);

create policy "Users update own completions"
  on public.lesson_completions for update
  using (auth.uid() = user_id);
