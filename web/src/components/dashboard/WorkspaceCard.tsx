import Link from "next/link";
import type { WorkspaceStatus } from "@/lib/types";

const STATUS_LABEL: Record<WorkspaceStatus, string> = {
  active: "Actif",
  archived: "Archivé",
};

const STATUS_STYLE: Record<WorkspaceStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  archived: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function WorkspaceCard({
  id,
  name,
  targetCompany,
  status,
  documentCount,
  updatedAt,
}: {
  id: string;
  name: string;
  targetCompany: string | null;
  status: WorkspaceStatus;
  documentCount: number;
  updatedAt: string | null;
}) {
  return (
    <Link
      href={`/workspace/${id}`}
      className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-navy-dark">{name}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[status]}`}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>
      {targetCompany && (
        <p className="text-sm text-slate-500">{targetCompany}</p>
      )}
      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>
          {documentCount} document{documentCount !== 1 ? "s" : ""}
        </span>
        {updatedAt && (
          <span>
            Maj le {new Date(updatedAt).toLocaleDateString("fr-FR")}
          </span>
        )}
      </div>
    </Link>
  );
}
