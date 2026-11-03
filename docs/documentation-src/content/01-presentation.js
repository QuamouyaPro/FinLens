"use strict";
const { Doc } = require("../kit");
const M = require("../model");

module.exports = function build() {
  const d = new Doc({
    num: "01",
    title: "Note de présentation",
    subtitle: "Le copilote d'analyse financière des investisseurs",
    short: "Note de présentation",
    date: "3 novembre 2026",
    public: "Partenaires, investisseurs, premiers clients, équipe",
    perimetre: "Le produit, ses offres, et son état d'avancement réel — y compris ce qui n'est pas encore prêt",
    lead: "FinLens lit des centaines de pages de documents financiers, en extrait l'essentiel, le restitue selon l'angle de chaque métier, et répond aux questions en citant la page exacte. Cette note présente le produit tel qu'il est construit aujourd'hui.",
  });

  /* ------------------------------------------------------------------ 1 */
  d.h1("1. FinLens en bref");
  d.p("FinLens est une plateforme SaaS d'analyse documentaire pour les professionnels de l'investissement : Private Equity, Venture Capital, banques d'affaires, family offices, directions financières, cabinets d'audit et de conseil. L'utilisateur crée un **dossier par entreprise étudiée**, y dépose ses documents (rapports annuels, due diligences, bilans), et obtient une note d'analyse, un assistant conversationnel qui répond à partir de ces seuls documents, et des contrôles de cohérence entre pièces.");
  d.callout([
    "**La promesse produit : « 300 pages en 3 minutes, sans perdre la source. »**",
    "C'est un objectif de performance et de traçabilité. Le délai de trois minutes n'a pas encore été mesuré sur des dossiers réels (le moteur d'IA n'est pas activé en production, voir section 7). La traçabilité, en revanche, est déjà dans la conception : chaque donnée porte la page d'où elle vient.",
  ]);
  d.table(
    null,
    [
      ["**Produit**", "Plateforme web (Next.js) : site public, application connectée, mode démonstration sans compte"],
      ["**Utilisateurs**", "Analystes, associés, banquiers, CFO, auditeurs ; une offre d'entrée pour étudiants et veille personnelle"],
      ["**Ce qu'il produit**", "Une extraction exhaustive du dossier, six lectures métier de cette extraction, un score de risque par lecture, des contradictions détectées, une checklist de due diligence, un export PDF ou Word"],
      ["**Offres**", "Essentiel (23 €/mois), Analyste (690 €/mois), Fonds (à partir de 2 900 €/mois)"],
      ["**Hébergement des données**", "Données au repos dans l'Union européenne (Supabase, Francfort). Le traitement par l'IA fait intervenir des sous-traitants à encadrer : voir le document 06"],
      ["**Stade**", "Application complète côté interface et données ; moteur d'IA câblé mais non activé ; aucun client réel à ce jour"],
    ],
    [24, 76]
  );

  /* ------------------------------------------------------------------ 2 */
  d.h1("2. Le problème");
  d.p("Les investisseurs ont accès à toute l'information, mais manquent d'un outil rapide et sûr pour la traiter à grande échelle. Trois difficultés reviennent :");
  d.ul([
    "**Le volume.** Il faut lire et croiser des centaines de pages pour extraire quelques indicateurs précis : free cash flow, covenants bancaires, risques juridiques.",
    "**L'erreur humaine.** Retrouver une clause ou une note de bas de page dans un bilan de 300 pages est lent et sujet à l'oubli.",
    "**Le coût du temps.** Confier cette lecture à des analystes juniors est cher et plafonne le nombre de dossiers qu'un fonds peut examiner en parallèle.",
  ]);
  d.p("Les IA généralistes ne répondent pas à ce besoin : les professionnels les écartent par crainte des informations inventées et des fuites de données confidentielles. Il faut un outil spécialisé, sourcé et maîtrisé.");

  /* ------------------------------------------------------------------ 3 */
  d.h1("3. La solution");
  d.p("FinLens accompagne l'analyste de la réception des documents jusqu'à la note remise en comité. L'enchaînement tient en cinq gestes.");
  d.fig("p01-parcours-valeur", "Schéma 1 — Du document brut à la note sourcée.");
  d.table(
    ["Module", "Ce que fait l'utilisateur", "Ce que produit FinLens"],
    [
      ["**Data room**", "Dépose les documents dans un dossier (jusqu'à 50 fichiers)", "Texte extrait page par page, doublons écartés, indexation pour la recherche"],
      ["**Synthèse par profil**", "Choisit un profil : PE/VC, M&A, Family Office, CFO, Audit, Généraliste, ou Personnalisé", "Une note et un score de risque propres au profil ; changer de profil est instantané car toutes les lectures sont générées d'avance"],
      ["**Copilote**", "Pose des questions en langage naturel", "Une réponse limitée aux passages du dossier, avec le document et la page de chaque citation ; une réponse utile peut être épinglée à la note"],
      ["**Contrôles**", "Consulte les signaux", "Contradictions entre documents (deux passages côte à côte), checklist de due diligence, signaux centralisés"],
      ["**Comparateur**", "Sélectionne plusieurs dossiers (offres Analyste et Fonds)", "Un tableau comparatif ligne par ligne, chaque cellule reliée à sa source"],
      ["**Export**", "Demande la note finale", "Un PDF ou un document Word, avec les ajouts épinglés du Copilote"],
    ],
    [16, 34, 50]
  );
  d.p("**Un même dossier, plusieurs lectures.** Le moteur lit les documents une seule fois, puis reformule le résultat sous l'angle de chaque métier. Un associé de fonds et un auditeur ne cherchent pas la même chose dans le même bilan : le score de risque lui-même change selon le profil, parce que chaque profil pondère cinq axes différemment.");

  /* ------------------------------------------------------------------ 4 */
  d.h1("4. À qui s'adresse FinLens");
  d.table(
    ["Cible", "Besoin", "Profil d'analyse"],
    [
      ["Fonds de Private Equity et Venture Capital", "Screening rapide, thèse d'investissement, levier, multiples", "PE / VC"],
      ["Banques d'affaires (M&A)", "Structuration, synergies, clauses, risques juridiques", "M&A"],
      ["Family offices, analystes indépendants", "Solidité patrimoniale, diversification, long terme", "Family Office"],
      ["Directions financières", "Veille concurrentielle, benchmark sectoriel", "CFO"],
      ["Cabinets d'audit et de conseil", "Conformité, provisions, incohérences comptables", "Audit & Conseil"],
      ["Étudiants, curieux, non-spécialistes", "Résumé pédagogique, sans jargon", "Généraliste"],
    ],
    [34, 40, 26]
  );
  d.p("Le segment étudiant et veille personnelle est une porte d'entrée vers les offres professionnelles, pas la cible finale.");

  /* ------------------------------------------------------------------ 5 */
  d.h1("5. Ce qui différencie FinLens");
  d.ul([
    "**La citation de la page exacte, partout.** Chaque chiffre porte une pastille cliquable qui ouvre le passage d'origine. C'est le fil conducteur de toute l'interface.",
    "**Des réponses contraintes aux documents du dossier.** Le Copilote ne répond qu'à partir des passages retrouvés dans le dossier ; une donnée absente est marquée `[DONNÉE MANQUANTE]` au lieu d'être estimée.",
    "**Six lectures sans nouvelle analyse.** Changer d'angle métier ne relance aucun calcul coûteux : la lecture est déjà en base.",
    "**Le croisement des documents.** Les contradictions entre pièces d'un même dossier (par exemple un chiffre d'affaires de 14,0 M€ dans le teaser contre 12,8 M€ dans l'annexe) sont détectées et présentées côte à côte.",
    "**Un produit conçu pour un métier.** Vocabulaire, formats d'export, profils et checklists sont ceux de la finance d'investissement.",
    "**Des données au repos en Union européenne**, isolées par organisation, et un droit à la suppression réelle (corbeille de 30 jours puis purge).",
  ]);
  d.warn([
    "**Allégations commerciales à sécuriser.** La page d'accueil affiche aujourd'hui « Risque d'information inventée : Nul — RAG contraint ». Aucune architecture RAG ne garantit un risque nul, et une telle affirmation absolue est contestable. Formulation défendable : **réponses contraintes aux passages indexés, citation vérifiable par l'utilisateur, absence signalée plutôt qu'inventée**. Le document 08 propose un contrôle automatique des citations qui permettrait de chiffrer cette fiabilité plutôt que de l'affirmer.",
  ]);

  /* ------------------------------------------------------------------ 6 */
  d.h1("6. Les offres");
  d.table(
    ["Offre", "Prix", "Contenu", "Limites"],
    [
      ["**Essentiel**", "23 €/mois", "4 dossiers actifs simultanés, 3 profils d'analyse (Généraliste, CFO, Family Office), export PDF/Word illimité", "3 nouveaux dossiers analysés et 100 questions par mois ; pas de comparateur ; blocage automatique au dépassement"],
      ["**Analyste**", "690 €/mois (1 siège)", "Dossiers, documents, pages et questions illimités ; les six profils plus Personnalisé ; comparateur", "15 dossiers ouverts simultanément"],
      ["**Fonds**", "Sur devis, dès 2 900 €/mois", "5 sièges à 580 € ; 580 € par siège supplémentaire jusqu'au 10e, puis 630 € ; partage de dossiers", "15 dossiers ouverts par siège"],
    ],
    [14, 18, 38, 30]
  );
  d.p("Les deux logiques de marge diffèrent. Sur **Essentiel**, la marge unitaire est fine : des quotas fermes et visibles protègent le modèle. Sur **Analyste** et **Fonds**, le volume est illimité en apparence, et c'est le **routage des tâches vers le modèle d'IA le plus adapté** qui rend l'ensemble rentable (détail dans les documents 07 et 08).");
  d.small("Les notes sources ne précisent pas si les prix sont exprimés hors taxes ou toutes taxes comprises. L'écart compte sur l'offre Essentiel : voir le document 07, section 6.");

  /* ------------------------------------------------------------------ 7 */
  d.h1("7. Où en est le produit");
  d.p("État réel, relevé dans le code et dans la base à la date de cette note.");
  d.table(
    ["Brique", "État", "Précision"],
    [
      ["Site public, démonstration, prototype", "En place", "Accueil, tarifs, calculateur de ROI, mode démo complet sur `/demo`, prototype sur `/prototype`"],
      ["Comptes, organisations, isolation des données", "En place", "Inscription par e-mail ; 17 tables, toutes protégées par des règles d'accès par organisation"],
      ["Dossiers et documents PDF", "En place", "Dépôt, indexation, détection de doublons, corbeille et purge"],
      ["Analyse : extraction, six profils, score de risque", "En place", "Code complet. **Non exécuté en production** : les clés des fournisseurs d'IA ne sont pas configurées"],
      ["Copilote : réponses sourcées, panneau source", "En place", "Même réserve : fonctionne dès que les clés sont activées"],
      ["Contradictions, checklist, signaux, recherche globale", "En place", "Dépendent de l'analyse"],
      ["Comparateur, export PDF et Word", "En place", ""],
      ["Abonnements Stripe et quotas Essentiel", "En place", "À tester en conditions réelles"],
      ["Dossiers de grande taille (300 pages)", "Bloquant", "L'analyse actuelle s'exécute dans une seule requête web ; elle dépasserait la durée autorisée. Un traitement en arrière-plan est à construire"],
      ["Word, Excel, documents scannés", "À construire", "Seul le PDF avec couche texte est lu aujourd'hui"],
      ["Connexion Google et Microsoft", "À construire", "Retirée du produit en septembre, à reprendre"],
      ["Conformité : sous-traitants IA, effacement complet, CGU", "Partiel", "Revue en cours avant d'activer les clés d'IA ; voir le document 06"],
    ],
    [34, 14, 52]
  );
  d.callout([
    "**Ce que cela signifie concrètement.** L'interface, la base de données et les règles métier sont construites. Ce qui reste est de l'ordre de l'activation et de la fiabilisation : choisir les fournisseurs d'IA après revue de conformité, rendre l'analyse capable de traiter un vrai dossier, et lire Word, Excel et documents scannés. La base de données est vide : il n'existe encore aucune donnée client réelle, ce qui permet de corriger la conformité **avant** le premier client plutôt qu'après.",
  ]);

  /* ------------------------------------------------------------------ 8 */
  d.h1("8. Feuille de route");
  d.p("Huit lots, ordonnés par dépendance. Aucune date n'est engagée : la durée de chaque lot reste à estimer. Le détail, avec les critères d'acceptation, figure dans le cahier des charges (document 02).");
  d.fig("c01-feuille-de-route", "Schéma 2 — Feuille de route par lots.");

  /* ------------------------------------------------------------------ 9 */
  d.h1("9. Stratégie de lancement et vision");
  d.h2("9.1 Lancement progressif");
  d.ol([
    "**Validation experte** : offrir des analyses à cinq analystes en échange de retours sur la qualité des notes.",
    "**Bêta fermée** : ouvrir l'interface à une liste d'attente restreinte, facturer des abonnements « early bird ».",
    "**Acquisition** : démonstrations vidéo ciblant les associés de fonds, sur la base d'un cas réel (« comment analyser un rapport de 300 pages en quelques minutes »).",
  ]);
  d.h2("9.2 Vision à long terme");
  d.p("FinLens ne se limitera pas à lire des PDF. L'ambition est d'en faire le système d'exploitation de la due diligence : récupération automatique des data rooms, alertes sur les mouvements de marché, pré-rédaction des mémos d'investissement. Cette trajectoire suppose des agents capables d'agir, avec les garde-fous correspondants : elle est décrite, étape par étape, dans le document 08.");

  /* ------------------------------------------------------------------ 10 */
  d.h1("10. Risques principaux");
  d.table(
    ["Risque", "Nature", "Réponse"],
    [
      ["Confidentialité des documents (M&A, informations privilégiées)", "Confiance et conformité", "Isolation par organisation, hébergement UE au repos, revue des sous-traitants IA avant mise en production, engagement contractuel de non-entraînement"],
      ["Fiabilité des réponses", "Confiance", "Réponses contraintes aux passages indexés, citation cliquable, contrôle automatique des citations à construire ; discours : FinLens est un assistant, l'humain décide"],
      ["Coût des appels d'IA", "Économique", "Routage par tâche et cache de prompt ; correction du pipeline d'analyse, dont le coût réel dépasse aujourd'hui celui du modèle de prix (document 07)"],
      ["Concentration sur les gros contrats Fonds", "Économique", "Suivi du coût réel cumulé par contrat, palier tarifaire au-delà de dix sièges, clause de renégociation"],
      ["Dépendance à un fournisseur d'IA", "Stratégique", "Identifiants de modèles configurables ; benchmark interne à instaurer ; solutions de repli à câbler (document 08)"],
      ["Allégations commerciales trop absolues", "Juridique", "Reformuler les promesses de la page d'accueil (section 5)"],
    ],
    [30, 18, 52]
  );

  return d;
};
