# FinLens

Copilote d'analyse financière pour investisseurs (Private Equity, VC, M&A,
Family Office, CFO, audit) — data room intelligente, synthèse adaptée par
profil, Copilote RAG sourcé, comparateur de dossiers, export PDF/Word.

## Structure du repo

```
docs/     Spécifications produit (Note explicative, Note d'Architecture,
          Coûts & Pricing, Note de fonctionnement V1) + le prototype
          cliquable statique finlens-plateforme-v1.html
web/      L'application FinLens : un seul projet Next.js qui sert à la fois
          les routes API et l'interface utilisateur (voir web/README.md)
```

Il n'y a qu'**un seul déploiement** à faire : celui du dossier `web/`.
`docs/` n'est que de la documentation et une référence visuelle, jamais déployé
séparément.

## Déployer sur Vercel

**Root Directory : `web`** — c'est le point le plus important et la cause la
plus fréquente d'un déploiement qui ne montre pas la bonne page. Si Vercel
sert un contenu inattendu (page par défaut d'un template, contenu vide, etc.),
vérifiez en premier ce réglage dans Project Settings → General → Root
Directory.

1. Vercel → **Add New → Project** → importer `QuamouyaPro/FinLens`.
2. **Root Directory : `web`**.
3. Vercel détecte Next.js automatiquement (build command, output — rien à
   changer).
4. Renseigner les variables d'environnement (voir `web/.env.example` et
   `web/README.md` pour le détail complet — Supabase, Anthropic, Voyage AI,
   Stripe, `CRON_SECRET`).
5. Deploy.

Une fois déployé, le prototype cliquable statique (données fictives, aucune
connexion au backend réel) est accessible à `/prototype`.

## Backend

Schéma et logique métier détaillés dans [web/README.md](web/README.md).
