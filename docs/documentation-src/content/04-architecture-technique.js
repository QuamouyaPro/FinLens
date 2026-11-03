"use strict";
const { Doc } = require("../kit");
const M = require("../model");

module.exports = function build() {
  const d = new Doc({
    num: "04",
    title: "Architecture technique et infrastructure",
    subtitle: "Composants, flux, traitement asynchrone, déploiement et exploitation",
    short: "Architecture technique et infrastructure",
    date: "3 novembre 2026",
    public: "Développeurs, exploitant, architecte",
    perimetre: "Architecture réelle observée dans le code et l'infrastructure, et architecture cible proposée",
    lead: "Ce document remplace la Note d'Architecture initiale. Il distingue partout ce qui existe de ce qui est proposé, parce que l'écart entre les deux est la principale information utile.",
  });

  /* ------------------------------------------------------------------ 1 */
  d.h1("1. Synthèse");
  d.p("L'application est un projet Next.js unique, déployé sur Vercel, adossé à un projet Supabase en région de Francfort. Toute la logique d'analyse (extraction, profils, contradictions, Copilote, exports) y est écrite et fonctionne dans des routes d'API web. Le serveur Hostinger prévu par la note initiale (n8n, Qdrant, Coolify) n'a jamais été utilisé : aucun service n'y tourne.");
  d.callout([
    "**Principe directeur de la cible.** Vercel ne garde que ce qui répond en quelques secondes. Tout ce qui est long ou lourd descend sur le VPS. Supabase reste la seule source de vérité.",
    "Ce principe n'est pas une préférence : analyser 300 pages avec un modèle de raisonnement prend des minutes, et aucun hébergeur de fonctions web n'est conçu pour attendre ce temps-là.",
  ]);
  d.alert([
    "**Trois défauts empêchent aujourd'hui l'analyse d'un dossier de taille réelle**, indépendamment de toute clé d'API : (1) l'analyse entière s'exécute dans une seule requête web, (2) la vectorisation envoie tous les passages d'un document en un seul appel, (3) le dépôt d'un fichier transite par une fonction web dont la taille de requête est plafonnée par l'hébergeur. Ils sont détaillés en section 2.2 et corrigés par les lots 0 et 1 du cahier des charges.",
  ]);

  /* ------------------------------------------------------------------ 2 */
  d.h1("2. État des lieux");
  d.h2("2.1 Écart entre la note initiale et la réalité");
  d.table(
    ["Composant", "Prévu dans la note initiale", "Réellement déployé"],
    [
      ["Interface", "Vercel (Next.js)", "Conforme"],
      ["Authentification, base de données", "Supabase", "Conforme — projet `finlens`, Postgres 17, région eu-central-1, 17 tables sous RLS"],
      ["Moteur d'IA", "API Anthropic : Fable 5, Sonnet 5, Haiku 4.5", "Conforme et routage implémenté ; **clés non configurées**"],
      ["Paiement", "Stripe", "Conforme (clés Stripe présentes sur Vercel)"],
      ["Orchestration", "n8n sur le VPS", "**Routes d'API Next.js synchrones**"],
      ["Base vectorielle", "Qdrant auto-hébergé", "**pgvector** dans Supabase, index HNSW"],
      ["Serveur de traitement", "Hostinger KVM 2 et Coolify", "**Inexistant** : rien n'y tourne"],
      ["Embeddings", "Non spécifié", "Voyage AI (`voyage-3-large`) ; **clé non configurée**"],
      ["Intégration continue", "Non spécifiée", "**Aucune** : pas de contrôle automatique avant déploiement"],
    ],
    [24, 34, 42]
  );
  d.h2("2.2 Défauts relevés");
  d.table(
    ["Gravité", "Défaut", "Conséquence"],
    [
      ["Bloquant", "**Analyse entièrement synchrone** : extraction, six reformulations enchaînées, contradictions et checklist dans une seule requête (`api/dossiers/[id]/analyser`)", "Dix à vingt minutes estimées sur 300 pages, au-delà de la durée d'une fonction web. Pas de reprise, pas de progression, pas de verrou contre le double clic"],
      ["Bloquant", "**Corpus envoyé deux fois au modèle premium** : l'extraction et la détection de contradictions reçoivent chacune le corpus intégral", "Le poste de coût dominant est payé deux fois (≈ 3,10 $ de trop par dossier, document 07)"],
      ["Bloquant", "**Vectorisation non découpée en lots** (`lib/ai/embeddings.ts`)", "Un PDF de 300 pages produit plusieurs centaines de passages envoyés en une seule requête : dépassement des limites du fournisseur"],
      ["Bloquant", "**Dépôt de fichier via une fonction web** (`api/documents/upload`)", "Une requête vers une fonction est plafonnée en taille par l'hébergeur (4,5 Mo selon la documentation publique, à confirmer sur le plan actuel) : un PDF de plusieurs dizaines de pages risque d'être refusé"],
      ["À vérifier", "**Dimension des vecteurs** : le code demande `output_dimension: 1536` à `voyage-3-large` et la colonne est `vector(1536)`", "À notre connaissance, ce modèle n'accepte que 256, 512, 1 024 ou 2 048. Si c'est confirmé, la première indexation échouera. À contrôler dans la documentation du fournisseur **avant** d'ajouter la clé"],
      ["Élevée", "**Bascule multi-passages absente** : la constante `SEUIL_PAGES_MAP_REDUCE` est déclarée et jamais utilisée", "Au-delà de la fenêtre de contexte, l'appel échoue brutalement"],
      ["Élevée", "**Aucun OCR**, Word et Excel refusés", "Un PDF scanné est indexé « avec succès » mais vide, puis analysé sur rien"],
      ["Élevée", "**Buckets sans limite de taille ni de type** ; type de fichier pris sur la déclaration du navigateur", "Fichier arbitraire déposable ; contournement possible du filtre"],
      ["Moyenne", "**Chat non streamé**, recherche vectorielle seule", "Réponse affichée en une fois ; précision limitée sur les chiffres et termes exacts"],
      ["Moyenne", "**Cache de prompt du chat probablement inefficace** (document 08)", "Le bloc mis en cache est celui des passages retrouvés, qui change à chaque question"],
    ],
    [14, 44, 42],
    { size: 17 }
  );

  /* ------------------------------------------------------------------ 3 */
  d.h1("3. Architecture cible");
  d.fig("01-architecture", "Schéma 1 — Vue d'ensemble de l'architecture cible.");
  d.h2("3.1 Composants et responsabilités");
  d.table(
    ["Composant", "Rôle", "État", "Remarque"],
    [
      ["**Vercel**", "Interface, API courtes (CRUD, quotas, Stripe), Copilote, exports, tâches planifiées légères", "En place", "Plan Hobby probable (commentaire du code) ; usage commercial à confirmer"],
      ["**Supabase**", "Authentification, Postgres avec RLS, pgvector, Storage, file de jobs, journal d'usage", "En place", "File de jobs à créer"],
      ["**VPS Hostinger + Coolify**", "Hébergent le worker, l'ingestion et n8n ; déploiement depuis le dépôt", "À construire", "Accessibilité du VPS à confirmer"],
      ["**`finlens-worker`**", "Consomme la file : extraction, reformulations, contradictions, vectorisation", "À construire", "Réutilise `lib/ai/*` tel quel"],
      ["**`finlens-ingest`**", "OCR (Tesseract), conversion Word et Excel (LibreOffice sans interface), découpage", "À construire", "Gourmand en processeur"],
      ["**n8n**", "Vélocité, purge programmée, alertes, notifications", "À construire", "Supervision, pas pipeline d'IA"],
      ["**API Anthropic**", "Fable 5 (analyse), Sonnet 5 (profils, chat), Haiku 4.5 (tâches internes)", "En place", "Revue RGPD préalable"],
      ["**Voyage AI**", "Embeddings, puis reclassement", "En place", "Revue RGPD préalable"],
      ["**Stripe**", "Abonnements et webhooks", "En place", "À tester en réel"],
      ["**GitHub**", "Source de vérité du code, déclencheur des déploiements", "En place", "Sans contrôle automatique"],
    ],
    [20, 40, 14, 26],
    { size: 17 }
  );
  d.h2("3.2 Pourquoi un worker plutôt que n8n pour le pipeline");
  d.p("La note initiale confiait à n8n l'orchestration du pipeline d'IA. Ce document propose de réserver n8n à la supervision, pour trois raisons :");
  d.ul([
    "**Le code existe déjà** : routage des modèles, prompts, journal d'usage, quotas, tout est écrit en TypeScript. Un worker le réutilise sans réécriture ; n8n obligerait à le retranscrire en nœuds visuels.",
    "**Le pipeline est dense en logique métier** : dépendances entre étapes (l'étage 2 consomme l'étage 1), règles par offre, cache de prompt, reprise. C'est plus lisible, testable et versionnable en code qu'en flux graphique.",
    "**n8n excelle ailleurs** : surveiller une condition, appeler quelques services, prévenir un humain.",
  ]);

  /* ------------------------------------------------------------------ 4 */
  d.h1("4. Flux de bout en bout");
  d.fig("02-flux", "Schéma 2 — Parcours d'un dossier : où s'exécute chaque étape.");
  d.p("Les étapes 3 à 8 n'ont aucune contrainte de durée dans la cible. Aujourd'hui, les étapes 4 à 8 s'exécutent dans des requêtes web, d'où les défauts de la section 2.2.");
  d.h2("4.1 Ce qui se passe réellement aujourd'hui");
  d.table(
    ["Étape", "Route", "Où", "Remarque"],
    [
      ["Dépôt", "`POST /api/documents/upload`", "Vercel", "Écrit le fichier dans le bucket `documents`, chemin `organisation/dossier/uuid-nom`, et une ligne `documents` en attente"],
      ["Indexation", "`POST /api/documents/[id]/indexer`", "Vercel", "Télécharge, extrait le texte (PDF seul), calcule l'empreinte, découpe (3 000 caractères, chevauchement 300), vectorise, écrit `document_chunks`"],
      ["Analyse", "`POST /api/dossiers/[id]/analyser`", "Vercel", "Extraction, six reformulations, contradictions, checklist ; écrit `extractions`, `notes_profils`, `contradictions`, `checklist_items`"],
      ["Lecture d'un profil", "`GET /api/dossiers/[id]/profils/[profil]`", "Vercel", "Lecture en base, aucun appel d'IA"],
      ["Question", "`POST /api/copilote/chat`", "Vercel", "Anti-rafale, quota, vectorisation de la question, recherche des 8 passages, classification, réponse"],
      ["Export", "`POST /api/exports`", "Vercel", "Génère le fichier, l'écrit dans le bucket `exports`, renvoie un lien signé de dix minutes"],
    ],
    [14, 30, 12, 44],
    { size: 17 }
  );

  /* ------------------------------------------------------------------ 5 */
  d.h1("5. Pipeline d'analyse optimisé");
  d.fig("04-pipeline", "Schéma 3 — Le pipeline d'analyse avant et après optimisation.");
  d.p("Trois corrections indépendantes, sans modifier ni les prompts ni la structure de l'extraction :");
  d.ol([
    "**Un seul passage plein tarif sur le corpus.** La détection de contradictions lit l'extraction structurée (déjà sourcée) au lieu du corpus brut. Économie estimée : environ 2,70 $ par dossier de 300 pages (document 07).",
    "**Cinq reformulations en parallèle.** Elles ne dépendent que de l'extraction. Seule la première reste isolée, pour écrire le cache de prompt que les cinq autres liront.",
    "**Vectorisation par lots et bascule multi-passages.** Les passages partent par lots respectant les limites du fournisseur ; au-delà du seuil de pages, le corpus est traité par segments puis consolidé.",
  ]);
  d.small("Les durées de la figure (« 10 à 20 min » avant, « 3 à 5 min » après) sont des ordres de grandeur tirés de la lecture du code. Elles sont à mesurer dès que les clés d'API sont configurées.");

  /* ------------------------------------------------------------------ 6 */
  d.h1("6. La file de jobs");
  d.p("C'est la pièce qui manque, et celle qui rend tout le reste possible. Elle tient dans une table Postgres : aucune infrastructure supplémentaire.");
  d.code([
    "jobs (",
    "  id               uuid primary key default gen_random_uuid(),",
    "  organization_id  uuid not null,          -- isolation RLS",
    "  dossier_id       uuid not null,",
    "  type             text not null,          -- 'ingestion' | 'analyse'",
    "  statut           text not null,          -- en_attente | en_cours | termine | echec | abandonne",
    "  etape            text,                   -- étape courante, affichée à l'utilisateur",
    "  progression      int,                    -- 0 à 100",
    "  tentatives       int  not null default 0,",
    "  erreur           text,",
    "  verrou_jusqu_a   timestamptz,            -- battement de cœur du worker",
    "  cle_unicite      text unique,            -- dossier_id + type : un seul job actif",
    "  cree_le          timestamptz not null default now()",
    ")",
  ]);
  d.p("Le worker prend une tâche en ignorant celles que d'autres ont déjà verrouillées, ce qui permet de lancer plusieurs workers sans coordination :");
  d.code(["select * from jobs", " where statut = 'en_attente'", " order by cree_le", " limit 1", " for update skip locked;"]);
  d.fig("03-jobs", "Schéma 4 — Cycle de vie d'un job.");
  d.h2("6.1 Table dédiée, pgmq ou pg_cron ?");
  d.p("L'extension `pgmq` (file de messages sur Postgres) est disponible sur le projet mais non installée ; `pg_cron` est installée mais ne porte aucune tâche. Comparaison :");
  d.table(
    ["Option", "Avantages", "Limites", "Verdict"],
    [
      ["Table `jobs` dédiée", "Contrôle total du modèle : étape, progression, reprise, clé d'unicité ; lisible par l'interface ; RLS ; aucune dépendance", "Le verrouillage et les reprises sont à écrire", "Retenue"],
      ["`pgmq`", "File prête à l'emploi, durée de visibilité intégrée", "Modèle de message plat : la progression et l'état par étape restent à stocker ailleurs ; une dépendance de plus", "À réévaluer si le volume l'exige"],
      ["`pg_cron`", "Planification dans la base", "Planifie des commandes, ne gère pas une file", "Utile pour des tâches de maintenance, pas pour les jobs"],
    ],
    [20, 34, 30, 16]
  );
  d.h2("6.2 Ce que la file apporte");
  d.ul([
    "**L'analyse aboutit** : le traitement n'est plus borné par la durée d'une requête.",
    "**Une panne ne coûte pas une analyse complète** : le job reprend à la dernière étape validée, car chaque étape écrit son résultat avant de passer à la suivante.",
    "**Le double clic ne double pas la facture** : la clé d'unicité garantit un seul job actif par dossier.",
    "**L'attente devient lisible** : « Profil 5 sur 8 » au lieu d'un sablier de quinze minutes.",
    "**L'échec devient visible** : après trois tentatives avec attente croissante, le job passe à l'état abandonné et déclenche une alerte.",
  ]);

  /* ------------------------------------------------------------------ 7 */
  d.h1("7. Infrastructure et déploiement");
  d.fig("t01-deploiement", "Schéma 5 — Chaîne de déploiement et environnements.");

  d.h2("7.1 Vercel");
  d.table(
    ["Sujet", "Constat", "Action"],
    [
      ["Plan", "Le code mentionne le plan Hobby. Ce plan est réservé à un usage personnel non commercial", "Passer à un plan adapté avant le premier client ; confirmer le plan réel dans le tableau de bord"],
      ["Région des fonctions", "`vercel.json` ne fixe aucune région ; la région par défaut est hors Union européenne", "Fixer une région européenne (par exemple Francfort ou Paris) : les fichiers et les extraits de documents transitent par ces fonctions"],
      ["Taille des requêtes", "Plafond de requête documenté par l'hébergeur (4,5 Mo)", "Déposer les fichiers directement dans le stockage via une URL signée"],
      ["Durée des fonctions", "Plafonnée ; le Copilote escaladé vers le modèle premium peut s'en approcher", "Passer le Copilote en flux continu"],
      ["Tâches planifiées", "Trois tâches quotidiennes (purge de la corbeille, vélocité, coût par contrat), protégées par `CRON_SECRET`", "Conserver ; la fréquence quotidienne suffit car l'anti-rafale est synchrone"],
      ["Variables d'environnement", "Supabase et Stripe présentes. `ANTHROPIC_API_KEY` et `VOYAGE_API_KEY` absentes ; `STRIPE_WEBHOOK_SECRET` absente de la liste relevée le 21 septembre", "Re-vérifier la liste ; configurer après la revue de conformité"],
    ],
    [20, 44, 36],
    { size: 17 }
  );

  d.h2("7.2 Supabase");
  d.table(
    ["Sujet", "Constat", "Action"],
    [
      ["Projet", "`finlens`, Postgres 17, `eu-central-1`, un seul projet", "Créer une branche pour tester les migrations avant la production"],
      ["Extensions installées", "`vector` 0.8.2, `pgcrypto`, `uuid-ossp`, `pg_stat_statements`, `pg_cron`, `supabase_vault`", "—"],
      ["Extensions utiles non installées", "`pg_trgm`, `unaccent` (recherche plein texte), `pgmq`, `pgaudit` (journal d'audit), `pg_net`", "Installer `unaccent` et `pg_trgm` avec la recherche hybride ; étudier `pgaudit` pour la conformité"],
      ["Index vectoriel", "HNSW en distance cosinus sur `document_chunks.embedding`", "Ajouter un index plein texte (GIN) sur le contenu, en français"],
      ["Fonctions", "Quatre fonctions `SECURITY DEFINER` appelables par l'API publique (avertissements du linter)", "Légitime pour `handle_new_user` ; révoquer l'exécution pour les autres"],
      ["Sauvegardes", "Le plan gratuit ne fournit pas de sauvegardes managées ni de restauration à un instant donné", "Plan payant avant le premier client ; tester une restauration"],
      ["Taille", "Plan gratuit : base limitée à environ 500 Mo (limite publique à confirmer) ; ≈ 6 à 7 Mo par dossier de 300 pages", "Environ 78 dossiers avant saturation : voir document 05"],
      ["Stockage", "Deux buckets privés, sans limite de taille ni de type", "Fixer une taille maximale et une liste de types MIME"],
    ],
    [20, 44, 36],
    { size: 17 }
  );

  d.h2("7.3 VPS Hostinger et Coolify");
  d.p("Le serveur KVM 2 (2 vCPU, 8 Go de RAM, hébergé en France, 270 € pour deux ans déjà réglés) héberge trois services déployés depuis Coolify. Dimensionnement indicatif, à mesurer :");
  d.table(
    ["Service", "Profil de charge", "Mémoire indicative", "Concurrence conseillée"],
    [
      ["`finlens-worker`", "Attend les réponses des API d'IA : peu de processeur, beaucoup d'attente", "0,5 à 1 Go", "2 à 3 jobs d'analyse simultanés"],
      ["`finlens-ingest`", "OCR : un cœur saturé par document ; LibreOffice : pic de mémoire", "1 à 3 Go en pointe", "1 à 2 documents simultanés"],
      ["n8n", "Léger", "0,5 à 1 Go", "—"],
    ],
    [20, 40, 20, 20]
  );
  d.p("Durcissement minimal : accès par clé SSH, pare-feu fermé hors HTTPS, mises à jour automatiques, interface Coolify protégée par authentification forte, aucun port de base de données exposé. **Point d'attention** : si le worker utilise la clé `service_role` de Supabase, celle-ci contourne toutes les règles d'accès ; il vaut mieux lui donner un rôle Postgres dédié aux seules tables dont il a besoin.");

  d.h2("7.4 Intégration et livraison continues");
  d.ul([
    "**Aujourd'hui** : chaque poussée sur `main` déclenche un déploiement de production sur Vercel, sans contrôle préalable. Aucun test automatique, aucune vérification de types ou de lint avant mise en ligne.",
    "**Cible minimale** : un workflow GitHub qui exécute `tsc --noEmit` et `eslint` sur chaque demande de fusion, et protège `main`.",
    "**Migrations** : le nom d'un fichier de migration doit être égal à la version appliquée. Un écart a déjà été constaté (fichier local `20260810120000`, version appliquée `20260810153246`) : il suffit à faire croire qu'une migration n'a jamais été jouée.",
    "**Types** : `types/database.ts` est généré depuis le schéma ; le régénérer à chaque migration.",
  ]);

  d.h2("7.5 Environnements et secrets");
  d.table(
    ["Variable", "Où", "Rôle", "État"],
    [
      ["`NEXT_PUBLIC_SUPABASE_URL`, `…_ANON_KEY`", "Vercel, `.env.local`", "Accès navigateur à Supabase (clé publique)", "En place"],
      ["`SUPABASE_SERVICE_ROLE_KEY`", "Vercel (sensible)", "Opérations serveur privilégiées : indexation, crons, effacement", "En place"],
      ["`ANTHROPIC_API_KEY`", "—", "Appels aux modèles", "Bloquant"],
      ["`VOYAGE_API_KEY`", "—", "Embeddings", "Bloquant"],
      ["`STRIPE_SECRET_KEY`, `STRIPE_PRICE_*`", "Vercel (sensible)", "Abonnements", "En place"],
      ["`STRIPE_WEBHOOK_SECRET`", "—", "Authentifie les webhooks Stripe", "À vérifier"],
      ["`CRON_SECRET`", "Vercel (sensible)", "Protège les tâches planifiées", "En place"],
      ["`NEXT_PUBLIC_APP_URL`", "Vercel", "URL de base", "À vérifier"],
    ],
    [30, 22, 34, 14],
    { size: 17 }
  );
  d.p("Règle générale : aucune valeur secrète dans le dépôt ni dans les journaux ; `.env.local` jamais commité ; secrets du worker stockés dans Coolify, distincts de ceux de Vercel.");

  /* ------------------------------------------------------------------ 8 */
  d.h1("8. Exploitation et observabilité");
  d.table(
    ["Besoin", "Mécanisme existant", "Manque"],
    [
      ["Coût de chaque appel d'IA", "Table `usage_logs` : modèle, jetons entrée et sortie, lecture et écriture du cache, coût en dollars", "Tableau de bord ; correction de la classification, dont les jetons sont écrits en dur"],
      ["Marge par contrat", "Table `contract_cost_tracking` (ratio généré) et tâche quotidienne", "Alerte automatique aux seuils 70 % et 100 %"],
      ["Comportements anormaux", "Anti-rafale synchrone (15 questions par minute) ; table `velocity_alerts`", "Revue humaine outillée (flux n8n)"],
      ["Santé des jobs", "À créer avec la file", "Longueur de file, durée moyenne, taux d'échec et de reprise"],
      ["Erreurs applicatives", "Journaux Vercel", "Agrégation et alerte (par exemple un outil de suivi d'erreurs)"],
      ["Sauvegarde et restauration", "Aucune managée sur le plan gratuit", "Politique de rétention courte, test de restauration"],
    ],
    [24, 40, 36]
  );
  d.p("Objectifs de service proposés (à valider) : interface disponible à 99,5 % hors maintenance ; 99 % des analyses terminées en moins de dix minutes ; 100 % des appels d'IA journalisés.");

  /* ------------------------------------------------------------------ 9 */
  d.h1("9. Capacité et montée en charge");
  d.ul([
    "**Base de données** : environ 6 à 7 Mo par dossier de 300 pages (passages, vecteurs et index). Mille dossiers représentent environ 6 Go. Détail au document 05.",
    "**Recherche vectorielle** : l'index HNSW tient confortablement plusieurs millions de passages. Seuil de réévaluation proposé : au-delà de 5 à 10 millions de passages, ou si le temps de recherche au 95e centile dépasse 300 ms.",
    "**Fournisseurs d'IA** : les limites de débit des API (requêtes et jetons par minute) borneront le nombre d'analyses simultanées. Le worker doit limiter sa concurrence et gérer les réponses de limitation avec attente croissante.",
    "**VPS** : la montée en gamme est un changement de plan, pas de conception ; l'ingestion est le premier poste à saturer.",
  ]);

  /* ------------------------------------------------------------------ 10 */
  d.h1("10. Décisions d'architecture");
  d.table(
    ["N°", "Décision", "Statut", "Justification"],
    [
      ["ADR-1", "Conserver pgvector, ne pas réintroduire Qdrant", "Proposée", "La note initiale désignait comme point le plus urgent l'absence d'identifiant propriétaire sur les points vectoriels. Avec pgvector, l'effacement et l'isolation sont ceux des autres tables. Seuil de réévaluation chiffré en section 9"],
      ["ADR-2", "Worker Node pour le pipeline d'IA ; n8n pour la supervision", "Proposée", "Réutilisation du code, logique métier dense (section 3.2)"],
      ["ADR-3", "File de jobs dans une table Postgres", "Proposée", "Contrôle de l'état, de la reprise et de l'unicité (section 6.1)"],
      ["ADR-4", "Dépôt de fichiers directement vers le stockage par URL signée", "Proposée", "Contourne le plafond de taille des requêtes de l'hébergeur"],
      ["ADR-5", "Région européenne imposée aux fonctions web", "Proposée", "Les fichiers et extraits y transitent"],
      ["ADR-6", "Recherche hybride puis reclassement", "Proposée", "Précision des citations sur les chiffres exacts (document 08)"],
      ["ADR-7", "Un seul projet Supabase, avec branches pour les migrations", "Proposée", "Évite le coût d'un second projet tout en isolant les essais"],
    ],
    [10, 34, 12, 44],
    { size: 17 }
  );

  /* ------------------------------------------------------------------ 11 */
  d.h1("11. Plan de mise en œuvre");
  d.table(
    ["Étape", "Contenu", "Dépend de", "Gain autonome"],
    [
      ["1", "Vectorisation par lots, dimension des vecteurs vérifiée, contradictions sur l'extraction, reformulations en parallèle, dépôt direct vers le stockage, limites des buckets, région des fonctions", "Aucune", "Le produit redevient utilisable sur des dossiers moyens, sans nouvelle infrastructure"],
      ["2", "Table de jobs, worker sur Coolify, progression dans l'interface", "VPS actif", "L'analyse aboutit quelle que soit la taille ; reprise sur incident"],
      ["3", "Service d'ingestion : OCR, Word, Excel ; bascule multi-passages", "Étape 2", "Les documents réels deviennent exploitables"],
      ["4", "Recherche hybride, reclassement, flux continu, vérification des citations", "Aucune", "Précision et confiance"],
      ["5", "Flux n8n : vélocité, purge, alertes ; contrôle automatique avant déploiement", "Étape 2", "Supervision et fiabilité de livraison"],
    ],
    [8, 52, 14, 26],
    { size: 17 }
  );
  d.h2("11.1 Risques de mise en œuvre");
  d.table(
    ["Risque", "Parade"],
    [
      ["Le VPS n'est pas accessible", "Les étapes 1 et 4 n'en dépendent pas ; vérifier avant l'étape 2"],
      ["Le VPS devient un point de défaillance", "L'interface et le Copilote restent servis par Vercel ; une panne suspend les analyses en cours sans rendre la plateforme inaccessible ; les jobs reprennent au redémarrage"],
      ["Capacité du KVM 2 insuffisante pour l'OCR", "Limiter la concurrence avant d'envisager une montée en gamme"],
      ["Gains annoncés non confirmés", "Mesurer dès l'étape 1 avec le journal d'usage"],
    ],
    [34, 66]
  );

  return d;
};
