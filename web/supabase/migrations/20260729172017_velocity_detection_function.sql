-- Détection de vélocité anormale (Note d'Architecture, section G) : compare, par
-- utilisateur, le rythme de création de dossiers et de questions sur la dernière
-- heure à la moyenne par utilisateur de l'organisation sur les 7 derniers jours.
create or replace function public.detect_velocity_anomalies()
returns table (
  organization_id uuid,
  user_id uuid,
  metric text,
  observed_value numeric,
  baseline_value numeric,
  is_burst boolean
)
language sql
stable
security definer
set search_path = public
as $$
  with dossiers_recent as (
    select organization_id, owner_id as user_id, count(*)::numeric as observed
    from public.dossiers
    where created_at > now() - interval '1 hour'
    group by organization_id, owner_id
  ),
  dossiers_baseline as (
    select organization_id, owner_id as user_id, count(*)::numeric / (7.0 * 24) as baseline
    from public.dossiers
    where created_at > now() - interval '7 days'
    group by organization_id, owner_id
  ),
  questions_recent as (
    select organization_id, user_id, count(*)::numeric as observed
    from public.chat_messages
    where role = 'user' and created_at > now() - interval '1 hour'
    group by organization_id, user_id
  ),
  questions_baseline as (
    select organization_id, user_id, count(*)::numeric / (7.0 * 24) as baseline
    from public.chat_messages
    where role = 'user' and created_at > now() - interval '7 days'
    group by organization_id, user_id
  ),
  questions_burst as (
    select organization_id, user_id, count(*)::numeric as burst_count
    from public.chat_messages
    where role = 'user' and created_at > now() - interval '60 seconds'
    group by organization_id, user_id
  )
  select
    r.organization_id, r.user_id, 'dossiers_par_heure'::text,
    r.observed, coalesce(b.baseline, 0),
    false
  from dossiers_recent r
  left join dossiers_baseline b using (organization_id, user_id)
  where r.observed > greatest(coalesce(b.baseline, 0) * 5, 10)

  union all

  select
    r.organization_id, r.user_id, 'questions_par_heure'::text,
    r.observed, coalesce(b.baseline, 0),
    coalesce(burst.burst_count, 0) > 15
  from questions_recent r
  left join questions_baseline b using (organization_id, user_id)
  left join questions_burst burst using (organization_id, user_id)
  where r.observed > greatest(coalesce(b.baseline, 0) * 5, 30)
     or coalesce(burst.burst_count, 0) > 15;
$$;

revoke execute on function public.detect_velocity_anomalies() from anon, authenticated;
