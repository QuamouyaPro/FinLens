-- Ces fonctions ne doivent jamais etre appelables via /rest/v1/rpc :
-- handle_new_user est reservee au trigger on_auth_user_created, et
-- search_all_dossiers doit exiger une session (RLS via is_org_member).
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.detect_velocity_anomalies() from anon, authenticated;
revoke execute on function public.search_all_dossiers(extensions.vector, int) from anon;
revoke execute on function public.is_org_member(uuid) from anon;
revoke execute on function public.current_org_role(uuid) from anon;
