create type public.chat_role as enum ('user', 'assistant');
create type public.gravite as enum ('critique', 'a_verifier', 'mineur');
create type public.contradiction_status as enum ('ouverte', 'arbitree');

-- Copilote : chat sourcé (Module 3)
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  role public.chat_role not null,
  content text not null,
  sources jsonb not null default '[]',
  model public.ia_model,
  complexity_label text, -- 'standard' | 'complexe', pose par le classifieur Haiku 4.5
  tokens_in int,
  tokens_out int,
  created_at timestamptz not null default now()
);

create index chat_messages_dossier_idx on public.chat_messages (dossier_id, created_at);

-- Controles : contradictions detectees entre documents d'un meme dossier (Module Controles)
create table public.contradictions (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  gravite public.gravite not null,
  description text not null,
  source_a jsonb not null,
  source_b jsonb not null,
  status public.contradiction_status not null default 'ouverte',
  arbitre_par uuid references auth.users(id),
  arbitre_at timestamptz,
  created_at timestamptz not null default now()
);

-- Checklist de due diligence, pre-chargee selon le type d'operation du dossier
create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  label text not null,
  auto_checked boolean not null default false,
  requires_manual_check boolean not null default false,
  linked_contradiction_id uuid references public.contradictions(id),
  linked_document_missing text,
  created_at timestamptz not null default now()
);

-- Comparateur de dossiers (Module 4, reserve Analyste/Fonds)
create table public.comparisons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  dossier_ids uuid[] not null,
  created_by uuid not null references auth.users(id),
  contenu_json jsonb not null,
  model public.ia_model not null default 'fable_5',
  tokens_in int,
  tokens_out int,
  created_at timestamptz not null default now()
);

-- Exports (Module 5)
create table public.exports (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  format text not null check (format in ('pdf', 'word')),
  template text not null default 'note_investissement',
  profil public.profil_analyse not null,
  storage_path text,
  created_at timestamptz not null default now()
);
