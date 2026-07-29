import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import type { ExportContent } from "./content";

export async function generateWordExport(content: ExportContent): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({ text: content.titre, heading: HeadingLevel.TITLE }),
    new Paragraph({ text: `Profil : ${content.profilLabel}`, heading: HeadingLevel.HEADING_3 }),
    new Paragraph({
      children: [new TextRun({ text: `Score de risque : ${content.scoreRisque}/100`, bold: true })],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "Résumé", heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ text: content.resumeCourt }),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "Indicateurs clés", heading: HeadingLevel.HEADING_2 }),
    ...content.indicateursCles.map(
      (i) => new Paragraph({ text: `${i.libelle} : ${i.valeur ?? "[DONNÉE MANQUANTE]"}` })
    ),
    new Paragraph({ text: "" }),
  ];

  for (const section of content.sections) {
    children.push(new Paragraph({ text: section.section, heading: HeadingLevel.HEADING_2 }));
    children.push(new Paragraph({ text: section.contenu }));
    children.push(new Paragraph({ text: "" }));
  }

  if (content.ajoutsParCategorie.size > 0) {
    children.push(new Paragraph({ text: "Ajouts du Copilote", heading: HeadingLevel.HEADING_2 }));
    for (const [categorie, contenus] of content.ajoutsParCategorie) {
      children.push(new Paragraph({ text: categorie, heading: HeadingLevel.HEADING_3 }));
      for (const texte of contenus) {
        children.push(new Paragraph({ text: texte }));
      }
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  return Packer.toBuffer(doc);
}
