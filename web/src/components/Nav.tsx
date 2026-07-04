"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#securite", label: "Sécurité" },
  { href: "#cta", label: "Accès anticipé" },
];

// Le build GitHub Pages ne publie que la landing : pas de routes /login ni /signup.
const IS_PAGES = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

function StartCta({ className = "" }: { className?: string }) {
  const style = `inline-flex h-9 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-zinc-950 transition-all duration-300 ease-in-out hover:bg-zinc-200 active:scale-95 ${className}`;
  return IS_PAGES ? (
    <a href="#cta" className={style}>
      Démarrer
    </a>
  ) : (
    <Link href="/signup" className={style}>
      Démarrer
    </Link>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-50">
              FinLens
            </span>
          </a>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-zinc-400 transition-colors duration-300 ease-in-out hover:text-zinc-50"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-5 md:flex">
            {!IS_PAGES && (
              <Link
                href="/login"
                className="text-sm text-zinc-400 transition-colors duration-300 ease-in-out hover:text-zinc-50"
              >
                Connexion
              </Link>
            )}
            <StartCta />
          </div>

          {/* Menu mobile */}
          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 md:hidden"
          >
            {open ? (
              <X className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        </nav>
      </header>

      {/* Overlay mobile plein écran */}
      <div
        className={`fixed inset-0 z-40 bg-zinc-950/90 backdrop-blur-xl transition-opacity duration-300 ease-in-out md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex min-h-[100dvh] flex-col items-start justify-center gap-7 px-8">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${100 + i * 50}ms` : "0ms" }}
              className={`text-3xl font-semibold tracking-tight text-zinc-50 transition-all duration-300 ease-in-out ${
                open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {l.label}
            </a>
          ))}

          {!IS_PAGES && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? "250ms" : "0ms" }}
              className={`text-xl font-medium text-zinc-400 transition-all duration-300 ease-in-out ${
                open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              Connexion
            </Link>
          )}

          <div
            style={{ transitionDelay: open ? "300ms" : "0ms" }}
            className={`mt-2 transition-all duration-300 ease-in-out ${
              open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <StartCta className="h-11 px-6" />
          </div>
        </div>
      </div>
    </>
  );
}
