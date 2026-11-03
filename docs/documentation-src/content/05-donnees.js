"use strict";
const { Doc } = require("../kit");
const M = require("../model");

const f1 = (n) => n.toFixed(1).replace(".", ",");

module.exports = function build() {
  const v = M.volumetrie;
  const d = new Doc({
    num: "05",
    title: "Architecture des données et gestion documentaire",
    subtitle: "Modèle de données, cycles de vie, documents, vecteurs, rétention",
    short: "Architecture des données et gestion documentaire",
    date: "3 novembre 2026",
    public: "Développeurs, responsable des données, conformité",
    perimetre: "Tables, relations, règles d'accès, cycles de vie, stockage, volumétrie, rétention",
    lead: "Toutes les données de FinLens vivent dans un seul projet Supabase, sous un seul mécanisme d'isolation. Ce document décrit ce qui est stocké, où, pour combien de temps, et ce qui se passe quand on le supprime.",
  });

  /* ------------------------------------------------------------------ 1 */
  d.h1("1. Principes");
  d.ul([
    "**Une source de vérité unique.** Données métier, vecteurs, fichiers et journal d'usage sont dans le même projet Supabase (région de Francfort). Aucun second magasin à garder synchrone.",
    "**Isolation par organisation.** Chaque table métier porte `organization_id` ; des règles de sécurité au niveau des lignes (RLS) limitent toute requête aux données de l'organisation de l'utilisateur. 17 tables sur 17 sont sous RLS.",
    "**Séparer ce que l'utilisateur lit de ce que le serveur écrit.** Les tables de pilotage (`usage_logs`, `quotas_essentiel`, `velocity_alerts`, `contract_cost_tracking`) sont en lecture seule pour l'utilisateur ; elles ne sont écrites que par le serveur, avec une clé privilégiée jamais exposée au navigateur.",
    "**Tout résultat d'IA est stocké avec sa provenance** : modèle, jetons, source (document, page, extrait). Un résultat se relit sans rappeler l'IA.",
    "**Supprimer veut dire supprimer.** Les clés étrangères en cascade et la purge des fichiers rendent la suppression d'un dossier réelle, pas un simple masquage.",
  ]);

  /* ------------------------------------------------------------------ 2 */
  d.h1("2. Modèle de données");
  d.fig("d01-modele-donnees", "Schéma 1 — Les 17 tables et leurs regroupements.");
  d.p("Le modèle s'organise autour de deux entités : l'**organisation** (le client, qui porte l'offre et la facturation) et le **dossier** (une entreprise étudiée, qui porte tout le contenu).");

  /* ------------------------------------------------------------------ 3 */
  d.h1("3. Dictionnaire de données");
  d.p("Les colonnes listées sont les colonnes significatives ; toutes les tables portent un identifiant `uuid` généré et, sauf mention, une date de création.");

  d.h2("3.1 Identité et compte");
  d.table(
    ["Table", "Rôle", "Colonnes clés", "Accès utilisateur (RLS)"],
    [
      ["`organizations`", "Le client : offre, sièges, identifiants Stripe", "`name`, `offre` (essentiel, analyste, fonds), `stripe_customer_id`, `stripe_subscription_id`, `seats_included`, `data_residency` (défaut `eu-central-1`)", "Lecture et mise à jour de sa propre organisation"],
      ["`memberships`", "Lie un utilisateur à une organisation avec un rôle", "`organization_id`, `user_id` (vers `auth.users`), `role` (owner, admin, member)", "Lecture de ses appartenances ; gestion réservée"],
    ],
    [16, 22, 40, 22],
    { size: 17 }
  );
  d.p("L'identité de connexion est dans `auth.users`, géré par Supabase Auth. À l'inscription, un déclencheur (`handle_new_user`) crée l'organisation et l'appartenance de rôle `owner`. Le nom de l'organisation est tiré, dans l'ordre, de `organization_name`, `full_name`, `name`, puis du préfixe de l'e-mail.");

  d.h2("3.2 Dossiers et documents");
  d.table(
    ["Table", "Rôle", "Colonnes clés", "Particularités"],
    [
      ["`dossiers`", "Une entreprise étudiée", "`organization_id`, `owner_id`, `name`, `type_operation`, `status` (actif, archive, corbeille), `active_profil`, `personnalise_indicateurs[]`, `trashed_at`, `purge_at`, `risk_score` (non maintenu)", "`risk_score` est hérité : le score dépend du profil et se lit dans `notes_profils`"],
      ["`documents`", "Un fichier déposé", "`dossier_id`, `storage_path`, `original_name`, `mime_type`, `page_count`, `type_document`, `status`, `is_duplicate_of`, `content_hash`, `error_message`", "Déclencheur : 50 documents maximum par dossier. `type_document` est prévu, non alimenté"],
      ["`document_chunks`", "Un passage du texte, vectorisé", "`document_id`, `dossier_id`, `organization_id`, `owner_id`, `page_number`, `chunk_index`, `content`, `embedding vector(1536)`", "Index HNSW cosinus. `owner_id` passe à NULL si le compte est effacé"],
    ],
    [16, 18, 42, 24],
    { size: 17 }
  );

  d.h2("3.3 Analyse");
  d.table(
    ["Table", "Rôle", "Colonnes clés", "Particularités"],
    [
      ["`extractions`", "Résultat de l'étage 1 : une par dossier", "`dossier_id` (unique), `contenu_json`, `sources`, `model`, `tokens_in`, `tokens_out`", "`contenu_json` : six catégories d'indicateurs sourcés"],
      ["`notes_profils`", "Résultat de l'étage 2 : une par dossier et par profil", "`dossier_id`, `profil`, `contenu_json`, `risk_score`, `model`, `generated_at`", "Unique sur `(dossier_id, profil)` ; `risk_score` propre au profil"],
      ["`contradictions`", "Écart détecté entre deux passages", "`gravite` (critique, a_verifier, mineur), `description`, `source_a`, `source_b`, `status` (ouverte, arbitree), `arbitre_par`, `arbitre_at`", "Sources en JSON : document, page, extrait"],
      ["`checklist_items`", "Ligne de la checklist de due diligence", "`label`, `auto_checked`, `requires_manual_check`, `linked_contradiction_id`, `linked_document_missing`", "Pré-chargée selon `type_operation`"],
    ],
    [16, 22, 40, 22],
    { size: 17 }
  );

  d.h2("3.4 Copilote et sorties");
  d.table(
    ["Table", "Rôle", "Colonnes clés", "Particularités"],
    [
      ["`chat_messages`", "Historique des questions et réponses", "`dossier_id`, `user_id`, `role` (user, assistant), `content`, `sources`, `model`, `complexity_label`, `tokens_in`, `tokens_out`", "`user_id` passe à NULL si le compte est effacé : l'historique du dossier survit"],
      ["`ajouts_copilote`", "Réponse épinglée à la note", "`dossier_id`, `profil_cible` (NULL = tous), `categorie`, `contenu`, `sources`, `created_by`", "Lue à l'export"],
      ["`comparisons`", "Résultat d'un comparateur", "`dossier_ids[]`, `contenu_json`, `model`, `created_by`", "Référence plusieurs dossiers : pas de clé étrangère par dossier"],
      ["`exports`", "Trace d'un fichier exporté", "`dossier_id`, `format` (pdf, word), `template`, `profil`, `storage_path`, `created_by`", "Le fichier est dans le bucket `exports`"],
    ],
    [16, 22, 40, 22],
    { size: 17 }
  );

  d.h2("3.5 Pilotage, quotas et conformité");
  d.table(
    ["Table", "Rôle", "Colonnes clés", "Accès utilisateur"],
    [
      ["`usage_logs`", "Une ligne par appel d'IA", "`task_type`, `model`, `tokens_in/out`, `cache_read_tokens`, `cache_write_tokens`, `cost_usd`. `dossier_id` passe à NULL à la purge du dossier ; `user_id` n'a pas de règle de suppression", "Lecture seule"],
      ["`quotas_essentiel`", "Cycle de quotas de l'offre Essentiel", "`cycle_start`, `cycle_end`, `dossiers_analyses_count/limit`, `questions_count/limit`, `blocked`", "Lecture seule"],
      ["`velocity_alerts`", "Anomalies d'usage", "`user_id`, `metric`, `observed_value`, `baseline_value`, `status` (ouverte, revue_ok, revue_suspecte, throttled)", "Lecture seule"],
      ["`contract_cost_tracking`", "Coût réel rapporté à la facture, par cycle", "`invoiced_amount_eur`, `real_cost_usd`, `ratio` (colonne générée), `renegotiation_flagged`", "Lecture seule"],
      ["`erasure_requests`", "Trace des demandes d'effacement", "`scope`, `requested_by`, `requested_at`, `executed_at`, `perimeter_summary`", "Gérée par le serveur"],
    ],
    [18, 22, 40, 20],
    { size: 17 }
  );

  /* ------------------------------------------------------------------ 4 */
  d.h1("4. Types énumérés");
  d.table(
    ["Type", "Valeurs"],
    [
      ["`offre`", "essentiel, analyste, fonds"],
      ["`profil_analyse`", "pe_vc, ma, family_office, cfo, audit_conseil, generaliste, personnalise"],
      ["`type_operation`", "due_diligence, lbo, serie_a_b, screening, veille"],
      ["`dossier_status`", "actif, archive, corbeille"],
      ["`document_status`", "en_attente, en_cours, indexe, erreur"],
      ["`ia_model`", "fable_5, sonnet_5, haiku_4_5, opus_4_8, gemini_flash, gemini_flash_lite"],
      ["`task_type`", "extraction, reformulation_profil, chat, comparaison, classement_copilote, classification_complexite, nettoyage_pdf"],
      ["`gravite`, `contradiction_status`, `chat_role`, `velocity_alert_status`", "critique / a_verifier / mineur ; ouverte / arbitree ; user / assistant ; ouverte / revue_ok / revue_suspecte / throttled"],
    ],
    [32, 68]
  );

  /* ------------------------------------------------------------------ 5 */
  d.h1("5. Documents calculés : structure des résultats d'IA");
  d.p("Les résultats d'IA sont stockés en JSON, avec une structure typée côté application (`types/domain.ts`). Ces structures sont le véritable contrat entre le moteur d'IA et l'interface.");
  d.table(
    ["Structure", "Contenu", "Produite par"],
    [
      ["`ExtractionContenu`", "Pour chacune des six catégories, une liste d'indicateurs : `{ libelle, valeur, sources[], donnee_manquante }`", "Extraction (Fable 5)"],
      ["`NoteProfilContenu`", "`resume_court`, `score_risque` (0 à 100), `axes_risque[]` (axe, poids, commentaire), `indicateurs_cles[]` (6 au plus), `note_complete[]` (section, contenu)", "Reformulation par profil (Sonnet 5)"],
      ["`SourceCitation`", "`{ document, page, extrait }` — l'unité de traçabilité, présente partout", "Tous les traitements d'IA"],
      ["`ChatReponse`", "`reponse`, `sources[]`, `complexite` (standard ou complexe)", "Copilote"],
      ["`ComparaisonContenu`", "`lignes[]` (indicateur, valeurs par dossier, sources) et `synthese`", "Comparateur (Fable 5)"],
      ["`ContradictionDetectee`", "`gravite`, `description`, `source_a`, `source_b`", "Détection de contradictions"],
    ],
    [24, 54, 22]
  );
  d.warn("**Aucune validation de schéma n'est appliquée** à ces JSON avant écriture : la réponse du modèle est analysée (`JSON.parse`) puis stockée telle quelle. Un champ manquant ou mal typé ne sera détecté qu'à l'affichage. Une validation (par exemple avec la bibliothèque `zod`, déjà dans les dépendances) suivie d'une relance en cas d'échec ferait de ces structures un vrai contrat.");

  /* ------------------------------------------------------------------ 6 */
  d.h1("6. Gestion documentaire");
  d.h2("6.1 Formats et limites");
  d.table(
    ["Sujet", "Règle actuelle", "Écart ou action"],
    [
      ["Formats acceptés au dépôt", "PDF, Word (`.docx` et `.doc`), Excel (`.xlsx` et `.xls`)", "Word et Excel sont acceptés puis refusés à l'indexation"],
      ["Détection du type", "Type déclaré par le navigateur (`file.type`)", "À remplacer par une détection sur le contenu (signature du fichier)"],
      ["Nombre de fichiers", "50 par dossier, déclencheur en base", "Conforme"],
      ["Taille maximale", "Aucune dans le bucket ; plafond de requête de l'hébergeur", "Fixer une taille maximale ; déposer en direct vers le stockage"],
      ["Doublons", "Empreinte SHA-256 du texte extrait ; un doublon est lié (`is_duplicate_of`) et non re-vectorisé", "Conforme ; un même document en deux versions légèrement différentes n'est pas détecté"],
      ["Versions", "Aucun versionnage : remplacer un document revient à en déposer un nouveau", "À décider : lien explicite entre versions"],
      ["Classification", "Colonne `type_document` prévue, jamais alimentée", "À construire (rapport annuel, due diligence, ESG, contrat)"],
    ],
    [22, 44, 34],
    { size: 17 }
  );

  d.h2("6.2 Stockage des fichiers");
  d.table(
    ["Bucket", "Contenu", "Chemin", "Accès"],
    [
      ["`documents`", "Fichiers originaux déposés", "`organisation/dossier/uuid-nom_du_fichier`", "Privé ; lecture par le serveur ; aucune URL publique"],
      ["`exports`", "PDF et Word générés", "`organisation/dossier/uuid.pdf` ou `.docx`", "Privé ; lien signé de dix minutes"],
    ],
    [14, 26, 36, 24]
  );
  d.p("L'original est conservé tant que le dossier existe ; l'indexation le relit sans le déplacer ni le modifier. Il est supprimé avec le dossier (section 7).");

  d.h2("6.3 De la page au passage");
  d.table(
    ["Étape", "Règle"],
    [
      ["Extraction du texte", "Page par page ; une page vide est ignorée ; la numérotation est celle du PDF"],
      ["Découpage", "3 000 caractères par passage, chevauchement de 300, à l'intérieur d'une page : un passage ne traverse pas deux pages, ce qui garantit une citation de page exacte"],
      ["Vectorisation", "Un vecteur par passage (modèle `voyage-3-large`, dimension 1 536 demandée — à vérifier, document 04)"],
      ["Index", "HNSW en distance cosinus ; fonction `match_document_chunks` filtrée sur le dossier"],
      ["Recherche globale", "Fonction `search_all_dossiers`, exécutée avec les droits de l'appelant (RLS appliquée)"],
    ],
    [24, 76]
  );

  /* ------------------------------------------------------------------ 7 */
  d.h1("7. Cycles de vie");
  d.fig("d02-cycles-vie", "Schéma 2 — Cycles de vie d'un dossier et d'un document.");
  d.table(
    ["État du dossier", "Réversible", "Effet", "Libère une place"],
    [
      ["Actif", "Oui", "Visible ; compte dans le plafond (4 sur Essentiel, 15 par siège sur Analyste et Fonds)", "—"],
      ["Archivé", "Oui, à tout moment", "Masqué de la vue active ; rien n'est supprimé", "Oui"],
      ["Corbeille", "Oui, 30 jours (`purge_at`)", "Masqué ; restaurable", "Oui, immédiatement"],
      ["Purgé", "Non", "Fichiers supprimés du stockage, puis lignes supprimées en cascade ; tâche quotidienne à 03:00", "—"],
    ],
    [18, 22, 44, 16]
  );
  d.p("**Ce qui est conservé malgré la purge** : les lignes de `usage_logs`, sous leur forme agrégée (jetons, coûts, dates), sans le contenu du dossier. Elles n'identifient personne et restent nécessaires au suivi de marge et de vélocité.");

  /* ------------------------------------------------------------------ 8 */
  d.h1("8. Volumétrie");
  d.p("Estimation pour un dossier de " + v.pages + " pages, à confirmer sur des documents réels :");
  d.table(
    ["Élément", "Hypothèse", "Taille"],
    [
      ["Passages", `${v.pages} pages × 1,25 passage par page`, `${v.chunks} passages`],
      ["Une ligne de passage", "Vecteur de 1 536 valeurs sur 4 octets, texte d'environ 2,8 Ko, métadonnées", `≈ ${(v.octetsLigne / 1000).toFixed(1).replace(".", ",")} Ko`],
      ["Données", `${v.chunks} lignes`, `≈ ${f1(v.donneesMo)} Mo`],
      ["Index vectoriel", "Environ 1,25 fois la taille des vecteurs", `≈ ${f1(v.indexMo)} Mo`],
      ["**Total par dossier**", "Hors fichiers originaux et résultats d'IA (quelques centaines de Ko)", `**≈ ${f1(v.totalMo)} Mo**`],
    ],
    [26, 50, 24]
  );
  d.table(
    ["Capacité de la base", "Dossiers de 300 pages", "Observation"],
    [
      ["500 Mo (plan gratuit, limite publique à confirmer)", `≈ ${v.dossiersPour500Mo}`, "Insuffisant dès les premiers clients"],
      ["8 Go (plan payant d'entrée, à confirmer)", `≈ ${v.dossiersPour8Go}`, "Largement suffisant pour la bêta et les premiers mois"],
    ],
    [42, 22, 36]
  );
  d.small("Les fichiers originaux sont comptés à part, dans le stockage d'objets, dont les limites sont distinctes de celles de la base.");

  /* ------------------------------------------------------------------ 9 */
  d.h1("9. Rétention");
  d.table(
    ["Donnée", "Durée de conservation", "Fin de vie"],
    [
      ["Compte et organisation", "Durée de la relation commerciale", "Suppression à la demande (voir écart ci-dessous)"],
      ["Dossier actif ou archivé", "Tant que le client le conserve", "Corbeille puis purge"],
      ["Dossier en corbeille", "30 jours", "Purge automatique quotidienne"],
      ["Fichiers originaux, passages, extraction, notes, chat, contradictions", "Avec le dossier", "Suppression en cascade et purge du stockage"],
      ["Exports générés", "Avec le dossier", "Purge avec le dossier"],
      ["Journal d'usage IA", "Agrégé, conservé après suppression du dossier", "À fixer (proposition : 24 mois)"],
      ["Demandes d'effacement", "Trace minimale", "À fixer (proposition : durée de prescription applicable)"],
      ["Sauvegardes", "Selon le plan de l'hébergeur", "Ne s'effacent pas rétroactivement : rétention courte à définir"],
      ["Journaux d'exécution n8n", "À configurer", "Purge après rétention courte"],
    ],
    [34, 30, 36]
  );
  d.alert([
    "**Deux écarts sur l'effacement d'un compte** (analyse du schéma, à confirmer par un essai sur une branche de test).",
    "**1. La suppression de l'utilisateur échoue.** Cinq clés étrangères vers `auth.users` n'ont aucune règle de suppression (`NO ACTION`) : `erasure_requests.requested_by`, `usage_logs.user_id`, `velocity_alerts.user_id`, `velocity_alerts.reviewed_by` et `contradictions.arbitre_par`. La route d'effacement insère d'abord une ligne dans `erasure_requests` au nom de l'utilisateur, puis supprime l'utilisateur : la base refuse tant que cette ligne existe. Le libre-service d'effacement ne peut donc pas aboutir en l'état.",
    "**2. Même corrigé, il laisse le contenu.** La route supprime l'utilisateur et ses appartenances, et détache les références personnelles (`owner_id`, `user_id`, `created_by` passent à NULL), mais ne supprime ni l'organisation, ni ses dossiers, ni ses fichiers du stockage, ni ses passages. Pour une organisation à un seul membre (Essentiel, Analyste), le contenu confidentiel reste en base et dans le stockage.",
    "**Correctifs** : passer ces cinq clés en `SET NULL` ; supprimer l'organisation et tout son contenu lorsque le dernier membre part, en réutilisant la purge des dossiers. Voir le document 06.",
  ]);

  /* ------------------------------------------------------------------ 10 */
  d.h1("10. Gouvernance des données");
  d.table(
    ["Sujet", "Règle proposée"],
    [
      ["Migrations", "Un fichier = une version appliquée, au même nom ; jamais de modification directe en production sans fichier ; essai sur une branche Supabase"],
      ["Types", "Régénérés depuis le schéma à chaque migration"],
      ["Nouvelles tables", "Toujours : `organization_id`, RLS activée dès la création, clés étrangères avec règle de suppression explicite, index sur les clés étrangères"],
      ["Données de démonstration", "Séparées des données réelles : extraites du prototype par script, stockées en fichiers JSON dans le code, jamais dans la base de production"],
      ["Accès privilégié", "La clé `service_role` n'existe que côté serveur ; un rôle dédié et restreint pour le worker"],
      ["Qualité", "Validation de schéma des JSON d'IA ; citation vérifiée avant stockage (document 08)"],
      ["Traçabilité", "Journal d'usage sans contenu ; extension d'audit à étudier"],
    ],
    [24, 76]
  );

  /* ------------------------------------------------------------------ 11 */
  d.h1("11. Évolutions du modèle");
  d.table(
    ["Évolution", "Pourquoi", "Impact"],
    [
      ["Table `jobs`", "File d'analyse et d'ingestion (document 04)", "Nouvelle table, RLS en lecture pour l'utilisateur"],
      ["Index plein texte en français", "Recherche hybride (document 08)", "Index GIN et extensions `unaccent` et `pg_trgm`"],
      ["Table d'invitations", "Inviter des membres d'une équipe Fonds", "Nouvelle table liée à `organizations`"],
      ["Journal d'audit", "Accès et exports sensibles tracés", "Extension `pgaudit` ou table dédiée"],
      ["Versionnage des documents", "Remplacer une version sans perdre l'historique", "Colonne de lien entre versions"],
      ["Exploitation de `data_residency`", "Aujourd'hui informative", "À utiliser si plusieurs régions deviennent proposées"],
      ["Suppression de `dossiers.risk_score`", "Colonne héritée non maintenue", "Migration de nettoyage"],
    ],
    [30, 40, 30]
  );

  return d;
};
