do $$
declare
  teacher_id uuid;
begin
  select id into teacher_id
  from auth.users
  where lower(email) = 'hermapenebab@gmail.com'
  limit 1;

  if teacher_id is null then
    raise exception 'Teacher account hermapenebab@gmail.com was not found in Auth users';
  end if;

  insert into public.teachers (user_id)
  values (teacher_id)
  on conflict (user_id) do nothing;
end $$;
