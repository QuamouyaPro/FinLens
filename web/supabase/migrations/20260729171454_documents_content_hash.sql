alter table public.documents add column content_hash text;
create index documents_content_hash_idx on public.documents (dossier_id, content_hash);
