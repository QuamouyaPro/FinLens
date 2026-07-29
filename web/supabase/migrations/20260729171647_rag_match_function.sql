create or replace function public.match_document_chunks(
  p_dossier_id uuid,
  p_query_embedding extensions.vector(1536),
  p_match_count int default 8
)
returns table (
  id uuid,
  document_id uuid,
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
    dc.document_id,
    dc.page_number,
    dc.content,
    1 - (dc.embedding <=> p_query_embedding) as similarity
  from public.document_chunks dc
  where dc.dossier_id = p_dossier_id
    and public.is_org_member(dc.organization_id)
  order by dc.embedding <=> p_query_embedding
  limit p_match_count;
$$;

revoke execute on function public.match_document_chunks(uuid, extensions.vector, int) from anon;
