import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { ExportContent } from "./content";

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const LINE_HEIGHT = 14;

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length > maxCharsPerLine) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generatePdfExport(content: ExportContent): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function ensureSpace(lines = 1) {
    if (y - lines * LINE_HEIGHT < MARGIN) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  }

  function writeLine(text: string, options: { bold?: boolean; size?: number } = {}) {
    ensureSpace();
    page.drawText(text, {
      x: MARGIN,
      y,
      size: options.size ?? 10,
      font: options.bold ? boldFont : font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= LINE_HEIGHT;
  }

  function writeParagraph(text: string, options: { bold?: boolean; size?: number } = {}) {
    const lines = wrapText(text, 95);
    for (const line of lines) {
      writeLine(line, options);
    }
  }

  writeLine(content.titre, { bold: true, size: 18 });
  writeLine(`Profil : ${content.profilLabel}`, { size: 12 });
  writeLine(`Score de risque : ${content.scoreRisque}/100`, { bold: true });
  y -= LINE_HEIGHT;

  writeLine("Résumé", { bold: true, size: 13 });
  writeParagraph(content.resumeCourt);
  y -= LINE_HEIGHT;

  writeLine("Indicateurs clés", { bold: true, size: 13 });
  for (const indicateur of content.indicateursCles) {
    writeLine(`- ${indicateur.libelle} : ${indicateur.valeur ?? "[DONNÉE MANQUANTE]"}`);
  }
  y -= LINE_HEIGHT;

  for (const section of content.sections) {
    writeLine(section.section, { bold: true, size: 13 });
    writeParagraph(section.contenu);
    y -= LINE_HEIGHT;
  }

  if (content.ajoutsParCategorie.size > 0) {
    writeLine("Ajouts du Copilote", { bold: true, size: 13 });
    for (const [categorie, contenus] of content.ajoutsParCategorie) {
      writeLine(categorie, { bold: true });
      for (const texte of contenus) {
        writeParagraph(texte);
      }
    }
  }

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}
