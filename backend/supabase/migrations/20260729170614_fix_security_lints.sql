create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.enforce_max_documents_per_dossier()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  doc_count int;
begin
  select count(*) into doc_count from public.documents where dossier_id = new.dossier_id;
  if doc_count >= 50 then
    raise exception 'Un dossier ne peut pas depasser 50 documents';
  end if;
  return new;
end;
$$;

revoke execute on function public.is_org_member(uuid) from anon;
revoke execute on function public.current_org_role(uuid) from anon;
