import Anthropic from "@anthropic-ai/sdk";
import { MODEL_API_IDS, type IaModel } from "./models";

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (anthropicClient) return anthropicClient;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY doit être défini (voir .env.example).");
  }

  anthropicClient = new Anthropic({ apiKey });
  return anthropicClient;
}

export type CallModelResult = {
  text: string;
  tokensIn: number;
  tokensOut: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
};

export type CallModelParams = {
  model: IaModel;
  /**
   * Contenu système volumineux et stable (extraction, historique de conversation)
   * -- marqué cache_control pour bénéficier du cache de prompt 1h (Note
   * d'Architecture, section D). Le cache est propre à chaque modèle : un cache
   * écrit par Sonnet 5 n'est jamais lu par Fable 5.
   */
  cachedSystem?: string;
  system?: string;
  messages: Anthropic.MessageParam[];
  maxTokens?: number;
  temperature?: number;
};

export async function callModel(params: CallModelParams): Promise<CallModelResult> {
  const client = getAnthropicClient();
  const modelId = MODEL_API_IDS[params.model];

  const system: Anthropic.TextBlockParam[] = [];
  if (params.cachedSystem) {
    system.push({
      type: "text",
      text: params.cachedSystem,
      cache_control: { type: "ephemeral", ttl: "1h" },
    });
  }
  if (params.system) {
    system.push({ type: "text", text: params.system });
  }

  const response = await client.messages.create({
    model: modelId,
    max_tokens: params.maxTokens ?? 4096,
    temperature: params.temperature ?? 0.2,
    system: system.length > 0 ? system : undefined,
    messages: params.messages,
  });

  const textBlock = response.content.find((block) => block.type === "text");

  return {
    text: textBlock && textBlock.type === "text" ? textBlock.text : "",
    tokensIn: response.usage.input_tokens,
    tokensOut: response.usage.output_tokens,
    cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
    cacheWriteTokens: response.usage.cache_creation_input_tokens ?? 0,
  };
}
