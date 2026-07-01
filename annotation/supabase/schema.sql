-- ============================================================================
-- annotation — Supabase schema
-- Run this in the Supabase Dashboard → SQL Editor (or `supabase db push`).
-- Every table is scoped to the authenticated user via `user_id` + RLS,
-- so each account only ever sees its own data.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- projects
--   columns / column_order / members / env_sets keep the same nested shape
--   the Zustand store already uses, stored as JSONB / arrays.
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name         text not null,
  description  text not null default '',
  icon         text not null default 'folder',
  color        text not null default '#8B8FD4',
  due_date     date,
  members      text[] not null default '{}',
  column_order text[] not null default '{}',
  columns      jsonb  not null default '{}'::jsonb,
  env_sets     jsonb  not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- tasks
-- ---------------------------------------------------------------------------
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id  uuid not null references public.projects (id) on delete cascade,
  column_id   text not null,
  title       text not null,
  description text not null default '',
  priority    text not null default 'medium',
  assignee    text,
  due_date    date,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists tasks_project_id_idx on public.tasks (project_id);

-- ---------------------------------------------------------------------------
-- docs (team wiki pages)
-- ---------------------------------------------------------------------------
create table if not exists public.docs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title      text not null default 'Untitled',
  content    text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- feedback (submitted from the Support page)
-- ---------------------------------------------------------------------------
create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.projects enable row level security;
alter table public.tasks    enable row level security;
alter table public.docs     enable row level security;
alter table public.feedback enable row level security;

-- projects -------------------------------------------------------------------
create policy "projects are visible to their owner"
  on public.projects for select using (auth.uid() = user_id);
create policy "projects can be inserted by their owner"
  on public.projects for insert with check (auth.uid() = user_id);
create policy "projects can be updated by their owner"
  on public.projects for update using (auth.uid() = user_id);
create policy "projects can be deleted by their owner"
  on public.projects for delete using (auth.uid() = user_id);

-- tasks ----------------------------------------------------------------------
create policy "tasks are visible to their owner"
  on public.tasks for select using (auth.uid() = user_id);
create policy "tasks can be inserted by their owner"
  on public.tasks for insert with check (auth.uid() = user_id);
create policy "tasks can be updated by their owner"
  on public.tasks for update using (auth.uid() = user_id);
create policy "tasks can be deleted by their owner"
  on public.tasks for delete using (auth.uid() = user_id);

-- docs -----------------------------------------------------------------------
create policy "docs are visible to their owner"
  on public.docs for select using (auth.uid() = user_id);
create policy "docs can be inserted by their owner"
  on public.docs for insert with check (auth.uid() = user_id);
create policy "docs can be updated by their owner"
  on public.docs for update using (auth.uid() = user_id);
create policy "docs can be deleted by their owner"
  on public.docs for delete using (auth.uid() = user_id);

-- feedback -------------------------------------------------------------------
create policy "feedback can be inserted by their owner"
  on public.feedback for insert with check (auth.uid() = user_id);
create policy "feedback is visible to their owner"
  on public.feedback for select using (auth.uid() = user_id);
