import NewWorkspaceForm from "@/components/dashboard/NewWorkspaceForm";

export default function NewWorkspacePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Nouvel espace de travail
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Chaque espace regroupe les documents d&apos;une même entreprise.
      </p>
      <div className="mt-8">
        <NewWorkspaceForm />
      </div>
    </div>
  );
}
