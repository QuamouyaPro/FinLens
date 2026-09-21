const sharp = require("E:/FinLens/web/node_modules/sharp");
const fs = require("node:fs");
const path = require("node:path");

const OUT = path.join(__dirname, "img");
fs.mkdirSync(OUT, { recursive: true });

const C = {
  ink: "#0F130E",
  soft: "#59615A",
  faint: "#8A928A",
  line: "#D7DCD5",
  surf: "#FFFFFF",
  surf2: "#F6F7F5",
  acc: "#146B45",
  accTint: "#E8F3ED",
  danger: "#A63A2E",
  dangerTint: "#F8E9E6",
  signal: "#A9741A",
  signalTint: "#FBF3E4",
  info: "#2E6B99",
  infoTint: "#E7F0F7",
  // Panneaux « ink » : tokens repris tels quels de DESIGN.md (ink-bg, ink-bg-2,
  // ink-text, ink-text-soft) pour ne pas introduire de teinte hors charte.
  panel: "#0E1211",
  panelBox: "#08090A",
  panelText: "#F3F5F3",
  panelSoft: "#97A19A",
};

const SANS = "Arial, Helvetica, sans-serif";
const MONO = "Consolas, 'Courier New', monospace";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function box(x, y, w, h, o = {}) {
  const fill = o.fill || C.surf;
  const stroke = o.stroke || C.line;
  const sw = o.sw ?? 1.5;
  const rx = o.rx ?? 8;
  const so = o.strokeOpacity != null ? ` stroke-opacity="${o.strokeOpacity}"` : "";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${so}/>`;
}

function txt(x, y, s, o = {}) {
  const size = o.size ?? 14;
  const fill = o.fill || C.ink;
  const weight = o.weight || "normal";
  const anchor = o.anchor || "start";
  const family = o.family || SANS;
  const ls = o.ls ? ` letter-spacing="${o.ls}"` : "";
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${ls}>${esc(s)}</text>`;
}

function defs() {
  return `<defs>
    <marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${C.soft}"/>
    </marker>
    <marker id="aAcc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${C.acc}"/>
    </marker>
  </defs>`;
}

function arrow(x1, y1, x2, y2, o = {}) {
  const color = o.color || C.soft;
  const m = o.color === C.acc ? "aAcc" : "a";
  const both = o.both ? ` marker-start="url(#${m})"` : "";
  const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : "";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" marker-end="url(#${m})"${both}${dash}/>`;
}

function pathArrow(d, o = {}) {
  const color = o.color || C.soft;
  const m = o.color === C.acc ? "aAcc" : "a";
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" marker-end="url(#${m})"/>`;
}

function head(w, h, title, subtitle) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${defs()}
  <rect width="${w}" height="${h}" fill="${C.surf}"/>
  ${txt(40, 40, title, { size: 25, weight: "bold" })}
  ${subtitle ? txt(40, 65, subtitle, { size: 13.5, fill: C.soft }) : ""}`;
}

/* ============================ 1. Vue d'ensemble ============================ */
function diagram1() {
  const W = 1000,
    H = 800;
  let s = head(
    W,
    H,
    "Architecture cible FinLens",
    "Vercel = synchrone court · VPS = long et lourd · Supabase = source de vérité unique"
  );

  // Client
  s += box(200, 95, 300, 46, { fill: C.surf2 });
  s += txt(350, 124, "Navigateur — l'analyste", { size: 15, anchor: "middle" });
  s += arrow(350, 141, 350, 171, { color: C.acc });

  // Vercel
  s += box(40, 175, 620, 150, { stroke: C.acc, sw: 2, rx: 10 });
  s += txt(58, 201, "VERCEL", { size: 13, weight: "bold", fill: C.acc, family: MONO, ls: "1.5" });
  s += txt(140, 201, "toute réponse en moins de 30 secondes", { size: 12, fill: C.faint });
  const vChips = [
    ["Interface Next.js", 58, 212, 180],
    ["API CRUD + quotas", 250, 212, 180],
    ["Copilote (SSE)", 442, 212, 160],
    ["Exports PDF / Word", 58, 262, 180],
    ["Stripe checkout", 250, 262, 180],
    ["Crons légers", 442, 262, 160],
  ];
  for (const [label, x, y, w] of vChips) {
    s += box(x, y, w, 40, { fill: C.accTint, stroke: C.accTint, rx: 6 });
    s += txt(x + w / 2, y + 25, label, { size: 13, anchor: "middle" });
  }

  s += arrow(350, 325, 350, 359, { both: true });
  s += txt(365, 348, "lecture / écriture — isolation RLS", { size: 12, fill: C.soft });

  // Supabase
  s += box(40, 363, 620, 150, { stroke: C.info, sw: 2, rx: 10 });
  s += txt(58, 389, "SUPABASE", { size: 13, weight: "bold", fill: C.info, family: MONO, ls: "1.5" });
  s += txt(158, 389, "source de vérité unique — données ET vecteurs", { size: 12, fill: C.faint });
  const sChips = [
    ["Postgres + RLS", 58, 400, 180],
    ["pgvector (chunks)", 250, 400, 180],
    ["Storage (fichiers)", 442, 400, 160],
    ["Auth", 58, 450, 180],
    ["Table jobs", 250, 450, 180],
    ["usage_logs", 442, 450, 160],
  ];
  for (const [label, x, y, w] of sChips) {
    s += box(x, y, w, 40, { fill: C.infoTint, stroke: C.infoTint, rx: 6 });
    s += txt(x + w / 2, y + 25, label, { size: 13, anchor: "middle" });
  }

  s += arrow(350, 513, 350, 547, { both: true });
  s += txt(365, 536, "file de jobs tirée par le worker (SKIP LOCKED)", { size: 12, fill: C.soft });

  // VPS
  s += box(40, 551, 620, 185, { fill: C.panel, stroke: C.panel, rx: 10 });
  s += txt(58, 579, "VPS HOSTINGER KVM 2 + COOLIFY", {
    size: 13,
    weight: "bold",
    fill: C.panelText,
    family: MONO,
    ls: "1.5",
  });
  s += txt(58, 600, "aucun plafond de durée — c'est là que vit tout le traitement lourd", {
    size: 12,
    fill: C.panelSoft,
  });
  const vpsBoxes = [
    ["finlens-worker", "extraction, profils,", "contradictions", 58],
    ["finlens-ingest", "OCR, Word / Excel,", "découpage", 258],
    ["n8n", "supervision, alertes,", "purge RGPD", 458],
  ];
  for (const [title, l1, l2, x] of vpsBoxes) {
    s += box(x, 614, 182, 76, { fill: C.panelBox, stroke: "#FFFFFF", strokeOpacity: 0.09, rx: 6 });
    s += txt(x + 91, 637, title, { size: 13.5, weight: "bold", fill: C.panelText, anchor: "middle" });
    s += txt(x + 91, 656, l1, { size: 11.5, fill: C.panelSoft, anchor: "middle" });
    s += txt(x + 91, 672, l2, { size: 11.5, fill: C.panelSoft, anchor: "middle" });
  }
  s += txt(58, 714, "Déployés et supervisés via Coolify — aucune ligne de commande au quotidien.", {
    size: 11.5,
    fill: C.panelSoft,
  });

  // Externes
  s += box(700, 175, 260, 561, { fill: C.surf2, rx: 10 });
  s += txt(718, 201, "SERVICES EXTERNES", { size: 13, weight: "bold", fill: C.soft, family: MONO, ls: "1.5" });

  s += box(718, 225, 224, 90, { rx: 6 });
  s += txt(730, 250, "API Anthropic", { size: 14, weight: "bold" });
  s += txt(730, 272, "Fable 5 — extraction, comparateur", { size: 11, fill: C.soft });
  s += txt(730, 289, "Sonnet 5 — profils, chat", { size: 11, fill: C.soft });
  s += txt(730, 306, "Haiku 4.5 — classification", { size: 11, fill: C.soft });

  s += box(718, 335, 224, 72, { rx: 6 });
  s += txt(730, 360, "Voyage AI", { size: 14, weight: "bold" });
  s += txt(730, 382, "embeddings (voyage-3-large)", { size: 11, fill: C.soft });
  s += txt(730, 399, "rerank des passages", { size: 11, fill: C.soft });

  s += box(718, 427, 224, 56, { rx: 6 });
  s += txt(730, 452, "Stripe", { size: 14, weight: "bold" });
  s += txt(730, 472, "abonnements Essentiel / Analyste / Fonds", { size: 10.5, fill: C.soft });

  s += box(718, 503, 224, 56, { rx: 6 });
  s += txt(730, 528, "GitHub", { size: 14, weight: "bold" });
  s += txt(730, 548, "source de vérité du code, CI vers Vercel", { size: 10.5, fill: C.soft });

  s += arrow(660, 250, 714, 250);
  s += txt(664, 240, "chat", { size: 10.5, fill: C.faint });
  s += pathArrow("M 660 640 L 680 640 L 680 380 L 714 380");

  s += txt(40, 768, "Le worker tire ses tâches de la file — aucun webhook à perdre. Les flèches doubles sont des échanges bidirectionnels.", {
    size: 11.5,
    fill: C.faint,
  });
  s += txt(40, 788, "Le worker appelle Anthropic et Voyage AI pour l'analyse ; Vercel n'appelle Anthropic que pour le chat.", {
    size: 11.5,
    fill: C.faint,
  });

  return { name: "01-architecture", svg: s + "</svg>", W, H };
}

/* ============================ 2. Flux bout en bout ============================ */
function diagram2() {
  const W = 1000,
    H = 900;
  let s = head(
    W,
    H,
    "Parcours d'un dossier, de l'upload à la note",
    "Chaque étape indique où elle s'exécute réellement"
  );

  const steps = [
    ["Dépôt du document", "PDF, Word ou Excel déposé par l'analyste dans un dossier", "VERCEL", C.accTint, C.acc],
    ["Stockage et mise en file", "Fichier en Storage, puis une ligne jobs(type=ingestion)", "SUPABASE", C.infoTint, C.info],
    ["Préparation du fichier", "OCR si aucune couche texte ; Word/Excel via LibreOffice headless", "finlens-ingest", C.panel, C.panel],
    ["Découpage et vectorisation", "Chunking par page, embeddings Voyage envoyés par lots", "finlens-worker", C.panel, C.panel],
    ["Mémoire du dossier", "document_chunks : texte + vecteur + organization_id / dossier_id", "SUPABASE", C.infoTint, C.info],
    ["Extraction exhaustive", "Fable 5, un seul passage sur le corpus, six catégories sourcées", "finlens-worker", C.panel, C.panel],
    ["Six reformulations par profil", "Sonnet 5 : la première amorce le cache, les cinq autres en parallèle", "finlens-worker", C.panel, C.panel],
    ["Contradictions et checklist", "Détectées sur l'extraction structurée, pas sur le corpus brut", "finlens-worker", C.panel, C.panel],
    ["Restitution", "Progression en direct, puis note par profil et citations cliquables", "VERCEL", C.accTint, C.acc],
  ];

  let y = 105;
  steps.forEach(([title, sub, zone, zFill, zStroke], i) => {
    const cy = y + 28;
    s += `<circle cx="70" cy="${cy}" r="19" fill="${C.acc}"/>`;
    s += txt(70, cy + 6, String(i + 1), { size: 15, weight: "bold", fill: "#FFFFFF", anchor: "middle" });
    s += box(110, y, 630, 56, {});
    s += txt(130, y + 24, title, { size: 14.5, weight: "bold" });
    s += txt(130, y + 44, sub, { size: 12, fill: C.soft });
    const dark = zFill === C.panel;
    s += box(762, y + 15, 198, 28, { fill: zFill, stroke: dark ? C.panel : zFill, rx: 14 });
    s += txt(861, y + 34, zone, {
      size: 12,
      weight: "bold",
      fill: dark ? C.panelText : zStroke,
      anchor: "middle",
      family: dark ? MONO : SANS,
    });
    if (i < steps.length - 1) s += arrow(70, cy + 20, 70, cy + 59, { color: C.acc });
    y += 84;
  });

  s += txt(40, 870, "Les étapes 3 à 8 sont hors de toute contrainte de durée : c'est précisément ce que l'architecture actuelle ne permet pas.", {
    size: 11.5,
    fill: C.faint,
  });

  return { name: "02-flux", svg: s + "</svg>", W, H };
}

/* ============================ 3. Machine à états ============================ */
function diagram3() {
  const W = 1000,
    H = 470;
  let s = head(W, H, "Cycle de vie d'un job", "Reprise, idempotence et alerte en cas d'échec définitif");

  const st = (x, y, label, sub, fill, stroke, textFill) => {
    let o = box(x, y, 190, 66, { fill, stroke, sw: 2, rx: 8 });
    o += txt(x + 95, y + 30, label, { size: 14, weight: "bold", anchor: "middle", fill: textFill || C.ink, family: MONO });
    o += txt(x + 95, y + 50, sub, { size: 11, anchor: "middle", fill: textFill ? C.panelSoft : C.soft });
    return o;
  };

  s += st(50, 150, "en_attente", "dans la file", C.surf2, C.line);
  s += st(340, 150, "en_cours", "verrouillé par un worker", C.accTint, C.acc);
  s += st(660, 150, "termine", "résultats écrits", C.accTint, C.acc);
  s += st(340, 310, "echec", "erreur capturée", C.dangerTint, C.danger);
  s += st(660, 310, "abandonne", "alerte n8n", C.signalTint, C.signal);

  s += arrow(240, 183, 336, 183, { color: C.acc });
  s += txt(244, 174, "FOR UPDATE SKIP LOCKED", { size: 10.5, fill: C.soft, family: MONO });
  s += arrow(530, 183, 656, 183, { color: C.acc });
  s += txt(552, 174, "toutes les étapes OK", { size: 10.5, fill: C.soft });
  s += arrow(435, 216, 435, 306, { color: C.danger });
  s += txt(445, 265, "erreur API, crash, redémarrage", { size: 10.5, fill: C.soft });
  s += pathArrow("M 340 343 L 145 343 L 145 220", { color: C.acc });
  s += txt(150, 366, "nouvelle tentative — reprise à la dernière étape validée, backoff", {
    size: 10.5,
    fill: C.soft,
  });
  s += arrow(530, 343, 656, 343, { color: C.signal });
  s += txt(548, 334, "après 3 tentatives", { size: 10.5, fill: C.soft });

  s += txt(50, 415, "Idempotence : un job porte une clé unique (dossier_id + type). Deux clics ne déclenchent qu'une seule analyse — et donc une seule facturation.", {
    size: 12,
    fill: C.ink,
  });
  s += txt(50, 438, "La progression étape par étape est lue directement depuis cette table : l'interface affiche « Profil 5 sur 8 » au lieu d'un sablier.", {
    size: 12,
    fill: C.soft,
  });

  return { name: "03-jobs", svg: s + "</svg>", W, H };
}

/* ============================ 4. Avant / après ============================ */
function diagram4() {
  const W = 1000,
    H = 600;
  let s = head(
    W,
    H,
    "Pipeline d'analyse : aujourd'hui et après optimisation",
    "Même qualité de sortie, deux passages coûteux supprimés et six appels parallélisés"
  );

  // AVANT
  s += box(40, 100, 440, 430, { fill: C.dangerTint, stroke: C.danger, sw: 2, rx: 10 });
  s += txt(62, 130, "AUJOURD'HUI", { size: 13, weight: "bold", fill: C.danger, family: MONO, ls: "1.5" });
  s += txt(62, 150, "une seule requête HTTP synchrone", { size: 11.5, fill: C.soft });

  let ay = 168;
  const bar = (x, y, w, h, label, fill, stroke, small) => {
    let o = box(x, y, w, h, { fill, stroke, rx: 5 });
    o += txt(x + 12, y + (small ? 17 : 23), label, { size: small ? 11 : 12.5, fill: C.ink });
    return o;
  };
  s += bar(62, ay, 396, 36, "Extraction Fable 5 — corpus complet", C.surf, C.line);
  ay += 44;
  for (let i = 1; i <= 6; i++) {
    s += bar(62, ay, 396, 24, `Profil ${i} — Sonnet 5 (séquentiel)`, C.surf, C.line, true);
    ay += 28;
  }
  s += bar(62, ay, 396, 36, "Contradictions Fable 5 — corpus complet (2e fois)", "#F3D9D4", C.danger);
  ay += 52;
  s += txt(62, ay, "≈ 10 à 20 min sur un dossier de 300 pages", { size: 13, weight: "bold", fill: C.danger });
  s += txt(62, ay + 22, "→ dépasse le plafond d'une fonction Vercel : l'analyse échoue.", {
    size: 12,
    fill: C.ink,
  });
  s += txt(62, ay + 42, "→ aucune reprise : tout est à relancer, et à repayer.", { size: 12, fill: C.ink });

  // APRES
  s += box(520, 100, 440, 430, { fill: C.accTint, stroke: C.acc, sw: 2, rx: 10 });
  s += txt(542, 130, "APRÈS", { size: 13, weight: "bold", fill: C.acc, family: MONO, ls: "1.5" });
  s += txt(542, 150, "job asynchrone sur le worker", { size: 11.5, fill: C.soft });

  let by = 168;
  s += bar(542, by, 396, 36, "Extraction Fable 5 — corpus complet (une fois)", C.surf, C.line);
  by += 44;
  s += bar(542, by, 396, 28, "Profil 1 — Sonnet 5, amorce le cache", C.surf, C.line, true);
  by += 36;
  s += box(542, by, 396, 74, { fill: C.surf, stroke: C.acc, rx: 5 });
  s += txt(554, by + 20, "Profils 2 à 6 — en parallèle, lecture du cache", { size: 11.5 });
  for (let i = 0; i < 5; i++) {
    s += box(554 + i * 76, by + 32, 68, 28, { fill: C.accTint, stroke: C.accTint, rx: 4 });
    s += txt(588 + i * 76, by + 51, `P${i + 2}`, { size: 11.5, anchor: "middle", family: MONO });
  }
  by += 84;
  s += bar(542, by, 396, 36, "Contradictions — lues sur l'extraction structurée", C.surf, C.line);
  by += 52;
  s += txt(542, by, "≈ 3 à 5 min, sans plafond de durée", { size: 13, weight: "bold", fill: C.acc });
  s += txt(542, by + 22, "→ coût d'analyse réduit de l'ordre de moitié (un seul", { size: 12, fill: C.ink });
  s += txt(542, by + 40, "    passage plein tarif sur le corpus au lieu de deux).", { size: 12, fill: C.ink });
  s += txt(542, by + 60, "→ reprise à l'étape, progression visible.", { size: 12, fill: C.ink });

  s += txt(40, 570, "Les durées sont des ordres de grandeur, à confirmer par mesure sur des dossiers réels une fois le worker en place.", {
    size: 11.5,
    fill: C.faint,
  });

  return { name: "04-pipeline", svg: s + "</svg>", W, H };
}

/* ============================ 5. Récupération ============================ */
function diagram5() {
  const W = 1000,
    H = 480;
  let s = head(
    W,
    H,
    "Récupération hybride et reclassement",
    "Ce qui garantit que la citation pointe la bonne page — le cœur de la promesse produit"
  );

  s += box(30, 190, 140, 66, { fill: C.surf2 });
  s += txt(100, 218, "Question", { size: 14, weight: "bold", anchor: "middle" });
  s += txt(100, 238, "de l'analyste", { size: 11, fill: C.soft, anchor: "middle" });

  s += box(215, 120, 195, 66, { stroke: C.info, sw: 2 });
  s += txt(312, 148, "Recherche vectorielle", { size: 13, weight: "bold", anchor: "middle" });
  s += txt(312, 168, "pgvector — sens général", { size: 11, fill: C.soft, anchor: "middle" });

  s += box(215, 262, 195, 66, { stroke: C.info, sw: 2 });
  s += txt(312, 290, "Recherche plein texte", { size: 13, weight: "bold", anchor: "middle" });
  s += txt(312, 310, "Postgres FR — chiffres exacts", { size: 11, fill: C.soft, anchor: "middle" });

  s += box(455, 190, 130, 66, { fill: C.surf2 });
  s += txt(520, 218, "Fusion RRF", { size: 13, weight: "bold", anchor: "middle" });
  s += txt(520, 238, "≈ 30 passages", { size: 11, fill: C.soft, anchor: "middle" });

  s += box(630, 190, 150, 66, { stroke: C.acc, sw: 2, fill: C.accTint });
  s += txt(705, 218, "Rerank Voyage", { size: 13, weight: "bold", anchor: "middle" });
  s += txt(705, 238, "pertinence réelle", { size: 11, fill: C.soft, anchor: "middle" });

  s += box(825, 190, 145, 66, { stroke: C.acc, sw: 2 });
  s += txt(897, 218, "8 passages", { size: 13, weight: "bold", anchor: "middle" });
  s += txt(897, 238, "envoyés au modèle", { size: 11, fill: C.soft, anchor: "middle" });

  s += pathArrow("M 170 210 L 192 210 L 192 153 L 211 153", { color: C.info });
  s += pathArrow("M 170 236 L 192 236 L 192 295 L 211 295", { color: C.info });
  s += pathArrow("M 410 153 L 432 153 L 432 212 L 451 212", { color: C.info });
  s += pathArrow("M 410 295 L 432 295 L 432 234 L 451 234", { color: C.info });
  s += arrow(585, 223, 626, 223, { color: C.acc });
  s += arrow(780, 223, 821, 223, { color: C.acc });

  s += box(215, 370, 755, 62, { fill: C.panel, stroke: C.panel, rx: 8 });
  s += txt(235, 396, "Sonnet 5 (standard) ou Fable 5 (escalade) — réponse contrainte aux seuls passages fournis", {
    size: 13,
    fill: C.panelText,
  });
  s += txt(235, 417, "Chaque affirmation porte sa pastille de citation : document et page exacte, cliquable.", {
    size: 11.5,
    fill: C.panelSoft,
  });
  s += pathArrow("M 897 256 L 897 340 L 592 340 L 592 366", { color: C.acc });

  return { name: "05-recherche", svg: s + "</svg>", W, H };
}

/* ============================ Rendu ============================ */
const diagrams = [diagram1(), diagram2(), diagram3(), diagram4(), diagram5()];

(async () => {
  for (const d of diagrams) {
    const svgPath = path.join(OUT, `${d.name}.svg`);
    fs.writeFileSync(svgPath, d.svg, "utf8");
    const png = await sharp(Buffer.from(d.svg), { density: 300 })
      .resize({ width: 2000 })
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(OUT, `${d.name}.png`), png);
    console.log(`${d.name}.png  ${d.W}x${d.H} -> ${(png.length / 1024).toFixed(0)} Ko`);
  }
})();
