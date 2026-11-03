"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { D, SC, renderDiagrams, IMG_DIR } = require("./kit");
const M = require("./model");

const { box, txt, lines, arrow, path: P, pill, circle, head, foot } = D;
const out = [];
const add = (name, W, H, svg) => out.push({ name, W, H, svg: foot(svg) });

const tag = (x, y, kind) => {
  const map = {
    ok: ["En place", SC.accTint, SC.acc],
    part: ["Partiel", SC.signalTint, SC.signal],
    todo: ["À construire", SC.infoTint, SC.info],
  };
  const [l, f, c] = map[kind];
  return pill(x, y, 96, 22, l, { fill: f, color: c, size: 11 });
};

/* ================================================================== p01 */
(() => {
  const W = 1000, H = 480;
  let s = head(W, H, "FinLens en un coup d'œil", "Du document brut à la décision, sans perdre la source");
  const cards = [
    ["Déposer", ["PDF (Word et Excel à", "venir), jusqu'à 50", "fichiers par dossier,", "doublons détectés"]],
    ["Analyser", ["Extraction exhaustive", "en 6 catégories :", "financier, juridique,", "marché, ESG,", "gouvernance, risques"]],
    ["Lire par profil", ["6 profils métier +", "Personnalisé, générés", "d'avance : changer", "d'angle est instantané"]],
    ["Interroger", ["Le Copilote répond à", "partir des passages", "du dossier, avec", "la page citée"]],
    ["Exporter", ["Note PDF ou Word,", "ajouts épinglés du", "Copilote inclus"]],
  ];
  cards.forEach(([t, body], i) => {
    const x = 36 + i * 188;
    s += box(x, 100, 176, 200, { fill: SC.surf2 });
    s += circle(x + 26, 130, 14, String(i + 1));
    s += txt(x + 50, 136, t, { size: 15, weight: "bold" });
    s += lines(x + 16, 172, body, { size: 12.5, fill: SC.soft }, 19);
    if (i < 4) s += arrow(x + 178, 200, x + 186, 200, { color: SC.acc });
  });
  s += box(36, 322, 928, 62, { fill: SC.accTint, stroke: SC.accTint });
  s += pill(56, 341, 62, 24, "p.148", { fill: SC.surf, color: SC.acc, stroke: SC.acc, mono: true });
  s += txt(136, 358, "Chaque chiffre porte sa source : un clic ouvre la page exacte, passage surligné.", { size: 14, fill: SC.ink });
  s += box(36, 398, 928, 62, { fill: SC.surf2 });
  s += txt(56, 424, "Contrôles automatiques", { size: 13.5, weight: "bold" });
  s += pill(250, 408, 250, 24, "contradictions entre documents", { fill: SC.dangerTint, color: SC.danger, size: 12 });
  s += pill(512, 408, 190, 24, "checklist de due diligence", { fill: SC.signalTint, color: SC.signal, size: 12 });
  s += pill(714, 408, 130, 24, "signaux", { fill: SC.infoTint, color: SC.info, size: 12 });
  s += txt(56, 448, "Le Copilote et les notes ne s'appuient que sur le contenu indexé du dossier ; une donnée absente est marquée [DONNÉE MANQUANTE].", { size: 11.5, fill: SC.faint });
  add("p01-parcours-valeur", W, H, s);
})();

/* ================================================================== u01 */
(() => {
  const W = 1000, H = 700;
  let s = head(W, H, "Carte de navigation", "Site public, application connectée, et l'écran central : le dossier");

  // Public
  s += box(30, 95, 270, 560, { fill: SC.surf2 });
  s += txt(48, 122, "SITE PUBLIC", { size: 12.5, weight: "bold", fill: SC.soft, mono: true, ls: "1.5" });
  const pub = [
    ["Accueil  /", "hero, démo, tarifs, calculateur ROI"],
    ["Démo complète  /demo/…", "toute l'application, données fictives"],
    ["Prototype  /prototype", "référence visuelle statique"],
    ["Connexion", "e-mail et mot de passe"],
    ["Inscription", "crée aussi l'organisation"],
  ];
  pub.forEach(([t, sub], i) => {
    const y = 142 + i * 100;
    s += box(46, y, 238, 84, { fill: SC.surf });
    s += txt(60, y + 30, t, { size: 14, weight: "bold" });
    s += lines(60, y + 52, [sub], { size: 11.5, fill: SC.soft });
  });
  s += arrow(284, 484, 340, 484, { color: SC.acc });
  s += arrow(284, 584, 340, 584, { color: SC.acc });

  // App
  s += box(340, 95, 300, 560, { fill: SC.panel, stroke: SC.panel });
  s += txt(358, 122, "APPLICATION CONNECTÉE", { size: 12.5, weight: "bold", fill: SC.panelText, mono: true, ls: "1.5" });
  const nav = [
    ["Tableau de bord", "", false],
    ["Dossiers", "compteur", true],
    ["Signaux", "compteur", false],
    ["Recherche globale", "", false],
    ["Comparateur", "Analyste · Fonds", false],
    ["Exports", "", false],
    ["Facturation", "", false],
    ["Équipe", "Fonds", false],
    ["Réglages", "", false],
  ];
  nav.forEach(([t, note, hl], i) => {
    const y = 142 + i * 48 + (i >= 6 ? 14 : 0);
    s += box(356, y, 268, 38, { fill: hl ? SC.acc : SC.panelBox, stroke: hl ? SC.acc : SC.panelSoft, so: hl ? 1 : 0.25, rx: 6 });
    s += txt(372, y + 25, t, { size: 13.5, fill: SC.panelText, weight: hl ? "bold" : "normal" });
    if (note) s += txt(608, y + 25, note, { size: 10.5, fill: hl ? SC.panelText : SC.panelSoft, anchor: "end" });
  });
  s += txt(358, 600, "Barre latérale toujours sombre ; palette de", { size: 11.5, fill: SC.panelSoft });
  s += txt(358, 618, "commandes (⌘K) ; tiroir sur mobile (< 780 px).", { size: 11.5, fill: SC.panelSoft });

  // Dossier
  s += box(680, 95, 290, 560, { fill: SC.surf2 });
  s += txt(698, 122, "UN DOSSIER", { size: 12.5, weight: "bold", fill: SC.soft, mono: true, ls: "1.5" });
  s += box(696, 142, 258, 66, { fill: SC.surf, stroke: SC.acc, sw: 2 });
  s += txt(710, 166, "Sélecteur de profil", { size: 13.5, weight: "bold" });
  s += txt(710, 183, "PE/VC · M&A · Family Office · CFO", { size: 10.5, fill: SC.soft });
  s += txt(710, 198, "Audit · Généraliste · Personnalisé", { size: 10.5, fill: SC.soft });
  const tabs = [
    ["Synthèse", "note du profil actif, jauge de risque"],
    ["Documents", "dépôt, statuts d'indexation"],
    ["Copilote", "chat sourcé, ajout à la note"],
    ["Contrôles", "contradictions, checklist"],
    ["Export", "PDF ou Word"],
  ];
  tabs.forEach(([t, sub], i) => {
    const y = 224 + i * 60;
    s += box(696, y, 258, 50, { fill: SC.surf });
    s += txt(710, y + 22, t, { size: 13.5, weight: "bold" });
    s += txt(710, y + 40, sub, { size: 11, fill: SC.soft });
  });
  s += box(696, 540, 258, 92, { fill: SC.accTint, stroke: SC.acc });
  s += txt(710, 566, "Panneau source", { size: 13.5, weight: "bold", fill: SC.acc });
  s += lines(710, 586, ["ouvert par un clic sur une citation :", "document, page, passage surligné"], { size: 11.5, fill: SC.ink }, 17);
  s += P("M 624 209 L 652 209 L 652 175 L 676 175", { color: SC.acc });
  return add("u01-navigation", W, H, s);
})();

/* ================================================================== u02 */
(() => {
  const W = 1000, H = 740;
  let s = head(W, H, "Anatomie de l'écran dossier", "Un écran unique, six repères : profil, onglets, risque, indicateurs, citation, source");

  // cadre principal
  s += box(30, 90, 740, 610, { fill: SC.surf2, stroke: SC.line });
  // sidebar
  s += box(30, 90, 140, 610, { fill: SC.panel, stroke: SC.panel, rx: 8 });
  for (let i = 0; i < 8; i++) s += box(44, 118 + i * 38, 112, 24, { fill: i === 1 ? SC.acc : SC.panelBox, stroke: SC.panelSoft, so: 0.25, rx: 5 });
  // en-tête
  s += txt(190, 120, "Dossiers  ›  Helios — due diligence SaaS", { size: 12, fill: SC.faint });
  s += txt(190, 150, "Helios — due diligence SaaS", { size: 21, weight: "bold" });
  s += txt(190, 170, "Due diligence · 4 documents indexés", { size: 12, fill: SC.soft });
  // chips profils
  const chips = [["PE / VC", 0], ["M&A", 0], ["Family Office", 0], ["CFO", 1], ["Audit", 0], ["Généraliste", 0], ["Personnalisé", 0]];
  let cx = 190;
  chips.forEach(([l, on]) => {
    const w = l.length * 6.3 + 18;
    s += pill(cx, 188, w, 26, l, { fill: on ? SC.acc : SC.surf, stroke: on ? SC.acc : SC.line, color: on ? "#FFFFFF" : SC.soft, size: 11, weight: "normal" });
    cx += w + 6;
  });
  // onglets
  const ot = ["Synthèse", "Documents", "Copilote", "Contrôles", "Export"];
  let tx = 190;
  ot.forEach((l, i) => {
    const w = l.length * 8.2 + 28;
    s += txt(tx + w / 2, 247, l, { size: 13, anchor: "middle", weight: i === 0 ? "bold" : "normal", fill: i === 0 ? SC.acc : SC.soft });
    if (i === 0) s += `<rect x="${tx}" y="255" width="${w}" height="3" fill="${SC.acc}"/>`;
    if (i === 3) s += `<circle cx="${tx + w - 6}" cy="238" r="4" fill="${SC.danger}"/>`;
    tx += w + 6;
  });
  s += `<line x1="190" y1="258" x2="750" y2="258" stroke="${SC.line}" stroke-width="1"/>`;

  // jauge
  s += box(190, 276, 170, 150, { fill: SC.surf });
  s += txt(205, 300, "RISQUE — CFO", { size: 10.5, weight: "bold", fill: SC.soft, mono: true });
  s += `<circle cx="275" cy="352" r="40" fill="none" stroke="${SC.line}" stroke-width="9"/>`;
  s += `<circle cx="275" cy="352" r="40" fill="none" stroke="${SC.signal}" stroke-width="9" stroke-dasharray="111 251" transform="rotate(-90 275 352)"/>`;
  s += txt(275, 361, "44", { size: 24, weight: "bold", anchor: "middle", mono: true });
  s += txt(275, 414, "À surveiller", { size: 11, anchor: "middle", fill: SC.signal });

  // KPI
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 3; c++) {
      const x = 376 + c * 126;
      const y = 276 + r * 78;
      s += box(x, y, 118, 70, { fill: SC.surf });
      s += `<rect x="${x + 12}" y="${y + 14}" width="54" height="7" rx="3" fill="${SC.line}"/>`;
      s += txt(x + 12, y + 46, ["12,8 M€", "0,9×", "68 %", "9,4 M€", "-1,2 pt", "34 j"][r * 3 + c], { size: 16, weight: "bold", mono: true });
      s += pill(x + 70, y + 36, 40, 20, "p." + [12, 31, 8, 22, 40, 17][r * 3 + c], { fill: SC.accTint, color: SC.acc, size: 10.5, mono: true });
    }
  // résumé
  s += box(190, 442, 560, 236, { fill: SC.surf });
  s += txt(206, 468, "Résumé", { size: 13, weight: "bold" });
  for (let i = 0; i < 7; i++) s += `<rect x="206" y="${486 + i * 24}" width="${i % 3 === 2 ? 300 : 520}" height="8" rx="4" fill="${SC.line}"/>`;
  s += pill(206, 654, 66, 20, "p.148", { fill: SC.accTint, color: SC.acc, size: 10.5, mono: true });

  // panneau source
  s += box(530, 276, 230, 402, { fill: SC.surf, stroke: SC.acc, sw: 2 });
  s += txt(544, 302, "Rapport_annuel.pdf", { size: 12.5, weight: "bold" });
  s += txt(544, 319, "Page 148", { size: 11, fill: SC.soft });
  s += `<line x1="530" y1="330" x2="760" y2="330" stroke="${SC.line}"/>`;
  s += box(546, 344, 198, 316, { fill: SC.surf2 });
  s += txt(558, 366, "Passage cité", { size: 11.5, weight: "bold" });
  for (let i = 0; i < 4; i++) s += `<rect x="558" y="${380 + i * 20}" width="${i === 3 ? 90 : 172}" height="7" rx="3" fill="${SC.line}"/>`;
  s += `<rect x="556" y="466" width="178" height="40" rx="4" fill="#F4E3A8"/>`;
  s += `<rect x="558" y="474" width="170" height="7" rx="3" fill="${SC.soft}"/><rect x="558" y="490" width="120" height="7" rx="3" fill="${SC.soft}"/>`;
  for (let i = 0; i < 5; i++) s += `<rect x="558" y="${522 + i * 20}" width="${i === 4 ? 80 : 172}" height="7" rx="3" fill="${SC.line}"/>`;

  // repères
  const marks = [[1, 740, 188], [2, 752, 240], [3, 372, 330], [4, 626, 262], [5, 273, 666], [6, 640, 288]];
  void marks;
  const pts = [[1, 176, 201], [2, 176, 241], [3, 190, 276], [4, 494, 276], [5, 288, 664], [6, 530, 276]];
  pts.forEach(([n, x, y]) => (s += circle(x, y, 11, String(n), { size: 12 })));

  // légende
  s += txt(795, 112, "REPÈRES", { size: 12, weight: "bold", fill: SC.soft, mono: true, ls: "1.5" });
  const legend = [
    ["Sélecteur de profil", "changement instantané : lecture en base, aucun nouvel appel IA"],
    ["Onglets du dossier", "pastille rouge quand une contradiction est ouverte"],
    ["Jauge de risque", "propre au profil actif — chaque profil pondère 5 axes"],
    ["Indicateurs clés", "six par profil, chacun relié à sa source"],
    ["Pastille de citation", "p.148 : signature du produit, partout où un fait apparaît"],
    ["Panneau source", "passage surligné ; extrait reconstruit, pas un fac-similé du PDF"],
  ];
  legend.forEach(([t, sub], i) => {
    const y = 140 + i * 92;
    s += circle(806, y + 6, 11, String(i + 1), { size: 12 });
    s += txt(826, y + 11, t, { size: 13, weight: "bold" });
    s += lines(826, y + 31, wrap(sub, 26), { size: 11, fill: SC.soft }, 15);
  });
  return add("u02-anatomie-dossier", W, H, s);
})();

function wrap(text, n) {
  const words = text.split(" ");
  const res = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > n) {
      res.push(cur.trim());
      cur = w;
    } else cur += " " + w;
  }
  if (cur.trim()) res.push(cur.trim());
  return res;
}

/* ================================================================== d01 */
(() => {
  const W = 1000, H = 885;
  let s = head(W, H, "Modèle de données", "17 tables, toutes sous RLS — l'identifiant d'organisation isole chaque client");

  const table = (x, y, w, name, cols, o = {}) => {
    let r = box(x, y, w, 86, { fill: SC.surf, stroke: o.stroke || SC.line, sw: 1.4, rx: 6 });
    r += txt(x + 10, y + 21, name, { size: 12.5, weight: "bold", mono: true });
    r += lines(x + 10, y + 40, cols, { size: 10.5, fill: SC.soft }, 14.5);
    return r;
  };
  const panel = (x, y, w, h, label, color, fill) =>
    box(x, y, w, h, { fill, stroke: color, sw: 1.8, rx: 10 }) + txt(x + 14, y + 22, label, { size: 11.5, weight: "bold", fill: color, mono: true, ls: "1.2" });

  // A
  s += panel(30, 88, 285, 250, "IDENTITÉ ET COMPTE", SC.info, SC.infoTint);
  s += table(46, 112, 253, "organizations", ["name · offre (essentiel/analyste/fonds)", "stripe_customer_id · seats_included", "data_residency (eu-central-1)"]);
  s += table(46, 214, 253, "memberships", ["organization_id · user_id → auth.users", "role : owner / admin / member"]);
  // B
  s += panel(345, 88, 625, 250, "DOSSIERS ET DOCUMENTS", SC.acc, SC.accTint);
  s += table(361, 112, 190, "dossiers", ["organization_id · owner_id", "type_operation · status", "active_profil · purge_at"]);
  s += table(565, 112, 190, "documents", ["dossier_id · storage_path", "status · content_hash", "is_duplicate_of · page_count"]);
  s += table(769, 112, 185, "document_chunks", ["document_id · dossier_id", "page_number · content", "embedding vector(1536)"]);
  s += txt(361, 226, "Un dossier = une entreprise étudiée (≤ 50 documents, trigger en base).", { size: 11, fill: SC.soft });
  s += txt(361, 244, "Les chunks portent organization_id, dossier_id et owner_id : isolation et", { size: 11, fill: SC.soft });
  s += txt(361, 260, "suppression par dossier sans second magasin (pas de base vectorielle externe).", { size: 11, fill: SC.soft });
  s += arrow(551, 150, 561, 150, { color: SC.acc });
  s += arrow(755, 150, 765, 150, { color: SC.acc });
  s += arrow(299, 150, 357, 150, { color: SC.info });

  // C
  s += panel(30, 368, 470, 220, "ANALYSE", SC.signal, SC.signalTint);
  s += table(46, 392, 222, "extractions", ["dossier_id (unique) · model", "contenu_json : 6 catégories", "tokens_in · tokens_out"]);
  s += table(280, 392, 205, "notes_profils", ["dossier_id · profil (unique)", "contenu_json · risk_score", "model · generated_at"]);
  s += table(46, 488, 222, "contradictions", ["gravite · status (ouverte/arbitrée)", "source_a · source_b (jsonb)", "arbitre_par · arbitre_at"]);
  s += table(280, 488, 205, "checklist_items", ["label · auto_checked", "requires_manual_check", "linked_contradiction_id"]);

  // D
  s += panel(530, 368, 440, 220, "COPILOTE ET SORTIES", SC.danger, SC.dangerTint);
  s += table(546, 392, 205, "chat_messages", ["dossier_id · user_id · role", "content · sources (jsonb)", "model · complexity_label"]);
  s += table(763, 392, 191, "ajouts_copilote", ["dossier_id · profil_cible", "categorie · contenu", "sources · created_by"]);
  s += table(546, 488, 205, "comparisons", ["dossier_ids uuid[]", "contenu_json (tableau)", "model · created_by"]);
  s += table(763, 488, 191, "exports", ["dossier_id · profil", "format : pdf / word", "storage_path"]);

  // E
  s += panel(30, 618, 940, 218, "PILOTAGE, QUOTAS ET CONFORMITÉ", SC.soft, SC.surf2);
  const e = [
    ["usage_logs", ["task_type · model", "tokens in/out · cache", "cost_usd"]],
    ["quotas_essentiel", ["cycle_start · cycle_end", "compteurs et limites", "blocked"]],
    ["velocity_alerts", ["user_id · metric", "observed / baseline", "status · reviewed_by"]],
    ["contract_cost_tracking", ["invoiced_amount_eur", "real_cost_usd · ratio", "renegotiation_flagged"]],
    ["erasure_requests", ["scope · requested_at", "executed_at", "perimeter_summary"]],
  ];
  e.forEach(([n, c], i) => (s += table(46 + i * 184, 644, 174, n, c)));
  s += txt(46, 760, "Lecture seule pour l'utilisateur (RLS : SELECT) : usage_logs, quotas_essentiel, velocity_alerts, contract_cost_tracking.", { size: 11, fill: SC.soft });
  s += txt(46, 778, "Écriture par le serveur uniquement (clé service_role) : jamais exposée au navigateur.", { size: 11, fill: SC.soft });
  s += txt(46, 806, "Non représenté : file de jobs (table à créer — voir document 04) · auth.users (géré par Supabase Auth).", { size: 11, fill: SC.faint });

  // flèches inter-panneaux
  s += arrow(430, 338, 430, 364, { color: SC.soft });
  s += arrow(750, 338, 750, 364, { color: SC.soft });
  s += txt(440, 356, "dossier_id", { size: 10.5, fill: SC.faint, mono: true });
  s += txt(760, 356, "dossier_id", { size: 10.5, fill: SC.faint, mono: true });
  s += txt(40, 862, "organization_id est présent sur toutes les tables métier : c'est la clé d'isolation appliquée par les politiques RLS.", { size: 11.5, fill: SC.ink, weight: "bold" });
  return add("d01-modele-donnees", W, H, s);
})();

/* ================================================================== d02 */
(() => {
  const W = 1000, H = 600;
  let s = head(W, H, "Cycles de vie d'un dossier et d'un document", "Ce qui est conservé, ce qui est libéré, ce qui est réellement supprimé");

  s += txt(40, 100, "DOSSIER", { size: 12.5, weight: "bold", fill: SC.soft, mono: true, ls: "1.5" });
  const st = [
    [40, "Actif", "compte dans le plafond", "(4 Essentiel · 15 Pro)", SC.acc, SC.accTint],
    [290, "Archivé", "libère un emplacement,", "rien n'est supprimé", SC.info, SC.infoTint],
    [540, "Corbeille", "restaurable 30 jours", "(purge_at)", SC.signal, SC.signalTint],
    [790, "Purgé", "lignes en base (cascade)", "+ fichiers Storage", SC.danger, SC.dangerTint],
  ];
  st.forEach(([x, t, l1, l2, c, f]) => {
    s += box(x, 118, 170, 112, { fill: f, stroke: c, sw: 2 });
    s += txt(x + 85, 148, t, { size: 17, weight: "bold", anchor: "middle", fill: c });
    s += txt(x + 85, 178, l1, { size: 11.5, anchor: "middle", fill: SC.ink });
    s += txt(x + 85, 196, l2, { size: 11.5, anchor: "middle", fill: SC.ink });
  });
  s += arrow(212, 160, 286, 160, { color: SC.soft });
  s += txt(216, 150, "archiver", { size: 10.5, fill: SC.soft });
  s += arrow(286, 195, 212, 195, { color: SC.soft });
  s += txt(228, 211, "rouvrir", { size: 10.5, fill: SC.soft });
  s += arrow(462, 160, 536, 160, { color: SC.signal });
  s += txt(466, 150, "supprimer", { size: 10.5, fill: SC.soft });
  s += arrow(712, 160, 786, 160, { color: SC.danger });
  s += txt(718, 150, "cron 03:00", { size: 10.5, fill: SC.soft });
  s += P("M 625 230 L 625 262 L 125 262 L 125 234", { color: SC.acc });
  s += txt(300, 280, "restaurer (jusqu'à l'échéance de purge_at)", { size: 11.5, fill: SC.acc });
  s += txt(40, 322, "La purge réutilise le mécanisme du droit à l'effacement, paramétré par dossier_id : fichiers d'abord, puis lignes (documents,", { size: 11.5, fill: SC.soft });
  s += txt(40, 340, "chunks, extraction, notes, chat, contradictions, checklist, exports) par cascade. usage_logs est conservé sous forme agrégée.", { size: 11.5, fill: SC.soft });

  s += txt(40, 392, "DOCUMENT", { size: 12.5, weight: "bold", fill: SC.soft, mono: true, ls: "1.5" });
  const ds = [
    [40, "en_attente", "fichier stocké,", "pas encore lu", SC.soft, SC.surf2],
    [270, "en_cours", "téléchargement,", "extraction, vecteurs", SC.signal, SC.signalTint],
    [520, "indexé", "chunks écrits,", "prêt pour l'analyse", SC.acc, SC.accTint],
  ];
  ds.forEach(([x, t, l1, l2, c, f]) => {
    s += box(x, 410, 190, 92, { fill: f, stroke: c, sw: 2 });
    s += txt(x + 95, 438, t, { size: 15, weight: "bold", anchor: "middle", fill: c, mono: true });
    s += txt(x + 95, 464, l1, { size: 11.5, anchor: "middle" });
    s += txt(x + 95, 482, l2, { size: 11.5, anchor: "middle" });
  });
  s += arrow(232, 456, 266, 456, { color: SC.soft });
  s += arrow(462, 456, 516, 456, { color: SC.acc });
  s += box(520, 520, 190, 56, { fill: SC.dangerTint, stroke: SC.danger, sw: 2 });
  s += txt(615, 546, "erreur", { size: 15, weight: "bold", anchor: "middle", fill: SC.danger, mono: true });
  s += txt(615, 564, "error_message renseigné", { size: 11, anchor: "middle" });
  s += P("M 365 502 L 365 548 L 516 548", { color: SC.danger });
  s += box(750, 410, 220, 92, { fill: SC.surf, stroke: SC.acc, dash: "6 4", sw: 1.6 });
  s += txt(860, 436, "doublon détecté", { size: 13.5, weight: "bold", anchor: "middle" });
  s += txt(860, 458, "empreinte SHA-256 du texte", { size: 11, anchor: "middle", fill: SC.soft });
  s += txt(860, 476, "déjà présente : is_duplicate_of,", { size: 11, anchor: "middle", fill: SC.soft });
  s += txt(860, 494, "aucune re-vectorisation", { size: 11, anchor: "middle", fill: SC.soft });
  s += arrow(714, 456, 746, 456, { color: SC.acc, dash: "5 4" });
  return add("d02-cycles-vie", W, H, s);
})();

/* ================================================================== g01 */
(() => {
  const W = 1000, H = 800;
  let s = head(W, H, "Flux de données personnelles et localisation", "Où passe le contenu des dossiers, et ce qui reste à vérifier avant d'ouvrir à de vrais clients");

  const loc = (x, y, label, kind) => {
    const m = { ok: [SC.accTint, SC.acc], warn: [SC.signalTint, SC.signal], out: [SC.dangerTint, SC.danger] }[kind];
    return pill(x, y, label.length * 6.6 + 22, 22, label, { fill: m[0], color: m[1], size: 11 });
  };

  s += box(30, 330, 150, 80, { fill: SC.surf2 });
  s += txt(105, 365, "Analyste", { size: 15, weight: "bold", anchor: "middle" });
  s += txt(105, 385, "navigateur", { size: 11.5, anchor: "middle", fill: SC.soft });

  s += box(250, 105, 270, 175, { fill: SC.surf, stroke: SC.signal, sw: 2 });
  s += txt(268, 134, "Vercel", { size: 16, weight: "bold" });
  s += lines(268, 156, ["Interface et routes API :", "reçoit les fichiers, appelle", "l'IA, renvoie les résultats"], { size: 11.5, fill: SC.soft }, 16);
  s += loc(268, 232, "Région des fonctions : à fixer", "warn");

  s += box(250, 335, 270, 190, { fill: SC.surf, stroke: SC.acc, sw: 2 });
  s += txt(268, 364, "Supabase — Francfort", { size: 16, weight: "bold" });
  s += lines(268, 386, ["Auth · Postgres + RLS · pgvector", "Storage : documents, exports", "Contenu des dossiers au repos"], { size: 11.5, fill: SC.soft }, 16);
  s += loc(268, 474, "UE confirmée (eu-central-1)", "ok");

  s += box(250, 575, 270, 150, { fill: SC.surf, stroke: SC.acc, sw: 2, dash: "7 5" });
  s += txt(268, 604, "VPS Hostinger — France", { size: 16, weight: "bold" });
  s += lines(268, 626, ["Cible : worker, ingestion, n8n", "Aujourd'hui : aucun service"], { size: 11.5, fill: SC.soft }, 16);
  s += loc(268, 676, "UE (France) — non utilisé", "ok");

  s += box(620, 105, 350, 150, { fill: SC.surf, stroke: SC.danger, sw: 2 });
  s += txt(638, 134, "API Anthropic", { size: 16, weight: "bold" });
  s += lines(638, 156, ["Reçoit les passages et le corpus à analyser,", "les questions des utilisateurs.", "DPA et clauses types : conditions commerciales"], { size: 11.5, fill: SC.soft }, 16);
  s += loc(638, 214, "Transfert hors UE — à encadrer", "out");

  s += box(620, 285, 350, 150, { fill: SC.surf, stroke: SC.signal, sw: 2 });
  s += txt(638, 314, "Voyage AI (embeddings)", { size: 16, weight: "bold" });
  s += lines(638, 336, ["Reçoit le texte de tous les chunks des", "documents pour le vectoriser.", "Absent des notes d'architecture initiales"], { size: 11.5, fill: SC.soft }, 16);
  s += loc(638, 394, "Localisation, DPA, rétention : à vérifier", "warn");

  s += box(620, 465, 350, 110, { fill: SC.surf, stroke: SC.signal, sw: 2 });
  s += txt(638, 494, "Stripe (paiement)", { size: 16, weight: "bold" });
  s += lines(638, 516, ["Nom, e-mail, facturation —", "jamais le contenu des dossiers"], { size: 11.5, fill: SC.soft }, 16);
  s += loc(638, 542, "DPA à vérifier", "warn");

  s += arrow(180, 355, 246, 215, { color: SC.soft });
  s += arrow(180, 375, 246, 420, { color: SC.soft });
  s += txt(40, 318, "fichiers, questions", { size: 10.5, fill: SC.faint });
  s += arrow(385, 280, 385, 331, { color: SC.acc, both: true });
  s += arrow(520, 160, 616, 160, { color: SC.danger });
  s += arrow(520, 230, 616, 330, { color: SC.signal });
  s += arrow(520, 255, 616, 505, { color: SC.signal });
  s += arrow(385, 525, 385, 571, { color: SC.acc, both: true, dash: "6 4" });
  s += P("M 520 650 L 580 650 L 580 195 L 616 195", { color: SC.danger, w: 1.6 });
  s += txt(524, 640, "cible", { size: 10.5, fill: SC.faint });

  s += txt(40, 760, "Légende :", { size: 12, weight: "bold" });
  s += loc(110, 745, "UE confirmée", "ok");
  s += loc(230, 745, "À vérifier", "warn");
  s += loc(325, 745, "Hors UE", "out");
  s += txt(40, 782, "Les clés Anthropic et Voyage ne sont volontairement pas encore configurées : la revue de ces deux sous-traitants est un préalable.", { size: 11.5, fill: SC.ink });
  return add("g01-flux-donnees", W, H, s);
})();

/* ================================================================== b01 */
(() => {
  const W = 1000, H = 800;
  let s = head(W, H, "Marge brute par scénario d'usage", "Modèle de la note Coûts & Pricing, puis recalculé avec le coût réel du pipeline actuel");
  const x0 = 360, wPlot = 590, vmin = -40, vmax = 100;
  const sc = (v) => x0 + ((v - vmin) / (vmax - vmin)) * wPlot;
  const zero = sc(0);

  // légende
  const leg = [["Modèle de la note Coûts & Pricing", SC.faint], ["Pipeline actuel (contradictions sur le corpus complet)", SC.danger], ["Après fusion (contradictions sur l'extraction)", SC.acc]];
  let lx = 40;
  leg.forEach(([l, c]) => {
    s += `<rect x="${lx}" y="86" width="14" height="14" rx="3" fill="${c}"/>`;
    s += txt(lx + 20, 98, l, { size: 11.5, fill: SC.soft });
    lx += l.length * 5.9 + 46;
  });

  // grille
  [-40, -20, 0, 20, 40, 60, 80, 100].forEach((v) => {
    s += `<line x1="${sc(v)}" y1="118" x2="${sc(v)}" y2="${H - 56}" stroke="${v === 0 ? SC.ink : SC.line}" stroke-width="${v === 0 ? 1.6 : 1}"/>`;
    s += txt(sc(v), H - 38, `${v} %`, { size: 10.5, anchor: "middle", fill: SC.faint });
  });

  const rowH = 70;
  M.scenarios.forEach((sc9, i) => {
    const y = 128 + i * rowH;
    s += txt(40, y + 22, `${sc9.offre}`, { size: 12.5, weight: "bold" });
    s += txt(40, y + 40, sc9.libelle, { size: 11.5, fill: SC.soft });
    const bars = [[sc9.margeNominale, SC.faint], [sc9.margeActuelle, SC.danger], [sc9.margeV2, SC.acc]];
    bars.forEach(([v, c], k) => {
      const pct = v * 100;
      const bx = pct >= 0 ? zero : sc(pct);
      const bw = Math.abs(sc(pct) - zero);
      const by = y + 4 + k * 19;
      s += `<rect x="${bx}" y="${by}" width="${Math.max(bw, 1)}" height="15" rx="2" fill="${c}"/>`;
      const lblX = pct >= 0 ? sc(pct) + 6 : sc(pct) - 6;
      s += txt(lblX, by + 12, `${pct.toFixed(0)} %`, { size: 10.5, anchor: pct >= 0 ? "start" : "end", fill: pct < 0 ? SC.danger : SC.soft, weight: pct < 0 ? "bold" : "normal" });
    });
  });
  s += txt(40, H - 14, "Essentiel : facture de 23 € traitée comme un montant hors taxes, comme dans la note source (voir le texte pour l'effet de la TVA).", { size: 11, fill: SC.faint });
  return add("b01-marges", W, H, s);
})();

/* ================================================================== b02 */
(() => {
  const W = 1000, H = 430;
  let s = head(W, H, "Coût d'analyse d'un dossier de ~300 pages", "Dollars par dossier, hypothèses de la note Coûts & Pricing (1 $ ≈ 1 €)");
  const x0 = 70, k = 105; // px par dollar
  const rows = [
    ["Pipeline actuel", [[M.COUT.extraction, "Extraction", SC.acc], [M.COUT.reformulation6, "", SC.info], [M.contradictionsActuel, "Contradictions sur le corpus complet", SC.danger]]],
    ["Après fusion", [[M.COUT.extraction, "Extraction", SC.acc], [M.COUT.reformulation6, "", SC.info], [M.contradictionsV2, "", SC.signal]]],
  ];
  rows.forEach(([label, segs], r) => {
    const y = 130 + r * 120;
    s += txt(x0, y - 14, label, { size: 14, weight: "bold" });
    let x = x0;
    let tot = 0;
    segs.forEach(([v, name, c]) => {
      const w = v * k;
      s += `<rect x="${x}" y="${y}" width="${w}" height="46" fill="${c}"/>`;
      if (w > 60) s += txt(x + w / 2, y + 28, `${v.toFixed(2).replace(".", ",")} $`, { size: 12.5, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
      x += w;
      tot += v;
    });
    s += txt(x + 12, y + 29, `≈ ${tot.toFixed(2).replace(".", ",")} $`, { size: 16, weight: "bold" });
  });
  // légende
  const L = [["Extraction exhaustive (Fable 5)", SC.acc], ["6 reformulations par profil (Sonnet 5)", SC.info], ["Contradictions — pipeline actuel", SC.danger], ["Contradictions — après fusion", SC.signal]];
  L.forEach(([l, c], i) => {
    const x = 70 + (i % 2) * 400;
    const y = 330 + Math.floor(i / 2) * 26;
    s += `<rect x="${x}" y="${y}" width="14" height="14" rx="3" fill="${c}"/>`;
    s += txt(x + 22, y + 12, l, { size: 12, fill: SC.soft });
  });
  s += txt(70, 400, `Contradictions : ~300k tokens en entrée à 10 $/M + ~2k en sortie à 50 $/M ≈ ${M.contradictionsActuel.toFixed(2).replace(".", ",")} $ ; après fusion ~20k en entrée + 4k en sortie ≈ ${M.contradictionsV2.toFixed(2).replace(".", ",")} $.`, { size: 11, fill: SC.faint });
  return add("b02-cout-dossier", W, H, s);
})();

/* ================================================================== i01 */
(() => {
  const W = 1000, H = 740;
  let s = head(W, H, "Routage des modèles par tâche", "Le modèle qui lit et juge reste Fable 5 ; le reste est confié à plus économique");
  const tasks = [
    ["Extraction exhaustive du dossier", "F"],
    ["Comparateur de dossiers", "F"],
    ["Détection de contradictions", "F"],
    ["Copilote — question complexe", "F"],
    ["Reformulation par profil (×6)", "S"],
    ["Copilote — question standard", "S"],
    ["Classification de complexité", "H"],
    ["Classement d'un ajout épinglé", "H"],
  ];
  const col = { F: SC.acc, S: SC.info, H: SC.signal };
  const models = {
    F: [610, 100, 360, 170, "Claude Fable 5", ["10 $ / 50 $ par million de tokens", "Lit et juge les documents", "Toujours sur l'analyse"], SC.accTint],
    S: [610, 300, 360, 130, "Claude Sonnet 5", ["2 $ / 10 $ par million de tokens", "Reformule, converse", "Environ 5× moins cher que Fable 5"], SC.infoTint],
    H: [610, 460, 360, 120, "Claude Haiku 4.5", ["1 $ / 5 $ par million de tokens", "Tâches internes invisibles"], SC.signalTint],
  };
  Object.entries(models).forEach(([k, [x, y, w, h, name, ln, f]]) => {
    s += box(x, y, w, h, { fill: f, stroke: col[k], sw: 2 });
    s += txt(x + 18, y + 32, name, { size: 17, weight: "bold", fill: col[k] });
    s += lines(x + 18, y + 58, ln, { size: 12, fill: SC.ink }, 19);
  });
  tasks.forEach(([t, k], i) => {
    const y = 100 + i * 56;
    s += box(30, y, 330, 44, { fill: SC.surf });
    s += txt(46, y + 27, t, { size: 13 });
    const [mx, my, mw, mh] = models[k];
    s += arrow(362, y + 22, mx - 4, my + mh / 2 + ((i % 4) - 1.5) * 8, { color: col[k], w: 1.6 });
  });
  s += box(30, 590, 940, 120, { fill: SC.surf2 });
  s += txt(48, 616, "Chemin d'une question du Copilote", { size: 13.5, weight: "bold" });
  const flow = [["Question", SC.surf, SC.ink], ["Haiku 4.5 classe", SC.signalTint, SC.signal], ["standard", SC.infoTint, SC.info], ["Sonnet 5", SC.infoTint, SC.info]];
  let fx = 48;
  flow.forEach(([l, f, c], i) => {
    const w = l.length * 8 + 34;
    s += pill(fx, 634, w, 30, l, { fill: f, color: c, size: 12.5, stroke: c });
    if (i < flow.length - 1) s += arrow(fx + w + 2, 649, fx + w + 20, 649, { color: SC.soft });
    fx += w + 24;
  });
  s += pill(48 + 178, 676, 90, 26, "complexe", { fill: SC.accTint, color: SC.acc, size: 12.5, stroke: SC.acc });
  s += arrow(48 + 270, 689, 48 + 296, 689, { color: SC.acc });
  s += pill(48 + 300, 676, 90, 26, "Fable 5", { fill: SC.accTint, color: SC.acc, size: 12.5, stroke: SC.acc });
  s += txt(660, 652, "Le cache de prompt (1 h) rend la relecture du", { size: 11.5, fill: SC.soft });
  s += txt(660, 670, "contexte d'une session à 10 % du tarif d'entrée.", { size: 11.5, fill: SC.soft });
  s += txt(660, 694, "Le cache est propre à chaque modèle.", { size: 11.5, fill: SC.soft });
  return add("i01-routage", W, H, s);
})();

/* ================================================================== i02 */
(() => {
  const W = 1000, H = 760;
  let s = head(W, H, "Pipeline RAG : de l'indexation à la citation vérifiée", "En place · partiel · à construire — chaque étape est située");
  const step = (x, y, w, h, t, ln, kind) => {
    let r = box(x, y, w, h, { fill: SC.surf, stroke: kind === "todo" ? SC.info : kind === "part" ? SC.signal : SC.acc, sw: 1.8, dash: kind === "todo" ? "6 4" : undefined });
    r += txt(x + 12, y + 26, t, { size: 13.5, weight: "bold" });
    r += lines(x + 12, y + 46, ln, { size: 11, fill: SC.soft }, 15);
    r += tag(x + 12, y + h - 30, kind);
    return r;
  };
  s += txt(40, 100, "INDEXATION — à chaque document déposé", { size: 12.5, weight: "bold", fill: SC.soft, mono: true, ls: "1.2" });
  const a = [
    ["Fichier", ["Supabase Storage,", "bucket privé"], "ok"],
    ["Extraction du texte", ["PDF : unpdf (couche texte)", "OCR, Word, Excel : à faire"], "part"],
    ["Découpage", ["3 000 caractères,", "chevauchement 300"], "ok"],
    ["Embeddings", ["Voyage, envoyés par", "lots (à corriger)"], "part"],
    ["Stockage", ["pgvector + index HNSW ;", "plein texte à ajouter"], "part"],
  ];
  a.forEach(([t, l, k], i) => {
    const x = 36 + i * 188;
    s += step(x, 116, 176, 124, t, l, k);
    if (i < 4) s += arrow(x + 178, 178, x + 186, 178, { color: SC.acc });
  });
  s += txt(40, 288, "QUESTION — à chaque message du Copilote", { size: 12.5, weight: "bold", fill: SC.soft, mono: true, ls: "1.2" });
  const b1 = [
    ["Question", ["texte libre,", "4 000 caractères max"], "ok"],
    ["Embedding de la requête", ["même modèle que", "les documents"], "ok"],
    ["Recherche hybride", ["vecteur + plein texte,", "fusion RRF"], "todo"],
    ["Reclassement", ["rerank des ~30 passages", "retenus"], "todo"],
  ];
  const b2 = [
    ["8 passages", ["envoyés au modèle", "avec document et page"], "ok"],
    ["Génération", ["Sonnet 5 ou Fable 5,", "réponse JSON + sources"], "ok"],
    ["Vérification", ["l'extrait cité existe-t-il", "dans la page citée ?"], "todo"],
    ["Réponse", ["pastilles cliquables,", "panneau source"], "ok"],
  ];
  b1.forEach(([t, l, k], i) => {
    const x = 36 + i * 238;
    s += step(x, 304, 214, 124, t, l, k);
    if (i < 3) s += arrow(x + 216, 366, x + 236, 366, { color: SC.acc });
  });
  s += P("M 940 428 L 940 452 L 60 452 L 60 470", { color: SC.acc });
  b2.forEach(([t, l, k], i) => {
    const x = 36 + i * 238;
    s += step(x, 470, 214, 124, t, l, k);
    if (i < 3) s += arrow(x + 216, 532, x + 236, 532, { color: SC.acc });
  });
  s += box(36, 620, 928, 100, { fill: SC.surf2 });
  s += txt(52, 646, "Pourquoi la vérification des citations compte", { size: 13.5, weight: "bold" });
  s += lines(52, 668, ["Le modèle renvoie lui-même l'extrait qu'il prétend citer. Un contrôle programmatique simple — l'extrait figure-t-il, mot pour mot,", "dans un des passages fournis ? — permet de marquer une citation non vérifiable avant de l'afficher. C'est le seul moyen de rendre la promesse", "« chaque réponse cite sa source » mesurable plutôt que seulement affichée."], { size: 11.5, fill: SC.soft }, 17);
  return add("i02-rag", W, H, s);
})();

/* ================================================================== i03 */
(() => {
  const W = 1000, H = 560;
  let s = head(W, H, "Feuille de route agents", "Chaque marche augmente l'autonomie — et les garde-fous qui l'accompagnent");
  const steps = [
    ["0", "Assistant", "En place", "ok", ["Copilote et notes par profil.", "Le modèle répond, l'humain décide.", "Aucune action sur le monde."]],
    ["1", "Automatisations", "À construire", "todo", ["Tâches en file : analyse,", "contrôles, alertes.", "Déclenchées par un événement,", "jamais par le modèle."]],
    ["2", "Agents supervisés", "À construire", "todo", ["Complétude documentaire, veille.", "Outils en lecture seule, budget de", "tokens borné, validation humaine."]],
    ["3", "Agents rédacteurs", "À décider", "todo", ["Pré-rédaction de mémo, data rooms,", "messageries. Périmètre, droits et", "coûts bornés ; journal complet."]],
  ];
  steps.forEach(([n, t, st, k, ln], i) => {
    const x = 36 + i * 236;
    const top = 330 - i * 70;
    const h = 480 - top;
    s += box(x, top, 222, h, { fill: i === 0 ? SC.accTint : SC.surf2, stroke: i === 0 ? SC.acc : SC.line, sw: 1.8 });
    s += circle(x + 26, top + 28, 14, n);
    s += txt(x + 50, top + 34, t, { size: 15, weight: "bold" });
    s += pill(x + 14, top + 52, st === "En place" ? 74 : 102, 22, st, { fill: st === "En place" ? SC.surf : SC.infoTint, color: st === "En place" ? SC.acc : SC.info, size: 11, stroke: st === "En place" ? SC.acc : SC.infoTint });
    s += lines(x + 14, top + 96, ln, { size: 11.5, fill: SC.soft }, 17);
  });
  s += arrow(36, 520, 940, 520, { color: SC.soft });
  s += txt(36, 545, "autonomie croissante  →", { size: 12.5, fill: SC.soft });
  s += txt(964, 545, "→  garde-fous et journalisation croissants", { size: 12.5, fill: SC.soft, anchor: "end" });
  return add("i03-agents", W, H, s);
})();

/* ================================================================== c01 */
(() => {
  const W = 1000, H = 640;
  let s = head(W, H, "Feuille de route par lots", "Ordre et dépendances — la durée de chaque lot reste à estimer, aucune date n'est engagée");
  const x0 = 270, cw = 170;
  ["Vague 1", "Vague 2", "Vague 3", "Vague 4"].forEach((l, i) => {
    s += box(x0 + i * cw, 90, cw - 6, 30, { fill: SC.ink, stroke: SC.ink, rx: 6 });
    s += txt(x0 + i * cw + (cw - 6) / 2, 111, l, { size: 12.5, weight: "bold", fill: "#FFFFFF", anchor: "middle" });
  });
  const lots = [
    ["Lot 0 — Débloquer la production", 0, 1, SC.danger, "clés IA après revue RGPD"],
    ["Lot 1 — Fiabiliser le pipeline", 0, 1.8, SC.acc, "lots, fusion, parallèle"],
    ["Lot 2 — Worker et file de jobs", 1, 2, SC.acc, "dépend du VPS"],
    ["Lot 3 — Ingestion lourde", 2, 3, SC.acc, "OCR, Word, Excel"],
    ["Lot 4 — Qualité du RAG", 1, 3, SC.info, "hybride, rerank, streaming"],
    ["Lot 5 — Supervision n8n", 2.5, 3.5, SC.info, "vélocité, purge, alertes"],
    ["Lot 6 — Conformité et sécurité", 0, 4, SC.signal, "en continu, bloquant avant lancement"],
    ["Lot 7 — Bêta fermée et lancement", 3, 4, SC.soft, "comptes payants, Stripe en réel"],
  ];
  lots.forEach(([t, a, b, c, sub], i) => {
    const y = 144 + i * 58;
    s += txt(30, y + 18, t, { size: 12.5, weight: "bold" });
    s += txt(30, y + 36, sub, { size: 11, fill: SC.soft });
    for (let k = 0; k < 4; k++) s += `<rect x="${x0 + k * cw}" y="${y - 6}" width="${cw - 6}" height="48" fill="${SC.surf2}" rx="4"/>`;
    s += `<rect x="${x0 + a * cw}" y="${y + 4}" width="${(b - a) * cw - 8}" height="28" rx="6" fill="${c}"/>`;
  });
  s += txt(30, 622, "Rouge : bloquant · vert : socle technique · bleu : qualité et exploitation · ocre : transverse · gris : mise sur le marché.", { size: 11.5, fill: SC.faint });
  return add("c01-feuille-de-route", W, H, s);
})();

/* ================================================================== t01 */
(() => {
  const W = 1000, H = 600;
  let s = head(W, H, "Chaîne de déploiement et environnements", "Un dépôt, deux cibles de déploiement, une base");
  s += box(30, 110, 230, 100, { fill: SC.surf2 });
  s += txt(145, 142, "Poste de développement", { size: 14, weight: "bold", anchor: "middle" });
  s += lines(145, 164, ["disque externe, deux PC", "Claude Code + Git"], { size: 11.5, fill: SC.soft, anchor: "middle" }, 16);
  s += arrow(262, 160, 318, 160, { color: SC.acc });
  s += txt(264, 150, "git push", { size: 10.5, fill: SC.faint, mono: true });

  s += box(320, 100, 260, 120, { fill: SC.surf, stroke: SC.ink, sw: 2 });
  s += txt(450, 132, "GitHub", { size: 16, weight: "bold", anchor: "middle" });
  s += lines(450, 154, ["QuamouyaPro/FinLens", "branche main = production", "docs/ · web/ · session-log/"], { size: 11.5, fill: SC.soft, anchor: "middle" }, 16);

  s += arrow(450, 222, 300, 318, { color: SC.acc });
  s += arrow(450, 222, 640, 318, { color: SC.acc, dash: "6 4" });

  s += box(60, 320, 300, 130, { fill: SC.surf, stroke: SC.acc, sw: 2 });
  s += txt(210, 350, "Vercel", { size: 16, weight: "bold", anchor: "middle" });
  s += lines(210, 372, ["build de web/ (Root Directory = web)", "production · aperçus de branche", "3 tâches planifiées quotidiennes"], { size: 11.5, fill: SC.soft, anchor: "middle" }, 16);
  s += pill(110, 414, 200, 22, "plan Hobby à confirmer", { fill: SC.signalTint, color: SC.signal, size: 11 });

  s += box(500, 320, 300, 130, { fill: SC.surf, stroke: SC.info, sw: 2, dash: "7 5" });
  s += txt(650, 350, "Coolify sur le VPS", { size: 16, weight: "bold", anchor: "middle" });
  s += lines(650, 372, ["finlens-worker · finlens-ingest · n8n", "déploiement depuis le même dépôt"], { size: 11.5, fill: SC.soft, anchor: "middle" }, 16);
  s += pill(590, 414, 120, 22, "cible, non construit", { fill: SC.infoTint, color: SC.info, size: 11 });

  s += box(60, 490, 740, 80, { fill: SC.accTint, stroke: SC.acc, sw: 2 });
  s += txt(80, 520, "Supabase — projet « finlens » (Francfort)", { size: 14, weight: "bold", fill: SC.acc });
  s += txt(80, 542, "Migrations versionnées dans web/supabase/migrations, appliquées via la CLI ou l'outil MCP. Un seul projet : pas de staging.", { size: 11.5, fill: SC.ink });
  s += txt(80, 560, "Recommandation : branche Supabase pour tester une migration avant la production.", { size: 11.5, fill: SC.soft });
  s += arrow(210, 452, 210, 486, { color: SC.acc, both: true });
  s += arrow(650, 452, 650, 486, { color: SC.info, both: true, dash: "6 4" });

  s += box(830, 100, 150, 470, { fill: SC.surf2 });
  s += txt(905, 128, "SECRETS", { size: 12, weight: "bold", fill: SC.soft, anchor: "middle", mono: true, ls: "1.5" });
  s += lines(845, 160, ["Variables Vercel", "(sensibles, preview", "et production)", "", "Variables Coolify", "(cible)", "", ".env.local", "jamais commité", "", "Aucun secret", "dans le dépôt"], { size: 11.5, fill: SC.soft }, 18);
  return add("t01-deploiement", W, H, s);
})();

/* ================================================================ sortie */
(async () => {
  // schémas de la Note d'Architecture V2 réutilisés tels quels
  const reuse = [
    ["01-architecture", 1000, 800],
    ["02-flux", 1000, 900],
    ["03-jobs", 1000, 470],
    ["04-pipeline", 1000, 600],
    ["05-recherche", 1000, 480],
  ];
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const mfPath = path.join(IMG_DIR, "manifest.json");
  const manifest = fs.existsSync(mfPath) ? JSON.parse(fs.readFileSync(mfPath, "utf8")) : {};
  for (const [n, w, h] of reuse) {
    const src = path.join(__dirname, "..", "architecture-v2-src", "img", `${n}.png`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(IMG_DIR, `${n}.png`));
      manifest[n] = { w, h };
    }
  }
  fs.writeFileSync(mfPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log("Rendu des schémas :");
  await renderDiagrams(out);
})();
