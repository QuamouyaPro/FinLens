import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { estimateCostUsd, type IaModel } from "./models";
import type { Enums } from "@/types/database";

type TaskType = Enums<"task_type">;

export async function logUsage(params: {
  organizationId: string;
  userId?: string | null;
  dossierId?: string | null;
  taskType: TaskType;
  model: IaModel;
  tokensIn: number;
  tokensOut: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
}) {
  const admin = getSupabaseAdmin();

  const costUsd = estimateCostUsd(
    params.model,
    params.tokensIn,
    params.tokensOut,
    params.cacheReadTokens ?? 0,
    params.cacheWriteTokens ?? 0
  );

  await admin.from("usage_logs").insert({
    organization_id: params.organizationId,
    user_id: params.userId ?? null,
    dossier_id: params.dossierId ?? null,
    task_type: params.taskType,
    model: params.model,
    tokens_in: params.tokensIn,
    tokens_out: params.tokensOut,
    cache_read_tokens: params.cacheReadTokens ?? 0,
    cache_write_tokens: params.cacheWriteTokens ?? 0,
    cost_usd: costUsd,
  });

  return costUsd;
}
