import { callModel } from "./client";
import { logUsage } from "./usage";
import { parseJsonResponse } from "./json";
import {
  buildExtractionSystemPrompt,
  buildExtractionUserPrompt,
} from "./prompts/extraction";
import {
  buildReformulationSystemPrompt,
  buildReformulationUserPrompt,
} from "./prompts/profils";
import {
  buildChatSystemPrompt,
  buildChatContextPrompt,
  buildComplexityClassifierPrompt,
} from "./prompts/chat";
import {
  buildComparateurSystemPrompt,
  buildContradictionSystemPrompt,
} from "./prompts/comparateur";
import { buildClassementSystemPrompt } from "./prompts/classement";
import type { Enums } from "@/types/database";
import type {
  ExtractionContenu,
  NoteProfilContenu,
  ChatReponse,
  ComparaisonContenu,
  ContradictionDetectee,
} from "@/types/domain";

type ProfilAnalyse = Enums<"profil_analyse">;

/**
 * Routeur IA par tâche (Note d'Architecture, section 3 ; Coûts & Pricing, section 3).
 * Principe directeur, non négociable : l'IA qui lit et juge les documents reste
 * toujours Fable 5. Sonnet 5 reformule/discute ; Haiku 4.5 fait les tâches
 * internes invisibles (classification, classement).
 */

export async function runExtraction(params: {
  organizationId: string;
  dossierId: string;
  documentsText: string;
}) {
  const result = await callModel({
    model: "fable_5",
    system: buildExtractionSystemPrompt(),
    messages: [{ role: "user", content: buildExtractionUserPrompt(params.documentsText) }],
    maxTokens: 8192,
  });

  await logUsage({
    organizationId: params.organizationId,
    dossierId: params.dossierId,
    taskType: "extraction",
    model: "fable_5",
    tokensIn: result.tokensIn,
    tokensOut: result.tokensOut,
    cacheReadTokens: result.cacheReadTokens,
    cacheWriteTokens: result.cacheWriteTokens,
  });

  return {
    contenu: parseJsonResponse<ExtractionContenu>(result.text),
    tokensIn: result.tokensIn,
    tokensOut: result.tokensOut,
  };
}

export async function runReformulationProfil(params: {
  organizationId: string;
  dossierId: string;
  profil: ProfilAnalyse;
  extractionJson: string;
  indicateursPersonnalises?: string[];
  /** true dès la 2e reformulation du dossier : profite du cache 1h sur l'extraction. */
  useCachedExtraction: boolean;
}) {
  const result = await callModel({
    model: "sonnet_5",
    cachedSystem: params.useCachedExtraction
      ? buildReformulationUserPrompt(params.extractionJson)
      : undefined,
    system: buildReformulationSystemPrompt(params.profil, params.indicateursPersonnalises),
    messages: [
      {
        role: "user",
        content: params.useCachedExtraction
          ? "Rédige la note pour ce profil à partir de l'extraction ci-dessus."
          : buildReformulationUserPrompt(params.extractionJson),
      },
    ],
    maxTokens: 4096,
  });

  await logUsage({
    organizationId: params.organizationId,
    dossierId: params.dossierId,
    taskType: "reformulation_profil",
    model: "sonnet_5",
    tokensIn: result.tokensIn,
    tokensOut: result.tokensOut,
    cacheReadTokens: result.cacheReadTokens,
    cacheWriteTokens: result.cacheWriteTokens,
  });

  return parseJsonResponse<NoteProfilContenu>(result.text);
}

export async function classifyComplexity(question: string): Promise<"standard" | "complexe"> {
  const result = await callModel({
    model: "haiku_4_5",
    system: buildComplexityClassifierPrompt(),
    messages: [{ role: "user", content: question }],
    maxTokens: 50,
  });

  const parsed = parseJsonResponse<{ complexite: "standard" | "complexe" }>(result.text);
  return parsed.complexite;
}

export async function runChatMessage(params: {
  organizationId: string;
  userId: string;
  dossierId: string;
  question: string;
  chunksContext: string;
  /** true si l'écart avec la dernière question dépasse 1h (cache expiré). */
  cacheExpired: boolean;
}) {
  // Haiku 4.5 classe la complexité (coût négligeable) -> routage Sonnet 5 / Fable 5.
  const complexite = await classifyComplexity(params.question);
  await logUsage({
    organizationId: params.organizationId,
    userId: params.userId,
    dossierId: params.dossierId,
    taskType: "classification_complexite",
    model: "haiku_4_5",
    tokensIn: 50,
    tokensOut: 10,
  });

  const model = complexite === "complexe" ? "fable_5" : "sonnet_5";

  const result = await callModel({
    model,
    cachedSystem: !params.cacheExpired ? buildChatContextPrompt(params.chunksContext) : undefined,
    system: buildChatSystemPrompt(),
    messages: [
      {
        role: "user",
        content: params.cacheExpired
          ? `${buildChatContextPrompt(params.chunksContext)}\n\nQuestion : ${params.question}`
          : `Question : ${params.question}`,
      },
    ],
    maxTokens: 2048,
  });

  await logUsage({
    organizationId: params.organizationId,
    userId: params.userId,
    dossierId: params.dossierId,
    taskType: "chat",
    model,
    tokensIn: result.tokensIn,
    tokensOut: result.tokensOut,
    cacheReadTokens: result.cacheReadTokens,
    cacheWriteTokens: result.cacheWriteTokens,
  });

  return { ...parseJsonResponse<ChatReponse>(result.text), modelUsed: model };
}

export async function runComparaison(params: {
  organizationId: string;
  userId: string;
  dossiersContext: string;
}) {
  const result = await callModel({
    model: "fable_5",
    system: buildComparateurSystemPrompt(),
    messages: [{ role: "user", content: params.dossiersContext }],
    maxTokens: 4096,
  });

  await logUsage({
    organizationId: params.organizationId,
    userId: params.userId,
    taskType: "comparaison",
    model: "fable_5",
    tokensIn: result.tokensIn,
    tokensOut: result.tokensOut,
  });

  return parseJsonResponse<ComparaisonContenu>(result.text);
}

export async function detectContradictions(params: {
  organizationId: string;
  dossierId: string;
  documentsText: string;
}) {
  const result = await callModel({
    model: "fable_5",
    system: buildContradictionSystemPrompt(),
    messages: [{ role: "user", content: params.documentsText }],
    maxTokens: 4096,
  });

  await logUsage({
    organizationId: params.organizationId,
    dossierId: params.dossierId,
    taskType: "extraction",
    model: "fable_5",
    tokensIn: result.tokensIn,
    tokensOut: result.tokensOut,
  });

  return parseJsonResponse<ContradictionDetectee[]>(result.text);
}

export async function classifyAjoutCopilote(params: {
  organizationId: string;
  dossierId: string;
  texte: string;
}) {
  const result = await callModel({
    model: "haiku_4_5",
    system: buildClassementSystemPrompt(),
    messages: [{ role: "user", content: params.texte }],
    maxTokens: 50,
  });

  await logUsage({
    organizationId: params.organizationId,
    dossierId: params.dossierId,
    taskType: "classement_copilote",
    model: "haiku_4_5",
    tokensIn: result.tokensIn,
    tokensOut: result.tokensOut,
  });

  return parseJsonResponse<{ categorie: string }>(result.text).categorie;
}
