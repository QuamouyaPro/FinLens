# FinLens

FinLens est une plateforme SaaS d'intelligence documentaire et d'analyse financière, conçue pour les professionnels de l'investissement : fonds de Private Equity (PE), Venture Capital (VC), banques d'affaires, gestionnaires de patrimoine, analystes indépendants et directeurs financiers (CFO).

## Objectif

Libérer ces professionnels de la tâche chronophage qu'est la lecture et la synthèse de documents volumineux (rapports annuels 10-K, due-diligences, bilans comptables, rapports ESG). La plateforme permet :

- d'ingérer massivement ces documents,
- d'en extraire instantanément les données clés,
- de proposer un assistant conversationnel capable de répondre à toute question technique en se sourçant strictement sur les textes fournis.

## Promesse

FinLens aide les investisseurs à analyser plus vite, plus profondément et sans erreur, pour dénicher les meilleures opportunités d'investissement en un temps record.

## Approche

Le projet repose sur une approche agile : une construction low-code et vibe coding, propulsée par le modèle d'intelligence artificielle le plus performant du marché en finance (Claude Fable 5).

## Architecture technique

| Brique | Technologie |
|---|---|
| Application web | Next.js (App Router) + TypeScript + Tailwind CSS — dossier `web/` |
| Auth & base de données | Supabase (PostgreSQL, Row Level Security, Storage) |
| Moteur d'analyse IA | Claude API (extraction de données, assistant conversationnel sourcé) |
| Facturation | Stripe |

## Roadmap

- [x] **Phase 0 — Repo & fondations** : dépôt GitHub, scaffold Next.js, structure du projet
- [x] **Phase 1 — Landing page** : page vitrine premium présentant l'offre FinLens
- [ ] **Phase 2 — Auth & données** : inscription/connexion, espace de travail par utilisateur (Supabase)
- [ ] **Phase 3 — Ingestion documentaire** : upload de documents (PDF 10-K, bilans, rapports ESG), parsing et stockage
- [ ] **Phase 4 — Extraction & synthèse** : extraction automatique des données clés (Claude API)
- [ ] **Phase 5 — Assistant conversationnel** : Q&A sourcé strictement sur les documents fournis, avec citations
- [ ] **Phase 6 — Facturation** : offres et abonnements via Stripe

## Développement local

```bash
cd web
npm install
npm run dev   # http://localhost:3000
```

> Le dossier `aries/` est un projet indépendant (site ARIES), versionné sur son propre dépôt — il est ignoré par ce dépôt.
