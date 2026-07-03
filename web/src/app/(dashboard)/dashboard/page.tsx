import Link from "next/link";
import { FolderPlus } from "lucide-react";
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
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Mes espaces de travail
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Un espace par entreprise étudiée.
          </p>
        </div>
        <Link
          href="/workspace/new"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Button tabIndex={-1}>Nouvel espace de travail</Button>
        </Link>
      </div>

      {!workspaces || workspaces.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-slate-200 bg-white/50 px-6 py-24 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <FolderPlus
              className="h-7 w-7 text-accent"
              strokeWidth={1.5}
              aria-hidden
            />
          </span>
          <div>
            <p className="font-semibold tracking-tight text-slate-900">
              Aucun espace de travail pour l&apos;instant
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Créez votre premier espace de travail pour commencer à analyser
              les documents d&apos;une entreprise.
            </p>
          </div>
          <Link
            href="/workspace/new"
            className="mt-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Button tabIndex={-1}>Créer mon premier espace</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
