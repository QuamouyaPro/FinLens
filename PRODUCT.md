# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Professionnels de l'analyse financière qui doivent lire et challenger des
documents d'entreprise sous contrainte de temps : Private Equity, Venture
Capital, M&A / banques d'affaires, Family Offices, directions financières
(CFO) et audit & conseil. Un même dossier (rapport annuel, due diligence,
bilan) est relu sous six angles métier différents sans nouvelle analyse.
L'offre Essentiel cible en plus un usage individuel plus ponctuel (étudiants,
veille personnelle).

## Product Purpose

FinLens est le copilote d'analyse financière des investisseurs : il ingère
des rapports annuels, due diligences et bilans (PDF, Excel, Word), en extrait
l'essentiel, détecte les contradictions entre documents et répond aux
questions de l'utilisateur en citant systématiquement la page exacte. Le
succès se mesure au temps de lecture évité (promesse : 300 pages en 3
minutes) sans perte de traçabilité vers la source.

## Positioning

Contrairement à une IA généraliste, chaque réponse de FinLens est contrainte
par RAG aux passages réellement indexés du dossier : zéro hallucination,
citation systématique et cliquable vers la page d'origine. Contrairement à un
analyste junior ou une lecture manuelle, le délai passe de 2-3 jours à
quelques minutes, pour un coût de quelques euros par dossier.

## Operating Context

- Un dossier = une entreprise étudiée ; jusqu'à 50 documents par dossier,
  volume de pages illimité.
- Cycle de vie du dossier : actif → archivé → corbeille (purge réelle après
  30 jours), pas un simple masquage.
- Le Copilote répond en citant la page exacte ; les réponses utiles peuvent
  être épinglées pour construire une note d'investissement, exportée en PDF
  ou Word au format du fonds.
- Le Comparateur confronte plusieurs entreprises ou périodes ligne par
  ligne, chaque cellule reliée à sa source.
- Détection de contradictions entre documents d'un même dossier (ex. teaser
  vs annexe du bilan) et score de risque / checklist de due diligence.
- `/demo/*` reproduit l'application entière avec des données fictives issues
  du prototype validé, sans compte ni clé API, pour l'essai avant inscription.

## Capabilities and Constraints

- Trois offres : Essentiel (quotas fermes : 4 dossiers actifs, 3 analyses et
  100 questions/mois), Analyste (illimité, 1 siège, 15 dossiers actifs),
  Fonds (illimité, plusieurs sièges facturés à la personne).
- Six profils d'analyse (PE/VC, M&A, family office, CFO, audit, généraliste)
  — changer de profil est instantané, sans relancer une analyse.
- Documents hébergés en Union européenne (Francfort), cloisonnés par
  organisation, jamais utilisés pour entraîner un modèle public.
- Droit à l'effacement en self-service ; suppression réelle après le délai
  de grâce, pas un simple masquage.
- Terminologie produit à respecter dans toute UI/copie : dossier, profil,
  Copilote, note d'investissement, checklist, contradictions, comparateur.

## Brand Commitments

- Nom : FinLens. Ton et copie en français.
- Promesse chiffrée toujours mise en avant : « 300 pages en 3 minutes, sans
  perdre la source. »
- Le prototype validé (`docs/finlens-plateforme-v1.html`) fait autorité sur
  le contenu produit réel (profils, dossiers de démonstration, états
  financiers, checklists) : à extraire, jamais à retranscrire à la main.

## Evidence on Hand

- Prototype HTML complet et validé : `docs/finlens-plateforme-v1.html`,
  servi tel quel sur `/prototype`.
- Données de démonstration extraites par script du prototype :
  `web/src/lib/demo/data/*.json` (voir `web/scripts/extraire-donnees-demo.mjs`).
- Quatre notes sources du projet (note explicative, note d'architecture,
  note de coûts & pricing, note de fonctionnement V1) ont servi à construire
  le backend ; pas de testimonials, presse ou étude de cas réels — ne pas en
  inventer.

## Product Principles

- Une affirmation sans source n'est pas une réponse : citer la page exacte
  est non négociable, partout où un fait apparaît.
- Changer d'angle métier (profil) ne doit jamais coûter une nouvelle analyse.
- Supprimer doit vouloir dire supprimer : pas de masquage déguisé en
  suppression.
- Le contenu de démonstration est un miroir fidèle du prototype validé, pas
  une réinvention.
- Confidentialité par défaut : documents isolés par organisation, hébergement
  UE, aucun entraînement de modèle sur les données client.

## Accessibility & Inclusion

Cible WCAG 2.1 niveau AA (contraste, navigation clavier complète, focus
visible, `prefers-reduced-motion` respecté) — confirmé par l'utilisateur le
30/07/2026, pertinent pour un usage en environnement professionnel régulé.
