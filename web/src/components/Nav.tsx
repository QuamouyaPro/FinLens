"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "#produit", label: "Produit" },
  { href: "#methode", label: "Méthode" },
  { href: "#pour-qui", label: "Pour qui" },
];

const SHOW_LOGIN = process.env.NEXT_PUBLIC_GITHUB_PAGES !== "true";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Îlot de navigation flottant */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center pt-5 pointer-events-none">
        <nav className="pointer-events-auto flex items-center gap-6 rounded-full bg-[#0b0b0b]/70 backdrop-blur-xl ring-1 ring-white/10 pl-5 pr-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
          <a href="#" className="flex items-center gap-2.5">
            <LensMark />
            <span className="text-[15px] font-medium tracking-tight text-white">
              FinLens
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/55 hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              >
                {l.label}
              </a>
            ))}
          </div>

          {SHOW_LOGIN && (
            <Link
              href="/login"
              className="hidden md:inline text-sm text-white/55 hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              Se connecter
            </Link>
          )}

          <a
            href="#acces"
            className="hidden md:flex items-center gap-2 rounded-full bg-white text-black text-sm font-medium pl-4 pr-1.5 py-1.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] group"
          >
            Demander un accès
            <span className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </a>

          {/* Hamburger → X (mobile) */}
          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen(!open)}
            className="md:hidden relative w-9 h-9 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center"
          >
            <span
              className={`absolute h-px w-4 bg-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                open ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`absolute h-px w-4 bg-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                open ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Overlay plein écran (mobile) */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-black/85 backdrop-blur-3xl transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-start justify-center min-h-[100dvh] px-8 gap-7">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
              className={`text-4xl font-medium tracking-tight text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              {l.label}
            </a>
          ))}
          {SHOW_LOGIN && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? "260ms" : "0ms" }}
              className={`text-2xl font-medium tracking-tight text-white/60 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              Se connecter
            </Link>
          )}
          <a
            href="#acces"
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? "320ms" : "0ms" }}
            className={`mt-4 flex items-center gap-3 rounded-full bg-white text-black font-medium pl-6 pr-2 py-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
          >
            Demander un accès
            <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </a>
        </div>
      </div>
    </>
  );
}

function LensMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.5" stroke="#6ee7b7" strokeWidth="1" />
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1" />
      <path d="M12 2.5v5M21.5 12h-5" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path
        d="M4.5 11.5l7-7M5.5 4.5h6v6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
