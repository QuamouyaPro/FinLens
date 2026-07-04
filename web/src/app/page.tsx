import Link from "next/link";
import {
  ArrowRight,
  FileStack,
  Gauge,
  MessageSquareText,
  Play,
  ShieldCheck,
} from "lucide-react";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

// Le build GitHub Pages ne publie que cette page : pas de route /signup.
const IS_PAGES = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

const PARTNERS = [
  "Arcadia Capital",
  "Meridian Partners",
  "Helios Invest",
  "Vertex & Cie",
  "Osmond AM",
];

export default function Home() {
  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-zinc-950 text-zinc-50">
      <Nav />

      <main>
        {/* ——— HERO ——— */}
        <section className="relative overflow-hidden px-4 pb-28 pt-40 text-center md:pb-36 md:pt-48">
          {/* Grille discrète + lueurs froides très diffuses */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_50%,transparent_100%)]" />
            <div className="absolute -top-40 left-1/2 h-[550px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(99,102,241,0.12),transparent_75%)]" />
            <div className="absolute right-[-200px] top-1/3 h-[500px] w-[500px] bg-[radial-gradient(closest-side,rgba(124,58,237,0.07),transparent_75%)]" />
          </div>

          <div className="relative mx-auto max-w-4xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
                <span className="h-1 w-1 rounded-full bg-indigo-400" />
                Plateforme d&apos;intelligence documentaire
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mt-8 text-5xl font-semibold leading-[1.06] tracking-tight text-zinc-50 md:text-7xl">
                L&apos;analyse financière,
                <br />à la vitesse de la{" "}
                <span className="bg-gradient-to-r from-zinc-50 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                  décision
                </span>
                .
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400">
                FinLens ingère vos 10-K, due diligences, bilans et rapports
                ESG, en extrait les données clés et répond à vos questions —
                chaque réponse strictement sourcée sur vos documents.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {IS_PAGES ? (
                  <a
                    href="#cta"
                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-6 text-sm font-medium text-zinc-950 transition-all duration-300 ease-in-out hover:bg-zinc-200 active:scale-95"
                  >
                    Commencer l&apos;analyse gratuite
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </a>
                ) : (
                  <Link
                    href="/signup"
                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-6 text-sm font-medium text-zinc-950 transition-all duration-300 ease-in-out hover:bg-zinc-200 active:scale-95"
                  >
                    Commencer l&apos;analyse gratuite
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                )}
                <a
                  href="#fonctionnalites"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 px-6 text-sm font-medium text-zinc-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:text-zinc-50"
                >
                  <Play className="h-4 w-4" strokeWidth={1.75} />
                  Voir la démo
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ——— SOCIAL PROOF ——— */}
        <section className="px-4 pb-24">
          <Reveal>
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                Recommandé par les analystes de :
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                {PARTNERS.map((name) => (
                  <span
                    key={name}
                    className="text-base font-semibold tracking-tight text-zinc-700 transition-colors duration-300 ease-in-out hover:text-zinc-500"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ——— FONCTIONNALITÉS (BENTO GRID) ——— */}
        <section id="fonctionnalites" className="scroll-mt-24 px-4 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
                  Une salle de lecture qui{" "}
                  <span className="bg-gradient-to-r from-zinc-50 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                    répond
                  </span>
                </h2>
                <p className="mt-5 text-zinc-400">
                  Importez vos documents, FinLens fait le reste : extraction
                  structurée, synthèse et dialogue sourcé.
                </p>
              </div>
            </Reveal>

            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Analyse instantanée — grande carte */}
              <Reveal className="md:col-span-2">
                <div className="h-full rounded-2xl border border-white/5 bg-zinc-900/50 p-8 transition-colors duration-300 ease-in-out hover:bg-zinc-900">
                  <CardHead
                    icon={<Gauge className="h-5 w-5" strokeWidth={1.5} />}
                    title="Analyse instantanée"
                    sub="Les métriques clés extraites et structurées à l'import — ce qui prenait trois jours de lecture est prêt en trois minutes."
                  />
                  <div className="mt-8 grid grid-cols-1 gap-2.5 font-mono text-[13px] sm:grid-cols-2">
                    {[
                      ["EBITDA normalisé", "8,4 M€"],
                      ["Dette nette / EBITDA", "1,9×"],
                      ["Variation du BFR", "−2,1 M€"],
                      ["Covenant bancaire", "3,0× max"],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between rounded-lg border border-white/5 bg-zinc-950/60 px-3.5 py-2.5"
                      >
                        <span className="text-zinc-500">{k}</span>
                        <span className="text-zinc-50">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Chat RAG — carte haute */}
              <Reveal delay={100} className="md:row-span-2">
                <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-zinc-900/50 p-8 transition-colors duration-300 ease-in-out hover:bg-zinc-900">
                  <CardHead
                    icon={
                      <MessageSquareText
                        className="h-5 w-5"
                        strokeWidth={1.5}
                      />
                    }
                    title="Chat RAG sourcé"
                    sub="Interrogez vos documents comme un analyste senior."
                  />
                  <div className="mt-8 flex flex-1 flex-col gap-3 text-sm">
                    <div className="self-end rounded-xl rounded-br-sm border border-white/10 bg-white/5 px-4 py-3 text-zinc-200">
                      Quelle est l&apos;évolution de la dette nette sur les
                      trois derniers exercices ?
                    </div>
                    <div className="self-start rounded-xl rounded-bl-sm border border-white/5 bg-zinc-950/60 px-4 py-3 leading-relaxed text-zinc-300">
                      La dette nette passe de 42,3 M€ (2023) à 31,1 M€ (2025),
                      portée par la cession de la filiale logistique.
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["Rapport annuel 2025 · p. 47", "Annexe · p. 12"].map(
                          (s) => (
                            <span
                              key={s}
                              className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2.5 py-1 text-[11px] text-indigo-300"
                            >
                              {s}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <p className="mt-auto pt-4 text-xs text-zinc-500">
                      Zéro hallucination : chaque réponse cite le document et
                      la page dont elle provient.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Ingestion massive */}
              <Reveal delay={150}>
                <div className="h-full rounded-2xl border border-white/5 bg-zinc-900/50 p-8 transition-colors duration-300 ease-in-out hover:bg-zinc-900">
                  <CardHead
                    icon={<FileStack className="h-5 w-5" strokeWidth={1.5} />}
                    title="Ingestion massive"
                    sub="Des data rooms entières, tous formats confondus."
                  />
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["10-K", "PDF", "DOCX", "XLSX", "Rapport ESG", "Liasse fiscale"].map(
                      (f) => (
                        <span
                          key={f}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400"
                        >
                          {f}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </Reveal>

              {/* Sécurité */}
              <Reveal delay={200}>
                <div
                  id="securite"
                  className="h-full scroll-mt-24 rounded-2xl border border-white/5 bg-zinc-900/50 p-8 transition-colors duration-300 ease-in-out hover:bg-zinc-900"
                >
                  <CardHead
                    icon={<ShieldCheck className="h-5 w-5" strokeWidth={1.5} />}
                    title="Sécurité institutionnelle"
                    sub="Vos documents sont votre avantage compétitif. Ils le restent."
                  />
                  <ul className="mt-6 space-y-2.5 text-sm text-zinc-400">
                    {[
                      "Chiffrement en transit et au repos",
                      "Cloisonnement par espace de travail",
                      "Aucune réutilisation pour l'entraînement",
                    ].map((p) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ——— CTA FINAL ——— */}
        <section id="cta" className="scroll-mt-24 px-4 py-24 md:py-32">
          <Reveal>
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 px-8 py-16 text-center md:px-16 md:py-24">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_-10%,rgba(99,102,241,0.12),transparent)]"
              />
              <div className="relative">
                <h2 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-50 md:text-5xl">
                  Prêt à analyser plus vite
                  <br />
                  que le marché ?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-zinc-400">
                  FinLens est en construction. Rejoignez la liste d&apos;accès
                  anticipé et soyez parmi les premiers à l&apos;essayer.
                </p>
                <a
                  href="mailto:tjcamouya@gmail.com?subject=Acc%C3%A8s%20anticip%C3%A9%20FinLens"
                  className="mt-10 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-6 text-sm font-medium text-zinc-950 transition-all duration-300 ease-in-out hover:bg-zinc-200 active:scale-95"
                >
                  Rejoindre la liste d&apos;attente
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ——— FOOTER ——— */}
      <footer className="border-t border-white/5 px-4 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10">
              <span className="h-1 w-1 rounded-full bg-zinc-400" />
            </span>
            <span className="text-xs text-zinc-500">
              © 2026 FinLens — L&apos;intelligence documentaire pour
              l&apos;investissement.
            </span>
          </div>
          <div className="flex gap-6 text-xs text-zinc-500">
            <a
              href="#"
              className="transition-colors duration-300 ease-in-out hover:text-zinc-300"
            >
              Mentions légales
            </a>
            <a
              href="#"
              className="transition-colors duration-300 ease-in-out hover:text-zinc-300"
            >
              Confidentialité
            </a>
            <a
              href="#cta"
              className="transition-colors duration-300 ease-in-out hover:text-zinc-300"
            >
              Accès anticipé
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CardHead({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300">
        {icon}
      </span>
      <div>
        <h3 className="font-semibold tracking-tight text-zinc-50">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{sub}</p>
      </div>
    </div>
  );
}
