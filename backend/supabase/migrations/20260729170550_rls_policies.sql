-- Helper : l'utilisateur courant est-il membre de cette organisation ?
create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = org_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.current_org_role(org_id uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.memberships
  where organization_id = org_id and user_id = auth.uid()
  limit 1;
$$;

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.dossiers enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.extractions enable row level security;
alter table public.notes_profils enable row level security;
alter table public.ajouts_copilote enable row level security;
alter table public.chat_messages enable row level security;
alter table public.contradictions enable row level security;
alter table public.checklist_items enable row level security;
alter table public.comparisons enable row level security;
alter table public.exports enable row level security;
alter table public.usage_logs enable row level security;
alter table public.quotas_essentiel enable row level security;
alter table public.velocity_alerts enable row level security;
alter table public.contract_cost_tracking enable row level security;
alter table public.erasure_requests enable row level security;

create policy organizations_select on public.organizations
  for select using (public.is_org_member(id));
create policy organizations_update on public.organizations
  for update using (public.current_org_role(id) in ('owner', 'admin'));

create policy memberships_select on public.memberships
  for select using (public.is_org_member(organization_id));
create policy memberships_write on public.memberships
  for all using (public.current_org_role(organization_id) in ('owner', 'admin'));

create policy dossiers_rw on public.dossiers
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy documents_rw on public.documents
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy document_chunks_rw on public.document_chunks
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy extractions_rw on public.extractions
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy notes_profils_rw on public.notes_profils
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy ajouts_copilote_rw on public.ajouts_copilote
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy chat_messages_rw on public.chat_messages
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy contradictions_rw on public.contradictions
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy checklist_items_rw on public.checklist_items
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy comparisons_rw on public.comparisons
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy exports_rw on public.exports
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

-- usage_logs / quotas / velocity / contract cost / erasure : lecture seule cote client,
-- ecriture reservee au backend (service_role, qui bypass RLS nativement)
create policy usage_logs_select on public.usage_logs
  for select using (public.is_org_member(organization_id));

create policy quotas_essentiel_select on public.quotas_essentiel
  for select using (public.is_org_member(organization_id));

create policy velocity_alerts_select on public.velocity_alerts
  for select using (public.current_org_role(organization_id) in ('owner', 'admin'));

create policy contract_cost_tracking_select on public.contract_cost_tracking
  for select using (public.current_org_role(organization_id) in ('owner', 'admin'));

create policy erasure_requests_rw on public.erasure_requests
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));
