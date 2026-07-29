-- Le plan Vercel Hobby limite les cron jobs a une execution par jour : la
-- fenetre d'observation passe de 1h a 24h pour rester coherente avec cette
-- cadence forcee. Le vrai garde-fou contre les rafales (schema non-humain,
-- section G) est desormais un throttling synchrone dans /api/copilote/chat,
-- independant de ce cron.
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
    where created_at > now() - interval '24 hours'
    group by organization_id, owner_id
  ),
  dossiers_baseline as (
    select organization_id, owner_id as user_id, count(*)::numeric / 7.0 as baseline
    from public.dossiers
    where created_at > now() - interval '7 days'
    group by organization_id, owner_id
  ),
  questions_recent as (
    select organization_id, user_id, count(*)::numeric as observed
    from public.chat_messages
    where role = 'user' and created_at > now() - interval '24 hours'
    group by organization_id, user_id
  ),
  questions_baseline as (
    select organization_id, user_id, count(*)::numeric / 7.0 as baseline
    from public.chat_messages
    where role = 'user' and created_at > now() - interval '7 days'
    group by organization_id, user_id
  )
  select
    r.organization_id, r.user_id, 'dossiers_par_jour'::text,
    r.observed, coalesce(b.baseline, 0),
    false
  from dossiers_recent r
  left join dossiers_baseline b using (organization_id, user_id)
  where r.observed > greatest(coalesce(b.baseline, 0) * 5, 15)

  union all

  select
    r.organization_id, r.user_id, 'questions_par_jour'::text,
    r.observed, coalesce(b.baseline, 0),
    false
  from questions_recent r
  left join questions_baseline b using (organization_id, user_id)
  where r.observed > greatest(coalesce(b.baseline, 0) * 5, 150);
$$;

revoke execute on function public.detect_velocity_anomalies() from anon, authenticated;
