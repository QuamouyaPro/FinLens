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
        <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
          Créer un compte
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Commencez à analyser vos documents financiers.
        </p>
      </div>

      <Input
        id="full_name"
        name="full_name"
        label="Nom complet"
        tone="dark"
        required
      />
      <Input
        id="company_name"
        name="company_name"
        label="Nom de l'entreprise"
        tone="dark"
        required
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className="text-sm font-medium text-zinc-300">
          Rôle
        </label>
        <select
          id="role"
          name="role"
          required
          defaultValue=""
          className="h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none transition-all duration-300 ease-in-out focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
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

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        tone="dark"
        required
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Mot de passe"
        tone="dark"
        minLength={6}
        required
        hint="6 caractères minimum."
      />

      {state?.error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="white" loading={pending}>
        {pending ? "Création du compte…" : "Créer mon compte"}
      </Button>

      <p className="text-center text-sm text-zinc-400">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-medium text-zinc-50 transition-colors duration-300 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}
