const fs = require("node:fs");
const path = require("node:path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  BorderStyle,
  ImageRun,
  PageBreak,
  Footer,
  PageNumber,
  TableOfContents,
  LevelFormat,
  convertMillimetersToTwip,
} = require("docx");

const IMG = path.join(__dirname, "img");
const OUT = "E:/FinLens/docs/FinLens_Note_d_Architecture_V2.docx";

/* ---------------------------------------------------------------- palette */
const INK = "0F130E";
const SOFT = "59615A";
const FAINT = "7C847C";
const ACC = "146B45";
const LINE = "D7DCD5";
const TINT = "E8F3ED";
const SURF2 = "F6F7F5";
const DANGER = "A63A2E";
const SIGNAL = "A9741A";

const SERIF = "Georgia";
const SANS = "Calibri";
const MONO = "Consolas";

/* ------------------------------------------------------------- dimensions */
const MARGIN = convertMillimetersToTwip(20);
const PAGE_W = 11906; // A4 en DXA
const USABLE = PAGE_W - MARGIN * 2;

/* ---------------------------------------------------------------- helpers */
const h1 = (text) =>
  new Paragraph({ text, heading: HeadingLevel.HEADING_1 });

const h2 = (text) =>
  new Paragraph({ text, heading: HeadingLevel.HEADING_2 });

const h3 = (text) =>
  new Paragraph({ text, heading: HeadingLevel.HEADING_3 });

function p(content, o = {}) {
  const runs = (Array.isArray(content) ? content : [content]).map((c) =>
    typeof c === "string"
      ? new TextRun({ text: c })
      : new TextRun({
          text: c.t,
          bold: c.b,
          italics: c.i,
          font: c.mono ? MONO : undefined,
          size: c.mono ? 18 : undefined,
          color: c.color,
        })
  );
  return new Paragraph({
    children: runs,
    spacing: { after: o.after ?? 140, line: 276 },
    alignment: o.align,
  });
}

const li = (content) => {
  const runs = (Array.isArray(content) ? content : [content]).map((c) =>
    typeof c === "string"
      ? new TextRun({ text: c })
      : new TextRun({ text: c.t, bold: c.b, italics: c.i, font: c.mono ? MONO : undefined, size: c.mono ? 18 : undefined })
  );
  return new Paragraph({
    children: runs,
    numbering: { reference: "puces", level: 0 },
    spacing: { after: 70, line: 276 },
  });
};

function callout(lines, color = ACC) {
  return new Table({
    columnWidths: [USABLE],
    width: { size: USABLE, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "FFFFFF" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "FFFFFF" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "FFFFFF" },
      left: { style: BorderStyle.SINGLE, size: 18, color },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: USABLE, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: SURF2, color: "auto" },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            children: lines.map(
              (l, i) =>
                new Paragraph({
                  children: [new TextRun({ text: l.t ?? l, bold: l.b })],
                  spacing: { after: i === lines.length - 1 ? 0 : 90, line: 276 },
                })
            ),
          }),
        ],
      }),
    ],
  });
}

function code(lines) {
  return new Table({
    columnWidths: [USABLE],
    width: { size: USABLE, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      left: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      right: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: USABLE, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: "FAFBF9", color: "auto" },
            margins: { top: 130, bottom: 130, left: 180, right: 180 },
            children: lines.map(
              (l) =>
                new Paragraph({
                  children: [new TextRun({ text: l, font: MONO, size: 17, color: INK })],
                  spacing: { after: 40, line: 240 },
                })
            ),
          }),
        ],
      }),
    ],
  });
}

function tbl(header, rows, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map((w) => Math.round((w / total) * USABLE));
  widths[widths.length - 1] = USABLE - widths.slice(0, -1).reduce((a, b) => a + b, 0);

  const cell = (text, i, isHeader, zebra) =>
    new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      shading: {
        type: ShadingType.CLEAR,
        fill: isHeader ? INK : zebra ? SURF2 : "FFFFFF",
        color: "auto",
      },
      margins: { top: 90, bottom: 90, left: 130, right: 130 },
      children: (Array.isArray(text) ? text : [text]).map(
        (t, k) =>
          new Paragraph({
            children: [
              new TextRun({
                text: typeof t === "string" ? t : t.t,
                bold: isHeader || (typeof t === "object" && t.b),
                color: isHeader ? "FFFFFF" : typeof t === "object" && t.color ? t.color : INK,
                size: isHeader ? 17 : 18,
                font: typeof t === "object" && t.mono ? MONO : SANS,
              }),
            ],
            spacing: { after: k === (Array.isArray(text) ? text.length : 1) - 1 ? 0 : 60, line: 250 },
          })
      ),
    });

  return new Table({
    columnWidths: widths,
    width: { size: USABLE, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      left: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      right: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 3, color: LINE },
      insideVertical: { style: BorderStyle.SINGLE, size: 3, color: LINE },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: header.map((t, i) => cell(t, i, true)),
      }),
      ...rows.map(
        (r, ri) =>
          new TableRow({
            children: r.map((t, i) => cell(t, i, false, ri % 2 === 1)),
          })
      ),
    ],
  });
}

function figure(file, w, h, caption) {
  return [
    new Paragraph({
      children: [
        new ImageRun({
          type: "png",
          data: fs.readFileSync(path.join(IMG, file)),
          transformation: { width: w, height: h },
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 90 },
    }),
    new Paragraph({
      children: [new TextRun({ text: caption, size: 17, color: FAINT, italics: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    }),
  ];
}

const spacer = (n = 200) => new Paragraph({ text: "", spacing: { after: n } });

/* ------------------------------------------------------------------ corps */
const children = [];

/* ---- page de titre ---- */
children.push(
  new Paragraph({ text: "", spacing: { after: 1400 } }),
  new Paragraph({
    children: [new TextRun({ text: "FinLens", font: SERIF, size: 26, color: ACC, bold: true, characterSpacing: 60 })],
    spacing: { after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Note d'Architecture et Stack Technique", font: SERIF, size: 56, bold: true, color: INK })],
    spacing: { after: 120 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Version 2 — architecture optimisée", font: SERIF, size: 32, color: SOFT })],
    spacing: { after: 400 },
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: "Architecture technique, orchestration asynchrone, routage IA par tâche et garde-fous d'usage de la plateforme SaaS FinLens.",
        size: 22,
        color: SOFT,
      }),
    ],
    spacing: { after: 600, line: 300 },
  }),
  callout([
    { t: "Ce que cette version remplace", b: true },
    "Cette note révise la V1 à la lumière du code réellement déployé. Les sections 1 (flux), 2 (stack), 4.B (backend) et H (droit à l'effacement) sont remplacées. Le routage des modèles IA par tâche, le cache de prompt, la mécanique des modules produit et le cap de dossiers simultanés sont conservés : ils se sont avérés justes et sont déjà implémentés.",
  ]),
  spacer(300),
  p([{ t: "Date : ", b: true }, "21 septembre 2026"]),
  p([{ t: "Dépôt de référence : ", b: true }, { t: "github.com/QuamouyaPro/FinLens", mono: true }]),
  p([{ t: "Statut : ", b: true }, "proposition d'architecture — à valider avant mise en œuvre"]),
  new Paragraph({ children: [new PageBreak()] })
);

/* ---- sommaire ---- */
children.push(
  h1("Sommaire"),
  new TableOfContents("Sommaire", { hyperlink: true, headingStyleRange: "1-2" }),
  new Paragraph({ children: [new PageBreak()] })
);

/* ---- 1 ---- */
children.push(
  h1("1. Objet de cette révision"),
  p("La note initiale décrivait une architecture cohérente : un frontend sur Vercel, un backend auto-hébergé sur un VPS Hostinger piloté par Coolify, n8n pour l'orchestration et Qdrant pour la base vectorielle. L'implémentation qui a suivi s'en est écartée sur deux points majeurs, documentés dans le dépôt comme « écarts assumés » : n8n a été remplacé par des routes API Next.js, et Qdrant par pgvector dans Supabase."),
  p("Ces substitutions ont été faites parce que l'infrastructure Hostinger n'était pas accessible au moment de construire le backend — un contournement, pas un choix d'architecture. L'une d'elles s'avère aujourd'hui bénéfique et doit être entérinée ; l'autre empêche purement et simplement le produit de fonctionner sur un dossier réel."),
  p("Cette V2 tranche les deux : elle acte pgvector comme choix définitif, et elle réintroduit le VPS — non pas pour y remettre n8n au centre du pipeline, mais pour y faire tourner le traitement long que Vercel ne peut structurellement pas héberger."),

  h2("1.1 Ce qui change, ce qui ne change pas"),
  tbl(
    ["Domaine", "V1", "V2", "Motif"],
    [
      ["Orchestration du pipeline", "n8n sur VPS", "Worker Node sur VPS, tiré par une file de jobs", "Réutilise le code TypeScript existant, sans réécriture en nœuds visuels"],
      ["Rôle de n8n", "Orchestrateur central", "Supervision, alertes, purge, planification", "Usage où n8n est le plus efficace"],
      ["Base vectorielle", "Qdrant auto-hébergé", "pgvector dans Supabase", "Supprime le problème d'effacement RGPD signalé en V1 comme le plus urgent"],
      ["Recherche", "Vectorielle", "Hybride (vecteur + plein texte) puis reclassement", "Précision des citations sur les chiffres exacts"],
      ["Exécution de l'analyse", "Asynchrone (n8n)", "Asynchrone (worker + file)", "Principe conservé — c'est l'implémentation qui l'avait perdu"],
      ["Routage des modèles IA", "Fable 5 / Sonnet 5 / Haiku 4.5", "Inchangé", "Déjà implémenté et pertinent"],
      ["Cache de prompt", "Palier 1 heure", "Inchangé, étendu à l'étape contradictions", "Gain supplémentaire sans changement de principe"],
      ["Modules produit", "Six profils, comparateur, export, épinglage", "Inchangés", "Spécification produit validée"],
    ],
    [16, 20, 28, 36]
  ),
  spacer()
);

/* ---- 2 ---- */
children.push(
  h1("2. Diagnostic de l'existant"),
  p("Le constat ci-dessous ne provient pas d'une relecture de la note, mais d'un audit du code déployé en production."),

  h2("2.1 Écart entre la note V1 et le code"),
  tbl(
    ["Composant", "Prévu en V1", "Réellement déployé"],
    [
      ["Frontend", "Vercel (Next.js)", "Conforme"],
      ["Auth, base de données", "Supabase", "Conforme"],
      ["Moteur IA", "Anthropic — Fable 5 / Sonnet 5 / Haiku 4.5", "Conforme, routage implémenté"],
      ["Monétisation", "Stripe", "Conforme"],
      ["Orchestration", "n8n sur VPS Hostinger", [{ t: "Routes API Next.js synchrones", b: true }]],
      ["Base vectorielle", "Qdrant", [{ t: "pgvector (Supabase)", b: true }]],
      ["Serveur backend", "Hostinger KVM 2 + Coolify", [{ t: "Inexistant — rien n'y tourne", b: true, color: DANGER }]],
      ["Embeddings", "Non spécifié", "Voyage AI (voyage-3-large)"],
    ],
    [22, 34, 44]
  ),
  spacer(160),

  h2("2.2 Défauts relevés dans le code"),
  p("Six défauts ont été identifiés, dont trois empêchent le produit de fonctionner sur un dossier de taille réelle."),
  tbl(
    ["Gravité", "Défaut", "Conséquence"],
    [
      [
        [{ t: "Bloquant", b: true, color: DANGER }],
        [{ t: "Analyse entièrement synchrone", b: true }, { t: "api/dossiers/[id]/analyser/route.ts", mono: true }],
        "Extraction, six reformulations séquentielles et détection de contradictions dans une seule requête HTTP. Dix à vingt minutes sur un dossier de 300 pages, là où une fonction Vercel expire après quelques minutes. Aucune reprise, aucune progression, aucun verrou contre le double clic.",
      ],
      [
        [{ t: "Bloquant", b: true, color: DANGER }],
        [{ t: "Corpus envoyé deux fois à Fable 5", b: true }, { t: "lib/ai/router.ts", mono: true }],
        "runExtraction et detectContradictions reçoivent tous deux le corpus intégral, sur le même modèle, sans cache partagé. Le poste de coût le plus lourd du produit est payé deux fois par analyse.",
      ],
      [
        [{ t: "Bloquant", b: true, color: DANGER }],
        [{ t: "Embeddings non découpés en lots", b: true }, { t: "lib/ai/embeddings.ts", mono: true }],
        "Tous les chunks d'un document partent dans un seul appel Voyage. Un PDF de 300 pages dépasse les limites de la requête : l'indexation échoue.",
      ],
      [
        [{ t: "Élevée", b: true, color: SIGNAL }],
        [{ t: "Map-reduce jamais implémenté", b: true }, { t: "lib/pdf/extract.ts", mono: true }],
        "La constante SEUIL_PAGES_MAP_REDUCE est déclarée mais utilisée nulle part. La bascule automatique promise en section E de la V1 n'existe pas : au-delà de la fenêtre de contexte, l'appel échoue brutalement.",
      ],
      [
        [{ t: "Élevée", b: true, color: SIGNAL }],
        [{ t: "Aucun OCR", b: true }],
        "L'extraction ne lit que la couche texte. Un rapport annuel ou une liasse scannée produit un document vide, indexé « avec succès », puis analysé sur rien.",
      ],
      [
        [{ t: "Moyenne", b: true }],
        [{ t: "Chat non streamé, récupération sans reclassement", b: true }],
        "La réponse n'apparaît qu'une fois entièrement générée, et la récupération est purement vectorielle. Sur des documents financiers où un chiffre exact compte, c'est la précision des citations qui est en jeu.",
      ],
    ],
    [12, 30, 58]
  ),
  spacer()
);

/* ---- 3 ---- */
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("3. Principe directeur de l'architecture cible"),
  p("Un seul principe gouverne la répartition, et il suffit à trancher chaque cas :"),
  callout([
    { t: "Vercel ne garde que ce qui répond en quelques secondes. Tout ce qui est long ou lourd descend sur le VPS. Supabase reste la seule source de vérité.", b: true },
  ]),
  spacer(160),
  p("Ce principe n'est pas une préférence esthétique : il découle de la nature du produit. Analyser 300 pages avec un modèle de raisonnement prend des minutes, pas des secondes. Aucun hébergeur de fonctions serverless n'est conçu pour cela, quel que soit le plafond de durée retenu. À l'inverse, servir une page, lire une note déjà générée ou encaisser un paiement n'a aucune raison de quitter Vercel."),
  ...figure("01-architecture.png", 640, 512, "Schéma 1 — Vue d'ensemble de l'architecture cible."),
  p("Trois conséquences pratiques découlent de ce découpage :"),
  li([{ t: "Aucun traitement IA long ne s'exécute plus derrière une requête HTTP. ", b: true }, "L'utilisateur déclenche un job et récupère la main immédiatement."]),
  li([{ t: "Le worker tire ses tâches, personne ne les lui pousse. ", b: true }, "Il n'y a donc pas de webhook à perdre, ni de reprise manuelle après un redémarrage du VPS."]),
  li([{ t: "La file vit dans Supabase, pas dans un service tiers. ", b: true }, "L'état d'un traitement est lisible par une simple requête SQL, dans la même transaction que les données produites."]),
  spacer()
);

/* ---- 4 ---- */
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("4. Le flux de bout en bout"),
  p("Le parcours ci-dessous reprend celui de la section 1 de la V1, corrigé de l'emplacement réel de chaque étape."),
  ...figure("02-flux.png", 640, 576, "Schéma 2 — Parcours d'un dossier, du dépôt du document à la note par profil."),
  h2("4.1 Détail des étapes"),
  li([{ t: "Étapes 1 et 2 — dépôt. ", b: true }, "Le fichier est déposé depuis l'interface, stocké dans Supabase Storage, et une ligne est insérée dans la table des jobs. La requête HTTP s'arrête là : elle dure moins d'une seconde."]),
  li([{ t: "Étape 3 — préparation. ", b: true }, "Le service d'ingestion détecte l'absence de couche texte et déclenche une reconnaissance optique si nécessaire ; les fichiers Word et Excel sont convertis via LibreOffice en mode headless. C'est ce qui débloque simultanément les documents scannés et les formats bureautiques, aujourd'hui tous deux hors de portée."]),
  li([{ t: "Étapes 4 et 5 — mémoire du dossier. ", b: true }, "Découpage par page, vectorisation par lots, écriture dans document_chunks avec l'identifiant d'organisation et de dossier sur chaque ligne."]),
  li([{ t: "Étape 6 — extraction. ", b: true }, "Un seul passage de Fable 5 sur le corpus, produisant l'extraction structurée en six catégories, chaque donnée sourcée. C'est le seul étage qui relit le document source, conformément à la V1."]),
  li([{ t: "Étape 7 — reformulations. ", b: true }, "La première reformulation amorce le cache de prompt ; les cinq suivantes s'exécutent en parallèle et lisent ce cache."]),
  li([{ t: "Étape 8 — contradictions et checklist. ", b: true }, "La détection s'appuie désormais sur l'extraction structurée, et non plus sur le corpus brut."]),
  li([{ t: "Étape 9 — restitution. ", b: true }, "L'interface suit l'avancement en direct en lisant l'état du job, puis affiche la note du profil actif."]),
  spacer()
);

/* ---- 5 ---- */
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("5. Tableau récapitulatif de la stack"),
  tbl(
    ["Catégorie", "Outil", "Rôle", "Coût"],
    [
      ["Développement", "Claude Code", "Écriture et itération du code en local, revue d'architecture.", "À l'usage"],
      ["Gestion du code", "GitHub", "Source de vérité du code, déploiement automatique vers Vercel.", "Gratuit"],
      ["Frontend et API courte", "Vercel", "Interface Next.js, API CRUD, Copilote en streaming, exports, Stripe, tâches planifiées légères.", "Plan hébergeur"],
      ["Serveur de traitement", "Hostinger KVM 2", "Héberge le worker, l'ingestion lourde et n8n. Aucun plafond de durée.", "Forfait fixe déjà engagé"],
      ["Gestionnaire de serveur", "Coolify", "Déploiement et supervision des trois services, sans ligne de commande.", "Gratuit (open source)"],
      [[{ t: "Traitement asynchrone", b: true }], [{ t: "finlens-worker", mono: true }], "Extraction, reformulations par profil, contradictions, vectorisation. Réutilise le code TypeScript existant.", "Inclus dans le VPS"],
      [[{ t: "Ingestion lourde", b: true }], [{ t: "finlens-ingest", mono: true }], "Reconnaissance optique des PDF scannés, conversion Word et Excel, découpage.", "Inclus dans le VPS"],
      ["Supervision", "n8n", "Détection de vélocité anormale, alertes, purge RGPD programmée, notifications.", "Gratuit (auto-hébergé)"],
      ["Base de données et vecteurs", "Supabase", "Comptes, dossiers, notes, file de jobs, journal d'usage, et vecteurs via pgvector. Isolation par organisation en RLS.", "Palier gratuit puis usage"],
      ["Analyse", "API Anthropic — Fable 5", "Extraction exhaustive et comparateur de dossiers. Toujours, sans exception.", "À l'usage"],
      ["Conversation", "API Anthropic — Sonnet 5", "Reformulation par profil et Copilote par défaut, avec escalade vers Fable 5.", "À l'usage"],
      ["Tâches internes", "API Anthropic — Haiku 4.5", "Classification de complexité, classement des ajouts épinglés.", "Négligeable"],
      ["Vectorisation et reclassement", "Voyage AI", "Embeddings des passages et reclassement des résultats de recherche.", "À l'usage"],
      ["Monétisation", "Stripe", "Abonnements Essentiel, Analyste et Fonds.", "Commission"],
    ],
    [20, 20, 42, 18]
  ),
  spacer()
);

/* ---- 6 ---- */
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("6. Détail opérationnel des composants"),

  h2("6.1 Vercel — l'interface et l'API courte"),
  p("Vercel conserve tout ce qui est visible et rapide : la page publique, l'espace de travail, le sélecteur de profil, les écrans de dossiers, la facturation. Côté API, il garde la création et la lecture de dossiers, le contrôle des quotas, la génération des exports à partir d'une note déjà produite, et les tâches planifiées légères déjà en place."),
  p("Le Copilote reste sur Vercel, mais passe en diffusion continue : la réponse s'affiche au fil de la génération plutôt qu'en une fois à la fin. Cela supprime du même coup le risque de dépassement de durée sur une question escaladée vers Fable 5."),

  h2("6.2 Supabase — la source de vérité unique"),
  p("Supabase porte désormais quatre rôles, et c'est cette concentration qui fait sa valeur : les données métier, les vecteurs, la file de jobs et le journal d'usage vivent dans la même base, sous les mêmes règles d'isolation."),
  li([{ t: "Données métier et authentification", b: true }, " — comptes, organisations, dossiers, notes par profil, ajouts épinglés, historique de conversation."]),
  li([{ t: "Vecteurs", b: true }, " — la table des passages porte le texte, son vecteur, et les identifiants d'organisation et de dossier sur chaque ligne."]),
  li([{ t: "File de jobs", b: true }, " — décrite en section 7."]),
  li([{ t: "Journal d'usage", b: true }, " — jetons, modèle, dossier et siège pour chaque appel, base du suivi de marge et de la détection de vélocité."]),
  p("L'isolation entre organisations repose sur les politiques RLS de Postgres, appliquées uniformément à toutes ces tables. Un passage vectoriel n'est pas plus accessible qu'une ligne de facturation : c'est le même mécanisme, pas deux disciplines séparées."),

  h2("6.3 Le VPS Hostinger et Coolify"),
  p("Le serveur KVM 2 héberge trois services déployés et supervisés depuis Coolify."),
  h3("finlens-worker — le moteur d'analyse"),
  p("Service Node qui consomme la file de jobs et exécute l'extraction, les reformulations par profil, la détection de contradictions et la vectorisation. Il réutilise tel quel le code déjà écrit dans le dépôt : le routeur de modèles, les prompts par tâche et la comptabilisation des jetons n'ont pas à être réécrits. C'est la raison principale de ne pas confier ce rôle à n8n — la logique existe déjà, en TypeScript, testée par l'usage."),
  p("Plusieurs instances peuvent tourner simultanément sans coordination particulière : le verrouillage au niveau de la file garantit qu'un job n'est pris que par un seul worker."),
  h3("finlens-ingest — la préparation des fichiers"),
  p("Reconnaissance optique des documents sans couche texte, conversion des fichiers Word et Excel via LibreOffice headless, découpage en passages. Ces traitements sont gourmands en processeur et en durée : ils n'ont leur place ni dans une fonction serverless, ni dans un flux n8n."),
  h3("n8n — la supervision"),
  p("n8n conserve un rôle réel, mais déplacé : il ne porte plus le pipeline d'analyse, il surveille la plateforme et automatise ce qui l'entoure."),
  li("Détection de vélocité anormale par siège, avec alerte pour revue humaine plutôt que blocage automatique (section G de la V1, conservée)."),
  li("Purge programmée des dossiers en corbeille arrivés à échéance et exécution des demandes d'effacement."),
  li("Notifications : échec répété d'indexation, job abandonné après trois tentatives, seuil de coût franchi."),
  li("Rétention courte de ses propres journaux d'exécution, qui peuvent contenir des fragments de données traitées."),
  p("Ce périmètre correspond à ce que n8n fait le mieux : observer une condition, appeler quelques services, prévenir un humain. Lui confier un enchaînement d'appels IA avec dépendances de données et logique de quota aurait signifié réécrire en nœuds visuels une logique métier déjà écrite et fonctionnelle."),

  h2("6.4 API Anthropic — le routage par tâche"),
  p("Cette section est reprise sans modification de la V1 : le mécanisme est implémenté et pertinent. C'est lui qui rend les offres illimitées tenables économiquement."),
  tbl(
    ["Tâche", "Modèle", "Raison"],
    [
      ["Extraction exhaustive du dossier", "Fable 5 (toujours)", "Seule lecture complète du document, structurée en six catégories — cœur de la promesse produit"],
      ["Reformulation par profil", "Sonnet 5 (toujours)", "Relit uniquement l'extraction déjà produite, pas le document source"],
      ["Comparateur de dossiers", "Fable 5 (toujours)", "Raisonnement croisé entre plusieurs dossiers"],
      ["Question de chat standard", "Sonnet 5 (par défaut)", "Recherche de fait, citation, synthèse simple"],
      ["Question de chat complexe", "Fable 5 (escalade)", "Comparaison de périodes, calcul multi-documents, jugement transverse"],
      ["Détection de contradictions", [{ t: "Fable 5, sur l'extraction", b: true }], [{ t: "Changement V2 : lecture de l'extraction structurée au lieu du corpus brut", b: true }]],
      ["Classement d'un ajout épinglé", "Haiku 4.5", "Tri par catégorie, tâche interne invisible"],
      ["Classification de complexité", "Haiku 4.5", "Coût négligeable au regard de l'économie réalisée"],
    ],
    [30, 24, 46]
  ),
  spacer(160),

  h2("6.5 Voyage AI"),
  p("Voyage assure la vectorisation des passages, l'API Anthropic ne proposant pas d'embeddings. La V2 lui ajoute un second rôle : le reclassement des résultats de recherche, décrit en section 9."),

  h2("6.6 Stripe et GitHub"),
  p("Inchangés. Stripe porte les trois abonnements ; GitHub reste la source de vérité du code et déclenche le déploiement Vercel. Coolify se connecte au même dépôt pour déployer les services du VPS, ce qui maintient un seul point de vérité pour l'ensemble de la plateforme."),
  spacer()
);

/* ---- 7 ---- */
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("7. La file de jobs"),
  p("C'est la pièce qui manque aujourd'hui, et celle qui rend tout le reste possible. Elle tient dans une table Postgres — aucune infrastructure supplémentaire à installer, à sauvegarder ou à surveiller."),
  code([
    "jobs (",
    "  id             uuid primary key,",
    "  organization_id uuid not null,      -- isolation RLS",
    "  dossier_id     uuid not null,",
    "  type           text not null,       -- 'ingestion' | 'analyse'",
    "  statut         text not null,       -- en_attente | en_cours | termine | echec | abandonne",
    "  etape          text,                -- étape courante, affichée à l'utilisateur",
    "  progression    int,                 -- 0 à 100",
    "  tentatives     int  not null default 0,",
    "  erreur         text,",
    "  verrou_jusqu_a timestamptz,",
    "  cle_unicite    text unique,         -- dossier_id + type : empêche le doublon",
    "  cree_le        timestamptz not null default now()",
    ")",
  ]),
  spacer(160),
  p("Le worker récupère une tâche avec un verrouillage qui ignore les lignes déjà prises par un autre worker, ce qui permet d'en faire tourner plusieurs sans coordination :"),
  code([
    "select * from jobs",
    " where statut = 'en_attente'",
    " order by cree_le",
    " limit 1",
    " for update skip locked;",
  ]),
  spacer(160),
  ...figure("03-jobs.png", 640, 301, "Schéma 3 — Cycle de vie d'un job, de la mise en file à l'abandon."),
  h2("7.1 Ce que la file apporte concrètement"),
  li([{ t: "L'analyse aboutit. ", b: true }, "C'est le point principal : le traitement n'est plus borné par la durée d'une requête HTTP."]),
  li([{ t: "Une panne ne coûte pas une analyse complète. ", b: true }, "Le job reprend à la dernière étape validée, et non depuis le début."]),
  li([{ t: "Le double clic ne double pas la facture. ", b: true }, "La clé d'unicité garantit qu'un dossier n'a qu'un seul job d'analyse en cours."]),
  li([{ t: "L'attente devient lisible. ", b: true }, "L'interface affiche « Profil 5 sur 8 » plutôt qu'un sablier de quinze minutes — un écart d'expérience considérable pour une fonctionnalité qui prend, par nature, plusieurs minutes."]),
  li([{ t: "L'échec devient visible. ", b: true }, "Un job abandonné après trois tentatives déclenche une alerte n8n, au lieu de disparaître dans les journaux."]),
  spacer()
);

/* ---- 8 ---- */
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("8. Le pipeline d'analyse optimisé"),
  p("Trois corrections indépendantes transforment le pipeline, sans modifier ni les prompts, ni la structure de l'extraction, ni la qualité attendue en sortie."),
  ...figure("04-pipeline.png", 640, 384, "Schéma 4 — Le pipeline d'analyse avant et après optimisation."),
  h2("8.1 Un seul passage plein tarif sur le corpus"),
  p("Aujourd'hui, l'extraction et la détection de contradictions envoient chacune le corpus intégral à Fable 5. La V2 fait lire les contradictions sur l'extraction structurée, qui contient déjà les données sourcées de tous les documents du dossier — c'est précisément le matériau dont la détection a besoin pour repérer qu'un chiffre du teaser contredit une annexe du bilan."),
  p("Le poste de coût dominant d'une analyse étant l'entrée du modèle sur un corpus de plusieurs centaines de pages, supprimer le second passage réduit le coût d'analyse de l'ordre de la moitié. Cet ordre de grandeur est à confirmer par mesure sur des dossiers réels."),
  h2("8.2 Cinq reformulations en parallèle"),
  p("Les six reformulations sont aujourd'hui enchaînées dans une boucle séquentielle. Or elles ne dépendent que de l'extraction, jamais les unes des autres. Seule la première doit rester isolée, le temps d'écrire le cache de prompt que les cinq autres liront. Le temps total d'analyse s'en trouve divisé par un facteur de deux à trois."),
  h2("8.3 Vectorisation par lots et bascule map-reduce"),
  p("Les passages sont envoyés à Voyage par lots respectant les limites de l'API, au lieu d'une requête unique qui échoue dès qu'un document dépasse quelques dizaines de pages. En parallèle, la bascule en résumé multi-passages annoncée en V1 est enfin implémentée : au-delà du seuil de pages, le corpus est traité par segments puis consolidé, de manière invisible pour l'utilisateur."),
  spacer()
);

/* ---- 9 ---- */
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("9. Recherche et citations"),
  p("La promesse produit tient en une phrase : aucune affirmation sans sa page exacte. Techniquement, cette promesse ne dépend pas du modèle, mais de la qualité des passages qu'on lui donne à lire. Si le bon passage n'est pas récupéré, le meilleur modèle du marché ne pourra pas le citer."),
  p("La recherche actuelle est purement vectorielle et retient les huit premiers résultats. C'est efficace sur le sens général, et faible précisément là où ce produit doit exceller : un montant, une référence de note annexe, le nom exact d'une clause. La V2 ajoute deux étages."),
  ...figure("05-recherche.png", 640, 307, "Schéma 5 — Récupération hybride puis reclassement avant envoi au modèle."),
  li([{ t: "Recherche hybride. ", b: true }, "La recherche vectorielle est doublée d'une recherche plein texte en français dans Postgres, et les deux classements sont fusionnés. Le vecteur capte la formulation, le plein texte capte le terme ou le chiffre littéral."]),
  li([{ t: "Reclassement. ", b: true }, "La trentaine de passages issus de la fusion est soumise au modèle de reclassement de Voyage, qui les ordonne par pertinence réelle vis-à-vis de la question. Seuls les huit meilleurs partent au modèle."]),
  p("Le coût supplémentaire est marginal au regard d'un appel de raisonnement, et le bénéfice porte directement sur l'argument de vente central du produit."),
  spacer()
);

/* ---- 10 ---- */
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("10. Décision d'architecture : pgvector plutôt que Qdrant"),
  p("C'est le point sur lequel cette V2 s'écarte volontairement de la note initiale. La décision est documentée ici en toutes lettres pour qu'elle puisse être contestée sur ses arguments, et réévaluée sur un critère chiffré."),
  h2("10.1 Contexte"),
  p("La V1 prévoyait Qdrant auto-hébergé. L'implémentation a utilisé pgvector faute d'accès au VPS. La V2 réintroduisant le VPS, la question se repose légitimement : faut-il y installer Qdrant comme prévu ?"),
  h2("10.2 Décision"),
  callout([
    { t: "pgvector dans Supabase est conservé comme base vectorielle. Qdrant n'est pas réintroduit.", b: true },
  ]),
  spacer(160),
  h2("10.3 Justification"),
  p("L'argument décisif est fourni par la V1 elle-même. Sa section H désigne comme « le point le plus urgent » le fait que Qdrant n'offre aucun moyen de retrouver les données d'un client donné, et impose d'ajouter un identifiant de propriétaire et de dossier sur chaque point vectoriel avant le lancement."),
  p("Ce problème n'existe pas avec pgvector. Les passages sont des lignes d'une table Postgres : leur suppression est transactionnelle avec le reste des données du dossier, et leur isolation par organisation découle des mêmes politiques RLS que toutes les autres tables. Ce que la V1 identifiait comme le risque de conformité le plus pressant disparaît par construction."),
  p("Réintroduire Qdrant reviendrait à recréer volontairement ce risque, en y ajoutant celui d'une double écriture à maintenir cohérente entre deux magasins, sur des documents financiers confidentiels — où une erreur de filtre ne produit pas un bug, mais une fuite entre clients."),
  h2("10.4 Conséquences"),
  li("Un composant de moins à déployer, sauvegarder, mettre à jour et surveiller sur le VPS."),
  li("Les sauvegardes Supabase couvrent données et vecteurs en un seul point de restauration cohérent."),
  li("L'effort correspondant est réinvesti dans la recherche hybride et le reclassement (section 9), dont le gain sur la précision des citations est supérieur à celui d'un changement de moteur vectoriel."),
  li("Contrepartie assumée : au-delà d'un certain volume, pgvector demandera un travail d'indexation et de partitionnement que Qdrant aurait absorbé nativement."),
  h2("10.5 Seuil de réévaluation"),
  p("Cette décision doit être réexaminée si l'un de ces deux seuils est franchi :"),
  li("le volume dépasse environ cinq à dix millions de passages vectorisés ;"),
  li("le temps de recherche au 95e centile dépasse 300 millisecondes malgré l'optimisation des index."),
  p("Tant que ces seuils ne sont pas atteints, l'ajout de Qdrant serait une complexité sans contrepartie mesurable."),
  spacer()
);

/* ---- 11 ---- */
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("11. Cache de prompt"),
  p("Le mécanisme décrit en V1 est conservé intégralement : palier d'une heure, rafraîchi à chaque question, de sorte qu'une session de travail active reste dans un cache continu. Le point de vigilance reste le même — le cache est propre à chaque modèle, un cache écrit par Sonnet 5 n'étant pas lisible par Fable 5."),
  p("La V2 ajoute un bénéficiaire. La détection de contradictions lisant désormais l'extraction structurée, elle partage le même contexte source que les reformulations par profil. Le contexte le plus coûteux du pipeline est donc écrit une fois et relu par sept appels successifs, au lieu d'être payé plein tarif par deux appels distincts sur le corpus complet."),
  spacer()
);

/* ---- 12 ---- */
children.push(
  h1("12. Conformité et droit à l'effacement"),
  p("La section H de la V1 reste valable dans ses principes. Sa mise en œuvre est en revanche nettement simplifiée par le choix de pgvector."),
  tbl(
    ["Composant", "Données personnelles", "Effacement"],
    [
      ["Supabase", "Compte, organisation, historique, notes par profil, ajouts épinglés, passages vectorisés, journal d'usage", [{ t: "Suppression directe, transactionnelle — vecteurs compris", b: true }]],
      ["Stripe", "Nom, courriel, historique de facturation", "Anonymisation du profil ; les factures restent conservées au titre des obligations comptables"],
      ["Sauvegardes VPS et Supabase", "Instantanés à un instant donné", "Non effaçables rétroactivement — impose une politique de rétention courte"],
      ["n8n", "Journaux d'exécution des flux", "Purge automatique après rétention courte, à configurer"],
      ["finlens-ingest", "Fichiers temporaires pendant la conversion", "Suppression en fin de traitement, répertoire de travail éphémère"],
    ],
    [22, 38, 40]
  ),
  spacer(160),
  p("Le flux d'effacement reste celui de la V1 : déclenchement en self-service, identification de tout ce qui doit être effacé, purge réelle et non un simple marquage, conservation d'une trace de conformité minimale. La différence est que la purge des vecteurs n'est plus une opération distincte sur un second magasin, mais une conséquence de la suppression des lignes du dossier."),
  p("Le point de vigilance juridique identifié en V1 demeure entier et reste hors du périmètre technique : les dossiers contiennent des données sur des tiers non-clients, et une demande émanant de l'un d'eux soulève des questions de base légale et de secret des affaires à faire trancher par un juriste, au même titre que la clause d'usage raisonnable des conditions générales."),
  spacer()
);

/* ---- 13 ---- */
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("13. Observabilité et maîtrise des coûts"),
  p("Le journal d'usage existant enregistre déjà les jetons, le modèle, le dossier et le siège pour chaque appel. La V2 en tire deux usages supplémentaires."),
  li([{ t: "Coût par job. ", b: true }, "Chaque analyse étant désormais un objet identifié, le coût réel d'un dossier devient directement mesurable, et non plus déduit d'une moyenne. C'est la base d'un suivi de marge fiable par offre."]),
  li([{ t: "Suivi de la file. ", b: true }, "Longueur de la file, durée moyenne d'un job, taux d'échec et taux de reprise sont lisibles par requête SQL et alimentent les alertes n8n."]),
  p("Ces deux indicateurs comblent un angle mort de l'architecture actuelle : aujourd'hui, une analyse qui expire ne laisse aucune trace exploitable, et son coût partiel est malgré tout facturé par le fournisseur."),
  spacer(160),

  h1("14. Plan de mise en œuvre"),
  p("Les étapes sont ordonnées pour que chacune apporte un gain autonome, sans dépendre de la suivante."),
  tbl(
    ["Étape", "Contenu", "Dépendance", "Gain"],
    [
      [[{ t: "1", b: true }], "Vectorisation par lots, fusion des deux passages Fable 5, parallélisation des reformulations", [{ t: "Aucune", b: true }], "Correctifs dans le code existant : le produit redevient utilisable sur des dossiers moyens, à coût réduit, sans changer d'infrastructure"],
      [[{ t: "2", b: true }], "Table de jobs, worker déployé sur Coolify, progression dans l'interface", "VPS actif", "L'analyse aboutit quelle que soit la taille du dossier ; reprise sur incident"],
      [[{ t: "3", b: true }], "Service d'ingestion : reconnaissance optique, Word et Excel, map-reduce", "Étape 2", "Les documents réels deviennent exploitables, quel que soit leur format"],
      [[{ t: "4", b: true }], "Recherche hybride et reclassement, Copilote en streaming", "Aucune", "Précision des citations et qualité perçue du Copilote"],
      [[{ t: "5", b: true }], "Flux n8n : vélocité, purge RGPD, alertes", "Étape 2", "Supervision et conformité opérationnelle"],
    ],
    [8, 38, 16, 38]
  ),
  spacer(160),
  callout([
    { t: "À vérifier avant de démarrer", b: true },
    "Les clés ANTHROPIC_API_KEY et VOYAGE_API_KEY n'apparaissent pas dans les variables d'environnement du projet Vercel en production. Si cette absence se confirme, le Copilote ne répond à aucune question et aucune vectorisation n'est possible en production — indépendamment de tout ce qui précède. C'est le premier point à lever.",
  ], SIGNAL),
  spacer()
);

/* ---- 15 ---- */
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("15. Risques et points ouverts"),
  tbl(
    ["Point", "Nature", "Traitement proposé"],
    [
      ["Disponibilité réelle du VPS", "Prérequis", "La V1 le décrit comme déjà engagé, mais aucun service n'y tourne. À confirmer avant l'étape 2 ; les étapes 1 et 4 n'en dépendent pas."],
      ["Le VPS devient un point de défaillance unique", "Architecture", "L'interface et le Copilote restent servis par Vercel : une panne du VPS suspend les analyses en cours, elle ne rend pas la plateforme inaccessible. Les jobs repartent à la reprise du service."],
      ["Capacité du KVM 2", "Dimensionnement", "La reconnaissance optique est gourmande en processeur. À mesurer sur des documents réels ; le cas échéant, limiter le nombre de workers simultanés avant d'envisager une montée en gamme."],
      ["Ordres de grandeur non mesurés", "Méthode", "Les gains annoncés en durée et en coût sont des estimations issues de la lecture du code. À confirmer par mesure dès l'étape 1."],
      ["Fonctions exposées publiquement", "Sécurité", "Quatre fonctions Postgres en SECURITY DEFINER sont appelables sans authentification. Légitime pour la création de compte, à vérifier pour les trois autres."],
      ["Clauses juridiques", "Hors périmètre technique", "Usage raisonnable et droit à l'effacement des tiers mentionnés dans un dossier : à faire rédiger par un juriste avant lancement commercial."],
    ],
    [22, 18, 60]
  ),
  spacer(200),

  h1("Conclusion"),
  p("L'architecture de la V1 était juste dans son intention : séparer l'interface du traitement lourd, et confier ce dernier à une infrastructure sans contrainte de durée. C'est cette intention que l'implémentation a perdue en repliant tout le pipeline dans des fonctions serverless — au point que l'analyse d'un dossier de taille réelle ne peut pas aboutir aujourd'hui."),
  p("La V2 restaure ce principe avec un découpage plus simple que celui d'origine : une file de jobs dans la base déjà utilisée, un worker qui réutilise le code existant, un service d'ingestion pour les traitements lourds, et n8n ramené au rôle de supervision où il est le plus efficace. Elle entérine par ailleurs pgvector, qui règle par construction le risque de conformité que la V1 désignait comme le plus urgent."),
  p("La protection de la rentabilité repose toujours sur les quatre mécanismes de la V1 — routage des modèles par tâche, cache de prompt, monitoring de vélocité et mémoire du dossier indépendante des appels IA. La V2 y ajoute le cinquième qui manquait : ne payer qu'une seule fois la lecture d'un corpus, et ne jamais payer une analyse qui n'aboutit pas.")
);

/* ------------------------------------------------------------------- doc */
const doc = new Document({
  creator: "BIACORP — FinLens",
  title: "FinLens — Note d'Architecture et Stack Technique V2",
  description: "Architecture optimisée de la plateforme FinLens",
  numbering: {
    config: [
      {
        reference: "puces",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 360, hanging: 240 } } },
          },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: SANS, size: 21, color: INK } },
      heading1: {
        run: { font: SERIF, size: 32, bold: true, color: INK },
        paragraph: { spacing: { before: 400, after: 200 } },
      },
      heading2: {
        run: { font: SERIF, size: 25, bold: true, color: ACC },
        paragraph: { spacing: { before: 300, after: 150 } },
      },
      heading3: {
        run: { font: SANS, size: 22, bold: true, color: INK },
        paragraph: { spacing: { before: 220, after: 110 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: 16838 },
          margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "FinLens — Note d'Architecture et Stack Technique V2 — Confidentiel — page ",
                  size: 16,
                  color: FAINT,
                }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: FAINT }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, buf);
  console.log(`OK -> ${OUT}  (${(buf.length / 1024).toFixed(0)} Ko)`);
});
