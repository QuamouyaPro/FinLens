import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoDossierDetail } from "@/components/demo/demo-dossier-detail";
import { DOSSIERS, trouverDossier } from "@/lib/demo";

export const metadata: Metadata = { title: "Dossier (démo) — FinLens" };

export function generateStaticParams() {
  return DOSSIERS.map((d) => ({ id: d.id }));
}

export default async function DemoDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dossier = trouverDossier(id);
  if (!dossier) notFound();

  return <DemoDossierDetail dossier={dossier} />;
}
