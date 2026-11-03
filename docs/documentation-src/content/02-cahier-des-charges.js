"use strict";
const { Doc } = require("../kit");

module.exports = function build() {
  const d = new Doc({
    num: "02",
    title: "Cahier des charges",
    subtitle: "Exigences, statut réel de chacune, et lots de réalisation",
    short: "Cahier des charges",
    date: "3 novembre 2026",
    public: "Équipe de réalisation, prestataires, relecteurs",
    perimetre: "Périmètre fonctionnel et non fonctionnel de la version 1 commercialisable",
    lead: "Ce cahier des charges ne décrit pas un produit à imaginer : il constate un produit largement construit et indique, exigence par exigence, ce qui est en place, ce qui est partiel et ce qui reste à faire.",
  });

  const req = (rows) =>
    d.table(["ID", "Exigence", "Priorité", "Statut"], rows, [8, 66, 10, 16], { size: 17.5 });

  /* ------------------------------------------------------------------ 1 */
  d.h1("1. Contexte et objectifs");
  d.p("FinLens est un copilote d'analyse financière pour investisseurs (document 01). La version 1 vise un produit commercialisable auprès de premiers clients professionnels, avec une offre d'entrée grand public.");
  d.h2("1.1 Objectifs");
  d.table(
    ["Objectif", "Indicateur de réussite", "Cible proposée"],
    [
      ["Gagner du temps de lecture", "Délai entre le dépôt d'un dossier de ~300 pages et la note du premier profil", "≤ 5 minutes (promesse commerciale : 3 minutes pour la synthèse courte) — à mesurer"],
      ["Garantir la traçabilité", "Part des citations affichées dont l'extrait figure mot pour mot dans la page citée", "≥ 95 % — mesure à instaurer (document 08)"],
      ["Rester rentable à volume élevé", "Marge brute par offre, coût réel / facture par contrat", "Positive dans tous les scénarios d'usage normal et soutenu (document 07)"],
      ["Protéger les données clients", "Tables protégées par isolation d'organisation ; sous-traitants IA encadrés", "100 % des tables ; revue des sous-traitants close avant tout client"],
      ["Rendre le produit exploitable", "Analyse d'un dossier réel sans échec ni reprise manuelle", "Taux de réussite ≥ 99 % des jobs d'analyse"],
    ],
    [26, 42, 32]
  );

  /* ------------------------------------------------------------------ 2 */
  d.h1("2. Périmètre");
  d.h2("2.1 Dans le périmètre de la version 1");
  d.ul([
    "Création de compte, organisation, rôles, trois offres et leurs plafonds.",
    "Dépôt et indexation de documents **PDF, Word et Excel**, y compris scannés (OCR).",
    "Extraction exhaustive, six profils métier plus Personnalisé, score de risque par profil.",
    "Copilote sourcé, avec vérification des citations, ajout à la note.",
    "Contradictions, checklist de due diligence, signaux, recherche globale, comparateur.",
    "Export PDF et Word.",
    "Facturation par abonnement, quotas, suivi du coût réel.",
    "Conformité : effacement complet, corbeille, registre des traitements, encadrement des sous-traitants.",
  ]);
  d.h2("2.2 Hors périmètre de la version 1");
  d.ul([
    "Connecteurs de data rooms et de messageries, alertes de marché, rédaction automatique de mémos (vision long terme, document 08).",
    "Intégration de données de marché en temps réel (Alpha Vantage, Bloomberg).",
    "Application mobile native (l'interface web est adaptée aux petits écrans).",
    "Langues autres que le français pour l'interface (les documents analysés peuvent être en anglais).",
    "Format d'export en diapositives (retiré volontairement : il n'apporte rien au coût et alourdit le développement).",
  ]);

  /* ------------------------------------------------------------------ 3 */
  d.h1("3. Acteurs et rôles");
  d.table(
    ["Acteur", "Description", "Droits"],
    [
      ["Visiteur", "Personne non connectée", "Site public, démonstration complète sur données fictives, inscription"],
      ["Membre (`member`)", "Utilisateur d'une organisation", "Ses dossiers, le Copilote, les exports, selon l'offre"],
      ["Administrateur (`admin`)", "Gère l'organisation", "Mêmes droits, plus la gestion de l'équipe (offre Fonds)"],
      ["Propriétaire (`owner`)", "Créateur de l'organisation", "Mêmes droits, plus la facturation et la suppression du compte"],
      ["Exploitant FinLens", "Équipe interne", "Revue des alertes de vélocité, suivi du coût par contrat ; accès par clé de service uniquement, jamais depuis le navigateur"],
      ["Système", "Tâches planifiées, webhooks Stripe, worker (cible)", "Écriture dans les tables de pilotage ; purge ; mise à jour des offres"],
    ],
    [20, 34, 46]
  );

  /* ------------------------------------------------------------------ 4 */
  d.h1("4. Exigences fonctionnelles");
  d.p("Priorités : **Must** (indispensable à la mise en service), **Should** (important), **Could** (souhaitable). Statuts : **En place**, **Partiel**, **À construire**, **À décider**, **À vérifier**, **Écart** ou **Bloquant**, établis par lecture du code et de la base à la date de cette note.");
  d.small("« En place » signifie que le code existe et est complet ; pas qu'il a été éprouvé en production. Le moteur d'IA n'étant pas activé, aucune des fonctions qui l'appellent n'a été exécutée en conditions réelles.");

  d.h2("4.1 Compte et organisation");
  req([
    ["F-001", "Inscription par e-mail et mot de passe, avec création automatique d'une organisation (déclencheur en base).", "Must", "En place"],
    ["F-002", "Connexion, déconnexion, session persistante.", "Must", "En place"],
    ["F-003", "Réinitialisation du mot de passe.", "Must", "À vérifier"],
    ["F-004", "Confirmation d'e-mail : décider si elle reste activée (elle retarde l'accès après l'inscription).", "Should", "À décider"],
    ["F-005", "Connexion Google et Microsoft (OAuth).", "Should", "À construire"],
    ["F-006", "Rôles `owner`, `admin`, `member` par organisation.", "Must", "Partiel"],
    ["F-007", "Authentification multifacteur (TOTP) pour les offres Analyste et Fonds.", "Should", "À construire"],
  ]);

  d.h2("4.2 Data room (Module 1)");
  req([
    ["F-010", "Dépôt de documents dans un dossier, 50 fichiers maximum (contrainte portée par un déclencheur en base).", "Must", "En place"],
    ["F-011", "Dépôt directement vers le stockage, sans transiter par une fonction serveur : une requête vers une fonction est plafonnée en taille par l'hébergeur.", "Must", "À construire"],
    ["F-012", "Extraction du texte des PDF, page par page.", "Must", "En place"],
    ["F-013", "Extraction des fichiers Word et Excel (acceptés au dépôt, aujourd'hui refusés à l'indexation).", "Must", "À construire"],
    ["F-014", "Reconnaissance optique (OCR) des documents sans couche texte.", "Must", "À construire"],
    ["F-015", "Découpage en passages et vectorisation par lots respectant les limites du fournisseur.", "Must", "Partiel"],
    ["F-016", "Détection des doublons par empreinte du contenu.", "Should", "En place"],
    ["F-017", "Tri automatique par type de document (rapport annuel, due diligence, ESG, contrat).", "Should", "À construire"],
    ["F-018", "Analyse de complétude : signaler les documents attendus mais absents selon le type d'opération.", "Could", "À construire"],
    ["F-019", "Statut visible de chaque document : en attente, en cours, indexé, erreur.", "Must", "En place"],
    ["F-020", "Limites de taille et de type de fichier appliquées par le serveur, indépendamment de ce que déclare le navigateur.", "Must", "À construire"],
  ]);

  d.h2("4.3 Analyse et profils (Module 2)");
  req([
    ["F-030", "Extraction exhaustive en six catégories (financier, juridique, concurrentiel, ESG, gouvernance, risques), chaque donnée sourcée.", "Must", "En place"],
    ["F-031", "Analyse exécutée en arrière-plan, avec progression visible et reprise après incident.", "Must", "À construire"],
    ["F-032", "Bascule en résumé multi-passages au-delà d'environ 1 500 pages.", "Should", "À construire"],
    ["F-033", "Six profils métier générés d'avance ; changer de profil est une simple lecture.", "Must", "En place"],
    ["F-034", "Profil Personnalisé : jusqu'à douze indicateurs choisis, analyse neutre en dessous.", "Should", "En place"],
    ["F-035", "Score de risque propre à chaque profil, pondérant cinq axes.", "Must", "En place"],
    ["F-036", "Verrouillage des profils selon l'offre (Essentiel : trois profils sur six).", "Must", "En place"],
    ["F-037", "Donnée absente marquée `[DONNÉE MANQUANTE]` plutôt qu'estimée.", "Must", "En place"],
    ["F-038", "Onglet « Chiffres clés » : compte de résultat, bilan et flux de trésorerie reconstruits, chaque ligne sourcée ou marquée estimée.", "Should", "À construire"],
    ["F-039", "Quota Essentiel : 3 nouveaux dossiers analysés par mois, rotation libre entre dossiers déjà analysés.", "Must", "En place"],
  ]);

  d.h2("4.4 Copilote (Module 3)");
  req([
    ["F-040", "Réponses limitées aux passages retrouvés dans le dossier, avec document et page de chaque citation.", "Must", "En place"],
    ["F-041", "Citation cliquable ouvrant un panneau latéral avec le passage surligné.", "Must", "En place"],
    ["F-042", "Routage de chaque question : classification de complexité, puis modèle standard ou modèle premium.", "Must", "En place"],
    ["F-043", "Épinglage d'une réponse à la note, classée par catégorie, pour un profil ou pour tous.", "Should", "En place"],
    ["F-044", "Vérification programmatique de chaque citation avant affichage.", "Must", "À construire"],
    ["F-045", "Recherche hybride (sens + mots exacts) suivie d'un reclassement des passages.", "Should", "À construire"],
    ["F-046", "Réponse affichée au fil de la génération.", "Should", "À construire"],
    ["F-047", "Suggestions de questions adaptées au type d'opération.", "Could", "À vérifier"],
    ["F-048", "Quota Essentiel de 100 questions par mois ; blocage anti-rafale à 15 questions par minute.", "Must", "En place"],
  ]);

  d.h2("4.5 Contrôles, signaux, recherche et comparateur");
  req([
    ["F-050", "Détection des contradictions entre documents d'un dossier, avec gravité et deux passages côte à côte.", "Must", "En place"],
    ["F-051", "Arbitrage d'une contradiction (marquer comme arbitrée, avec l'auteur et la date).", "Should", "En place"],
    ["F-052", "Checklist de due diligence pré-chargée selon le type d'opération.", "Must", "En place"],
    ["F-053", "Cochage automatique de la checklist à partir des documents.", "Could", "À construire"],
    ["F-054", "Vue centralisée des signaux de tous les dossiers, avec compteur de non lus.", "Should", "En place"],
    ["F-055", "Recherche globale : une question posée à tous les dossiers actifs.", "Should", "En place"],
    ["F-056", "Comparateur de dossiers sous forme de tableau, réservé aux offres Analyste et Fonds.", "Should", "En place"],
  ]);

  d.h2("4.6 Export (Module 5)");
  req([
    ["F-060", "Export d'une note de profil en PDF ou en Word.", "Must", "En place"],
    ["F-061", "Ajouts épinglés du Copilote intégrés à l'export.", "Should", "En place"],
    ["F-062", "Lien de téléchargement temporaire (dix minutes).", "Must", "En place"],
    ["F-063", "Choix du modèle d'export, des sections, annexe des pages sources, checklist jointe.", "Could", "Partiel"],
  ]);

  d.h2("4.7 Offres, facturation et équipe");
  req([
    ["F-070", "Trois offres souscrites par abonnement Stripe.", "Must", "En place"],
    ["F-071", "Plafonds : 4 dossiers actifs (Essentiel), 15 dossiers ouverts par siège (Analyste, Fonds).", "Must", "En place"],
    ["F-072", "Mise à jour de l'offre et réinitialisation du quota Essentiel à chaque prélèvement, par webhook.", "Must", "En place"],
    ["F-073", "Gestion d'équipe multisièges et partage de dossiers (Fonds).", "Should", "Partiel"],
    ["F-074", "Suivi du coût réel cumulé par contrat rapporté à la facture, avec seuils d'action.", "Should", "Partiel"],
    ["F-075", "Prix affichés avec mention explicite hors taxes ou toutes taxes comprises, TVA gérée.", "Must", "À décider"],
  ]);

  d.h2("4.8 Conformité et confidentialité");
  req([
    ["F-080", "Corbeille de 30 jours, puis purge réelle des lignes et des fichiers.", "Must", "En place"],
    ["F-081", "Effacement du compte en libre-service, **y compris les dossiers et fichiers d'une organisation à un seul membre**. Aujourd'hui : la suppression de l'utilisateur échoue (clés étrangères sans règle de suppression) et le contenu ne serait de toute façon pas supprimé.", "Must", "Écart"],
    ["F-082", "Trace de conformité de chaque demande d'effacement, sans les données effacées.", "Must", "En place"],
    ["F-083", "Export des données personnelles sur demande (portabilité).", "Should", "À construire"],
    ["F-084", "Journal d'usage IA par appel (modèle, volumes, coût), sans contenu des documents.", "Must", "En place"],
    ["F-085", "Revue de conformité des sous-traitants IA (Anthropic, Voyage AI) avant toute mise en production.", "Must", "Bloquant"],
  ]);

  d.h2("4.9 Site public et démonstration");
  req([
    ["F-090", "Page d'accueil, tarifs, calculateur de ROI, comparatif, FAQ.", "Must", "En place"],
    ["F-091", "Mode démonstration complet sur données fictives, sans compte ni clé d'API.", "Should", "En place"],
    ["F-092", "Prototype statique conservé comme référence visuelle.", "Could", "En place"],
  ]);

  /* ------------------------------------------------------------------ 5 */
  d.h1("5. Exigences non fonctionnelles");
  d.p("Les cibles sont des **propositions**, à valider. Aucune n'a encore été mesurée.");
  d.table(
    ["ID", "Catégorie", "Exigence", "Cible proposée", "Statut"],
    [
      ["NF-01", "Performance", "Lecture d'une note déjà générée", "< 1 s", "À vérifier"],
      ["NF-02", "Performance", "Analyse d'un dossier de ~300 pages, du dépôt à la première note", "≤ 5 min", "À construire"],
      ["NF-03", "Performance", "Copilote : premier mot affiché", "< 5 s", "À construire"],
      ["NF-04", "Disponibilité", "Interface et lecture des notes", "≥ 99,5 % hors maintenance", "À décider"],
      ["NF-05", "Sécurité", "Isolation par organisation sur les tables métier", "100 % des tables", "Conforme"],
      ["NF-06", "Sécurité", "Fichiers privés, accès par lien signé de courte durée", "Buckets privés ; 10 min", "Conforme"],
      ["NF-07", "Sécurité", "Authentification forte pour les comptes professionnels", "TOTP disponible", "À construire"],
      ["NF-08", "Résilience", "Sauvegardes quotidiennes, restauration éprouvée", "RPO 24 h ; test trimestriel", "À construire"],
      ["NF-09", "Conformité", "Données au repos en Union européenne", "Supabase eu-central-1", "Conforme"],
      ["NF-10", "Accessibilité", "WCAG 2.1 niveau AA", "Contraste ≥ 4,5:1, navigation clavier, mouvement réduit respecté", "Partiel"],
      ["NF-11", "Observabilité", "Coût et volume de chaque appel IA journalisés", "100 % des appels", "Partiel"],
      ["NF-12", "Maintenabilité", "Migrations versionnées, types générés depuis le schéma", "Nom de fichier = version appliquée", "Partiel"],
      ["NF-13", "Capacité", "Dimensionnement de la base pour 1 000 dossiers de 300 pages", "≈ 6 à 7 Go (document 05)", "À vérifier"],
      ["NF-14", "Qualité IA", "Citations retrouvées mot pour mot dans la page citée", "≥ 95 %", "À construire"],
    ],
    [8, 14, 36, 28, 14],
    { size: 17.5 }
  );

  /* ------------------------------------------------------------------ 6 */
  d.h1("6. Contraintes");
  d.ul([
    "**Techniques** : application Next.js unique (interface et API) déployée sur Vercel, Root Directory `web` ; base, authentification et stockage sur Supabase ; une seule version de l'application en production.",
    "**Juridiques** : données au repos en Union européenne ; transferts vers les sous-traitants IA à encadrer ; information des personnes tierces citées dans les documents ; clauses d'usage raisonnable à faire rédiger par un juriste.",
    "**Budgétaires** : démarrage à coûts fixes minimaux (VPS déjà payé, outils gratuits) ; les coûts variables d'IA doivent rester proportionnés aux abonnements (document 07).",
    "**Éditoriales** : terminologie produit imposée (dossier, profil, Copilote, note d'investissement, checklist, contradictions, comparateur) ; ton et contenus en français.",
    "**Accessibilité** : WCAG 2.1 AA, contexte professionnel régulé.",
  ]);

  /* ------------------------------------------------------------------ 7 */
  d.h1("7. Architecture cible");
  d.p("L'architecture cible répartit le travail entre trois zones : l'hébergeur web pour ce qui répond en quelques secondes, un serveur dédié pour le traitement long, et la base Supabase comme source de vérité unique. Elle est décrite en détail dans le document 04. Les décisions qui engagent le cahier des charges sont :");
  d.ul([
    "**Pas de base vectorielle séparée** : les vecteurs restent dans la base principale, ce qui simplifie l'isolation et l'effacement.",
    "**Une file de jobs dans la base** et un worker qui exécute les analyses hors de toute contrainte de durée.",
    "**Un service d'ingestion** pour l'OCR et la conversion des fichiers Word et Excel.",
    "**n8n pour la supervision** (vélocité, purge, alertes), non pour le pipeline d'IA.",
  ]);

  /* ------------------------------------------------------------------ 8 */
  d.h1("8. Plan de réalisation par lots");
  d.fig("c01-feuille-de-route", "Schéma 1 — Lots et dépendances.");
  d.table(
    ["Lot", "Contenu", "Exigences", "Dépend de", "Critère d'acceptation"],
    [
      ["**0** Débloquer la production", "Revue RGPD d'Anthropic et de Voyage AI ; vérifier la dimension des vecteurs acceptée par Voyage ; dépôt direct vers le stockage ; limites des buckets ; région des fonctions Vercel", "F-011, F-020, F-085", "—", "Un PDF de 20 Mo se dépose ; un dossier test s'indexe de bout en bout"],
      ["**1** Fiabiliser le pipeline", "Vectorisation par lots ; contradictions lues sur l'extraction ; reformulations en parallèle ; bascule multi-passages", "F-015, F-032", "Lot 0", "Un dossier de 300 pages s'analyse ; coût par dossier ≤ 5,5 $ mesuré dans le journal d'usage"],
      ["**2** Worker et file de jobs", "Table de jobs, worker sur le VPS, progression visible, reprise", "F-031", "Lot 1, VPS actif", "Une panne en cours d'analyse reprend sans doubler le coût ; deux clics = une analyse"],
      ["**3** Ingestion lourde", "OCR ; Word et Excel", "F-013, F-014", "Lot 2", "Un PDF scanné et un fichier Excel produisent des passages citables"],
      ["**4** Qualité du RAG", "Recherche hybride, reclassement, flux continu, vérification des citations", "F-044 à F-046", "Lot 1", "≥ 95 % des citations vérifiées sur le jeu d'évaluation"],
      ["**5** Supervision", "Flux n8n : vélocité, purge, alertes d'échec et de coût", "F-074", "Lot 2", "Une alerte arrive sur un job abandonné"],
      ["**6** Conformité et sécurité", "Effacement complet, portabilité, MFA, en-têtes de sécurité, test d'intrusion, CGU, DPA", "F-007, F-081, F-083", "En continu", "Aucun écart ouvert dans le registre de conformité"],
      ["**7** Bêta et lancement", "Comptes payants réels, Stripe en production, plans d'hébergement adaptés", "F-070, F-075", "Lots 0 à 6", "Premiers abonnés facturés ; marge mesurée conforme au modèle"],
    ],
    [14, 30, 14, 14, 28],
    { size: 17 }
  );

  /* ------------------------------------------------------------------ 9 */
  d.h1("9. Critères de recette");
  d.p("Scénarios de bout en bout à rejouer avant chaque mise en production.");
  d.ol([
    "**Inscription** : créer un compte, vérifier la création de l'organisation, se déconnecter, se reconnecter.",
    "**Dépôt** : déposer un PDF de 20 Mo, un fichier Word, un fichier Excel, un PDF scanné ; chacun passe à l'état « indexé » ou affiche une erreur explicite.",
    "**Doublon** : déposer deux fois le même fichier ; le second n'est pas vectorisé de nouveau.",
    "**Analyse** : lancer l'analyse d'un dossier de 300 pages ; la progression s'affiche ; couper le worker en cours de route ; l'analyse reprend sans doublon de coût.",
    "**Profils** : passer d'un profil à l'autre ; aucun appel d'IA n'est émis ; sur Essentiel, les profils verrouillés proposent de changer d'offre.",
    "**Copilote** : poser dix questions dont trois complexes ; chaque citation s'ouvre sur le bon passage ; une citation altérée artificiellement est signalée comme non vérifiable.",
    "**Contrôles** : un dossier comportant deux chiffres contradictoires les détecte ; l'arbitrage est tracé.",
    "**Export** : exporter en PDF et en Word ; les ajouts épinglés y figurent ; le lien expire après dix minutes.",
    "**Quotas** : épuiser les quotas Essentiel ; le message est clair ; la consultation et l'export restent possibles ; le quota se réinitialise au prélèvement suivant.",
    "**Effacement** : supprimer un compte à un seul membre ; vérifier qu'aucun dossier, aucun fichier et aucun passage ne subsiste.",
    "**Isolation** : avec deux organisations, vérifier qu'aucune requête ne retourne de donnée de l'autre.",
  ]);

  /* ------------------------------------------------------------------ 10 */
  d.h1("10. Hypothèses et risques");
  d.table(
    ["Hypothèse ou risque", "Conséquence si elle ne se vérifie pas", "Parade"],
    [
      ["Les fournisseurs d'IA retenus sont jugés conformes", "Impossible d'activer le moteur d'IA", "Instruire des alternatives : modèles via un hébergeur européen, vectorisation auto-hébergée (document 08)"],
      ["Un dossier moyen fait ~300 pages et ~300 000 jetons", "Coûts et délais sous-estimés", "Mesurer dès le lot 1 sur des dossiers réels"],
      ["Le VPS Hostinger est accessible", "Lots 2, 3 et 5 retardés", "Vérifier avant d'engager le lot 2 ; les lots 0, 1 et 4 n'en dépendent pas"],
      ["Les plans gratuits suffisent au démarrage", "Pas de sauvegarde managée ; base limitée en taille ; usage commercial non autorisé sur certains plans", "Passer aux plans payants avant le premier client (document 07)"],
      ["Les prix affichés sont hors taxes", "Sinon la marge Essentiel devient négative dans le pire cas", "Trancher HT ou TTC (F-075)"],
    ],
    [32, 32, 36]
  );

  /* ------------------------------------------------------------------ 11 */
  d.h1("11. Glossaire");
  d.table(
    ["Terme", "Définition"],
    [
      ["Dossier", "Espace de travail consacré à une entreprise étudiée ; contient jusqu'à 50 documents"],
      ["Profil", "Angle de lecture métier d'un même dossier : PE/VC, M&A, Family Office, CFO, Audit, Généraliste, Personnalisé"],
      ["Extraction", "Lecture exhaustive du dossier produisant des indicateurs sourcés en six catégories ; faite une fois par dossier"],
      ["Copilote", "Assistant conversationnel répondant à partir des passages du dossier"],
      ["RAG", "Génération augmentée par recherche : le modèle ne répond qu'à partir de passages retrouvés dans les documents"],
      ["Passage (chunk)", "Morceau de texte d'environ 3 000 caractères, vectorisé pour la recherche"],
      ["Citation", "Référence à un document et une page, accompagnée de l'extrait cité"],
      ["RLS", "Sécurité au niveau des lignes : règles de la base qui limitent chaque requête aux données de l'organisation de l'utilisateur"],
      ["Siège", "Un utilisateur nommé dans une offre facturée à la personne"],
      ["Job", "Tâche longue placée dans une file et exécutée en arrière-plan"],
    ],
    [22, 78]
  );

  return d;
};
