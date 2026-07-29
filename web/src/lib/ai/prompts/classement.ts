import { CATEGORIES_EXTRACTION } from "./taxonomy";

/** Classement Haiku 4.5 d'un ajout épinglé depuis le Copilote (Module 3 -> Note). */
export function buildClassementSystemPrompt(): string {
  return [
    `Classe le texte suivant dans l'une des catégories : ${CATEGORIES_EXTRACTION.join(", ")}.`,
    'Réponds uniquement avec {"categorie": "..."}.',
  ].join("\n");
}
