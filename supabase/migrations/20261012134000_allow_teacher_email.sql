create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'hermapenebab@gmail.com'
    or exists (
      select 1
      from public.teachers
      where user_id = (select auth.uid())
    )
$$;

revoke all on function public.is_teacher() from public;
grant execute on function public.is_teacher() to authenticated;
