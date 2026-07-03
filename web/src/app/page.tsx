import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";

export default function Home() {
  return (
    <div className="grain relative overflow-x-clip bg-[#050505] text-[#f4f4f1]">
      {/* Orbes d’ambiance */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[750px] bg-[radial-gradient(closest-side,rgba(52,211,153,0.13),rgba(52,211,153,0.04)_55%,transparent_75%)]" />
        <div className="absolute top-[38%] -left-64 w-[850px] h-[850px] bg-[radial-gradient(closest-side,rgba(99,102,241,0.08),rgba(99,102,241,0.02)_55%,transparent_75%)]" />
        <div className="absolute bottom-0 -right-64 w-[950px] h-[950px] bg-[radial-gradient(closest-side,rgba(52,211,153,0.07),rgba(52,211,153,0.02)_55%,transparent_75%)]" />
      </div>

      <Nav />

      <main className="relative z-10">
        {/* ——— HERO ——— */}
        <section className="min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full ring-1 ring-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-emerald-200/90">
              <span className="w-1 h-1 rounded-full bg-emerald-300" />
              Plateforme d’intelligence documentaire
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-8 max-w-4xl text-5xl md:text-7xl font-medium tracking-[-0.03em] leading-[1.04]">
              L’analyse financière,
              <br />
              à la vitesse de la{" "}
              <em className="font-serif italic font-normal text-emerald-200">
                décision
              </em>
              .
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg md:text-xl text-white/55 leading-relaxed">
              FinLens ingère vos 10-K, due diligences, bilans et rapports ESG,
              en extrait les données clés et répond à vos questions — chaque
              réponse strictement sourcée sur vos documents.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#acces"
                className={`group flex items-center gap-3 rounded-full bg-white text-black font-medium pl-6 pr-2 py-3 transition-transform duration-500 ${EASE} active:scale-[0.98]`}
              >
                Demander un accès anticipé
                <span
                  className={`w-8 h-8 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-500 ${EASE} group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105`}
                >
                  <Arrow />
                </span>
              </a>
              <a
                href="#methode"
                className={`rounded-full px-6 py-3 text-white/70 ring-1 ring-white/15 hover:text-white hover:ring-white/30 transition-all duration-500 ${EASE}`}
              >
                Découvrir la méthode
              </a>
            </div>
          </Reveal>

          <Reveal delay={450}>
            <p className="mt-16 text-xs uppercase tracking-[0.18em] text-white/30">
              Conçu pour les fonds PE &amp; VC · banques d’affaires · gestion de
              patrimoine · directions financières
            </p>
          </Reveal>
        </section>

        {/* ——— PROMESSES ——— */}
        <section className="px-4 py-24 md:py-32">
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                k: "Des heures → minutes",
                v: "La lecture d’une data room entière ramenée au temps d’un café.",
              },
              {
                k: "100 % sourcé",
                v: "Chaque réponse cite le document et la page dont elle provient.",
              },
              {
                k: "Vos données restent vôtres",
                v: "Cloisonnement strict par espace de travail, aucune réutilisation.",
              },
            ].map((s, i) => (
              <Reveal key={s.k} delay={i * 120}>
                <Shell>
                  <div className="p-8">
                    <p className="text-2xl font-medium tracking-tight text-white">
                      {s.k}
                    </p>
                    <p className="mt-3 text-sm text-white/50 leading-relaxed">
                      {s.v}
                    </p>
                  </div>
                </Shell>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ——— PRODUIT (BENTO) ——— */}
        <section id="produit" className="px-4 py-24 md:py-40 scroll-mt-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHead
                eyebrow="Produit"
                title={
                  <>
                    Une salle de lecture qui{" "}
                    <em className="font-serif italic font-normal text-emerald-200">
                      répond
                    </em>
                  </>
                }
                sub="Importez vos documents, FinLens fait le reste : extraction structurée, synthèse et dialogue sourcé."
              />
            </Reveal>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Assistant conversationnel */}
              <Reveal className="md:col-span-7" delay={0}>
                <Shell className="h-full">
                  <div className="p-8 h-full flex flex-col">
                    <CardHead
                      icon={<ChatIcon />}
                      title="Assistant sourcé"
                      sub="Interrogez vos documents comme un analyste senior."
                    />
                    <div className="mt-8 flex flex-col gap-4 text-sm">
                      <div className="self-end max-w-[85%] rounded-2xl rounded-br-md bg-white/8 ring-1 ring-white/10 px-4 py-3 text-white/80">
                        Quelle est l’évolution de la dette nette sur les trois
                        derniers exercices ?
                      </div>
                      <div className="self-start max-w-[92%] rounded-2xl rounded-bl-md bg-emerald-400/8 ring-1 ring-emerald-300/15 px-4 py-3 text-white/75 leading-relaxed">
                        La dette nette passe de 42,3 M€ (2023) à 31,1 M€
                        (2025), portée par la cession de la filiale logistique
                        et une génération de trésorerie en hausse de 18 %.
                        <div className="mt-3 flex flex-wrap gap-2">
                          <SourceChip>Rapport annuel 2025 · p. 47</SourceChip>
                          <SourceChip>Annexe comptable · p. 12</SourceChip>
                        </div>
                      </div>
                    </div>
                  </div>
                </Shell>
              </Reveal>

              {/* Colonne droite : ingestion + extraction */}
              <div className="md:col-span-5 flex flex-col gap-6">
                <Reveal delay={120}>
                  <Shell>
                    <div className="p-8">
                      <CardHead
                        icon={<InboxIcon />}
                        title="Ingestion massive"
                        sub="Des data rooms entières, tous formats confondus."
                      />
                      <div className="mt-6 flex flex-wrap gap-2">
                        {["10-K", "PDF", "DOCX", "XLSX", "Rapport ESG", "Liasse fiscale"].map(
                          (f) => (
                            <span
                              key={f}
                              className="rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1 text-xs text-white/60"
                            >
                              {f}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </Shell>
                </Reveal>

                <Reveal delay={240}>
                  <Shell>
                    <div className="p-8">
                      <CardHead
                        icon={<PulseIcon />}
                        title="Extraction instantanée"
                        sub="Les métriques clés, structurées à l’import."
                      />
                      <div className="mt-6 space-y-2.5 font-mono text-[13px]">
                        {[
                          ["EBITDA normalisé", "8,4 M€"],
                          ["Dette nette / EBITDA", "1,9×"],
                          ["Variation du BFR", "−2,1 M€"],
                          ["Covenant bancaire", "3,0× max"],
                        ].map(([k, v]) => (
                          <div
                            key={k}
                            className="flex items-center justify-between rounded-lg bg-white/4 ring-1 ring-white/8 px-3.5 py-2"
                          >
                            <span className="text-white/50">{k}</span>
                            <span className="text-emerald-200">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Shell>
                </Reveal>
              </div>

              {/* Rangée 2 */}
              <Reveal className="md:col-span-5" delay={0}>
                <Shell className="h-full">
                  <div className="p-8">
                    <CardHead
                      icon={<FlagIcon />}
                      title="Signaux d’alerte"
                      sub="Les zones de risque remontent d’elles-mêmes."
                    />
                    <div className="mt-6 space-y-2.5 text-sm">
                      {[
                        "Covenant à 94 % du seuil autorisé",
                        "Litige prud’homal non provisionné",
                        "Concentration client : 41 % du CA",
                      ].map((a) => (
                        <div
                          key={a}
                          className="flex items-start gap-2.5 rounded-lg bg-white/4 ring-1 ring-white/8 px-3.5 py-2.5 text-white/65"
                        >
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-300 shrink-0" />
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                </Shell>
              </Reveal>

              <Reveal className="md:col-span-7" delay={120}>
                <Shell className="h-full">
                  <div className="p-8 h-full flex flex-col justify-between gap-8">
                    <CardHead
                      icon={<ShieldIcon />}
                      title="Confidentialité de niveau institutionnel"
                      sub="Vos documents sont votre avantage compétitif. Ils le restent."
                    />
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/55">
                      {[
                        "Chiffrement en transit et au repos",
                        "Cloisonnement par espace de travail",
                        "Aucune réutilisation pour l’entraînement",
                      ].map((p) => (
                        <li
                          key={p}
                          className="rounded-xl bg-white/4 ring-1 ring-white/8 px-4 py-3 leading-snug"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Shell>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ——— MÉTHODE ——— */}
        <section id="methode" className="px-4 py-24 md:py-40 scroll-mt-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHead
                eyebrow="Méthode"
                title={
                  <>
                    Trois gestes,{" "}
                    <em className="font-serif italic font-normal text-emerald-200">
                      zéro friction
                    </em>
                  </>
                }
                sub="Le flux de travail d’un analyste, compressé à l’essentiel."
              />
            </Reveal>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  n: "01",
                  t: "Importez",
                  d: "Glissez votre data room : rapports annuels, liasses, contrats, ESG. FinLens absorbe tout.",
                },
                {
                  n: "02",
                  t: "FinLens analyse",
                  d: "Extraction structurée des métriques, synthèses par document et cartographie des risques.",
                },
                {
                  n: "03",
                  t: "Interrogez",
                  d: "Posez vos questions en langage naturel. Chaque réponse cite sa source, page par page.",
                },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 120}>
                  <Shell className="h-full">
                    <div className="p-8 h-full">
                      <span className="font-mono text-xs text-emerald-200/70">
                        {s.n}
                      </span>
                      <h3 className="mt-4 text-xl font-medium tracking-tight text-white">
                        {s.t}
                      </h3>
                      <p className="mt-3 text-sm text-white/50 leading-relaxed">
                        {s.d}
                      </p>
                    </div>
                  </Shell>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ——— POUR QUI ——— */}
        <section id="pour-qui" className="px-4 py-24 md:py-40 scroll-mt-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHead
                eyebrow="Pour qui"
                title={
                  <>
                    Pensé pour ceux qui{" "}
                    <em className="font-serif italic font-normal text-emerald-200">
                      décident
                    </em>
                  </>
                }
                sub="Chaque profil investit le temps gagné là où il crée le plus de valeur."
              />
            </Reveal>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                ["Private Equity", "Due diligence exhaustive sans rallonger le calendrier du deal."],
                ["Venture Capital", "Des dizaines de decks et data rooms passés au crible chaque semaine."],
                ["Banques d’affaires", "Mémorandums et comparables préparés sur une base documentaire fiable."],
                ["Gestion de patrimoine", "Analyse rapide des supports et rapports pour conseiller en confiance."],
                ["Analystes indépendants", "La puissance d’une équipe de recherche, en solo."],
                ["Directions financières", "Veille des covenants, audits et reportings sans mobiliser l’équipe."],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={(i % 3) * 120}>
                  <Shell className="h-full">
                    <div className="p-7 h-full">
                      <h3 className="text-base font-medium tracking-tight text-white">
                        {t}
                      </h3>
                      <p className="mt-2.5 text-sm text-white/50 leading-relaxed">
                        {d}
                      </p>
                    </div>
                  </Shell>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ——— CTA FINAL ——— */}
        <section id="acces" className="px-4 py-24 md:py-40 scroll-mt-24">
          <Reveal>
            <div className="mx-auto max-w-4xl">
              <Shell>
                <div className="relative overflow-hidden px-8 py-16 md:px-16 md:py-24 text-center">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_-10%,rgba(52,211,153,0.12),transparent)]"
                  />
                  <div className="relative">
                    <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] leading-[1.08]">
                      Prêt à analyser plus vite
                      <br />
                      que le{" "}
                      <em className="font-serif italic font-normal text-emerald-200">
                        marché
                      </em>{" "}
                      ?
                    </h2>
                    <p className="mt-6 text-white/50 max-w-xl mx-auto">
                      FinLens est en construction. Rejoignez la liste d’accès
                      anticipé et soyez parmi les premiers à l’essayer.
                    </p>
                    <a
                      href="mailto:tjcamouya@gmail.com?subject=Acc%C3%A8s%20anticip%C3%A9%20FinLens"
                      className={`group mt-10 inline-flex items-center gap-3 rounded-full bg-white text-black font-medium pl-6 pr-2 py-3 transition-transform duration-500 ${EASE} active:scale-[0.98]`}
                    >
                      Rejoindre la liste d’attente
                      <span
                        className={`w-8 h-8 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-500 ${EASE} group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105`}
                      >
                        <Arrow />
                      </span>
                    </a>
                  </div>
                </div>
              </Shell>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="relative z-10 px-4 pb-12">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/8 pt-8 text-xs text-white/35">
          <span>© 2026 FinLens — L’intelligence documentaire pour l’investissement.</span>
          <div className="flex gap-6">
            <a href="#produit" className="hover:text-white/70 transition-colors duration-500">
              Produit
            </a>
            <a href="#methode" className="hover:text-white/70 transition-colors duration-500">
              Méthode
            </a>
            <a href="#acces" className="hover:text-white/70 transition-colors duration-500">
              Accès anticipé
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ——— Briques ——— */

function Shell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] bg-white/5 ring-1 ring-white/10 p-1.5 ${className}`}
    >
      <div className="h-full rounded-[calc(2rem-0.375rem)] bg-[#0a0a0a] ring-1 ring-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
        {children}
      </div>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="inline-flex rounded-full ring-1 ring-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-emerald-200/90">
        {eyebrow}
      </span>
      <h2 className="mt-6 text-3xl md:text-5xl font-medium tracking-[-0.03em] leading-[1.1]">
        {title}
      </h2>
      <p className="mt-5 text-white/50 leading-relaxed">{sub}</p>
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
      <span className="w-10 h-10 shrink-0 rounded-xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-emerald-200">
        {icon}
      </span>
      <div>
        <h3 className="text-lg font-medium tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-white/45">{sub}</p>
      </div>
    </div>
  );
}

function SourceChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 ring-1 ring-emerald-300/20 px-2.5 py-1 text-[11px] text-emerald-200/80">
      <DocIcon />
      {children}
    </span>
  );
}

/* ——— Icônes (traits ultra-fins) ——— */

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" aria-hidden>
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

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
      <path
        d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v7a2.5 2.5 0 01-2.5 2.5H9l-4 4v-4A2.5 2.5 0 014 13.5v-7z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
      <path
        d="M4 13l2.2-6.6A2 2 0 018.1 5h7.8a2 2 0 011.9 1.4L20 13v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M4 13h4.5a1.5 1.5 0 011.5 1.5 1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5 1.5 1.5 0 011.5-1.5H20" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
      <path
        d="M3 12h4l2.5-6 4 12 2.5-6h5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
      <path
        d="M6 21V4m0 1h11.5L15 9l2.5 4H6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
      <path
        d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M9.5 12l1.8 1.8 3.2-3.6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" aria-hidden>
      <path
        d="M4 2.5h5L12 5.5v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-10a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M9 2.5v3h3" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}
