-- Droit à l'effacement (Note d'Architecture, section H) : la suppression d'un
-- compte utilisateur ne doit pas être bloquée par les FK ni supprimer les
-- dossiers d'une organisation partagée -- on détache la référence personnelle
-- (SET NULL) tout en conservant l'enregistrement métier.
alter table public.dossiers alter column owner_id drop not null;
alter table public.dossiers drop constraint dossiers_owner_id_fkey;
alter table public.dossiers add constraint dossiers_owner_id_fkey
  foreign key (owner_id) references auth.users(id) on delete set null;

alter table public.chat_messages alter column user_id drop not null;
alter table public.chat_messages drop constraint chat_messages_user_id_fkey;
alter table public.chat_messages add constraint chat_messages_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete set null;

alter table public.ajouts_copilote alter column created_by drop not null;
alter table public.ajouts_copilote drop constraint ajouts_copilote_created_by_fkey;
alter table public.ajouts_copilote add constraint ajouts_copilote_created_by_fkey
  foreign key (created_by) references auth.users(id) on delete set null;

alter table public.comparisons alter column created_by drop not null;
alter table public.comparisons drop constraint comparisons_created_by_fkey;
alter table public.comparisons add constraint comparisons_created_by_fkey
  foreign key (created_by) references auth.users(id) on delete set null;

alter table public.exports alter column created_by drop not null;
alter table public.exports drop constraint exports_created_by_fkey;
alter table public.exports add constraint exports_created_by_fkey
  foreign key (created_by) references auth.users(id) on delete set null;

alter table public.document_chunks alter column owner_id drop not null;
alter table public.document_chunks drop constraint document_chunks_owner_id_fkey;
alter table public.document_chunks add constraint document_chunks_owner_id_fkey
  foreign key (owner_id) references auth.users(id) on delete set null;
