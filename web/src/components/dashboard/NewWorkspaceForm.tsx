"use client";

import { useActionState } from "react";
import { createWorkspace } from "@/app/(dashboard)/actions";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function NewWorkspaceForm() {
  const [state, action, pending] = useActionState(createWorkspace, undefined);

  return (
    <form
      action={action}
      className="flex max-w-md flex-col gap-5 rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
    >
      <Input id="name" name="name" label="Nom de l'espace de travail" required />
      <Input
        id="target_company"
        name="target_company"
        label="Nom de l'entreprise étudiée"
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Création..." : "Créer l'espace de travail"}
      </Button>
    </form>
  );
}
