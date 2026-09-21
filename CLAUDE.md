# Instructions pour Claude Code — projet FinLens

## Continuité entre sessions / entre PC

Ce projet est travaillé depuis plusieurs PC (le dossier de travail vit sur un
disque dur externe transporté d'un PC à l'autre). Pour reprendre le contexte
correctement :

1. **Au début de toute session, lire [`session-log/SESSION_LOG.md`](session-log/SESSION_LOG.md)** —
   l'entrée la plus récente (en haut du fichier) décrit ce qui a été fait
   lors de la dernière session, les décisions prises, et l'état où le travail
   s'est arrêté.
2. **À la fin de toute session de travail** (avant que l'utilisateur ne
   ferme/change de PC), ajouter une nouvelle entrée en haut de
   `session-log/SESSION_LOG.md` résumant les changements de la session, puis
   committer et pousser sur `origin/main` (dépôt `QuamouyaPro/FinLens`).
3. Si le disque externe est monté avec une lettre de lecteur différente de
   celle utilisée précédemment, Git peut refuser d'opérer
   ("detected dubious ownership"). Corriger avec :
   ```
   git config --global --add safe.directory <lettre>:/FinLens
   ```

## Repo

- Structure : `docs/` (spécifications produit, prototype statique
  `finlens-plateforme-v1.html`) et `web/` (l'app Next.js unique — API + UI).
  Un seul déploiement Vercel, Root Directory = `web`.
- Voir [README.md](README.md) et [web/README.md](web/README.md) pour le
  schéma backend et la configuration de déploiement.
