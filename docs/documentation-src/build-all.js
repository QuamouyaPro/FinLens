"use strict";
/**
 * Génère les huit documents Word de la collection documentaire FinLens.
 * Usage : node diagrams.js && node build-all.js
 */
const path = require("node:path");
const OUT_DIR = path.join(__dirname, "..", "documentation");

const DOCS = [
  ["01-presentation", "01_FinLens_Note_de_presentation.docx"],
  ["02-cahier-des-charges", "02_FinLens_Cahier_des_charges.docx"],
  ["03-ux-ui", "03_FinLens_UX_UI_Parcours_et_design.docx"],
  ["04-architecture-technique", "04_FinLens_Architecture_technique_et_infrastructure.docx"],
  ["05-donnees", "05_FinLens_Architecture_des_donnees_et_gestion_documentaire.docx"],
  ["06-rgpd-cybersecurite", "06_FinLens_RGPD_cybersecurite_et_conformite.docx"],
  ["07-business-model", "07_FinLens_Business_model_pricing_couts_previsionnel.docx"],
  ["08-strategie-ia", "08_FinLens_Strategie_IA_benchmark_routage_RAG_agents.docx"],
];

(async () => {
  const only = process.argv[2];
  for (const [mod, file] of DOCS) {
    if (only && !mod.startsWith(only)) continue;
    const doc = require(`./content/${mod}`)();
    const res = await doc.save(path.join(OUT_DIR, file));
    console.log(`${file}  ${(res.bytes / 1024).toFixed(0)} Ko  ${res.headings} titres`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
