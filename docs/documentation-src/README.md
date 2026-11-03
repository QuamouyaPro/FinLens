# Collection documentaire FinLens — sources

Génère les huit documents Word de `docs/documentation/` et leurs schémas.

```
npm install docx sharp          # dans ce dossier, ou via NODE_PATH
node diagrams.js                # schémas -> img/ (SVG + PNG + manifest.json)
node build-all.js               # documents -> ../documentation/*.docx
node build-all.js 07            # un seul document (préfixe du module)
node model.js                   # contrôle du modèle financier
```

- `kit.js` : constructeur de documents Word et primitives de dessin SVG.
- `model.js` : modèle financier ; tous les chiffres dérivés des documents y sont CALCULÉS.
- `diagrams.js` : les schémas. `content/NN-*.js` : le texte de chaque document.
- Les schémas 01 à 05 sont repris de `../architecture-v2-src/img/`.