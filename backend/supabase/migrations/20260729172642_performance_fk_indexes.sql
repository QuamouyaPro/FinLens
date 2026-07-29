create index ajouts_copilote_dossier_idx on public.ajouts_copilote (dossier_id);
create index checklist_items_dossier_idx on public.checklist_items (dossier_id);
create index contradictions_dossier_idx on public.contradictions (dossier_id);
create index comparisons_org_idx on public.comparisons (organization_id);
create index exports_dossier_idx on public.exports (dossier_id);
create index documents_org_idx on public.documents (organization_id);
create index notes_profils_dossier_idx on public.notes_profils (dossier_id);
create index memberships_user_idx on public.memberships (user_id);
