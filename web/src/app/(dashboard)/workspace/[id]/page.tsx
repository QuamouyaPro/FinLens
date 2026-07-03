import { notFound } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Badge from "@/components/ui/Badge";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name, target_company, status")
    .eq("id", id)
    .single();

  if (!workspace) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {workspace.name}
        </h1>
        <Badge variant={workspace.status === "archived" ? "neutral" : "success"}>
          {workspace.status === "archived" ? "Archivé" : "Actif"}
        </Badge>
      </div>
      {workspace.target_company && (
        <p className="mt-1 text-sm text-slate-500">
          {workspace.target_company}
        </p>
      )}

      <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-slate-200 bg-white/50 px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
          <UploadCloud
            className="h-7 w-7 text-accent"
            strokeWidth={1.5}
            aria-hidden
          />
        </span>
        <div>
          <p className="font-semibold tracking-tight text-slate-900">
            Ingestion de documents à venir
          </p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            Le dépôt de documents (rapports annuels, liasses, due diligences)
            arrive à la prochaine phase.
          </p>
        </div>
      </div>
    </div>
  );
}
