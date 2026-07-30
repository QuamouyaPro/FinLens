import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoDossierDetail } from "@/components/demo/demo-dossier-detail";
import {
  trouverDossier,
  DEMO_PROFILS,
  DEMO_CONTRADICTIONS,
  DEMO_CHECKLIST,
  DEMO_CHAT,
} from "@/lib/demo/fixtures";

export const metadata: Metadata = { title: "Dossier (démo) — FinLens" };

export default async function DemoDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dossier = trouverDossier(id);
  if (!dossier) notFound();

  return (
    <DemoDossierDetail
      dossier={dossier}
      profils={DEMO_PROFILS[id] ?? {}}
      contradictions={DEMO_CONTRADICTIONS[id] ?? []}
      checklist={DEMO_CHECKLIST[id] ?? []}
      chat={DEMO_CHAT[id] ?? []}
    />
  );
}
