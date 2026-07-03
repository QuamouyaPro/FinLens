import Link from "next/link";
import { FileText } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { WorkspaceStatus } from "@/lib/types";

const STATUS: Record<
  WorkspaceStatus,
  { label: string; variant: "success" | "neutral" }
> = {
  active: { label: "Actif", variant: "success" },
  archived: { label: "Archivé", variant: "neutral" },
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
  const s = STATUS[status];

  return (
    <Link
      href={`/workspace/${id}`}
      className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <Card interactive className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-accent">
            {name}
          </h3>
          <Badge variant={s.variant}>{s.label}</Badge>
        </div>

        {targetCompany && (
          <p className="text-sm text-slate-500">{targetCompany}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            {documentCount} document{documentCount !== 1 ? "s" : ""}
          </span>
          {updatedAt && (
            <span>Maj le {new Date(updatedAt).toLocaleDateString("fr-FR")}</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
