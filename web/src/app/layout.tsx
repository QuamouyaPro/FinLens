import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./finlens.css";
import "./fonts.css";

/* Les trois rôles typographiques du design system (Note de fonctionnement, 17.2) :
   une serif d'affichage pour les titres, une sans-serif pour l'interface, une
   monospace pour tous les chiffres financiers (alignement tabulaire). */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinLens — Le copilote d'analyse financière des investisseurs",
  description:
    "FinLens ingère vos rapports annuels, due diligences et bilans, en extrait l'essentiel, détecte les contradictions entre documents et répond à vos questions en citant la page exacte.",
};

/* Applique le thème choisi avant le premier paint pour éviter un flash de
   couleurs. Le thème sombre est le défaut du produit. */
const themeScript = `
(function(){try{
  var t=localStorage.getItem("finlens-theme");
  document.documentElement.dataset.theme=(t==="light"||t==="dark")?t:"dark";
}catch(e){document.documentElement.dataset.theme="dark"}})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      data-theme="dark"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
