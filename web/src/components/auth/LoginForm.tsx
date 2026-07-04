"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/(auth)/actions";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
          Connexion
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Accédez à vos espaces de travail FinLens.
        </p>
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
        required
      />

      {state?.error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="white" loading={pending}>
        {pending ? "Connexion en cours…" : "Se connecter"}
      </Button>

      <p className="text-center text-sm text-zinc-400">
        Pas encore de compte ?{" "}
        <Link
          href="/signup"
          className="font-medium text-zinc-50 transition-colors duration-300 hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
