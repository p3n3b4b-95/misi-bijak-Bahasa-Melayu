create table if not exists public.classes (
  id bigint generated always as identity primary key,
  name text not null check (char_length(trim(name)) between 1 and 30),
  created_at timestamptz not null default now()
);

create unique index if not exists classes_name_unique_idx on public.classes (lower(name));

alter table public.classes enable row level security;

grant select on public.classes to anon, authenticated;
grant insert on public.classes to authenticated;
grant usage, select on sequence public.classes_id_seq to authenticated;

create policy "anyone can list classes" on public.classes
for select to anon, authenticated using (true);

create policy "teachers can add classes" on public.classes
for insert to authenticated with check ((select public.is_teacher()));
