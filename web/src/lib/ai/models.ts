import type { Enums } from "@/types/database";

export type IaModel = Enums<"ia_model">;

/**
 * Identifiants d'API réels associés à chaque modèle logique utilisé dans FinLens.
 * Configurables par variable d'environnement pour absorber un renommage de modèle
 * sans toucher au code (voir .env.example).
 */
export const MODEL_API_IDS: Record<IaModel, string> = {
  fable_5: process.env.ANTHROPIC_MODEL_FABLE_5 || "claude-fable-5",
  sonnet_5: process.env.ANTHROPIC_MODEL_SONNET_5 || "claude-sonnet-5",
  haiku_4_5: process.env.ANTHROPIC_MODEL_HAIKU_4_5 || "claude-haiku-4-5-20251001",
  opus_4_8: process.env.ANTHROPIC_MODEL_OPUS_FALLBACK || "claude-opus-5",
  // Modèles non-Anthropic utilisés uniquement pour des micro-tâches internes
  // (nettoyage, tri) -- non câblés par défaut, réservés à une optimisation future.
  gemini_flash: process.env.GEMINI_MODEL_FLASH || "gemini-2.5-flash",
  gemini_flash_lite: process.env.GEMINI_MODEL_FLASH_LITE || "gemini-2.5-flash-lite",
};

/**
 * Tarifs officiels $/M tokens (Coûts & Pricing, section 2). Utilisés pour estimer
 * cost_usd sur chaque ligne de usage_logs -- jamais pour facturer un dépassement
 * sur Analyste/Fonds, seulement pour le suivi de marge et le monitoring.
 */
export const MODEL_PRICING_USD_PER_MTOK: Record<IaModel, { input: number; output: number }> = {
  fable_5: { input: 10, output: 50 },
  sonnet_5: { input: 2, output: 10 },
  opus_4_8: { input: 5, output: 25 },
  haiku_4_5: { input: 1, output: 5 },
  gemini_flash: { input: 0.3, output: 2.5 },
  gemini_flash_lite: { input: 0.1, output: 0.4 },
};

/** Lecture du cache de prompt : 10 % du tarif d'entrée (Note d'Architecture, section D). */
export const CACHE_READ_DISCOUNT = 0.1;
/** Écriture du cache de prompt : 1.25x le tarif d'entrée standard (palier 1h). */
export const CACHE_WRITE_MULTIPLIER = 1.25;

export function estimateCostUsd(
  model: IaModel,
  tokensIn: number,
  tokensOut: number,
  cacheReadTokens = 0,
  cacheWriteTokens = 0
): number {
  const pricing = MODEL_PRICING_USD_PER_MTOK[model];
  const regularInputTokens = Math.max(tokensIn - cacheReadTokens - cacheWriteTokens, 0);

  const inputCost =
    (regularInputTokens * pricing.input) / 1_000_000 +
    (cacheReadTokens * pricing.input * CACHE_READ_DISCOUNT) / 1_000_000 +
    (cacheWriteTokens * pricing.input * CACHE_WRITE_MULTIPLIER) / 1_000_000;
  const outputCost = (tokensOut * pricing.output) / 1_000_000;

  return Number((inputCost + outputCost).toFixed(6));
}
