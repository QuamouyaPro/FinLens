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
| Auth, base de données & stockage | Supabase (PostgreSQL, Row Level Security, Storage) |
| Orchestration du pipeline documentaire | n8n (ingestion PDF, chunking, appels IA, chat RAG) |
| Base vectorielle (RAG) | Qdrant |
| Moteur d'analyse IA | API Anthropic — Claude (extraction de données, assistant conversationnel sourcé) |
| Hébergement app | Vercel (déploiement continu depuis GitHub) |
| Hébergement n8n / Qdrant | VPS (Coolify) |
| Facturation | Stripe |

## Roadmap

- [x] **Phase 0 — Repo & fondations** : dépôt GitHub, scaffold Next.js, structure du projet
- [x] **Phase 1 — Landing page** : page vitrine premium présentant l'offre FinLens
- [ ] **Phase 2 — Auth & données** : inscription/connexion, espaces de travail (Supabase), schéma SQL (`profiles`, `workspaces`, `documents`, `analyses`, `chat_messages`)
- [ ] **Phase 3 — Ingestion documentaire** : upload de documents (PDF 10-K, bilans, rapports ESG) vers Supabase Storage, pipeline n8n de traitement
- [ ] **Phase 4 — Extraction & synthèse** : Executive Summary automatique (API Anthropic), indexation vectorielle (Qdrant)
- [ ] **Phase 5 — Assistant conversationnel** : chat RAG sourcé strictement sur les documents fournis, avec citations page par page
- [ ] **Phase 6 — Facturation** : offres Pay-per-deal / Analyste Pro / Team via Stripe

## Développement local

```bash
cd web
npm install
npm run dev   # http://localhost:3000
```

## Déploiement

La Phase 1 (landing page seule) a été prévisualisée temporairement sur GitHub Pages via export statique. Dès la Phase 2, l'app utilise l'authentification Supabase (cookies, `proxy.ts`) qui nécessite un serveur — incompatible avec l'hébergement statique de GitHub Pages. Le déploiement se fait donc désormais sur **Vercel** (import du repo GitHub, déploiement continu à chaque push sur `main`).

> Le dossier `aries/` est un projet indépendant (site ARIES), versionné sur son propre dépôt — il est ignoré par ce dépôt.
