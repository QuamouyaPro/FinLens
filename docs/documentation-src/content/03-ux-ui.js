"use strict";
const { Doc } = require("../kit");

module.exports = function build() {
  const d = new Doc({
    num: "03",
    title: "UX / UI — parcours et design",
    subtitle: "Comment l'utilisateur travaille, et comment l'interface s'efface devant la source",
    short: "UX / UI — parcours et design",
    date: "3 novembre 2026",
    public: "Designers, développeurs front, product owner",
    perimetre: "Architecture de l'information, parcours clés, écrans, système de design, accessibilité",
    lead: "FinLens s'adresse à des professionnels pressés qui doivent pouvoir vérifier ce qu'on leur dit. Toute la conception UX découle de là : l'interface montre la source avant de montrer l'IA.",
  });

  /* ------------------------------------------------------------------ 1 */
  d.h1("1. Principes de conception");
  d.p("Le système visuel s'appelle **The Quiet Auditor** : l'interface ressemble au travail de quelqu'un qui a déjà vérifié deux fois. Elle est sobre partout, sauf à un endroit : la page exacte d'où vient un fait.");
  d.table(
    ["Principe", "Traduction concrète dans l'interface"],
    [
      ["**La source avant l'explication**", "Une pastille de citation (`p.148`) accompagne chaque chiffre ou affirmation générée : synthèse, chat, indicateurs, comparateur, signaux, exports"],
      ["**Honnêteté sur l'origine du chiffre**", "Une donnée absente est affichée comme telle (`[DONNÉE MANQUANTE]`), jamais comblée par une estimation silencieuse. Dans les états financiers reconstruits (à construire), une ligne porte soit une page, soit un badge « estimé »"],
      ["**Changer d'angle ne coûte rien**", "Le sélecteur de profil bascule instantanément : les six lectures sont déjà en base. Aucun spinner à cet endroit"],
      ["**L'humain décide**", "Le produit présente, signale, cite ; il ne tranche pas. Les contradictions se « marquent comme arbitrées » par l'utilisateur"],
      ["**Une limite visible, assumée**", "Les plafonds (dossiers actifs, quotas Essentiel) sont affichés en permanence plutôt que découverts au blocage"],
      ["**Supprimer veut dire supprimer**", "La corbeille repose sur une date de purge réelle (`purge_at`) ; aucun masquage déguisé en suppression"],
    ],
    [30, 70]
  );

  /* ------------------------------------------------------------------ 2 */
  d.h1("2. Utilisateurs et archétypes de travail");
  d.warn("Ces archétypes sont dérivés des segments cibles de la note explicative. Ils ne proviennent **pas** d'entretiens utilisateurs : la phase de validation experte (cinq analystes) doit les confirmer ou les corriger.");
  d.table(
    ["Archétype", "Situation type", "Ce qu'il attend de l'écran", "Profil"],
    [
      ["Associé de fonds PE/VC", "Reçoit un teaser et un data room ; décide en quelques jours s'il approfondit", "Un score et les trois points qui font mal, avec leurs pages", "PE / VC"],
      ["Analyste M&A", "Prépare une note pour un comité ; cherche clauses et synergies", "Clauses, covenants, risques juridiques, exportables en Word", "M&A"],
      ["Gestionnaire de family office", "Évalue la solidité d'une participation sur le long terme", "Lecture patrimoniale, pas de jargon de transaction", "Family Office"],
      ["Directeur financier", "Compare son entreprise à des pairs", "Benchmark sectoriel, comparaison entre périodes", "CFO"],
      ["Auditeur", "Cherche les incohérences comptables et provisions", "Contradictions entre pièces, zones de risque à documenter", "Audit"],
      ["Étudiant, curieux", "Veut comprendre un rapport annuel", "Un résumé vulgarisé avec glossaire", "Généraliste"],
    ],
    [20, 30, 34, 16]
  );

  /* ------------------------------------------------------------------ 3 */
  d.h1("3. Architecture de l'information");
  d.fig("u01-navigation", "Schéma 1 — Carte de navigation : site public, application, dossier.");
  d.h2("3.1 Navigation principale");
  d.table(
    ["Entrée", "Rôle", "Accès"],
    [
      ["Tableau de bord", "Ce qui demande une décision aujourd'hui : dossiers actifs, risque, activité récente", "Toutes offres"],
      ["Dossiers", "Liste filtrable (actifs, archivés, corbeille) avec pastille de risque ; compteur dans la barre latérale", "Toutes offres"],
      ["Signaux", "Toutes les alertes de tous les dossiers ; compteur de non lus", "Toutes offres"],
      ["Recherche globale", "Une question posée à tous les dossiers actifs", "Toutes offres"],
      ["Comparateur", "Tableau comparatif de plusieurs dossiers", "Analyste, Fonds (cadenas sur Essentiel)"],
      ["Exports", "Historique des exports", "Toutes offres"],
      ["Facturation", "Offre, quotas, factures", "Toutes offres"],
      ["Équipe", "Sièges, partage de dossiers", "Fonds"],
      ["Réglages", "Profil, alertes, confidentialité, suppression de compte", "Toutes offres"],
    ],
    [22, 54, 24]
  );
  d.p("La barre latérale est **toujours sombre**, quel que soit le thème choisi : c'est la signature de la marque. Une palette de commandes (⌘K) donne accès à la navigation et à la recherche par nom de dossier. Sous 780 px de large, la barre devient un tiroir.");

  /* ------------------------------------------------------------------ 4 */
  d.h1("4. Parcours clés");
  d.p("Sept parcours couvrent l'usage. Pour chacun : ce que fait l'utilisateur, ce que montre l'interface, et les frictions connues relevées dans le code.");

  d.h2("4.1 Découverte et inscription");
  d.table(
    ["Étape", "Écran", "Point d'attention"],
    [
      ["Découvrir la promesse", "Accueil : hero sombre, démonstration interactive du Copilote à quatre questions, tableau comparatif, calculateur de ROI", "Le visiteur teste la promesse avant de créer un compte : c'est l'argument de conversion principal"],
      ["Explorer sans risque", "`/demo` : toute l'application sur données fictives", "Aucune clé d'API requise ; contenus extraits du prototype validé, jamais ressaisis"],
      ["Créer un compte", "Inscription par e-mail ; l'organisation est créée automatiquement", "La connexion Google/Microsoft est à reprendre ; la confirmation d'e-mail retarde l'accès"],
      ["Choisir une offre", "Facturation", "Prix à afficher avec mention HT ou TTC (document 07)"],
    ],
    [24, 40, 36]
  );

  d.h2("4.2 Déposer et analyser un dossier");
  d.table(
    ["Étape", "Écran", "Point d'attention"],
    [
      ["Créer le dossier", "Nom et type d'opération (due diligence, LBO, série A/B, screening, veille)", "Le type d'opération pilote la checklist et les questions suggérées"],
      ["Déposer les documents", "Onglet Documents : zone de dépôt, liste avec statut", "**Friction** : Word et Excel sont acceptés au dépôt puis refusés à l'indexation ; message d'erreur à améliorer"],
      ["Lancer l'analyse", "Onglet Synthèse : bouton d'analyse", "**Friction majeure** : aujourd'hui l'analyse s'exécute dans une seule requête, sans progression ; sur un dossier réel elle dépasse la durée autorisée. La cible est une progression par étape (« Profil 5 sur 8 »)"],
      ["Attendre", "—", "Aucun indicateur de durée n'existe. Une analyse de plusieurs minutes sans retour visuel est le principal risque d'abandon"],
    ],
    [24, 40, 36]
  );

  d.h2("4.3 Lire par profil");
  d.table(
    ["Étape", "Écran", "Point d'attention"],
    [
      ["Choisir un profil", "Sélecteur de sept pastilles au-dessus des onglets", "Sur Essentiel, quatre profils sont grisés avec un cadenas ; le clic propose de changer d'offre plutôt que de bloquer silencieusement"],
      ["Lire la synthèse", "Jauge de risque du profil, six indicateurs clés, résumé, bouton vers la note complète", "Le score change d'un profil à l'autre : l'interface doit expliquer pourquoi (cinq axes pondérés)"],
      ["Vérifier un chiffre", "Clic sur une pastille de citation → panneau source", "Le panneau montre l'extrait **reconstruit**, pas la page du PDF : le dire explicitement évite de laisser croire à un fac-similé"],
      ["Personnaliser", "Profil Personnalisé : cases à cocher par catégorie, douze maximum", "Cocher plus ou moins d'indicateurs ne change que l'aperçu chiffré, jamais l'analyse rédigée en dessous"],
    ],
    [24, 40, 36]
  );

  d.h2("4.4 Interroger le Copilote");
  d.table(
    ["Étape", "Écran", "Point d'attention"],
    [
      ["Poser une question", "Onglet Copilote : champ de saisie, suggestions", "La réponse complète n'apparaît qu'à la fin de la génération ; le flux continu est à construire"],
      ["Lire la réponse", "Texte avec renvois, bloc « Sources — la page exacte »", "Les citations non vérifiables devraient être signalées avant affichage (document 08)"],
      ["Épingler", "Bouton « Ajouter à ma note »", "Choix : profil actif seul ou tous les profils"],
      ["Atteindre le quota (Essentiel)", "Message de blocage", "La consultation, l'historique et les exports restent disponibles ; le message doit dire quand le quota se réinitialise"],
    ],
    [24, 40, 36]
  );

  d.h2("4.5 Contrôler");
  d.p("L'onglet **Contrôles** porte une pastille rouge quand une contradiction est ouverte. Chaque contradiction présente les deux passages côte à côte, une gravité (critique, à vérifier, mineure) et l'action « marquer comme arbitrée ». La checklist de due diligence, pré-chargée selon le type d'opération, signale ce qui exige une vérification manuelle.");

  d.h2("4.6 Exporter");
  d.p("L'onglet **Export** produit un PDF ou un document Word de la note du profil actif, avec les ajouts épinglés. Le lien de téléchargement expire au bout de dix minutes ; l'historique conserve la trace de chaque export. Le choix de modèle, de sections et d'annexe des pages sources est prévu mais incomplet.");

  d.h2("4.7 Gérer son abonnement et ses données");
  d.p("Facturation affiche les quotas fermes (Essentiel) ou la mention « illimité » (Analyste), et l'historique de factures. Réglages porte la suppression de compte. Aujourd'hui, la suppression d'un compte ne supprime pas les dossiers d'une organisation à un seul membre : l'écran ne doit pas promettre davantage tant que ce point n'est pas corrigé (document 06).");

  /* ------------------------------------------------------------------ 5 */
  d.h1("5. Anatomie de l'écran dossier");
  d.p("Le dossier est l'écran où se passe l'essentiel du travail. Six repères le structurent.");
  d.fig("u02-anatomie-dossier", "Schéma 2 — Les six repères de l'écran dossier.");
  d.table(
    ["Repère", "Composant", "Comportement"],
    [
      ["1", "Sélecteur de profil", "Sept pastilles, une active ; cadenas selon l'offre ; changement instantané"],
      ["2", "Onglets", "Synthèse, Documents (avec compteur), Copilote, Contrôles (pastille d'alerte), Export"],
      ["3", "Jauge de risque", "Anneau et nombre ; trois niveaux : maîtrisé (moins de 35), à surveiller (35 à 59), élevé (60 et plus)"],
      ["4", "Indicateurs clés", "Six par profil dans la synthèse ; chacun relié à sa source"],
      ["5", "Pastille de citation", "Petit repère à police mono avec loupe et numéro de page ; inversé au survol"],
      ["6", "Panneau source", "Volet latéral : document, page, passage surligné ; fermeture par Échap ou clic extérieur"],
    ],
    [10, 28, 62]
  );

  /* ------------------------------------------------------------------ 6 */
  d.h1("6. États et messages");
  d.p("Les écrans doivent traiter explicitement les états limites. Voici ceux qui existent ou doivent exister.");
  d.table(
    ["État", "Situation", "Message ou comportement attendu"],
    [
      ["Vide", "Aucun dossier", "Invitation à créer un premier dossier ; pas de tableau vide"],
      ["Vide", "Dossier sans document indexé", "Invitation à déposer des documents ; le bouton d'analyse reste inactif"],
      ["Chargement", "Indexation d'un document", "Statut « en cours » sur la ligne du document"],
      ["Chargement", "Analyse d'un dossier", "**À construire** : progression par étape et estimation de durée"],
      ["Erreur", "Document illisible ou format non supporté", "Message explicite sur la ligne, avec la cause et l'action possible"],
      ["Verrouillé", "Profil ou comparateur réservé", "Cadenas, puis invitation à changer d'offre"],
      ["Quota atteint", "Essentiel : 3 analyses ou 100 questions", "Blocage clair ; lecture, historique et exports restent ouverts ; date de réinitialisation"],
      ["Anti-rafale", "Plus de 15 questions en une minute", "« Merci de patienter quelques instants » ; pas d'accusation"],
      ["Donnée absente", "Information non trouvée dans les documents", "Mention `[DONNÉE MANQUANTE]` plutôt qu'une valeur approximative"],
      ["Corbeille", "Dossier supprimé", "Date de purge affichée ; action « restaurer »"],
    ],
    [14, 36, 50]
  );

  /* ------------------------------------------------------------------ 7 */
  d.h1("7. Système de design");
  d.p("Le détail complet figure dans `DESIGN.md` à la racine du dépôt. Les points structurants :");
  d.h2("7.1 Couleurs");
  d.table(
    ["Rôle", "Sombre (défaut)", "Clair", "Usage"],
    [
      ["Accent « Verified Emerald »", "#43D48D", "#146B45", "Action principale et pastilles de citation — jamais en fond de section"],
      ["Fond", "#090A0A", "#F6F7F5", "Teinté, jamais noir ni blanc purs"],
      ["Surface", "#131516", "#FFFFFF", "Cartes, champs"],
      ["Danger", "#FF7C68", "#A63A2E", "Contradictions, actions destructives"],
      ["Signal", "#F0B65E", "#A9741A", "À vérifier, avertissements"],
      ["Info", "#6FB3E8", "#2E6B99", "États informatifs"],
      ["Panneaux « encre »", "#08090A → #0E1211", "identique", "Barre latérale, hero, bandeaux : fixes dans les deux thèmes"],
    ],
    [26, 18, 18, 38]
  );
  d.h2("7.2 Typographie");
  d.table(
    ["Usage", "Police", "Règle"],
    [
      ["Titres, autorité", "Fraunces (serif)", "Affichage et titres uniquement ; la phrase de thèse en italique accent"],
      ["Lecture, interface", "Instrument Sans", "Corps à 15 px, interligne 1,55"],
      ["Chiffres, références, sources", "JetBrains Mono", "**Règle** : tout ce qui est en mono doit être traçable à un document ou à un calcul ; jamais décoratif"],
    ],
    [28, 24, 48]
  );
  d.h2("7.3 Règles nommées");
  d.ul([
    "**Rare Accent** : l'émeraude marque au plus une action principale et les pastilles de citation par écran. Si plus d'une poignée d'éléments sont verts, quelque chose est sur-marqué.",
    "**Fixed Ink** : la barre latérale, le hero public et les bandeaux d'appel à l'action restent sombres dans les deux thèmes.",
    "**No Hard Shadow** : toute ombre est large, douce et peu opaque.",
    "**Pas de carte dans une carte** : séparer par une bordure ou un changement de fond.",
    "**Mono-Means-Sourced** : la police mono signale « vérifié ».",
  ]);
  d.h2("7.4 Composants signature");
  d.p("La **pastille de citation** est la marque reconnaissable du produit : un petit repère teinté avec une loupe et un numéro de page, qui s'inverse au survol. Sa grande sœur, la **carte source**, associe numéro de page et nom du document dans une liste sous chaque réponse. Tous les autres composants existent pour que celui-ci soit digne de confiance.");

  /* ------------------------------------------------------------------ 8 */
  d.h1("8. Accessibilité");
  d.p("Cible : WCAG 2.1 niveau AA, confirmée pour un usage en environnement professionnel régulé.");
  d.table(
    ["Exigence", "État", "À contrôler"],
    [
      ["Contraste du texte secondaire ≥ 4,5:1", "Partiel", "Le gris de texte discret a été ajusté pour passer l'AA sur surface et surface 2 ; auditer les deux thèmes et les pastilles"],
      ["Navigation clavier complète, focus visible", "Partiel", "Champs avec anneau de focus ; vérifier le panneau source (fermeture par Échap présente), la palette de commandes et les onglets"],
      ["`prefers-reduced-motion` respecté", "Partiel", "À vérifier sur le hero, les courbes d'évolution et les révélations au défilement"],
      ["Rôles et noms accessibles", "Partiel", "Panneau source déclaré en dialogue modal avec libellé ; vérifier le piégeage du focus"],
      ["Information jamais portée par la couleur seule", "À vérifier", "Les niveaux de risque ont un libellé en plus de la couleur ; vérifier la jauge et les puces d'état"],
      ["Tableaux avec en-têtes de colonne déclarés", "En place", "Tableau comparatif de la page d'accueil avec `scope=\"col\"`"],
    ],
    [38, 14, 48]
  );

  /* ------------------------------------------------------------------ 9 */
  d.h1("9. Adaptation aux écrans");
  d.table(
    ["Largeur", "Comportement"],
    [
      ["Au-dessus de 1 080 px", "Hero en deux colonnes (environ 55 / 45) ; grilles de 3 à 4 colonnes ; zone de contenu de l'application jusqu'à 1 400 px (les tableaux financiers ont besoin de place)"],
      ["780 à 1 080 px", "Une colonne pour le hero ; grilles à deux colonnes"],
      ["Sous 780 px", "Barre latérale en tiroir ouvert par un bouton, fermé à chaque navigation ; grilles à une colonne ; sommaire de la note en bandeau d'onglets défilant"],
    ],
    [26, 74]
  );

  /* ------------------------------------------------------------------ 10 */
  d.h1("10. Évolutions UX prioritaires");
  d.table(
    ["Évolution", "Pourquoi", "Dépend de"],
    [
      ["Progression de l'analyse par étape", "Supprime le principal risque d'abandon", "File de jobs (document 04)"],
      ["Réponse du Copilote en flux continu", "Réponse perçue immédiate", "Lot 4"],
      ["Signalement des citations non vérifiables", "Rend la promesse « page exacte » mesurable", "Vérification des citations"],
      ["Onglet « Chiffres clés »", "Matérialise la promesse : ne plus fouiller les documents", "Extraction enrichie"],
      ["Messages d'erreur d'indexation explicites", "Word, Excel et scans sont les premiers cas d'échec", "Lot 3"],
      ["Mention HT ou TTC et date de réinitialisation des quotas", "Évite deux malentendus fréquents", "Décision commerciale"],
      ["Connexion Google et Microsoft", "Réduit la friction d'inscription", "Reprise du code retiré"],
    ],
    [34, 40, 26]
  );

  /* ------------------------------------------------------------------ 11 */
  d.h1("11. Mesurer l'expérience");
  d.p("Aucune mesure d'usage n'est encore en place côté produit. Indicateurs proposés, à instrumenter avant la bêta :");
  d.table(
    ["Indicateur", "Définition", "Ce qu'il révèle"],
    [
      ["Délai jusqu'à la première note", "Du dépôt du premier document à l'ouverture d'une note de profil", "La promesse « 3 minutes » est-elle tenue ?"],
      ["Taux d'ouverture des citations", "Citations cliquées / réponses affichées", "L'utilisateur vérifie-t-il ? Fait-il confiance ?"],
      ["Profils consultés par dossier", "Nombre de profils différents ouverts", "La valeur des six lectures est-elle perçue ?"],
      ["Abandon pendant l'analyse", "Départs entre le lancement et la première note", "Gravité de la friction d'attente"],
      ["Questions par dossier", "Moyenne et distribution", "Intensité d'usage ; calibrage du coût (document 07)"],
      ["Ajouts épinglés par dossier", "Ajouts / dossiers analysés", "Le Copilote nourrit-il réellement la note finale ?"],
    ],
    [28, 40, 32]
  );

  return d;
};
