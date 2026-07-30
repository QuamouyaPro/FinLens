-- Sans cela, un utilisateur qui vient de s'inscrire n'appartient a aucune
-- organisation : requireAuthContext renvoie 403 et l'app est inutilisable.
-- Chaque inscription cree donc son organisation (offre essentiel par defaut,
-- role owner). Les offres Fonds ajoutent ensuite des membres a une org existante.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  org_name text;
begin
  org_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'organization_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    split_part(new.email, '@', 1)
  );

  insert into public.organizations (name, offre, seats_included)
  values (org_name, 'essentiel', 1)
  returning id into new_org_id;

  insert into public.memberships (organization_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
