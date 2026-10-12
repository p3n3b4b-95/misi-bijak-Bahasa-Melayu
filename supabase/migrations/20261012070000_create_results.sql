create table if not exists public.teachers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.results (
  id bigint generated always as identity primary key,
  attempt_id text not null unique,
  student_name text not null check (char_length(student_name) between 1 and 30),
  class_name text not null check (char_length(class_name) between 1 and 30),
  mission_id text not null check (mission_id in ('vokal','kv','kvk','padan','susun','ayat')),
  score smallint not null check (score between 0 and 100),
  total smallint not null check (total between 1 and 100 and score <= total),
  stars smallint not null check (stars between 0 and 3),
  created_at timestamptz not null default now()
);

create index if not exists results_class_name_idx on public.results (class_name);
create index if not exists results_student_name_idx on public.results (student_name);
create index if not exists results_created_at_idx on public.results (created_at desc);

alter table public.teachers enable row level security;
alter table public.results enable row level security;

grant select on public.teachers to authenticated;
grant insert on public.results to anon, authenticated;
grant select on public.results to authenticated;

create policy "teacher can see own membership" on public.teachers
for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$ select exists (select 1 from public.teachers where user_id = (select auth.uid())) $$;

revoke all on function public.is_teacher() from public;
grant execute on function public.is_teacher() to authenticated;

create policy "students can submit results" on public.results
for insert to anon, authenticated with check (true);

create policy "teachers can read results" on public.results
for select to authenticated using ((select public.is_teacher()));
