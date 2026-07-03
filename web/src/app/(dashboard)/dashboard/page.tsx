import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import WorkspaceCard from "@/components/dashboard/WorkspaceCard";
import Button from "@/components/ui/Button";
import type { WorkspaceStatus } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("id, name, target_company, status, updated_at, documents(count)")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy-dark">
            Mes espaces de travail
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Un espace par entreprise étudiée.
          </p>
        </div>
        <Link href="/workspace/new">
          <Button>Nouvel espace de travail</Button>
        </Link>
      </div>

      {!workspaces || workspaces.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <p className="text-navy-dark font-medium">
            Aucun espace de travail pour l&apos;instant
          </p>
          <p className="max-w-sm text-sm text-slate-500">
            Créez votre premier espace de travail pour commencer à analyser
            les documents d&apos;une entreprise.
          </p>
          <Link href="/workspace/new" className="mt-2">
            <Button>Créer mon premier espace</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((w) => (
            <WorkspaceCard
              key={w.id}
              id={w.id}
              name={w.name}
              targetCompany={w.target_company}
              status={(w.status ?? "active") as WorkspaceStatus}
              documentCount={w.documents?.[0]?.count ?? 0}
              updatedAt={w.updated_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
