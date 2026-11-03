"use strict";
const { Doc } = require("../kit");
const M = require("../model");

module.exports = function build() {
  const d = new Doc({
    num: "08",
    title: "Stratégie IA — benchmark, routage, RAG et agents",
    subtitle: "Quels modèles, pour quelles tâches, avec quelle fiabilité, et jusqu'où aller",
    short: "Stratégie IA",
    date: "3 novembre 2026",
    statut: "Stratégie et protocole — aucun benchmark interne n'a encore été exécuté",
    public: "Direction produit, développeurs, responsable qualité",
    perimetre: "Modèles, routage par tâche, prompts, cache, RAG, évaluation, contradictions, agents",
    lead: "Toute la promesse de FinLens repose sur la qualité de la lecture et la fidélité des citations. Ce document décrit comment l'IA est utilisée aujourd'hui, ce qui est fragile, et comment le mesurer avant de l'affirmer.",
  });

  /* ------------------------------------------------------------------ 1 */
  d.h1("1. Principes");
  d.ul([
    "**L'IA augmente l'analyste, elle ne le remplace pas.** Le produit présente, cite, signale ; l'humain décide. Aucune décision n'est prise par FinLens.",
    "**Le modèle qui lit et juge reste le meilleur.** L'extraction exhaustive d'un dossier et la comparaison passent toujours par le modèle premium. Le reste est confié à un modèle moins cher, sans perte de qualité perceptible.",
    "**Une affirmation sans source n'est pas une réponse.** Toute sortie factuelle porte un document, une page et un extrait.",
    "**Mesurer avant d'affirmer.** Une promesse de fiabilité doit être adossée à un indicateur, pas à une architecture.",
    "**Ne pas dépendre d'un seul fournisseur.** Les identifiants de modèles sont configurables ; un repli et un benchmark permettent d'en changer.",
    "**Confidentialité par construction.** On n'envoie au modèle que ce qui est nécessaire, et on n'en garde pas le contenu dans les journaux (document 06).",
  ]);
  d.alert([
    "**État de la mesure.** Les clés des fournisseurs ne sont pas configurées : le moteur d'IA n'a jamais été exécuté sur un vrai dossier. Les coûts de ce document sont des **calculs**, pas des relevés ; les délais sont des **ordres de grandeur** ; la qualité d'extraction et la fidélité des citations sont **inconnues**. Le protocole de la section 3 sert à les mesurer.",
  ]);

  /* ------------------------------------------------------------------ 2 */
  d.h1("2. Les modèles");
  d.table(
    ["Modèle", "Tarif ($/M jetons, entrée / sortie)", "Rôle", "Câblé"],
    [
      ["**Claude Fable 5**", "10 / 50", "Extraction exhaustive, comparateur, contradictions, questions complexes", "En place"],
      ["**Claude Sonnet 5**", "2 / 10", "Reformulation par profil, Copilote par défaut", "En place"],
      ["**Claude Haiku 4.5**", "1 / 5", "Classification de complexité, classement des ajouts épinglés", "En place"],
      ["Claude Opus (repli)", "5 / 25", "Remplaçant prévu du modèle premium en cas d'indisponibilité", "À construire"],
      ["Gemini 2.5 Flash / Flash-Lite", "0,30 / 2,50 et 0,10 / 0,40", "Micro-tâches internes (nettoyage, tri) — optimisation future", "À construire"],
      ["GPT-5.5", "5 / 30", "Référence de marché uniquement", "—"],
      ["**Voyage AI `voyage-3-large`**", "Voir le fournisseur", "Embeddings des passages et des questions ; reclassement prévu", "En place"],
    ],
    [24, 24, 38, 14]
  );
  d.p("Les identifiants de modèles sont lus dans des variables d'environnement (`ANTHROPIC_MODEL_FABLE_5` et suivantes) : un renommage de modèle ne demande aucune modification du code. Le repli vers un modèle de substitution est **prévu dans la configuration mais pas câblé** : aucun code ne bascule aujourd'hui si le modèle premium est indisponible.");

  /* ------------------------------------------------------------------ 3 */
  d.h1("3. Benchmark : protocole proposé");
  d.p("Un benchmark compare des options sur des critères mesurables, avec des documents réels. Il n'en existe pas encore. Voici ce qu'il faut mesurer, sur quoi, et comment décider.");
  d.h2("3.1 Ce qu'on compare");
  d.table(
    ["Décision à éclairer", "Options comparées", "Critère principal"],
    [
      ["Modèle d'extraction", "Fable 5 · modèle de repli · Sonnet 5 en extraction", "Rappel et précision des indicateurs, citations exactes, coût"],
      ["Modèle de reformulation", "Sonnet 5 · Haiku 4.5", "Fidélité à l'extraction, qualité rédactionnelle par profil, coût"],
      ["Classification de complexité", "Haiku 4.5 · règle simple (longueur, mots-clés)", "Concordance avec un étiquetage humain, coût"],
      ["Embeddings", "`voyage-3-large` · alternative européenne · modèle auto-hébergé", "Rappel@k sur des questions réelles, français et anglais, coût, conformité"],
      ["Reclassement", "Avec / sans reclassement", "Gain de rappel@8, latence, coût"],
      ["Stratégie de lecture", "Corpus complet en contexte · RAG · hybride", "Qualité, coût, taille maximale supportée"],
    ],
    [24, 40, 36]
  );
  d.h2("3.2 Sur quoi : le jeu d'évaluation");
  d.ul([
    "**15 à 20 dossiers réels, anonymisés ou publics**, couvrant : rapport annuel français, rapport annuel anglais, due diligence, teaser plus annexes, bilans, documents scannés, tableaux denses, un dossier de 300 pages et un de plus de 1 000 pages.",
    "**Une vérité terrain** établie par un analyste : pour chaque dossier, une liste d'indicateurs attendus avec leur page, quelques contradictions volontairement présentes, vingt à trente questions avec leur passage de réponse.",
    "**Des documents publics d'abord** (rapports annuels publiés) : ils permettent de lancer le benchmark sans attendre la revue de conformité (document 06).",
  ]);
  d.h2("3.3 Quoi mesurer");
  d.table(
    ["Mesure", "Définition", "Cible proposée"],
    [
      ["**Rappel d'extraction**", "Indicateurs attendus effectivement extraits / indicateurs attendus", "≥ 90 %"],
      ["**Précision d'extraction**", "Indicateurs extraits corrects (valeur et page) / indicateurs extraits", "≥ 95 %"],
      ["**Exactitude des citations**", "Citations dont l'extrait figure mot pour mot dans la page citée / citations", "≥ 95 %"],
      ["**Taux d'invention**", "Valeurs absentes des documents présentées comme présentes", "≤ 1 %"],
      ["**Honnêteté sur l'absence**", "Questions sans réponse dans le dossier pour lesquelles le modèle répond `[DONNÉE MANQUANTE]`", "≥ 90 %"],
      ["**Rappel@8 de la recherche**", "Questions dont le bon passage figure parmi les 8 envoyés au modèle", "≥ 90 %"],
      ["**Détection de contradictions**", "Rappel et précision sur les contradictions injectées", "À fixer après premier essai"],
      ["**Coût par dossier et par question**", "Relevé dans `usage_logs`", "≤ 5,5 $ par dossier de 300 pages"],
      ["**Latence**", "Délai du dépôt à la première note ; premier mot du Copilote", "≤ 5 min ; < 5 s"],
    ],
    [26, 54, 20]
  );
  d.h2("3.4 Règle de décision");
  d.p("Changer de modèle ou de stratégie n'est justifié que si la mesure montre un gain net : qualité au moins égale sur toutes les mesures de fidélité (exactitude des citations, taux d'invention), **et** un coût ou une latence meilleurs, **et** une conformité équivalente. Un gain de coût obtenu au prix d'une baisse de fidélité est refusé. Le benchmark est rejoué à chaque changement de modèle, de prompt ou de paramètre de recherche, en mode « ombre » (nouvelle option exécutée en parallèle, sans effet visible) avant bascule.");

  /* ------------------------------------------------------------------ 4 */
  d.h1("4. Routage par tâche");
  d.fig("i01-routage", "Schéma 1 — Routage des modèles par tâche.");
  d.table(
    ["Tâche", "Modèle", "Déclencheur", "Garde-fou"],
    [
      ["Extraction exhaustive", "Fable 5", "Une fois par dossier", "Sortie JSON ; donnée absente marquée ; 8 192 jetons de sortie au plus"],
      ["Reformulation par profil", "Sonnet 5", "Après l'extraction ; trois ou six profils selon l'offre", "Ne relit pas le corpus ; conserve les citations telles quelles"],
      ["Contradictions", "Fable 5", "Après l'extraction", "**Aujourd'hui sur le corpus complet ; cible : sur l'extraction** (section 8)"],
      ["Question du Copilote", "Sonnet 5, ou Fable 5 si complexe", "Chaque message", "Classification préalable par Haiku 4.5 ; 2 048 jetons de sortie au plus"],
      ["Comparateur", "Fable 5", "À la demande (Analyste, Fonds)", "Réservé aux offres professionnelles"],
      ["Classement d'un ajout", "Haiku 4.5", "À l'épinglage", "—"],
      ["Classification de complexité", "Haiku 4.5", "Chaque question", "Sortie limitée à 50 jetons"],
    ],
    [22, 20, 26, 32],
    { size: 17 }
  );
  d.h2("4.1 Critère d'escalade du Copilote");
  d.p("Une question est jugée complexe si elle demande une comparaison entre documents ou périodes, un calcul multi-documents ou un jugement transverse. Elle passe alors sur le modèle premium, au tarif plein et sans cache (le cache est propre à chaque modèle). Le taux d'escalade est un indicateur à suivre : un contrat dont le taux est structurellement élevé est un signal de coût (document 07).");
  d.h2("4.2 Ce qui manque au routage");
  d.ul([
    "**Repli** : si le modèle premium est indisponible, le modèle de substitution n'est pas câblé.",
    "**Journal de la classification inexact** : les jetons de la classification sont écrits en dur (50 et 10) au lieu d'être relevés ; le coût réel de cette tâche est ainsi approximé.",
    "**Tâche `contradictions` journalisée comme `extraction`** : le suivi par tâche confond les deux postes, alors que c'est précisément leur écart qu'il faut mesurer.",
    "**Budget par job** : aucune limite de jetons ou de coût par analyse ; un job qui s'emballe n'est pas interrompu.",
  ]);

  /* ------------------------------------------------------------------ 5 */
  d.h1("5. Prompts");
  d.table(
    ["Prompt", "Fichier", "Rôle donné au modèle"],
    [
      ["Extraction", "`lib/ai/prompts/extraction.ts`", "« Moteur d'extraction financière de FinLens » ; six catégories ; sortie JSON stricte ; règle d'absence de donnée"],
      ["Profils", "`lib/ai/prompts/profils.ts`", "Rédacteur de la note pour un profil, avec un angle de lecture ; ne relit pas le corpus ; JSON : résumé, score de risque, axes, indicateurs clés, note complète"],
      ["Chat", "`lib/ai/prompts/chat.ts`", "Copilote répondant à partir des passages fournis ; JSON : réponse, sources, complexité"],
      ["Comparateur et contradictions", "`lib/ai/prompts/comparateur.ts`", "Tableau structuré ; liste d'écarts avec deux sources"],
      ["Classement", "`lib/ai/prompts/classement.ts`", "Rangement d'un ajout dans une catégorie"],
      ["Taxonomie et règle absolue", "`lib/ai/prompts/taxonomy.ts`", "Six catégories détaillées ; règle commune « ne réponds qu'à partir du texte fourni »"],
    ],
    [20, 30, 50]
  );
  d.p("**La règle commune** (zéro hallucination) est : ne répondre qu'à partir du texte fourni, citer document, page et paragraphe pour chaque donnée chiffrée, et marquer `[DONNÉE MANQUANTE]` plutôt qu'estimer. C'est une consigne, pas une garantie : seul un contrôle programmatique des sorties la rend vérifiable.");
  d.h2("5.1 Pratiques à instaurer");
  d.ul([
    "**Valider chaque sortie JSON** par un schéma (la bibliothèque `zod` est déjà une dépendance) et relancer une fois en cas d'échec, au lieu d'écrire une réponse mal formée. Aujourd'hui, la réponse est analysée puis stockée telle quelle.",
    "**Versionner les prompts** : un numéro de version dans chaque résultat stocké, pour rejouer ou comparer.",
    "**Tester chaque modification de prompt** sur le jeu d'évaluation avant mise en production.",
    "**Traiter le contenu des documents comme des données**, jamais comme des instructions (injection) : consignes dans la partie système, documents dans la partie utilisateur, balises de délimitation.",
    "**Température basse** : elle est de 0,2 par défaut ; la conserver pour les tâches factuelles.",
  ]);

  /* ------------------------------------------------------------------ 6 */
  d.h1("6. Cache de prompt");
  d.p("Le cache d'Anthropic relit un contexte déjà envoyé à 10 % du tarif d'entrée, contre 1,25 fois ce tarif pour l'écrire (palier d'une heure, rafraîchi à chaque appel). Il est propre à chaque modèle. C'est le levier qui rend le chat et les reformulations peu coûteux.");
  d.table(
    ["Usage", "Principe", "Efficacité attendue"],
    [
      ["Six reformulations", "Le même contexte (l'extraction) est relu par les six appels émis coup sur coup ; seul le premier paie le tarif plein", "**Bonne** — à condition que le contexte soit placé dans la partie mise en cache"],
      ["Chat", "Le contexte d'une session est relu à chaque question", "**Probablement faible tel que codé** — voir ci-dessous"],
      ["Extraction, comparateur", "Appels isolés", "Marginale"],
      ["Escalade vers le modèle premium", "Aucun cache à relire", "Nulle ; prix plein"],
    ],
    [24, 46, 30]
  );
  d.h2("6.1 Constat sur le cache du chat");
  d.p("Dans le code du Copilote, le bloc mis en cache est celui des **passages retrouvés pour la question en cours**. Or ces passages changent à chaque question, puisque la recherche renvoie les huit plus proches de chaque nouvelle question. Deux conséquences :");
  d.ul([
    "**Lorsque le cache est considéré comme expiré** (première question, ou plus d'une heure d'écart), le contexte est placé dans le message de l'utilisateur et **n'est pas mis en cache du tout**.",
    "**Lorsqu'il n'est pas expiré**, le bloc est marqué pour le cache, mais comme son contenu diffère d'une question à l'autre, il est **réécrit** (à 1,25 fois le tarif d'entrée) au lieu d'être relu à 10 %. Le cache peut donc, dans ce cas, **coûter davantage** qu'il n'économise.",
  ]);
  d.p("Le coût de 0,02 $ par question de la note Coûts & Pricing suppose un cache efficace ; sans lui, la note source retient 0,06 $ pour un usage espacé et 0,09 $ si tout passait par le modèle premium sans optimisation.");
  d.callout([
    "**Correctif proposé.** Mettre en cache un préfixe **stable** : les consignes, plus un résumé du dossier (l'extraction JSON, d'environ 20 000 jetons) identique à toutes les questions d'une session, puis ajouter après lui les passages propres à la question. L'extraction étant déjà produite, ce préfixe est disponible et relisible à 10 %. À valider par la mesure du taux de succès du cache (`cache_read_tokens` dans `usage_logs`) avant et après.",
  ]);

  /* ------------------------------------------------------------------ 7 */
  d.h1("7. RAG : recherche et citation");
  d.fig("i02-rag", "Schéma 2 — Pipeline RAG : état de chaque étape.");
  d.h2("7.1 Aujourd'hui");
  d.table(
    ["Étape", "Réalisation", "Limite"],
    [
      ["Extraction du texte", "`unpdf`, page par page", "Aucun OCR ; les tableaux perdent leur structure (le texte est linéarisé) ; Word et Excel refusés"],
      ["Découpage", "3 000 caractères, chevauchement de 300, dans les limites d'une page", "Un tableau financier long est coupé ; un passage ne porte pas son contexte (titre de section, entité, période)"],
      ["Embeddings", "`voyage-3-large`, dimension 1 536 demandée, un seul appel par document", "Pas de lots ; **dimension à vérifier** auprès du fournisseur (document 04)"],
      ["Index", "HNSW, distance cosinus ; fonction `match_document_chunks` filtrée sur le dossier", "Pas d'index plein texte"],
      ["Récupération", "8 passages les plus proches de la question", "Le sens ressort bien ; les chiffres, références et noms exacts moins"],
      ["Génération", "Sonnet 5 ou Fable 5, réponse JSON avec sources", "Les sources sont déclarées par le modèle lui-même"],
      ["Citation", "Pastille cliquable et panneau source", "Aucune vérification que l'extrait cité existe vraiment"],
    ],
    [18, 40, 42],
    { size: 17 }
  );
  d.h2("7.2 Améliorations, par ordre de rapport qualité / effort");
  d.table(
    ["#", "Amélioration", "Effet attendu", "Effort", "Dépend de"],
    [
      ["1", "**Vérification des citations** : contrôler que l'extrait renvoyé figure, mot pour mot après normalisation, dans l'un des passages fournis ; signaler sinon", "Rend la promesse de la page exacte mesurable ; détecte les citations inventées", "Faible", "Rien"],
      ["2", "**Vectorisation par lots**, dimension vérifiée", "L'indexation fonctionne", "Faible", "Rien"],
      ["3", "**Cache d'un préfixe stable** pour le chat (section 6)", "Coût par question divisé par un facteur à mesurer", "Faible", "Rien"],
      ["4", "**Recherche hybride** : vectorielle et plein texte français (`unaccent`, `pg_trgm`), fusion par rangs réciproques", "Meilleure récupération des chiffres et termes exacts", "Moyen", "Index GIN"],
      ["5", "**Reclassement** : réordonner ~30 passages par pertinence avant d'en garder 8", "Gain de rappel@8", "Moyen", "Recherche hybride"],
      ["6", "**OCR et Word, Excel**", "Documents réels exploitables", "Élevé", "Service d'ingestion"],
      ["7", "**Découpage conscient de la structure** : conserver les tableaux entiers, titrer chaque passage (entité, période, section)", "Moins de passages ambigus ; meilleure lecture des tableaux financiers", "Élevé", "Extraction structurée"],
      ["8", "**Contexte ajouté à chaque passage** avant vectorisation (une courte phrase situant le passage dans le document)", "Réduit les échecs de récupération sur des passages sans contexte", "Moyen", "Coût de génération à chiffrer"],
      ["9", "**Diversification entre documents** : éviter que les huit passages viennent du même fichier", "Meilleure couverture des questions croisées", "Moyen", "Mesure sur le jeu d'évaluation"],
      ["10", "**Flux continu de la réponse**", "Réponse perçue immédiate", "Moyen", "Rien"],
    ],
    [5, 38, 28, 12, 17],
    { size: 17 }
  );
  d.h2("7.3 Extraction exhaustive et très gros dossiers");
  d.p("La fenêtre de contexte du modèle premium (1 million de jetons, soit 1 500 à 3 000 pages) couvre la quasi-totalité des dossiers en un seul appel. Au-delà, la bascule en résumé multi-passages prévue n'est pas implémentée. Conception proposée :");
  d.ol([
    "**Segmenter** par document, puis par section ou par tranche de pages, en conservant la numérotation de page d'origine.",
    "**Extraire par segment** avec le même prompt et la même taxonomie, en parallèle.",
    "**Fusionner** : réunir les indicateurs, dédupliquer, conserver toutes les sources ; une même donnée trouvée à deux endroits garde ses deux citations.",
    "**Réconcilier** : une seconde passe, courte, signale les valeurs divergentes entre segments — c'est aussi une source de contradictions.",
  ]);
  d.p("Le coût suit le volume d'entrée : il est proportionnel au nombre de pages, pas multiplié par le nombre de segments.");

  /* ------------------------------------------------------------------ 8 */
  d.h1("8. Détection de contradictions");
  d.table(
    ["", "Aujourd'hui", "Cible"],
    [
      ["Entrée du modèle", "Corpus complet du dossier (≈ 300 000 jetons)", "Extraction structurée (≈ 20 000 jetons)"],
      ["Coût par dossier", `≈ ${M.contradictionsActuel.toFixed(2).replace(".", ",")} $`, `≈ ${M.contradictionsV2.toFixed(2).replace(".", ",")} $`],
      ["Principe", "Le modèle relit tout pour repérer des écarts", "Le modèle compare des indicateurs déjà extraits et sourcés, puis **retourne chercher les passages** concernés pour confirmer"],
      ["Risque", "Coûteux ; l'écart peut échapper dans un long contexte", "Une contradiction n'apparaît que si les deux valeurs ont été extraites : à mesurer par rappel sur des contradictions injectées"],
    ],
    [20, 38, 42]
  );
  d.p("La cible tire parti du fait que l'extraction contient déjà, pour chaque indicateur, ses sources dans tous les documents du dossier : c'est précisément le matériau nécessaire pour voir qu'un chiffre d'affaires du teaser diffère de celui de l'annexe. Une étape de **confirmation** relit les deux passages cités avant de produire l'alerte, ce qui limite les faux positifs. Les contradictions portant sur un fait que l'extraction n'a pas capté (clause rédigée différemment, par exemple) sont un angle mort à mesurer : si le rappel est insuffisant, une lecture ciblée par recherche hybride des clauses sensibles peut le compléter sans relire tout le corpus.");

  /* ------------------------------------------------------------------ 9 */
  d.h1("9. Agents");
  d.p("La vision à long terme (document 01) fait de FinLens le système d'exploitation de la due diligence : récupérer des data rooms, surveiller des événements, pré-rédiger des mémos. Cela suppose des **agents**, c'est-à-dire des systèmes où le modèle choisit lui-même des actions. La progression doit être graduée : chaque marche accroît l'autonomie **et** les garde-fous.");
  d.fig("i03-agents", "Schéma 3 — Feuille de route des agents.");
  d.table(
    ["Niveau", "Description", "Exemples", "Garde-fous indispensables"],
    [
      ["**0 — Assistant**", "Le modèle répond, l'humain décide. Aucune action sur le monde", "Copilote, notes par profil — **en place**", "Citations vérifiées ; journal d'usage"],
      ["**1 — Automatisations**", "Tâches enchaînées déclenchées par un événement, jamais par le modèle", "Analyse en file, contrôles automatiques, alertes de coût", "Reprise, idempotence, plafond de coût par job"],
      ["**2 — Agents supervisés**", "Le modèle choisit parmi des outils **en lecture seule** pour accomplir un objectif borné", "Complétude documentaire (quels documents manquent pour ce type d'opération ?), veille sur les signaux du portefeuille", "Outils en lecture seule ; budget de jetons et d'étapes ; validation humaine avant tout effet visible"],
      ["**3 — Agents rédacteurs et connecteurs**", "Le modèle produit un livrable ou accède à des systèmes externes", "Pré-rédaction d'un mémo d'investissement ; récupération de data rooms ; lecture de messageries", "Périmètre et droits minimaux ; consentement explicite ; journal complet ; relecture obligatoire ; revue de conformité propre à chaque connecteur"],
    ],
    [16, 26, 28, 30],
    { size: 17 }
  );
  d.h2("9.1 Cas d'usage priorisés");
  d.table(
    ["Cas", "Valeur", "Niveau", "Pourquoi cet ordre"],
    [
      ["Complétude documentaire", "Dit à l'analyste ce qui manque avant de perdre du temps", "1 à 2", "Utilise la checklist et le type d'opération existants ; outils en lecture seule ; faible risque"],
      ["Veille sur les signaux", "Remonte les contradictions et risques qui changent", "2", "S'appuie sur des données déjà produites"],
      ["Pré-rédaction de mémo", "Assemble une note d'investissement à partir des profils et des ajouts épinglés", "2 à 3", "Valeur forte ; risque de contenu non vérifié : citations obligatoires et relecture"],
      ["Connecteurs de data rooms", "Supprime le dépôt manuel", "3", "Dépend de contrats avec des éditeurs tiers et d'une revue de sécurité par connecteur"],
      ["Alertes de marché", "Croise documents internes et données de marché", "3", "Hors périmètre de la version 1 ; exige une source de données de marché"],
    ],
    [22, 32, 10, 36],
    { size: 17 }
  );
  d.h2("9.2 Principes de conception d'un agent");
  d.ul([
    "**Moindre privilège** : un agent n'a que les outils et les droits de la tâche ; aucun accès en écriture tant qu'un humain n'a pas validé.",
    "**Budgets** : nombre d'étapes, de jetons et de coût plafonnés par exécution ; arrêt et alerte au dépassement.",
    "**Hors du navigateur** : les agents s'exécutent dans le worker, avec la file de jobs, la reprise et le journal.",
    "**Isolation** : un agent n'accède qu'aux données de l'organisation qui l'a lancé.",
    "**Défense contre l'injection** : un document ne doit jamais pouvoir faire exécuter une action ; c'est le risque majeur dès que le modèle dispose d'outils.",
    "**Traçabilité** : chaque action, chaque outil appelé et chaque sortie sont journalisés, sans le contenu confidentiel dans les journaux.",
    "**Évaluation** : un jeu de scénarios rejoué à chaque changement, comme pour le RAG.",
  ]);

  /* ------------------------------------------------------------------ 10 */
  d.h1("10. Observabilité et gouvernance de l'IA");
  d.table(
    ["Besoin", "Mécanisme", "État"],
    [
      ["Coût de chaque appel", "`usage_logs` (modèle, jetons, cache, coût)", "Partiel"],
      ["Coût par job et par dossier", "Agrégation de `usage_logs` par dossier ; identifiant de job", "À construire"],
      ["Taux de succès du cache", "`cache_read_tokens` / jetons d'entrée", "À construire"],
      ["Qualité en continu", "Jeu d'évaluation rejoué ; part de citations vérifiées en production", "À construire"],
      ["Dérive du taux d'escalade", "`chat_messages.complexity_label`", "À construire"],
      ["Changement de modèle ou de prompt", "Mode ombre, comparaison sur le jeu d'évaluation, bascule progressive", "À construire"],
      ["Plafonds de dépense", "Limites mensuelles côté fournisseurs ; alerte à 70 %", "À construire"],
      ["Journal sans contenu", "Seuls volumes et coûts sont conservés", "En place"],
    ],
    [30, 52, 18]
  );

  /* ------------------------------------------------------------------ 11 */
  d.h1("11. Feuille de route IA");
  d.table(
    ["Étape", "Contenu", "Résultat attendu"],
    [
      ["**0** Préalables", "Revue de conformité des fournisseurs ; vérifier la dimension des vecteurs ; clé d'évaluation sur documents publics", "Possibilité de mesurer"],
      ["**1** Mesurer", "Constituer le jeu d'évaluation ; exécuter le benchmark de la section 3 ; relever le coût réel par dossier", "Chiffres réels à la place des estimations"],
      ["**2** Fiabiliser", "Vectorisation par lots ; contradictions sur l'extraction ; validation de schéma ; cache d'un préfixe stable ; vérification des citations", "Coût et fidélité conformes aux cibles"],
      ["**3** Améliorer la récupération", "Recherche hybride, reclassement, flux continu, découpage structuré", "Rappel@8 ≥ 90 %"],
      ["**4** Étendre", "OCR, Word, Excel ; très gros dossiers ; repli de modèle", "Documents réels, continuité de service"],
      ["**5** Agents de niveau 1 et 2", "Complétude documentaire, veille", "Premières automatisations utiles"],
      ["**6** Agents de niveau 3", "Pré-rédaction de mémo, connecteurs", "Après revue de conformité propre à chaque connecteur"],
    ],
    [20, 52, 28]
  );

  /* ------------------------------------------------------------------ 12 */
  d.h1("12. Risques");
  d.table(
    ["Risque", "Effet", "Parade"],
    [
      ["Citation inventée ou mal attribuée", "Perte de confiance, cœur de la promesse atteint", "Vérification programmatique ; indicateur publié en interne"],
      ["Extraction incomplète sur dossiers longs ou tabulaires", "Notes fausses par omission", "Jeu d'évaluation incluant tableaux et gros dossiers ; découpage structuré"],
      ["Injection d'instructions par un document", "Notes ou citations manipulées ; critique avec des agents", "Séparation des consignes et des données ; validation de sortie ; pas d'outil à effet de bord sans validation"],
      ["Dérive silencieuse après changement de modèle ou de prompt", "Régression de qualité non vue", "Jeu d'évaluation rejoué, mode ombre"],
      ["Coût qui s'emballe", "Marge négative", "Budget par job, plafonds fournisseurs, suivi du ratio coût / facture"],
      ["Indisponibilité du fournisseur", "Service interrompu", "Repli de modèle câblé ; reprise des jobs"],
      ["Refus de conformité d'un fournisseur", "Moteur d'IA inutilisable", "Options B et C du document 06"],
      ["Promesse commerciale absolue", "Risque juridique et de réputation", "Formuler ce qui est mesuré : citation vérifiable, absence signalée"],
    ],
    [30, 32, 38]
  );

  return d;
};
