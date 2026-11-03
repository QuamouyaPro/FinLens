"use strict";
const { Doc } = require("../kit");

module.exports = function build() {
  const d = new Doc({
    num: "06",
    title: "RGPD, cybersécurité et conformité",
    subtitle: "Traitements, sous-traitants, droits des personnes, menaces et plan d'action",
    short: "RGPD, cybersécurité et conformité",
    date: "3 novembre 2026",
    statut: "Cadre de travail technique — à faire valider par un juriste avant lancement commercial",
    public: "Direction, responsable conformité, juriste, développeurs",
    perimetre: "Données personnelles et confidentielles traitées par FinLens, risques de sécurité, plan de mise en conformité",
    lead: "FinLens manipule des documents financiers confidentiels qui citent des tiers non clients. La confiance est le produit : ce document inventorie ce qui est protégé, ce qui ne l'est pas encore, et dans quel ordre le corriger.",
  });

  /* ------------------------------------------------------------------ 1 */
  d.h1("1. Résumé");
  d.warn([
    "**Ce document est un cadre de travail technique, pas un avis juridique.** Les qualifications (rôles, bases légales, durées) sont des propositions à faire valider par un juriste spécialisé avant tout lancement commercial.",
  ]);
  d.p("**Situation de départ favorable** : la base de données est vide. Aucune donnée client réelle n'a été traitée, ce qui permet de corriger la conformité avant le premier client plutôt qu'après.");
  d.p("**Ce qui est solide** : isolation par organisation sur les 17 tables, fichiers privés et accessibles par lien signé de dix minutes, données au repos en Union européenne, journal d'usage sans contenu des documents, corbeille avec purge réelle, trace des demandes d'effacement.");
  d.p("**Quatre points empêchent l'ouverture à de vrais clients :**");
  d.table(
    ["#", "Point", "Pourquoi c'est bloquant"],
    [
      ["1", "**Sous-traitants IA non encadrés** : Anthropic (modèles) et Voyage AI (vectorisation) recevront le contenu des documents", "Transfert de données confidentielles hors Union européenne ; localisation, accord de traitement, rétention et non-entraînement non vérifiés. Les clés d'API sont volontairement non configurées jusqu'à cette revue"],
      ["2", "**L'effacement de compte échoue**", "Cinq clés étrangères vers les utilisateurs n'ont pas de règle de suppression : la route d'effacement ne peut pas aboutir (section 5)"],
      ["3", "**L'effacement, même corrigé, laisse le contenu**", "Pour une organisation à un seul membre, dossiers, fichiers et passages restent après la suppression du compte"],
      ["4", "**Région des fonctions web non fixée**", "Les fichiers et extraits transitent par des fonctions dont la région par défaut est hors Union européenne"],
    ],
    [6, 40, 54]
  );

  /* ------------------------------------------------------------------ 2 */
  d.h1("2. Rôles et cadre");
  d.table(
    ["Donnée", "Rôle de FinLens", "Conséquence"],
    [
      ["Compte, facturation, usage de l'utilisateur", "**Responsable de traitement**", "FinLens décide des finalités ; il doit informer les personnes, honorer leurs droits et tenir le registre"],
      ["Contenu des documents déposés par les clients", "**Sous-traitant** du client, qui est responsable de traitement", "FinLens traite sur instruction du client ; un accord de sous-traitance (DPA) est nécessaire avec chaque client professionnel ; FinLens ne réutilise pas les contenus"],
      ["Personnes citées dans les documents (dirigeants, actionnaires, salariés)", "Tiers non clients, dont les données sont traitées pour le compte du client", "Le client reste le point d'entrée de leurs droits ; voir section 7"],
    ],
    [34, 30, 36]
  );
  d.small("Cette répartition est la lecture habituelle d'un service SaaS. Elle doit être confirmée : elle conditionne le contenu des CGU, du DPA et de la politique de confidentialité.");

  /* ------------------------------------------------------------------ 3 */
  d.h1("3. Registre des traitements (projet)");
  d.table(
    ["Traitement", "Données", "Base légale proposée", "Destinataires", "Durée proposée"],
    [
      ["Gestion des comptes et authentification", "E-mail, nom, mot de passe haché, organisation, rôle", "Exécution du contrat", "Supabase", "Durée de la relation, puis suppression à la demande"],
      ["Facturation et paiement", "Nom, e-mail, offre, historique de facturation", "Contrat ; obligation légale de conservation comptable", "Stripe", "Durée légale des pièces comptables (10 ans en France, à confirmer)"],
      ["Stockage et analyse des documents", "Contenu des documents (peut inclure des données de tiers)", "Instruction du client (sous-traitance)", "Supabase, Anthropic, Voyage AI", "Avec le dossier ; purge 30 jours après mise en corbeille"],
      ["Historique du Copilote, notes, ajouts épinglés", "Questions, réponses, notes dérivées des documents", "Instruction du client", "Supabase, Anthropic", "Avec le dossier"],
      ["Journal d'usage IA", "Identifiant utilisateur, modèle, volumes, coût — **sans le contenu**", "Intérêt légitime : maîtrise des coûts, facturation, sécurité", "Supabase", "24 mois (proposition)"],
      ["Prévention des abus", "Rythme des requêtes, alertes de vélocité", "Intérêt légitime : sécurité du service", "Supabase", "24 mois (proposition)"],
      ["Demandes d'effacement", "Date, périmètre, résultat — sans les données effacées", "Obligation de rendre compte", "Supabase", "Prescription applicable (à fixer)"],
      ["Site public et démonstration", "Préférence de thème (stockage local) ; aucun outil de mesure d'audience identifié", "Strictement nécessaire / à vérifier", "—", "Local au navigateur"],
    ],
    [20, 24, 22, 16, 18],
    { size: 17 }
  );

  /* ------------------------------------------------------------------ 4 */
  d.h1("4. Sous-traitants et flux de données");
  d.fig("g01-flux-donnees", "Schéma 1 — Où passe le contenu des dossiers.");
  d.table(
    ["Sous-traitant", "Rôle", "Données reçues", "Localisation", "Statut"],
    [
      ["**Supabase**", "Base, authentification, stockage", "Tout (au repos)", "Francfort (eu-central-1), confirmé par le projet", "Conforme"],
      ["**Vercel**", "Interface et routes d'API", "Fichiers et extraits en transit ; pas de stockage durable", "Région des fonctions non fixée dans `vercel.json`", "À vérifier"],
      ["**Anthropic**", "Modèles de langage", "Corpus des dossiers (extraction, contradictions), passages et questions (Copilote)", "Hors UE d'après les notes ; accord de traitement et clauses types annoncés dans les conditions commerciales", "À vérifier"],
      ["**Voyage AI**", "Vectorisation des passages (et reclassement prévu)", "**Le texte de tous les passages de tous les documents**", "À vérifier. **N'apparaît dans aucune note d'architecture précédente**", "Bloquant"],
      ["**Stripe**", "Abonnements", "Nom, e-mail, facturation — jamais le contenu", "À vérifier (Stripe agit en partie comme responsable de traitement)", "À vérifier"],
      ["**Hostinger**", "VPS (cible : worker, ingestion, n8n)", "Contenu en transit dans le worker et l'ingestion", "France", "Conforme (non utilisé)"],
      ["**GitHub**", "Code source", "Code uniquement ; **aucune donnée client ne doit y figurer**", "Hors périmètre RGPD si respecté", "Conforme"],
      ["**Claude Code** (outil de développement)", "Assistant de développement", "Code et, ponctuellement, données de la base lues par les outils", "À cadrer", "À vérifier"],
    ],
    [16, 18, 26, 26, 14],
    { size: 17 }
  );
  d.warn("**Voyage AI est un sous-traitant à part entière.** Les notes précédentes ne signalent qu'Anthropic comme transfert hors Union européenne. Or la vectorisation envoie à Voyage AI le texte intégral de chaque passage de chaque document déposé, avant même toute analyse. C'est le flux le plus volumineux et il doit être instruit au même titre que celui d'Anthropic.");

  /* ------------------------------------------------------------------ 5 */
  d.h2("4.1 Dossier de revue : Anthropic et Voyage AI");
  d.p("Les clés d'API ne seront ajoutées qu'après cette revue. Les points à trancher, par lecture des conditions **en vigueur** (elles évoluent) :");
  d.ul([
    "**Localisation du traitement** : où les requêtes sont-elles exécutées ? Une région européenne est-elle proposée ?",
    "**Accord de traitement (DPA)** et **clauses contractuelles types** : sont-ils inclus, signés, applicables à notre usage ?",
    "**Rétention** : durée de conservation des requêtes et des réponses ; existence d'une option de rétention nulle.",
    "**Entraînement** : engagement écrit que les contenus ne servent pas à entraîner les modèles.",
    "**Sous-traitants ultérieurs** et mécanisme d'information en cas de changement.",
    "**Sécurité** : certifications et rapports d'audit disponibles ; délai de notification d'une violation.",
    "**Suppression** : possibilité d'obtenir l'effacement de données transmises.",
  ]);
  d.table(
    ["Option", "Principe", "Avantages", "Réserves"],
    [
      ["**A** — API directes avec DPA et clauses types", "Anthropic et Voyage AI, tels que câblés aujourd'hui", "Aucun développement ; qualité maximale", "Transfert hors Union européenne à encadrer ; deux sous-traitants à instruire"],
      ["**B** — Modèles via un fournisseur cloud en région européenne", "Mêmes familles de modèles servies depuis une région de l'Union", "Résidence des données renforcée ; contrat cadre du fournisseur cloud", "Disponibilité des modèles retenus dans la région **à vérifier** ; développement d'un second client d'API"],
      ["**C** — Vectorisation auto-hébergée ou européenne", "Modèle d'embeddings sur le VPS français, ou fournisseur européen, à la place de Voyage AI", "Supprime Voyage AI de la chaîne ; le flux le plus volumineux reste en Union européenne", "Qualité sur documents financiers français et anglais à **mesurer** ; charge de calcul sur le VPS ; re-vectorisation si changement"],
    ],
    [22, 28, 26, 24],
    { size: 17 }
  );
  d.callout([
    "**Débloquer les essais sans attendre la revue.** Le pipeline, les coûts et la qualité peuvent être mesurés sur des **documents publics** (rapports annuels publiés, documents de référence), sans aucune donnée confidentielle ni donnée de tiers. Une clé réservée aux essais, utilisée sur un projet distinct de la production et sans donnée client, permet d'exécuter le benchmark du document 08 et de remplacer les estimations de coût de cette collection par des mesures — pendant que la revue de conformité suit son cours.",
  ]);

  /* ------------------------------------------------------------------ 6 */
  d.h1("5. Droits des personnes");
  d.table(
    ["Droit", "Mécanisme", "État"],
    [
      ["Information", "Politique de confidentialité, mentions légales, CGU", "À construire"],
      ["Accès", "Export des données du compte et des dossiers", "À construire"],
      ["Rectification", "Réglages du profil", "En place"],
      ["**Effacement**", "Bouton « Supprimer mon compte » → route `/api/erasure`", "Écart"],
      ["Portabilité", "Export structuré des données du compte et des notes", "À construire"],
      ["Opposition, limitation", "Demande au contact désigné", "À construire"],
      ["Décision automatisée", "Aucune décision n'est prise par FinLens : le score de risque est une aide à la lecture et l'utilisateur décide", "Conforme"],
    ],
    [22, 56, 22]
  );
  d.h2("5.1 Écart : l'effacement de compte");
  d.p("La route d'effacement enchaîne : (1) insérer une ligne de trace dans `erasure_requests` au nom de l'utilisateur ; (2) anonymiser le profil Stripe ; (3) supprimer l'utilisateur dans Supabase Auth ; (4) compléter la trace. Deux défauts, constatés par lecture du code et du schéma :");
  d.table(
    ["Défaut", "Cause", "Conséquence"],
    [
      ["**La suppression de l'utilisateur échoue**", "Cinq clés étrangères vers `auth.users` sont en `NO ACTION` : `erasure_requests.requested_by`, `usage_logs.user_id`, `velocity_alerts.user_id`, `velocity_alerts.reviewed_by`, `contradictions.arbitre_par`. L'étape 1 crée une ligne qui bloque l'étape 3", "L'utilisateur reçoit une erreur 500 ; son compte n'est pas supprimé ; **l'effacement est déjà « demandé » dans la trace, mais jamais exécuté**"],
      ["**Le contenu n'est pas supprimé**", "La route ne supprime que l'utilisateur ; l'organisation, les dossiers, les fichiers du stockage et les passages ne sont pas concernés", "Pour une organisation à un seul membre, tout le contenu confidentiel subsiste après la suppression"],
    ],
    [26, 44, 30]
  );
  d.p("**Correctif proposé** :");
  d.ol([
    "Passer les cinq clés étrangères en `ON DELETE SET NULL` (migration versionnée, essayée sur une branche).",
    "Lorsque le dernier membre d'une organisation est supprimé, supprimer l'organisation et son contenu, en réutilisant la purge par dossier (fichiers d'abord, puis lignes).",
    "Pour une organisation à plusieurs membres (offre Fonds), détacher seulement l'utilisateur et laisser les dossiers à l'organisation.",
    "Ne marquer la trace comme exécutée qu'après succès, et alerter sur toute demande restée sans exécution.",
    "Ajouter un test de bout en bout : créer un compte, déposer un dossier, supprimer le compte, vérifier l'absence de toute ligne et de tout fichier.",
  ]);
  d.small("Ces constats viennent d'une analyse du schéma et du code. Ils doivent être confirmés par un essai sur une branche de test ; aucun essai n'a été fait sur la base de production.");

  /* ------------------------------------------------------------------ 7 */
  d.h1("6. Cybersécurité : modèle de menaces");
  d.table(
    ["Menace", "Mesures en place", "Écart", "Priorité"],
    [
      ["**Accès entre organisations**", "RLS sur 17 tables sur 17 ; fonctions de recherche exécutées avec les droits de l'appelant ; clé privilégiée uniquement côté serveur", "Aucun test automatisé d'isolation ; quatre fonctions privilégiées appelables par l'API publique", "Critique"],
      ["**Fuite de fichiers**", "Buckets privés ; chemins préfixés par l'organisation ; liens signés de dix minutes", "Pas de limite de taille ni de type sur les buckets", "Élevée"],
      ["**Fichier malveillant déposé**", "Filtre sur le type déclaré par le navigateur", "Aucune détection sur le contenu réel ; aucun antivirus ; analyseurs de documents exposés au contenu", "Élevée"],
      ["**Injection d'instructions par un document**", "Instructions de rôle séparées du contenu ; sortie JSON ; aucun outil ni action déclenchable par le modèle aujourd'hui", "Pas de vérification des citations ; devient critique dès l'introduction d'agents", "Élevée"],
      ["**Compromission d'un compte**", "Authentification Supabase", "Pas d'authentification multifacteur ; politique de mot de passe à confirmer", "Élevée"],
      ["**Abus de coûts d'IA**", "Anti-rafale à 15 questions par minute ; quotas Essentiel ; suivi de vélocité ; suivi du coût par contrat", "Un seul compte Analyste peut déclencher des analyses à plusieurs dollars chacune ; pas de plafond de dépense chez les fournisseurs ni de limite par adresse sur l'inscription", "Élevée"],
      ["**Fuite de secrets**", "Variables sensibles sur Vercel ; `.env.local` ignoré par Git ; exemple de configuration sans secret", "Le worker futur détiendra des secrets ; pas de détection de secrets dans le dépôt", "Moyenne"],
      ["**Faux webhook de paiement**", "Vérification de signature Stripe", "Présence du secret de signature en production à confirmer", "Élevée"],
      ["**Appel non autorisé des tâches planifiées**", "En-tête `Authorization: Bearer <CRON_SECRET>` obligatoire", "—", "Faible"],
      ["**Vulnérabilité d'une dépendance**", "Fichier de verrouillage des versions", "Pas d'analyse automatique des dépendances ; pas d'intégration continue", "Moyenne"],
      ["**En-têtes HTTP de sécurité**", "—", "Aucun en-tête configuré (politique de sécurité du contenu, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)", "Moyenne"],
      ["**Perte ou vol du poste de développement**", "—", "Le code et les fichiers `.env.local` voyagent sur un disque externe entre deux ordinateurs ; chiffrement du disque non constaté", "Élevée"],
      ["**Journalisation insuffisante**", "Journal d'usage IA ; trace des effacements", "Pas de journal des accès sensibles ni des exports", "Moyenne"],
      ["**Perte de données**", "—", "Pas de sauvegarde managée sur le plan gratuit ; restauration jamais éprouvée", "Élevée"],
    ],
    [20, 30, 36, 14],
    { size: 17 }
  );

  d.h2("6.1 Sécurité propre à l'IA");
  d.table(
    ["Sujet", "Situation", "Mesure"],
    [
      ["Contenu envoyé aux modèles", "Corpus complet pour l'extraction ; passages pour le Copilote", "Minimiser : ne rien envoyer de plus que nécessaire ; contradictions sur l'extraction plutôt que sur le corpus (document 04)"],
      ["Journalisation", "Seuls les volumes et coûts sont journalisés, jamais le contenu", "Conserver cette règle ; interdire les journaux de prompts en clair"],
      ["Injection d'instructions", "Un document peut contenir « ignore tes consignes »", "Traiter le contenu comme donnée ; valider la sortie ; vérifier chaque citation ; aucun outil à effet de bord tant que ce n'est pas maîtrisé"],
      ["Fiabilité des réponses", "Réponses contraintes aux passages, sans mesure de fidélité", "Contrôle automatique des citations ; jeu d'évaluation (document 08)"],
      ["Dépendance au fournisseur", "Un identifiant de modèle configurable ; pas de repli câblé", "Repli vers un second modèle ; revue de conformité de chaque fournisseur"],
      ["Allégations", "« Risque d'information inventée : nul »", "Reformuler : réponses contraintes aux passages, citation vérifiable"],
    ],
    [24, 34, 42]
  );

  /* ------------------------------------------------------------------ 8 */
  d.h1("7. Données de tiers dans les documents");
  d.p("Les dossiers contiennent des noms de dirigeants, d'actionnaires, de salariés, parfois leurs rémunérations : ce sont des données personnelles, traitées pour le compte du client. Trois questions restent à faire trancher par un juriste :");
  d.ul([
    "**Base légale et information** : le client, responsable de traitement, doit pouvoir justifier ce traitement. Le DPA et les CGU doivent le prévoir et lui laisser la responsabilité de l'information.",
    "**Demande d'un tiers** : si un dirigeant cité demande l'effacement de ses données, la demande doit passer par le client. La durée légale de conservation de certains documents financiers et le secret des affaires peuvent s'opposer à l'effacement. FinLens doit offrir à son client les moyens techniques de supprimer un document ou un dossier, sans promettre davantage.",
    "**Réutilisation** : FinLens ne réutilise jamais les contenus pour un autre client ni pour entraîner un modèle. Cet engagement doit être contractuel **et** vérifié chez chaque sous-traitant.",
  ]);
  d.p("Une analyse d'impact relative à la protection des données (AIPD) est à évaluer avec un juriste : le recours à l'IA et le traitement à grande échelle de données de tiers sont des critères qui plaident pour en réaliser une avant le lancement.");

  /* ------------------------------------------------------------------ 9 */
  d.h1("8. Plan de conformité");
  d.table(
    ["#", "Action", "Priorité", "Bloquant pour", "État"],
    [
      ["1", "Revue d'Anthropic et de Voyage AI (section 4.1) et décision A, B ou C", "Critique", "Activer les clés d'IA", "À construire"],
      ["2", "Corriger l'effacement : clés étrangères, suppression de l'organisation, test de bout en bout", "Critique", "Premier client", "À construire"],
      ["3", "Fixer une région européenne pour les fonctions web", "Critique", "Premier client", "À construire"],
      ["4", "Plans payants Supabase (sauvegardes) et Vercel (usage commercial) ; tester une restauration", "Élevée", "Premier client", "À construire"],
      ["5", "Rédiger CGU et CGV, politique de confidentialité, mentions légales, DPA client", "Élevée", "Lancement", "À construire"],
      ["6", "Finaliser le registre ; décider de l'AIPD", "Élevée", "Lancement", "À construire"],
      ["7", "Limites de taille et de type des buckets ; détection du type par le contenu ; antivirus à l'ingestion", "Élevée", "Premier client", "À construire"],
      ["8", "Authentification multifacteur pour les offres professionnelles", "Élevée", "Lancement", "À construire"],
      ["9", "En-têtes de sécurité, intégration continue, analyse des dépendances, détection de secrets", "Moyenne", "Lancement", "À construire"],
      ["10", "Plafonds de dépense chez les fournisseurs d'IA ; limite par adresse sur l'inscription", "Élevée", "Premier client", "À construire"],
      ["11", "Chiffrer le disque externe de développement ; gérer les secrets hors du disque", "Élevée", "Immédiat", "À construire"],
      ["12", "Test d'intrusion par un tiers", "Élevée", "Lancement", "À construire"],
      ["13", "Procédure de violation de données et registre des violations", "Élevée", "Premier client", "À construire"],
      ["14", "Reformuler les allégations commerciales de la page d'accueil", "Moyenne", "Lancement", "À construire"],
      ["15", "Réviser les quatre fonctions privilégiées exposées à l'API publique", "Moyenne", "Lancement", "À construire"],
    ],
    [6, 52, 12, 18, 12],
    { size: 17 }
  );

  /* ------------------------------------------------------------------ 10 */
  d.h1("9. Violation de données");
  d.p("Procédure à formaliser et à tester avant le premier client :");
  d.ol([
    "**Détecter et qualifier** : source, périmètre, données et organisations concernées.",
    "**Contenir** : révoquer les accès et secrets concernés, isoler le composant.",
    "**Évaluer le risque** pour les personnes.",
    "**Notifier l'autorité de contrôle** (la CNIL) dans les 72 heures lorsque la violation est susceptible d'engendrer un risque ; **informer les personnes** lorsque le risque est élevé.",
    "**Informer les clients** concernés, dans le délai prévu au DPA, puisque FinLens agit en sous-traitant pour leurs contenus.",
    "**Consigner** la violation et les mesures prises dans un registre, même si elle n'est pas notifiée.",
  ]);

  /* ------------------------------------------------------------------ 11 */
  d.h1("10. Documents juridiques à produire");
  d.table(
    ["Document", "Contenu essentiel"],
    [
      ["Conditions générales d'utilisation et de vente", "Offres, quotas, clause d'usage raisonnable (pas d'automatisation de masse, pas de revente d'accès), clause de renégociation pour les contrats Fonds, limites de responsabilité, mention « FinLens est un assistant, l'humain garde la décision finale »"],
      ["Politique de confidentialité", "Responsable de traitement, finalités, bases légales, destinataires, durées, droits, transferts hors Union européenne"],
      ["Accord de traitement (DPA) client", "Instructions, confidentialité, sous-traitants ultérieurs, sécurité, assistance pour les droits, suppression en fin de contrat, notification des violations"],
      ["Registre des traitements", "Version finalisée de la section 3"],
      ["Analyse d'impact (AIPD)", "Si retenue : description, nécessité, risques, mesures"],
      ["Mentions légales", "Éditeur, hébergeurs"],
      ["Politique de gestion des cookies", "À rédiger si un outil de mesure d'audience est ajouté ; aucun n'est identifié aujourd'hui"],
    ],
    [30, 70]
  );

  /* ------------------------------------------------------------------ 12 */
  d.h1("11. Gouvernance");
  d.ul([
    "**Point de contact** pour les demandes d'exercice de droits, publié dans la politique de confidentialité.",
    "**Revue trimestrielle** de la liste des sous-traitants, des durées de rétention et des écarts ouverts.",
    "**Règle de développement** : toute nouvelle table porte `organization_id`, RLS dès sa création et une règle de suppression explicite sur chaque clé étrangère.",
    "**Règle de données** : aucune donnée client réelle dans l'environnement de développement, dans les jeux d'essai ni dans le dépôt.",
  ]);

  return d;
};
