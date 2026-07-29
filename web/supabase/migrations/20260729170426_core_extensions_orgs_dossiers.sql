-- Extensions
create extension if not exists vector with schema extensions;
create extension if not exists pg_cron;
create extension if not exists pgcrypto with schema extensions;

-- Enums
create type public.offre as enum ('essentiel', 'analyste', 'fonds');
create type public.dossier_status as enum ('actif', 'archive', 'corbeille');
create type public.profil_analyse as enum (
  'pe_vc', 'ma', 'family_office', 'cfo', 'audit_conseil', 'generaliste', 'personnalise'
);
create type public.ia_model as enum (
  'fable_5', 'sonnet_5', 'haiku_4_5', 'opus_4_8', 'gemini_flash', 'gemini_flash_lite'
);
create type public.type_operation as enum (
  'due_diligence', 'lbo', 'serie_a_b', 'screening', 'veille'
);

-- Organizations (compte facturé : 1 org = 1 abonnement, n sieges sur l'offre Fonds)
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  offre public.offre not null default 'essentiel',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  seats_included int not null default 1,
  data_residency text not null default 'eu-central-1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Memberships (un siege = une personne, un compte nomme)
create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- Dossiers (un dossier = une entreprise etudiee)
create table public.dossiers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  owner_id uuid not null references auth.users(id),
  name text not null,
  type_operation public.type_operation not null default 'screening',
  status public.dossier_status not null default 'actif',
  risk_score int,
  active_profil public.profil_analyse not null default 'generaliste',
  personnalise_indicateurs text[] not null default '{}',
  trashed_at timestamptz,
  purge_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index dossiers_org_status_idx on public.dossiers (organization_id, status);
create index dossiers_purge_idx on public.dossiers (purge_at) where status = 'corbeille';

-- Trigger generique updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

create trigger dossiers_set_updated_at
  before update on public.dossiers
  for each row execute function public.set_updated_at();
