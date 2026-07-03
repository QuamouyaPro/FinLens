import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
      <h1 className="text-2xl font-semibold text-navy-dark">
        {workspace.name}
      </h1>
      {workspace.target_company && (
        <p className="mt-1 text-sm text-slate-500">
          {workspace.target_company}
        </p>
      )}

      <div className="mt-10 rounded-xl border border-dashed border-slate-300 py-16 text-center">
        <p className="font-medium text-navy-dark">
          Ingestion de documents à venir
        </p>
        <p className="mt-1 text-sm text-slate-500">
          L&apos;upload de documents arrive à la prochaine phase.
        </p>
      </div>
    </div>
  );
}
