"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/(auth)/actions";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const ROLES: { value: string; label: string }[] = [
  { value: "analyste", label: "Analyste" },
  { value: "associe", label: "Associé" },
  { value: "cfo", label: "CFO" },
  { value: "independant", label: "Indépendant" },
];

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-navy-dark">Créer un compte</h1>
        <p className="mt-1 text-sm text-slate-500">
          Commencez à analyser vos documents financiers.
        </p>
      </div>

      <Input id="full_name" name="full_name" label="Nom complet" required />
      <Input
        id="company_name"
        name="company_name"
        label="Nom de l'entreprise"
        required
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className="text-sm font-medium text-navy-dark">
          Rôle
        </label>
        <select
          id="role"
          name="role"
          required
          defaultValue=""
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-navy-dark focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="" disabled>
            Sélectionnez votre rôle
          </option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <Input id="email" name="email" type="email" label="Email" required />
      <Input
        id="password"
        name="password"
        type="password"
        label="Mot de passe"
        minLength={6}
        required
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Création..." : "Créer mon compte"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
