insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('exports', 'exports', false)
on conflict (id) do nothing;

-- Convention de chemin : {organization_id}/{dossier_id}/{filename}
-- Le premier segment du chemin doit correspondre a une organisation dont l'utilisateur est membre
create policy documents_bucket_rw on storage.objects
  for all using (
    bucket_id = 'documents'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  )
  with check (
    bucket_id = 'documents'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );

create policy exports_bucket_rw on storage.objects
  for all using (
    bucket_id = 'exports'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  )
  with check (
    bucket_id = 'exports'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );
