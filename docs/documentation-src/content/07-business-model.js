"use strict";
const { Doc } = require("../kit");
const M = require("../model");

const fmt = (n, d = 0) =>
  n
    .toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d })
    .replace(/[  ]/g, " ")
    .replace(/−/g, "-");
const eur = (n, d = 0) => `${fmt(n, d)} €`;
const eurA = (n) => (Math.abs(n) < 100 ? eur(n, 2) : eur(n, 0));
const usd = (n, d = 2) => `${fmt(n, d)} $`;
const pct = (n) => `${fmt(n * 100, 0)} %`;

module.exports = function build() {
  const d = new Doc({
    num: "07",
    title: "Business model, pricing, coûts et prévisionnel",
    subtitle: "Ce que FinLens vend, ce que cela coûte, et ce que cela rapporte",
    short: "Business model, pricing, coûts et prévisionnel",
    date: "3 novembre 2026",
    statut: "Modèle de travail — chiffres de coûts sourcés, scénarios de demande illustratifs",
    public: "Direction, investisseurs, partenaires",
    perimetre: "Offres, structure de coûts, marges par scénario d'usage, seuils de rentabilité, sensibilités",
    lead: "Les coûts de ce document viennent de la note Coûts & Pricing et du code. Les volumes de clients, eux, ne viennent de nulle part : aucune demande n'a encore été mesurée. Ils sont donc présentés comme des scénarios d'illustration, jamais comme des prévisions.",
  });

  const S = Object.fromEntries(M.scenarios.map((s) => [s.id, s]));

  /* ------------------------------------------------------------------ 1 */
  d.h1("1. Résumé");
  d.table(
    ["Sujet", "Constat"],
    [
      ["**Modèle**", "Trois abonnements : Essentiel à 23 €/mois avec quotas fermes, Analyste à 690 €/mois et Fonds dès 2 900 €/mois, illimités en apparence et protégés par le routage des tâches vers le modèle d'IA le plus adapté"],
      ["**Coûts fixes**", `Très faibles : environ ${eur(M.fixesActuels, 0)} par mois aujourd'hui, environ ${eur(M.fixesProd, 0)} une fois les plans d'hébergement adaptés à un usage commercial (à confirmer)`],
      ["**Coût dominant**", `L'extraction exhaustive d'un dossier (≈ 4,50 $ sur ~300 pages) : environ ${pct(M.COUT.extraction / (M.COUT.extraction + M.COUT.reformulation6))} du coût d'analyse dans le modèle de la note Coûts & Pricing`],
      ["**Constat majeur**", `Le modèle de marge **ne compte pas** la détection de contradictions, que le code exécute pour chaque analyse en relisant le corpus complet sur le modèle premium : **+${usd(M.contradictionsActuel)} par dossier**, soit +${pct(M.contradictionsActuel / (M.COUT.extraction + M.COUT.reformulation6))} sur le coût d'analyse. Avec ce coût, plusieurs scénarios d'usage intensif passent en marge négative (section 5)`],
      ["**Correctif**", `Faire lire les contradictions sur l'extraction déjà produite ramène ce poste à environ ${usd(M.contradictionsV2)} : les marges retrouvent à 1 à 5 points près celles du modèle`],
      ["**Question de prix**", `Si le prix de 23 € est TTC, ou si l'engagement annuel (deux mois offerts) est choisi, l'offre Essentiel perd entre 5 et 17 points de marge et devient négative dans le pire cas (section 6)`],
      ["**Rentabilité**", `Un seul abonnement Analyste (marge unitaire ≈ ${eur(M.margeUnitaire.analyste)} par mois après coûts d'IA et frais de paiement) couvre les charges fixes actuelles. Le seuil de rentabilité est atteint à un nombre de clients très faible ; l'incertitude porte sur la demande, pas sur la structure de coûts`],
    ],
    [20, 80]
  );

  /* ------------------------------------------------------------------ 2 */
  d.h1("2. Proposition de valeur et marché");
  d.h2("2.1 Ce que FinLens remplace");
  d.p("La note explicative situe FinLens face à trois alternatives : une IA généraliste (rapide mais non sourcée et exposée aux informations inventées), un analyste junior (2 à 3 jours par dossier, coûteux), la lecture manuelle (2 à 3 jours, sujette à l'erreur). La page d'accueil porte un calculateur qui traduit cette comparaison en euros.");
  d.h2("2.2 L'argument de valeur, chiffré");
  d.p(`Le calculateur de retour sur investissement de la page d'accueil part de valeurs par défaut modifiables : ${M.roi.dossiers} dossiers par mois, ${M.roi.heures} heures de lecture par dossier, ${M.roi.coutHoraire} € de coût horaire chargé, et une reprise de ${pct(M.roi.part)} du temps de lecture par FinLens (la décision reste humaine).`);
  d.table(
    ["Élément", "Calcul", "Résultat"],
    [
      ["Économie mensuelle", `${M.roi.dossiers} × ${M.roi.heures} h × ${M.roi.coutHoraire} € × ${pct(M.roi.part)}`, eur(M.roi.economieMensuelle)],
      ["Économie annuelle", "× 12", eur(M.roi.economieAnnuelle)],
      ["Abonnement Analyste annuel", "690 € × 12", eur(M.roi.abonnementAnnuel)],
      ["Gain net annuel", "", eur(M.roi.net)],
      ["Multiple de retour", "économie annuelle / abonnement", `${fmt(M.roi.multiple, 1)}×`],
    ],
    [30, 46, 24]
  );
  d.small("Ces hypothèses sont celles du calculateur ; elles illustrent l'ancrage du prix sur la valeur (690 € pour plus de 7 600 € d'économie mensuelle supposée) mais n'ont pas été validées auprès de clients.");
  d.h2("2.3 Ce qui n'est pas connu");
  d.ul([
    "**Taille de marché** : aucun chiffre sourcé n'existe dans les notes ; il serait inventé ici. À établir à partir de sources publiques (nombre de fonds, banques d'affaires, cabinets ciblés en France et en Europe).",
    "**Consentement à payer** : 690 € par mois n'a pas été éprouvé. La phase de validation experte (cinq analystes) doit le tester.",
    "**Attrition et durée de vie client** : inconnues.",
    "**Coût d'acquisition** : la stratégie prévue (démonstrations vidéo, ciblage direct des associés) est peu coûteuse en euros mais gourmande en temps.",
  ]);

  /* ------------------------------------------------------------------ 3 */
  d.h1("3. Le modèle économique");
  d.h2("3.1 Les trois offres");
  d.table(
    ["", "Essentiel", "Analyste", "Fonds"],
    [
      ["**Prix**", "23 €/mois", "690 €/mois (1 siège)", "Sur devis, dès 2 900 €/mois (5 sièges à 580 €)"],
      ["**Sièges supplémentaires**", "—", "—", "580 € jusqu'au 10e, 630 € au-delà"],
      ["**Dossiers**", "4 actifs ; 3 nouveaux analysés par mois", "Illimités ; 15 ouverts", "Illimités ; 15 ouverts par siège"],
      ["**Questions**", "100 par mois", "Illimitées", "Illimitées"],
      ["**Profils**", "3 sur 6 (Généraliste, CFO, Family Office)", "6 + Personnalisé", "6 + Personnalisé"],
      ["**Comparateur**", "Non", "Oui", "Oui"],
      ["**Équipe, partage**", "Non", "Non", "Oui"],
      ["**Engagement annuel**", "Deux mois offerts", "Deux mois offerts", "Sur devis"],
    ],
    [20, 26, 26, 28]
  );
  d.h2("3.2 Deux logiques de protection de la marge");
  d.ul([
    "**Essentiel : des quotas fermes.** La marge unitaire ne tolère pas l'usage illimité. Les plafonds sont affichés et le dépassement bloque l'accès aux nouvelles analyses et questions, jusqu'au prochain prélèvement ; consultation, historique et exports restent disponibles.",
    "**Analyste et Fonds : le routage.** L'IA qui lit et juge les documents reste le modèle premium ; celle qui reformule ou converse est un modèle environ cinq fois moins cher, avec escalade automatique sur les questions complexes. Le cache de prompt réduit encore la relecture du contexte. Le seul plafond visible est le nombre de dossiers ouverts simultanément (15 par siège).",
  ]);
  d.h2("3.3 Garde-fous des gros contrats Fonds");
  d.p("Les sièges d'une même équipe intensifient leur usage ensemble (même opération, même période) : le risque ne se dilue pas comme entre clients distincts. Le dispositif se fonde sur le **coût réel cumulé du contrat rapporté à la facture**, mesuré dans la table `contract_cost_tracking` :");
  d.table(
    ["Coût réel / facture", "Action"],
    [
      ["Moins de 40 %", "Normal, aucune action"],
      ["40 à 70 %", "Surveillance automatique interne, sans contact client"],
      ["70 à 100 %", "Contact commercial proactif : comprendre l'usage, pas restreindre l'accès"],
      ["Plus de 100 % sur deux cycles consécutifs", "Clause de renégociation tarifaire déclenchée pour le renouvellement"],
    ],
    [40, 60]
  );
  d.p("S'y ajoutent : un palier à 630 € par siège au-delà de dix sièges, une vérification manuelle avant l'ajout massif et soudain de sièges, et une réserve de 10 à 15 % de la marge des comptes en usage normal conservée comme coussin plutôt que distribuable.");

  /* ------------------------------------------------------------------ 4 */
  d.h1("4. Structure de coûts");
  d.h2("4.1 Coûts fixes");
  d.table(
    ["Poste", "Montant mensuel", "Remarque"],
    [
      ...M.FIXES_ACTUELS.map(([n, v, r]) => [n, eur(v, 2), r]),
      ["**Sous-total actuel**", `**${eur(M.fixesActuels, 2)}**`, "Vercel, Supabase, GitHub, Coolify, n8n : plans gratuits ou open source"],
      ...M.FIXES_PROD_A_VERIFIER.map(([n, v, r]) => [n, eur(v, 2), r]),
      ["**Total cible production**", `**${eur(M.fixesProd, 2)}**`, "Hors courrier transactionnel, suivi d'erreurs, juridique et marketing (à chiffrer)"],
    ],
    [32, 18, 50]
  );
  d.p("Le serveur Hostinger est un coût **engagé et non utilisé** (270 € pour deux ans) : tant que le worker n'y tourne pas, il ne produit aucune valeur. Stripe prélève environ 1,5 % + 0,25 € par transaction, soit " + eur(M.fraisStripe(23), 2) + " sur un abonnement Essentiel, " + eur(M.fraisStripe(690), 2) + " sur un abonnement Analyste et " + eur(M.fraisStripe(2900), 2) + " sur un contrat Fonds de cinq sièges.");
  d.small("Les tarifs publics des plans payants d'hébergement (Vercel, Supabase) sont indicatifs et à confirmer avant décision. Les plans gratuits ne conviennent pas à un usage commercial : le plan gratuit de Vercel est réservé à un usage non commercial, et celui de Supabase n'offre ni sauvegarde managée ni garantie de service.");

  d.h2("4.2 Coûts variables d'intelligence artificielle");
  d.table(
    ["Modèle", "Entrée ($/M jetons)", "Sortie ($/M jetons)", "Usage dans FinLens"],
    [
      ["Claude Fable 5", "10", "50", "Extraction exhaustive, comparateur, contradictions, questions complexes — **toujours** sur l'analyse"],
      ["Claude Sonnet 5", "2", "10", "Reformulation par profil, Copilote par défaut"],
      ["Claude Opus (repli)", "5", "25", "Prévu en repli si le modèle premium est indisponible ; **non câblé**"],
      ["Claude Haiku 4.5", "1", "5", "Classification de complexité, classement des ajouts"],
      ["Gemini 2.5 Flash", "0,30", "2,50", "Micro-tâches internes — non câblé"],
      ["Gemini 2.5 Flash-Lite", "0,10", "0,40", "Nettoyage, tri — non câblé"],
      ["GPT-5.5 (référence)", "5", "30", "Comparatif de marché, non utilisé"],
    ],
    [22, 18, 18, 42]
  );
  d.p("Le **cache de prompt** relit un contexte à 10 % du tarif d'entrée (contre 1,25 fois pour l'écrire, palier d'une heure). Il est propre à chaque modèle. Hypothèse de conversion de la note source : 1 $ ≈ 1 €.");

  d.h2("4.3 Coût d'un dossier analysé");
  d.fig("b02-cout-dossier", "Schéma 1 — Coût d'analyse d'un dossier de ~300 pages, avant et après correction du pipeline.");
  d.table(
    ["Tâche", "Base de calcul", "Coût unitaire"],
    [
      ["Extraction exhaustive", "Fable 5, ~300 000 jetons en entrée, ~20 000 en sortie", "≈ 4,50 $"],
      ["Six reformulations par profil", "Sonnet 5, ~8 000 en entrée et ~2 500 en sortie par profil, cache dès la deuxième", "≈ 0,25 à 0,30 $"],
      ["Trois reformulations (Essentiel)", "Mêmes conditions", "≈ 0,13 à 0,15 $"],
      ["**Détection de contradictions — pipeline actuel**", "Fable 5, corpus complet (~300 000 en entrée) + ~2 000 en sortie", `**≈ ${usd(M.contradictionsActuel)}** (non comptée dans la note source)`],
      ["Détection de contradictions — après correction", "Fable 5 lisant l'extraction (~20 000 en entrée, ~4 000 en sortie)", `≈ ${usd(M.contradictionsV2)}`],
      ["Une question du Copilote", "Sonnet 5 majoritaire, escalade ponctuelle, cache", "≈ 0,02 $ (usage dense) à 0,06 $ (usage espacé)"],
      ["Une comparaison de deux dossiers", "Fable 5", "≈ 6 $"],
      ["Un ajout épinglé", "Haiku 4.5", "< 0,01 $"],
    ],
    [30, 46, 24]
  );
  d.small("Le coût de ~0,02 $ par question suppose un usage dense, qui maximise le cache. Voir le document 08 : le cache du chat tel que codé risque de ne pas produire cet effet.");

  /* ------------------------------------------------------------------ 5 */
  d.h1("5. Marges par scénario d'usage");
  d.h2("5.1 Les marges de la note Coûts & Pricing, et leur recalcul");
  d.p("La note source calcule la marge de neuf scénarios. Le tableau ci-dessous reprend ces neuf scénarios (colonnes « note source »), puis les recalcule en ajoutant le coût des contradictions pour chaque nouveau dossier analysé : d'abord avec le pipeline **actuel**, puis **après correction**.");
  d.table(
    ["Scénario", "Facture", "Note source : coût / marge", "Pipeline actuel : coût / marge", "Après correction : coût / marge"],
    M.scenarios.map((s) => [
      `**${s.offre}** — ${s.libelle.toLowerCase()}`,
      eur(s.facture),
      `${eurA(s.coutNominal)} / ${pct(s.margeNominale)}`,
      { t: `${eurA(s.coutActuel)} / ${pct(s.margeActuelle)}`, color: s.margeActuelle < 0 ? "A63A2E" : undefined, b: s.margeActuelle < 0 },
      `${eurA(s.coutV2)} / ${pct(s.margeV2)}`,
    ]),
    [28, 10, 20, 21, 21],
    { size: 17 }
  );
  d.fig("b01-marges", "Schéma 2 — Marge brute par scénario : modèle source, pipeline actuel, après correction.");
  d.small("Essentiel : la fourchette de la note source pour l'usage normal (5,25 à 6,45 €) est ramenée à son milieu. Coût des contradictions : " + usd(M.contradictionsActuel) + " (actuel) et " + usd(M.contradictionsV2) + " (après correction) par dossier analysé ; ordre de grandeur à confirmer par mesure dès l'activation des clés.");

  d.h2("5.2 Lecture");
  d.ul([
    `**Avec le pipeline actuel, trois scénarios passent en marge négative** : Essentiel au quota maximum (${pct(S["ess-max-ok"].margeActuelle)} et ${pct(S["ess-max-ko"].margeActuelle)}) et Fonds de dix sièges en usage extrême (${pct(S["fon-extreme"].margeActuelle)}). Analyste en usage extrême tombe à ${pct(S["ana-extreme"].margeActuelle)}.`,
    `**Après correction**, tous les scénarios redeviennent positifs, avec un plancher de ${pct(S["ess-max-ko"].margeV2)} sur Essentiel et de ${pct(S["fon-extreme"].margeV2)} sur Fonds en usage extrême.`,
    "**Le correctif n'est donc pas une optimisation de confort** : il conditionne la viabilité du modèle de prix. Il fait partie du lot 1 du cahier des charges.",
    `**L'usage normal reste très rentable** dans tous les cas : ${pct(S["ess-normal"].margeV2)} sur Essentiel, ${pct(S["ana-normal"].margeV2)} sur Analyste, ${pct(S["fon-normal"].margeV2)} sur Fonds.`,
  ]);
  const perDossier = M.COUT.extraction + M.COUT.reformulation6 + M.contradictionsV2 + 25 * M.COUT.question_min;
  d.p(`**Ordre de grandeur utile** : après correction, un dossier analysé avec vingt-cinq questions coûte environ ${usd(perDossier)}. Un abonnement Analyste à 690 € absorbe donc l'analyse d'environ ${fmt(690 / perDossier, 0)} dossiers par mois avant d'atteindre la marge zéro, soit largement plus que les « 20 à 60 » des scénarios de la note source.`);

  /* ------------------------------------------------------------------ 6 */
  d.h1("6. Fragilité de l'offre Essentiel");
  d.p("L'offre d'entrée est la plus exposée, parce que son prix ne laisse que peu de marge à l'imprévu. Deux questions de présentation commerciale la touchent directement.");
  d.h2("6.1 Prix hors taxes ou toutes taxes comprises ?");
  d.p("Les notes sources comptent 23 € comme du chiffre d'affaires. Or l'offre Essentiel s'adresse aussi à des particuliers, pour lesquels un prix est habituellement affiché TTC. Aucun écran de l'application ne précise la mention. Si 23 € est TTC, le chiffre d'affaires est de " + eur(M.essentielHT, 2) + " hors taxes (TVA à 20 %).");
  d.table(
    ["Scénario Essentiel (coûts de la note source)", "Coût", "Marge si 23 € HT", "Marge si 23 € TTC"],
    M.essentielTva.map((e) => [e.cas, eur(e.cout, 2), pct(e.margeSiHT), { t: pct(e.margeSiTTC), color: e.margeSiTTC < 0 ? "A63A2E" : undefined, b: e.margeSiTTC < 0 }]),
    [38, 20, 21, 21]
  );
  d.h2("6.2 Effet de l'engagement annuel");
  d.p("La page des tarifs propose deux mois offerts en cas d'engagement annuel : un abonné annuel paie 10 mois sur 12, soit un prix mensuel effectif de " + eur((23 * 10) / 12, 2) + " pour Essentiel. Marges après correction du pipeline, selon le mode de facturation :");
  d.table(
    ["Scénario", "Facture mensuelle", "Marge (mensuel)", "Facture effective annuelle", "Marge (annuel)"],
    M.scenarios.map((s) => {
      const an = (s.facture * 10) / 12;
      const m = (an - s.coutV2) / an;
      return [`**${s.offre}** — ${s.libelle.toLowerCase()}`, eur(s.facture), pct(s.margeV2), eurA(an), { t: pct(m), color: m < 0.05 ? "A63A2E" : undefined, b: m < 0.05 }];
    }),
    [34, 16, 16, 18, 16],
    { size: 17 }
  );
  d.warn("**À décider** : (1) la mention HT ou TTC de chaque prix, (2) si l'engagement annuel concerne aussi Essentiel, dont le pire cas devient alors négatif, (3) si le quota de 100 questions et de 3 analyses reste adapté. Les deux effets se cumulent : un abonné Essentiel annuel avec un prix TTC encaisse 15,97 € hors taxes par mois.");

  /* ------------------------------------------------------------------ 7 */
  d.h1("7. Prévisionnel");
  d.warn([
    "**Ce que ce chapitre est, et n'est pas.** Aucune demande n'a été mesurée : il n'existe ni client, ni liste d'attente chiffrée, ni taux de conversion. Les volumes de clients ci-dessous sont des **scénarios d'illustration** choisis pour montrer le comportement du modèle, pas des prévisions. Ce qui est fiable, ce sont les coûts unitaires et les seuils de rentabilité, qui ne dépendent pas de la demande. À remplacer par les résultats de la phase de validation et de la bêta.",
  ]);

  d.h2("7.1 Seuils de rentabilité");
  d.p(`Marge unitaire mensuelle après coûts d'IA (usage normal, pipeline corrigé) et frais de paiement : Analyste ${eur(M.margeUnitaire.analyste)} ; Essentiel ${eur(M.margeUnitaire.essentielHT, 2)} (23 € HT) ou ${eur(M.margeUnitaire.essentielTTC, 2)} (23 € TTC). Nombre de clients nécessaires pour couvrir une enveloppe de charges mensuelles :`);
  d.table(
    ["Charges mensuelles couvertes", "Abonnés Analyste", "Abonnés Essentiel (23 € HT)", "Abonnés Essentiel (23 € TTC)"],
    M.seuils.map((s) => [
      `${eur(s.budget)} ${s.budget === 150 ? "(phase ultra-lean)" : s.budget === 300 ? "(MVP, bas)" : s.budget === 800 ? "(MVP, haut)" : "(SaaS B2B)"}`,
      String(s.analystes),
      String(s.essentielHT),
      String(s.essentielTTC),
    ]),
    [34, 20, 24, 22]
  );
  d.small("Les enveloppes sont celles de la note explicative (150 €, 300 à 800 €, 1 500 € et plus par mois).");

  d.h2("7.2 Trois instantanés illustratifs");
  d.p("Chaque instantané décrit un mois « en régime » avec un mélange d'abonnés donné, au coût d'usage normal et avec le pipeline corrigé. Un contrat Fonds est compté à cinq sièges.");
  d.table(
    ["", ...M.instantanes.map((i) => i.nom)],
    [
      ["**Abonnés Essentiel**", ...M.instantanes.map((i) => String(i.ess))],
      ["**Abonnés Analyste**", ...M.instantanes.map((i) => String(i.ana))],
      ["**Contrats Fonds (5 sièges)**", ...M.instantanes.map((i) => String(i.fon))],
      ["**Chiffre d'affaires mensuel**", ...M.instantanes.map((i) => eur(i.ca))],
      ["Coûts variables d'IA", ...M.instantanes.map((i) => eur(-i.variable))],
      ["Frais de paiement", ...M.instantanes.map((i) => eur(-i.stripe))],
      ["**Marge avant charges de structure**", ...M.instantanes.map((i) => eur(i.avantStructure))],
      ["Charges de structure (enveloppe)", ...M.instantanes.map((i) => eur(-i.structure))],
      ["**Résultat mensuel**", ...M.instantanes.map((i) => eur(i.resultat))],
      ["Réserve de marge (12,5 % de la marge sur coûts d'IA)", ...M.instantanes.map((i) => eur(i.reserve))],
    ],
    [40, 20, 20, 20]
  );
  d.small("Les enveloppes de structure (300, 800 et 1 500 €) sont celles de la note explicative : elles intègrent en partie le budget d'IA, qui est ici compté à part, ce qui surestime les charges (approche prudente). Elles n'incluent pas de rémunération. Essentiel est compté à 23 € HT. La réserve est un coussin à conserver, non un résultat distribuable.");

  d.h2("7.3 Sensibilité au taux de change");
  d.p("Les coûts d'IA sont facturés en dollars, les prix en euros. La note source retient 1 $ ≈ 1 €. Effet d'un écart sur la marge d'usage normal, pipeline corrigé :");
  const rates = [0.9, 1.0, 1.1, 1.2];
  const norm = [
    ["Essentiel (23 € HT)", 23, M.coutNormal.essentiel],
    ["Analyste", 690, M.coutNormal.analyste],
    ["Fonds, 5 sièges", 2900, M.coutNormal.fonds5],
  ];
  const ext = [
    ["Analyste — usage extrême", 690, S["ana-extreme"].coutV2],
    ["Fonds 10 sièges — usage extrême", 5800, S["fon-extreme"].coutV2],
  ];
  d.table(
    ["Marge brute", ...rates.map((r) => `1 $ = ${fmt(r, 2)} €`)],
    [...norm, ...ext].map(([n, f, c]) => [n, ...rates.map((r) => pct((f - c * r) / f))]),
    [40, 15, 15, 15, 15]
  );
  d.p("Le modèle absorbe sans difficulté une dépréciation de 20 % de l'euro sur l'usage normal ; ce sont les scénarios extrêmes qui s'amincissent.");

  d.h2("7.4 Investissements ponctuels à prévoir");
  d.table(
    ["Poste", "Montant", "Remarque"],
    [
      ["Rédaction des CGU, CGV, politique de confidentialité, DPA", "À chiffrer", "Prérequis du lancement (document 06)"],
      ["Analyse d'impact (si retenue)", "À chiffrer", "Document 06"],
      ["Test d'intrusion par un tiers", "À chiffrer", "Avant le lancement"],
      ["Plans d'hébergement adaptés à un usage commercial", `≈ ${eur(M.FIXES_PROD_A_VERIFIER.reduce((a, r) => a + r[1], 0))} par mois`, "Récurrent, à confirmer"],
      ["Courrier transactionnel, suivi d'erreurs", "À chiffrer", "Récurrent ; paliers gratuits possibles au démarrage"],
      ["Crédits d'IA pour la phase d'évaluation sur documents publics", "À chiffrer", "Mesurable : quelques dossiers à ≈ 5 à 8 $ chacun"],
    ],
    [46, 22, 32]
  );

  /* ------------------------------------------------------------------ 8 */
  d.h1("8. Pilotage");
  d.table(
    ["Indicateur", "Définition", "Source", "Seuil d'alerte proposé"],
    [
      ["Coût réel par dossier analysé", "Somme des appels d'IA d'une analyse", "`usage_logs`", "> 6 $ sur ~300 pages"],
      ["Ratio coût / facture par contrat", "Coût réel cumulé du cycle / montant facturé", "`contract_cost_tracking`", "70 % puis 100 %"],
      ["Marge brute par offre", "(Facture − coût d'IA − frais de paiement) / facture", "`usage_logs` + Stripe", "< 40 % en moyenne sur Essentiel"],
      ["Taux de succès du cache", "Jetons lus en cache / jetons d'entrée du chat", "`usage_logs` (`cache_read_tokens`)", "< 30 %"],
      ["Taux d'escalade vers le modèle premium", "Questions complexes / questions", "`chat_messages` (`complexity_label`)", "Dérive de plus de 10 points"],
      ["Questions par dossier et par mois", "Volume d'usage", "`chat_messages`", "Écart important au profil normal"],
      ["Part des comptes Essentiel au quota", "Comptes bloqués / comptes actifs", "`quotas_essentiel`", "> 15 %"],
      ["Revenu récurrent mensuel, attrition", "Abonnements actifs × prix ; départs / base", "Stripe", "À définir après la bêta"],
    ],
    [26, 32, 22, 20],
    { size: 17 }
  );

  /* ------------------------------------------------------------------ 9 */
  d.h1("9. Risques économiques");
  d.table(
    ["Risque", "Effet", "Parade"],
    [
      ["**Coût des contradictions non corrigé**", "Marges négatives en usage intensif (section 5)", "Lot 1 : contradictions sur l'extraction"],
      ["**Cache du chat inefficace**", "Coût par question de 0,06 $ au lieu de 0,02 $", "Cacher un préfixe stable ; mesurer le taux de succès (document 08)"],
      ["**Prix HT/TTC et engagement annuel**", "Marge Essentiel négative dans le pire cas", "Décider avant l'ouverture des ventes (section 6)"],
      ["**Concentration sur un gros contrat Fonds**", "Usage extrême simultané de plusieurs sièges", "Suivi du coût réel, palier, clause de renégociation"],
      ["**Évolution des tarifs du fournisseur d'IA**", "Marge comprimée sans action de notre part", "Routage configurable ; benchmark pour changer de modèle ; remise à plat tarifaire annuelle"],
      ["**Dépréciation de l'euro**", "Coûts d'IA en hausse", "Section 7.3 : absorbable en usage normal"],
      ["**Dépendance à un fournisseur d'IA**", "Interruption ou refus de conformité", "Repli vers un second modèle ; options de la section 4.1 du document 06"],
      ["**Demande inférieure à l'attente**", "Charges fixes non couvertes", "Charges fixes très faibles : le point mort tient à un à trois abonnés Analyste"],
      ["**Plans gratuits d'hébergement**", "Usage commercial non autorisé ; pas de sauvegarde", "Plans payants avant le premier client (≈ 45 €/mois)"],
    ],
    [28, 34, 38]
  );

  /* ------------------------------------------------------------------ 10 */
  d.h1("10. Décisions à prendre");
  d.table(
    ["#", "Décision", "Pourquoi maintenant"],
    [
      ["1", "Prix affichés : HT ou TTC, pour chaque offre", "Conditionne la marge Essentiel et l'affichage légal"],
      ["2", "Engagement annuel : périmètre (toutes offres ou non) et réduction", "Rend l'offre Essentiel fragile dans le pire cas"],
      ["3", "Corriger le pipeline avant la première analyse réelle", "Évite des marges négatives dès le début"],
      ["4", "Quotas Essentiel : maintenir 3 analyses et 100 questions ou les resserrer", "Dépend des mesures de coût réel"],
      ["5", "Plans d'hébergement payants avant le premier client", "Usage commercial et sauvegardes"],
      ["6", "Instruire les options A, B, C du document 06", "Détermine le coût et l'architecture de l'IA"],
    ],
    [6, 52, 42]
  );

  return d;
};
