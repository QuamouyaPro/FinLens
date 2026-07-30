"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { AuthState } from "@/app/(auth)/actions";

type Mode = "connexion" | "inscription";

type Props = {
  mode: Mode;
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  messageInitial?: string;
};

export function AuthForm({ mode, action, messageInitial }: Props) {
  const [state, formAction, enCours] = useActionState<AuthState, FormData>(action, {
    erreur: messageInitial,
  });

  const estInscription = mode === "inscription";

  return (
    <form className="auth__form" action={formAction}>
      <h2>{estInscription ? "Créer votre espace" : "Se connecter"}</h2>
      <p className="sub">
        {estInscription
          ? "Un espace de travail par entreprise étudiée, prêt en quelques secondes."
          : "Retrouvez vos dossiers, vos notes et votre historique de Copilote."}
      </p>

      {state.erreur ? (
        <p
          role="alert"
          className="badge badge--crit"
          style={{ height: "auto", padding: "10px 13px", marginBottom: 18, display: "block", lineHeight: 1.5 }}
        >
          {state.erreur}
        </p>
      ) : null}

      {state.info ? (
        <p
          role="status"
          className="badge badge--ok"
          style={{ height: "auto", padding: "10px 13px", marginBottom: 18, display: "block", lineHeight: 1.5 }}
        >
          {state.info}
        </p>
      ) : null}

      {estInscription ? (
        <>
          <div className="field">
            <label htmlFor="full_name">Votre nom</label>
            <input id="full_name" name="full_name" className="input" autoComplete="name" placeholder="Camille Rousseau" />
          </div>
          <div className="field">
            <label htmlFor="organization_name">Votre structure</label>
            <input
              id="organization_name"
              name="organization_name"
              className="input"
              autoComplete="organization"
              placeholder="Meridian Capital"
            />
          </div>
        </>
      ) : null}

      <div className="field">
        <label htmlFor="email">Adresse e-mail professionnelle</label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          required
          autoComplete="email"
          placeholder="camille@meridian.fr"
        />
      </div>

      <div className="field">
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          required
          minLength={estInscription ? 8 : undefined}
          autoComplete={estInscription ? "new-password" : "current-password"}
          placeholder={estInscription ? "8 caractères minimum" : "••••••••"}
        />
      </div>

      <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={enCours}>
        {enCours
          ? estInscription
            ? "Création…"
            : "Connexion…"
          : estInscription
            ? "Créer mon espace"
            : "Se connecter"}
      </button>

      <p className="auth__alt">
        {estInscription ? (
          <>
            Vous avez déjà un compte ? <Link href="/connexion">Se connecter</Link>
          </>
        ) : (
          <>
            Pas encore de compte ? <Link href="/inscription">Créer un espace</Link>
          </>
        )}
      </p>
    </form>
  );
}
