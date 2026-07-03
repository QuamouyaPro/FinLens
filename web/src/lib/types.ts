import type { Database } from "@/lib/database.types";

export type { Database };

type Tables = Database["public"]["Tables"];

export type UserRole = "analyste" | "associe" | "cfo" | "independant";
export type Plan = "free" | "pay_per_deal" | "pro" | "team";
export type WorkspaceStatus = "active" | "archived";
export type ProcessingStatus = "pending" | "processing" | "completed" | "error";
export type AnalysisStatus = "pending" | "completed" | "error";
export type ChatRole = "user" | "assistant";

export type Profile = Omit<Tables["profiles"]["Row"], "role" | "plan"> & {
  role: UserRole | null;
  plan: Plan | null;
};

export type Workspace = Omit<Tables["workspaces"]["Row"], "status"> & {
  status: WorkspaceStatus | null;
};

export type Document = Omit<Tables["documents"]["Row"], "processing_status"> & {
  processing_status: ProcessingStatus | null;
};

export type Analysis = Omit<Tables["analyses"]["Row"], "status"> & {
  status: AnalysisStatus | null;
  summary_json: ExecutiveSummary | null;
};

export type ChatMessage = Omit<Tables["chat_messages"]["Row"], "role"> & {
  role: ChatRole;
};

export type ExecutiveSummary = {
  sante_financiere: string;
  risques: string[];
  opportunites: string[];
  points_attention: string[];
};
