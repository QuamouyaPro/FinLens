# FinLens — Web

Application Next.js unique de la plateforme FinLens (copilote d'analyse
financière RAG) : API Routes (App Router) aujourd'hui, interface utilisateur
(dashboard, Copilote, profils, export) à venir dans ce même projet — Vercel
héberge une seule app qui sert les deux, pas un frontend et un backend
séparés (Note d'Architecture, section 4.A/4.B). Stack : Supabase
(Postgres/pgvector/Auth/Storage) + API Anthropic (Claude Fable 5 / Sonnet 5 /
Haiku 4.5) + Stripe.

## Écarts assumés par rapport à la Note d'Architecture

L'infrastructure Hostinger (VPS + n8n + Qdrant) n'était pas accessible pour
construire les routes API. Deux substitutions, documentées et sans changement
de comportement produit :

- **n8n → API routes Next.js** : chaque « recette » n8n (extraction, routage,
  monitoring...) est une route API en TypeScript dans `src/app/api/`.
- **Qdrant → pgvector (Supabase)** : `document_chunks.embedding` (colonne
  `vector(1536)`) remplace la base vectorielle dédiée. Les tags `owner_id` et
  `dossier_id` par point (urgence RGPD, Note d'Architecture section H) sont
  en place dès la création du schéma.

Embeddings générés via **Voyage AI** (`voyage-3-large`), le fournisseur
recommandé par Anthropic pour le RAG — l'API Anthropic ne propose pas
d'embeddings.

## Prototype cliquable

Le prototype statique (`docs/finlens-plateforme-v1.html`, Note de fonctionnement
V1) est servi tel quel depuis `public/prototype/index.html`, accessible à
`/prototype` (redirection configurée dans `next.config.ts`). Fichier autonome
sans dépendance au backend -- aucune donnée réelle, uniquement pour visualiser
le parcours produit cible en attendant la reconstruction en pages Next.js.

## Démarrage

```bash
cp .env.example .env.local
# renseigner ANTHROPIC_API_KEY, SUPABASE_SERVICE_ROLE_KEY, VOYAGE_API_KEY,
# les clés Stripe et CRON_SECRET (jamais commités)
npm install
npm run dev
```

## Ce qui reste à faire avant la mise en production

- Extraction Word/Excel (`src/app/api/documents/[id]/indexer/route.ts` ne
  supporte que le PDF pour l'instant).
- Créer les produits/prix Stripe (3 offres) et renseigner leurs IDs.
- Interface utilisateur : aucune page n'existe encore dans `src/app/` en
  dehors de la page d'accueil par défaut de create-next-app. `docs/finlens-plateforme-v1.html`
  sert de référence fonctionnelle et visuelle (Note de fonctionnement V1) à
  reconstruire ici en pages Next.js consommant ces routes API.
- Planifier les 3 crons (`vercel.json`) sur l'environnement de déploiement.
- Revue juridique des clauses CGU (usage raisonnable, droit à l'effacement
  tiers mentionnés dans un dossier) — hors périmètre technique.

## Structure

```
src/
  app/api/            routes API (dossiers, documents, copilote, exports, stripe, cron...)
  lib/ai/              routeur de modèles, prompts par tâche, cache de prompt, usage/coûts
  lib/export/          génération Word (docx) et PDF (pdf-lib)
  lib/supabase/        clients Supabase (browser, server RLS, admin service_role)
  lib/quotas.ts        plafonds Essentiel (quotas fermes) et Analyste/Fonds (15 dossiers)
  types/database.ts    types générés depuis le schéma Supabase
```
