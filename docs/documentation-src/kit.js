"use strict";
/**
 * Socle commun de génération de la collection documentaire FinLens :
 *  - Doc    : constructeur de documents Word (couverture, sommaire cliquable,
 *             tableaux, encadrés, figures, pied de page) ;
 *  - D      : primitives de dessin SVG pour les schémas (rasterisés en PNG).
 * Dépendances : `docx` et `sharp` (voir README.md de ce dossier).
 */
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
  LevelFormat,
  Bookmark,
  InternalHyperlink,
  VerticalAlign,
  convertMillimetersToTwip,
} = require("docx");

const IMG_DIR = path.join(__dirname, "img");

/* ------------------------------------------------------------------ palette */
const C = {
  ink: "0F130E",
  soft: "59615A",
  faint: "7C847C",
  line: "D7DCD5",
  surf: "FFFFFF",
  surf2: "F6F7F5",
  acc: "146B45",
  accTint: "E8F3ED",
  danger: "A63A2E",
  dangerTint: "F8E9E6",
  signal: "A9741A",
  signalTint: "FBF3E4",
  info: "2E6B99",
  infoTint: "E7F0F7",
};
const SERIF = "Georgia";
const SANS = "Calibri";
const MONO = "Consolas";

const MARGIN = convertMillimetersToTwip(20);
const PAGE_W = 11906;
const PAGE_H = 16838;
const USABLE = PAGE_W - MARGIN * 2;
const FIG_W = 590;

/* ------------------------------------------------- collection documentaire */
const COLLECTION = [
  ["01", "Note de présentation", "Présenter FinLens : problème, solution, offres, état d'avancement."],
  ["02", "Cahier des charges", "Exigences fonctionnelles et non fonctionnelles, statut de chacune, lots de réalisation."],
  ["03", "UX / UI — parcours et design", "Parcours utilisateur, architecture de l'information, anatomie des écrans, design system."],
  ["04", "Architecture technique et infrastructure", "Composants, flux, file de jobs, déploiement, exploitation, décisions d'architecture."],
  ["05", "Architecture des données, gestion documentaire", "Modèle de données, cycles de vie, gestion des documents, rétention."],
  ["06", "RGPD, cybersécurité et conformité", "Traitements, sous-traitants, droits des personnes, menaces, plan de conformité."],
  ["07", "Business model, pricing, coûts et prévisionnel", "Offres, structure de coûts, marges, scénarios, sensibilités."],
  ["08", "Stratégie IA — benchmark, routage, RAG et agents", "Modèles, routage par tâche, RAG, évaluation, feuille de route agents."],
];

/* ---------------------------------------------------------- texte enrichi */
/** `**gras**` et `code` dans une chaîne -> TextRun[]. */
function rich(text, base = {}) {
  // Word attend des demi-points entiers : une taille décimale rend le fichier invalide.
  if (base.size !== undefined) base = { ...base, size: Math.round(base.size) };
  const parts = String(text)
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .filter((s) => s !== "");
  return parts.map((part) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return new TextRun({ ...base, text: part.slice(2, -2), bold: true });
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return new TextRun({ ...base, text: part.slice(1, -1), font: MONO, size: (base.size || 21) - 3 });
    }
    return new TextRun({ ...base, text: part });
  });
}

/* ------------------------------------------------------ statuts colorés */
const STATUS = {
  "En place": { color: C.acc, fill: C.accTint },
  Vérifié: { color: C.acc, fill: C.accTint },
  Actée: { color: C.acc, fill: C.accTint },
  Conforme: { color: C.acc, fill: C.accTint },
  Partiel: { color: C.signal, fill: C.signalTint },
  "À vérifier": { color: C.signal, fill: C.signalTint },
  Proposée: { color: C.signal, fill: C.signalTint },
  "À construire": { color: C.info, fill: C.infoTint },
  "À décider": { color: C.info, fill: C.infoTint },
  Bloquant: { color: C.danger, fill: C.dangerTint },
  Écart: { color: C.danger, fill: C.dangerTint },
  Critique: { color: C.danger, fill: C.dangerTint },
  Élevée: { color: C.signal, fill: C.signalTint },
  Moyenne: { color: C.soft, fill: C.surf2 },
  Faible: { color: C.soft, fill: C.surf2 },
  Must: { color: C.acc, fill: C.accTint },
  Should: { color: C.signal, fill: C.signalTint },
  Could: { color: C.soft, fill: C.surf2 },
};

/* -------------------------------------------------------------- Doc class */
class Doc {
  constructor(meta) {
    this.meta = meta;
    this.body = [];
    this.heads = [];
    this.olCount = 0;
  }

  /* --- titres --- */
  _head(level, text) {
    const id = `h${this.heads.length + 1}`;
    this.heads.push({ level, text, id });
    this.body.push(
      new Paragraph({
        heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
        keepNext: true,
        children: [new Bookmark({ id, children: [new TextRun({ text })] })],
      })
    );
    return this;
  }
  h1(t) {
    return this._head(1, t);
  }
  h2(t) {
    return this._head(2, t);
  }
  h3(t) {
    return this._head(3, t);
  }

  /* --- texte --- */
  p(text, o = {}) {
    this.body.push(
      new Paragraph({
        children: rich(text, { color: o.color, italics: o.italics, size: o.size }),
        spacing: { after: o.after ?? 130, line: 276 },
        alignment: o.align,
        keepNext: o.keepNext,
      })
    );
    return this;
  }
  small(text) {
    return this.p(text, { size: 18, color: C.faint, after: 100 });
  }
  ul(items) {
    for (const it of items) {
      this.body.push(
        new Paragraph({
          children: rich(it),
          numbering: { reference: "puces", level: 0 },
          spacing: { after: 70, line: 270 },
        })
      );
    }
    this.body.push(new Paragraph({ text: "", spacing: { after: 60 } }));
    return this;
  }
  ol(items) {
    const instance = ++this.olCount;
    for (const it of items) {
      this.body.push(
        new Paragraph({
          children: rich(it),
          numbering: { reference: "nums", level: 0, instance },
          spacing: { after: 70, line: 270 },
        })
      );
    }
    this.body.push(new Paragraph({ text: "", spacing: { after: 60 } }));
    return this;
  }
  gap(n = 160) {
    this.body.push(new Paragraph({ text: "", spacing: { after: n } }));
    return this;
  }
  pb() {
    this.body.push(new Paragraph({ children: [new PageBreak()] }));
    return this;
  }

  /* --- encadré --- */
  callout(lines, color = C.acc, fill = C.surf2) {
    const arr = Array.isArray(lines) ? lines : [lines];
    const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
    this.body.push(
      new Table({
        columnWidths: [USABLE],
        width: { size: USABLE, type: WidthType.DXA },
        borders: {
          top: none,
          bottom: none,
          right: none,
          left: { style: BorderStyle.SINGLE, size: 22, color },
          insideHorizontal: none,
          insideVertical: none,
        },
        rows: [
          new TableRow({
            cantSplit: true,
            children: [
              new TableCell({
                width: { size: USABLE, type: WidthType.DXA },
                shading: { type: ShadingType.CLEAR, fill, color: "auto" },
                margins: { top: 130, bottom: 130, left: 200, right: 200 },
                children: arr.map(
                  (l, i) =>
                    new Paragraph({
                      children: rich(l),
                      spacing: { after: i === arr.length - 1 ? 0 : 90, line: 270 },
                    })
                ),
              }),
            ],
          }),
        ],
      })
    );
    this.gap(150);
    return this;
  }
  warn(lines) {
    return this.callout(lines, C.signal, C.signalTint);
  }
  alert(lines) {
    return this.callout(lines, C.danger, C.dangerTint);
  }

  /* --- code --- */
  code(lines) {
    const line = { style: BorderStyle.SINGLE, size: 4, color: C.line };
    const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
    this.body.push(
      new Table({
        columnWidths: [USABLE],
        width: { size: USABLE, type: WidthType.DXA },
        borders: { top: line, bottom: line, left: line, right: line, insideHorizontal: none, insideVertical: none },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: USABLE, type: WidthType.DXA },
                shading: { type: ShadingType.CLEAR, fill: "FAFBF9", color: "auto" },
                margins: { top: 120, bottom: 120, left: 170, right: 170 },
                children: lines.map(
                  (l) =>
                    new Paragraph({
                      children: [new TextRun({ text: l, font: MONO, size: 17, color: C.ink })],
                      spacing: { after: 30, line: 240 },
                    })
                ),
              }),
            ],
          }),
        ],
      })
    );
    this.gap(150);
    return this;
  }

  /* --- tableau --- */
  table(header, rows, weights, o = {}) {
    const total = weights.reduce((a, b) => a + b, 0);
    const widths = weights.map((w) => Math.round((w / total) * USABLE));
    widths[widths.length - 1] = USABLE - widths.slice(0, -1).reduce((a, b) => a + b, 0);
    const line = { style: BorderStyle.SINGLE, size: 4, color: C.line };
    const inner = { style: BorderStyle.SINGLE, size: 3, color: C.line };

    const cell = (content, i, isHeader, zebra) => {
      let spec = content;
      if (spec === null || spec === undefined) spec = "";
      const asObj = typeof spec === "object" && !Array.isArray(spec) ? spec : { t: spec };
      const texts = Array.isArray(asObj.t) ? asObj.t : [asObj.t];
      let color = asObj.color;
      let fill = asObj.fill;
      let bold = asObj.b;
      if (!isHeader && texts.length === 1 && typeof texts[0] === "string" && STATUS[texts[0]] && !asObj.color) {
        color = STATUS[texts[0]].color;
        fill = STATUS[texts[0]].fill;
        bold = true;
      }
      return new TableCell({
        width: { size: widths[i], type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP,
        shading: {
          type: ShadingType.CLEAR,
          fill: isHeader ? C.ink : fill || (zebra ? C.surf2 : "FFFFFF"),
          color: "auto",
        },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: texts.map(
          (t, k) =>
            new Paragraph({
              children: rich(String(t), {
                size: isHeader ? 17 : o.size || 18,
                bold: isHeader || bold,
                color: isHeader ? "FFFFFF" : color || C.ink,
              }),
              alignment: asObj.align,
              spacing: { after: k === texts.length - 1 ? 0 : 50, line: 250 },
            })
        ),
      });
    };

    this.body.push(
      new Table({
        columnWidths: widths,
        width: { size: USABLE, type: WidthType.DXA },
        borders: { top: line, bottom: line, left: line, right: line, insideHorizontal: inner, insideVertical: inner },
        rows: [
          ...(header
            ? [new TableRow({ tableHeader: true, cantSplit: true, children: header.map((t, i) => cell(t, i, true)) })]
            : []),
          ...rows.map(
            (r, ri) => new TableRow({ cantSplit: true, children: r.map((t, i) => cell(t, i, false, ri % 2 === 1)) })
          ),
        ],
      })
    );
    this.gap(150);
    return this;
  }

  /* --- figure (PNG généré par diagrams.js) --- */
  fig(name, caption) {
    const manifest = JSON.parse(fs.readFileSync(path.join(IMG_DIR, "manifest.json"), "utf8"));
    const m = manifest[name];
    if (!m) throw new Error(`Figure inconnue : ${name}`);
    const w = FIG_W;
    const h = Math.round((FIG_W * m.h) / m.w);
    this.body.push(
      new Paragraph({
        children: [
          new ImageRun({
            type: "png",
            data: fs.readFileSync(path.join(IMG_DIR, `${name}.png`)),
            transformation: { width: w, height: h },
            altText: { title: caption, description: caption, name },
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 70 },
        keepNext: true,
      }),
      new Paragraph({
        children: [new TextRun({ text: caption, size: 17, color: C.faint, italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 220 },
      })
    );
    return this;
  }

  /* --- page de couverture + sommaire + collection (assemblés à l'enregistrement) --- */
  _cover() {
    const m = this.meta;
    const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
    const metaRows = [
      ["Version", m.version || "1.0"],
      ["Date", m.date],
      ["Statut", m.statut || "Document de référence — à valider"],
      ["Public visé", m.public],
      ["Périmètre", m.perimetre],
    ].filter((r) => r[1]);
    const kvTable = new Table({
      columnWidths: [2200, USABLE - 2200],
      width: { size: USABLE, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: C.line },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: C.line },
        left: none,
        right: none,
        insideHorizontal: { style: BorderStyle.SINGLE, size: 3, color: C.line },
        insideVertical: none,
      },
      rows: metaRows.map(
        ([k, v]) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 2200, type: WidthType.DXA },
                margins: { top: 90, bottom: 90, left: 0, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: k, bold: true, size: 19, color: C.soft })] })],
              }),
              new TableCell({
                width: { size: USABLE - 2200, type: WidthType.DXA },
                margins: { top: 90, bottom: 90, left: 100, right: 0 },
                children: [new Paragraph({ children: rich(v, { size: 20 }) })],
              }),
            ],
          })
      ),
    });

    return [
      new Paragraph({ text: "", spacing: { after: 1500 } }),
      new Paragraph({
        children: [new TextRun({ text: "FINLENS", font: SANS, size: 24, color: C.acc, bold: true, characterSpacing: 80 })],
        spacing: { after: 160 },
      }),
      new Paragraph({
        children: [new TextRun({ text: `Document ${m.num} sur 8 · Collection documentaire`, size: 20, color: C.faint })],
        spacing: { after: 360 },
      }),
      new Paragraph({
        children: [new TextRun({ text: m.title, font: SERIF, size: 58, bold: true, color: C.ink })],
        spacing: { after: 160, line: 240 },
      }),
      new Paragraph({
        children: [new TextRun({ text: m.subtitle, font: SERIF, size: 28, color: C.soft })],
        spacing: { after: 360, line: 280 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C.acc, space: 14 } },
      }),
      new Paragraph({ text: "", spacing: { after: 300 } }),
      kvTable,
      new Paragraph({ text: "", spacing: { after: 500 } }),
      ...(m.lead
        ? [
            new Paragraph({
              children: rich(m.lead, { size: 22, color: C.soft }),
              spacing: { line: 300, after: 120 },
            }),
          ]
        : []),
      new Paragraph({ children: [new PageBreak()] }),
    ];
  }

  _sommaire() {
    const out = [
      new Paragraph({
        children: [new TextRun({ text: "Sommaire", font: SERIF, size: 32, bold: true, color: C.ink })],
        spacing: { after: 220 },
      }),
    ];
    for (const h of this.heads) {
      if (h.level > 2) continue;
      out.push(
        new Paragraph({
          children: [
            new InternalHyperlink({
              anchor: h.id,
              children: [
                new TextRun({
                  text: h.text,
                  size: h.level === 1 ? 22 : 19,
                  bold: h.level === 1,
                  color: h.level === 1 ? C.ink : C.soft,
                }),
              ],
            }),
          ],
          indent: { left: h.level === 1 ? 0 : 360 },
          spacing: { before: h.level === 1 ? 110 : 0, after: h.level === 1 ? 30 : 20 },
        })
      );
    }
    out.push(new Paragraph({ children: [new PageBreak()] }));
    return out;
  }

  _collection() {
    const rows = COLLECTION.map(([n, t, d]) => [
      { t: n, b: n === this.meta.num, color: n === this.meta.num ? C.acc : C.soft },
      { t, b: n === this.meta.num, color: n === this.meta.num ? C.acc : C.ink },
      d,
    ]);
    const saved = this.body;
    this.body = [];
    this.h1("Collection documentaire FinLens");
    this.p("Cette note fait partie d'un ensemble de huit documents. Chacun traite un sujet distinct et renvoie aux autres pour le détail.");
    this.table(["N°", "Document", "Objet"], rows, [8, 34, 58]);
    const added = this.body;
    this.body = saved;
    return added;
  }

  async save(outPath) {
    // La section « Collection documentaire » ajoute un titre : elle est construite
    // avant le sommaire pour que celui-ci la référence.
    const collection = this._collection();
    const final = [...this._cover(), ...this._sommaire(), ...this.body, ...collection];

    const footerText = `FinLens — ${this.meta.short || this.meta.title} — Confidentiel — page `;
    const doc = new Document({
      creator: "FinLens",
      title: `FinLens — ${this.meta.title}`,
      description: this.meta.subtitle,
      numbering: {
        config: [
          {
            reference: "puces",
            levels: [
              {
                level: 0,
                format: LevelFormat.BULLET,
                text: "•",
                alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 400, hanging: 260 } } },
              },
            ],
          },
          {
            reference: "nums",
            levels: [
              {
                level: 0,
                format: LevelFormat.DECIMAL,
                text: "%1.",
                alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 440, hanging: 300 } } },
              },
            ],
          },
        ],
      },
      styles: {
        default: {
          document: { run: { font: SANS, size: 21, color: C.ink } },
          heading1: {
            run: { font: SERIF, size: 32, bold: true, color: C.ink },
            paragraph: { spacing: { before: 420, after: 200 } },
          },
          heading2: {
            run: { font: SERIF, size: 25, bold: true, color: C.acc },
            paragraph: { spacing: { before: 300, after: 150 } },
          },
          heading3: {
            run: { font: SANS, size: 22, bold: true, color: C.ink },
            paragraph: { spacing: { before: 220, after: 110 } },
          },
        },
      },
      sections: [
        {
          properties: {
            titlePage: true,
            page: {
              size: { width: PAGE_W, height: PAGE_H },
              margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
            },
          },
          footers: {
            first: new Footer({ children: [new Paragraph({ text: "" })] }),
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: footerText, size: 16, color: C.faint }),
                    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.faint }),
                  ],
                }),
              ],
            }),
          },
          children: final,
        },
      ],
    });

    const buf = await Packer.toBuffer(doc);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, buf);
    return { bytes: buf.length, headings: this.heads.length };
  }
}

/* ============================================================ SCHÉMAS (SVG) */
const SANS_SVG = "Arial, Helvetica, sans-serif";
const MONO_SVG = "Consolas, 'Courier New', monospace";
const SC = {
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
  panel: "#0E1211",
  panelBox: "#08090A",
  panelText: "#F3F5F3",
  panelSoft: "#97A19A",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const D = {
  C: SC,
  box(x, y, w, h, o = {}) {
    const fill = o.fill || SC.surf;
    const stroke = o.stroke || SC.line;
    const sw = o.sw ?? 1.5;
    const rx = o.rx ?? 8;
    const so = o.so != null ? ` stroke-opacity="${o.so}"` : "";
    const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : "";
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${so}${dash}/>`;
  },
  txt(x, y, s, o = {}) {
    const size = o.size ?? 14;
    const fill = o.fill || SC.ink;
    const weight = o.weight || "normal";
    const anchor = o.anchor || "start";
    const family = o.mono ? MONO_SVG : SANS_SVG;
    const ls = o.ls ? ` letter-spacing="${o.ls}"` : "";
    const it = o.italic ? ` font-style="italic"` : "";
    return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${ls}${it}>${esc(s)}</text>`;
  },
  /** Plusieurs lignes de texte, interligne lh. */
  lines(x, y, arr, o = {}, lh = 17) {
    return arr.map((s, i) => D.txt(x, y + i * lh, s, o)).join("");
  },
  defs() {
    const mk = (id, color) =>
      `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/></marker>`;
    return `<defs>${mk("a", SC.soft)}${mk("aAcc", SC.acc)}${mk("aDan", SC.danger)}${mk("aSig", SC.signal)}${mk("aInf", SC.info)}</defs>`;
  },
  arrow(x1, y1, x2, y2, o = {}) {
    const color = o.color || SC.soft;
    const m = { [SC.acc]: "aAcc", [SC.danger]: "aDan", [SC.signal]: "aSig", [SC.info]: "aInf" }[color] || "a";
    const both = o.both ? ` marker-start="url(#${m})"` : "";
    const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : "";
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${o.w || 2}" marker-end="url(#${m})"${both}${dash}/>`;
  },
  path(d, o = {}) {
    const color = o.color || SC.soft;
    const m = { [SC.acc]: "aAcc", [SC.danger]: "aDan", [SC.signal]: "aSig", [SC.info]: "aInf" }[color] || "a";
    const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : "";
    const end = o.noArrow ? "" : ` marker-end="url(#${m})"`;
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${o.w || 2}"${end}${dash}/>`;
  },
  /** Pastille (badge) arrondie avec libellé centré. */
  pill(x, y, w, h, label, o = {}) {
    return (
      D.box(x, y, w, h, { fill: o.fill || SC.accTint, stroke: o.stroke || o.fill || SC.accTint, rx: h / 2, sw: o.sw ?? 1.2, dash: o.dash }) +
      D.txt(x + w / 2, y + h / 2 + (o.size || 12) * 0.36, label, {
        size: o.size || 12,
        weight: o.weight || "bold",
        fill: o.color || SC.acc,
        anchor: "middle",
        mono: o.mono,
      })
    );
  },
  circle(cx, cy, r, label, o = {}) {
    return (
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.fill || SC.acc}"/>` +
      D.txt(cx, cy + (o.size || 14) * 0.36, label, { size: o.size || 14, weight: "bold", fill: o.color || "#FFFFFF", anchor: "middle" })
    );
  },
  head(W, H, title, subtitle) {
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
      D.defs() +
      `<rect width="${W}" height="${H}" fill="${SC.surf}"/>` +
      D.txt(40, 40, title, { size: 25, weight: "bold" }) +
      (subtitle ? D.txt(40, 65, subtitle, { size: 13.5, fill: SC.soft }) : "")
    );
  },
  foot(s) {
    return s + "</svg>";
  },
};

/** Rasterise une liste de { name, W, H, svg } vers img/ et met à jour manifest.json. */
async function renderDiagrams(list) {
  const sharp = require("sharp");
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const mfPath = path.join(IMG_DIR, "manifest.json");
  const manifest = fs.existsSync(mfPath) ? JSON.parse(fs.readFileSync(mfPath, "utf8")) : {};
  for (const d of list) {
    fs.writeFileSync(path.join(IMG_DIR, `${d.name}.svg`), d.svg, "utf8");
    const png = await sharp(Buffer.from(d.svg), { density: 300 }).resize({ width: 2000 }).png().toBuffer();
    fs.writeFileSync(path.join(IMG_DIR, `${d.name}.png`), png);
    manifest[d.name] = { w: d.W, h: d.H };
    console.log(`  ${d.name}.png  ${d.W}x${d.H}  ${(png.length / 1024).toFixed(0)} Ko`);
  }
  fs.writeFileSync(mfPath, JSON.stringify(manifest, null, 2), "utf8");
}

module.exports = { Doc, C, D, SC, USABLE, renderDiagrams, IMG_DIR, COLLECTION };
