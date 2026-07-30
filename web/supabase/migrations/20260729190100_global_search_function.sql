-- Recherche globale (Note de fonctionnement, section 12) : une seule question
-- posee simultanement a tous les dossiers actifs de l'utilisateur. Recherche
-- vectorielle sur l'ensemble des dossiers de l'organisation, avec le dossier
-- d'origine et la page exacte pour chaque resultat.
create or replace function public.search_all_dossiers(
  p_query_embedding extensions.vector(1536),
  p_match_count int default 12
)
returns table (
  chunk_id uuid,
  dossier_id uuid,
  dossier_name text,
  document_id uuid,
  document_name text,
  page_number int,
  content text,
  similarity float
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    dc.id,
    d.id,
    d.name,
    doc.id,
    doc.original_name,
    dc.page_number,
    dc.content,
    1 - (dc.embedding <=> p_query_embedding) as similarity
  from public.document_chunks dc
  join public.dossiers d on d.id = dc.dossier_id
  join public.documents doc on doc.id = dc.document_id
  where d.status = 'actif'
    and public.is_org_member(dc.organization_id)
  order by dc.embedding <=> p_query_embedding
  limit p_match_count;
$$;

revoke execute on function public.search_all_dossiers(extensions.vector, int) from anon;
