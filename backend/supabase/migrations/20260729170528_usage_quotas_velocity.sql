create type public.task_type as enum (
  'extraction', 'reformulation_profil', 'chat', 'comparaison',
  'classement_copilote', 'classification_complexite', 'nettoyage_pdf'
);

-- Journal de tous les appels IA : cout reel, marge, monitoring de velocite (jamais pour facturer un depassement
-- sur Analyste/Fonds -- Note d'Architecture section 1 et G)
create table public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id),
  dossier_id uuid references public.dossiers(id) on delete set null,
  task_type public.task_type not null,
  model public.ia_model not null,
  tokens_in int not null default 0,
  tokens_out int not null default 0,
  cache_read_tokens int not null default 0,
  cache_write_tokens int not null default 0,
  cost_usd numeric(10,4) not null default 0,
  created_at timestamptz not null default now()
);

create index usage_logs_org_created_idx on public.usage_logs (organization_id, created_at);
create index usage_logs_user_created_idx on public.usage_logs (user_id, created_at);

-- Quotas mensuels fermes, offre Essentiel uniquement (section 10 Note explicative, section 9 Couts & Pricing)
create table public.quotas_essentiel (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  cycle_start timestamptz not null,
  cycle_end timestamptz not null,
  dossiers_analyses_count int not null default 0,
  questions_count int not null default 0,
  dossiers_analyses_limit int not null default 3,
  questions_limit int not null default 100,
  blocked boolean not null default false,
  created_at timestamptz not null default now(),
  unique (organization_id, cycle_start)
);

-- Detection de velocite anormale (Note d'Architecture section G)
create type public.velocity_alert_status as enum ('ouverte', 'revue_ok', 'revue_suspecte', 'throttled');

create table public.velocity_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id),
  metric text not null, -- 'dossiers_par_heure', 'questions_par_minute', ...
  observed_value numeric not null,
  baseline_value numeric not null,
  status public.velocity_alert_status not null default 'ouverte',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Suivi du cout reel cumule par contrat, gros comptes Fonds (Couts & Pricing section 9)
create table public.contract_cost_tracking (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  cycle_start timestamptz not null,
  cycle_end timestamptz not null,
  invoiced_amount_eur numeric(10,2) not null,
  real_cost_usd numeric(10,2) not null default 0,
  ratio numeric(6,4) generated always as (
    case when invoiced_amount_eur = 0 then 0 else real_cost_usd / invoiced_amount_eur end
  ) stored,
  renegotiation_flagged boolean not null default false,
  created_at timestamptz not null default now(),
  unique (organization_id, cycle_start)
);

-- Droit a l'effacement : trace de conformite minimale (Note d'Architecture section H)
create table public.erasure_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  requested_by uuid references auth.users(id),
  scope text not null, -- 'compte', 'organisation'
  requested_at timestamptz not null default now(),
  executed_at timestamptz,
  perimeter_summary text
);
