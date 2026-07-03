"use client";

import { useActionState } from "react";
import { createWorkspace } from "@/app/(dashboard)/actions";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function NewWorkspaceForm() {
  const [state, action, pending] = useActionState(createWorkspace, undefined);

  return (
    <Card className="max-w-md">
      <form action={action} className="flex flex-col gap-6">
        <Input
          id="name"
          name="name"
          label="Nom de l'espace de travail"
          placeholder="Due diligence — Société X"
          required
        />
        <Input
          id="target_company"
          name="target_company"
          label="Nom de l'entreprise étudiée"
          placeholder="Société X SAS"
          hint="Facultatif — vous pourrez le préciser plus tard."
        />

        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <Button type="submit" loading={pending}>
          {pending ? "Création de l'espace…" : "Créer l'espace de travail"}
        </Button>
      </form>
    </Card>
  );
}
