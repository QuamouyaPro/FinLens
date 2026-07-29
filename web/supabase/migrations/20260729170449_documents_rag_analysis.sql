create type public.document_status as enum ('en_attente', 'en_cours', 'indexe', 'erreur');

-- Documents deposes dans un dossier (jusqu'a 50 par dossier, cf. note explicative section 7)
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  storage_path text not null,
  original_name text not null,
  mime_type text,
  page_count int,
  type_document text, -- rapport annuel, due-diligence, ESG, contrat...
  status public.document_status not null default 'en_attente',
  is_duplicate_of uuid references public.documents(id),
  error_message text,
  created_at timestamptz not null default now()
);

create index documents_dossier_idx on public.documents (dossier_id);

alter table public.dossiers add constraint dossiers_max_documents
  check (true); -- limite de 50 documents appliquee cote applicatif (trigger ci-dessous)

create or replace function public.enforce_max_documents_per_dossier()
returns trigger
language plpgsql
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

create trigger documents_enforce_max
  before insert on public.documents
  for each row execute function public.enforce_max_documents_per_dossier();

-- Chunks vectorises pour le RAG (remplace Qdrant, absent de l'infra accessible)
-- Tag owner_id ET dossier_id sur chaque point : urgence identifiee en Note d'Architecture section H/F
-- (droit a l'effacement + suppression dossier par dossier)
create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  owner_id uuid not null references auth.users(id),
  page_number int,
  chunk_index int not null,
  content text not null,
  embedding extensions.vector(1536),
  created_at timestamptz not null default now()
);

create index document_chunks_dossier_idx on public.document_chunks (dossier_id);
create index document_chunks_embedding_idx on public.document_chunks
  using hnsw (embedding extensions.vector_cosine_ops);

-- Etage 1 : extraction exhaustive Fable 5, une fois par dossier, 6 categories taguees
create table public.extractions (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null unique references public.dossiers(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  contenu_json jsonb not null,
  sources jsonb not null default '[]',
  model public.ia_model not null default 'fable_5',
  tokens_in int,
  tokens_out int,
  created_at timestamptz not null default now()
);

-- Etage 2 : reformulation par profil, Sonnet 5, jusqu'a 6 par dossier
create table public.notes_profils (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profil public.profil_analyse not null,
  contenu_json jsonb not null,
  risk_score int,
  model public.ia_model not null default 'sonnet_5',
  tokens_in int,
  tokens_out int,
  generated_at timestamptz not null default now(),
  unique (dossier_id, profil)
);

-- Ajouts epingles depuis le Copilote (Module Copilote -> Ajout a la note)
create table public.ajouts_copilote (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profil_cible public.profil_analyse, -- null = s'applique a tous les profils
  categorie text not null,
  contenu text not null,
  sources jsonb not null default '[]',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
