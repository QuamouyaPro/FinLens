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
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Créer un compte
        </h1>
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
        <label htmlFor="role" className="text-sm font-medium text-slate-900">
          Rôle
        </label>
        <select
          id="role"
          name="role"
          required
          defaultValue=""
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm transition-all duration-200 ease-in-out focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
        hint="6 caractères minimum."
      />

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Button type="submit" loading={pending}>
        {pending ? "Création du compte…" : "Créer mon compte"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-medium text-accent transition-colors duration-200 hover:text-accent-hover hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}
