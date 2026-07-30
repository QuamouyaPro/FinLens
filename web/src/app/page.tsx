import Link from "next/link";
import { IconSprite } from "@/components/ui/icon-sprite";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { TopbarPublique } from "@/components/landing/topbar-publique";
import { AncreDouce } from "@/components/ui/anchor-link";
import { DemoCopilote } from "@/components/landing/demo-copilote";
import { CalculateurRoi } from "@/components/landing/calculateur-roi";
import { Tarifs } from "@/components/landing/tarifs";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { getOptionalSession } from "@/lib/session";

const MODULES = [
  {
    num: "01",
    icon: "doc" as const,
    titre: "Data Room intelligente",
    texte:
      "PDF, Excel, Word — jusqu'à 50 fichiers par dossier, volume de pages illimité. Indexation instantanée, détection des doublons et des documents manquants.",
  },
  {
    num: "02",
    icon: "list" as const,
    titre: "Synthèse adaptée à votre métier",
    texte:
      "La même extraction relue sous six angles : PE/VC, M&A, family office, CFO, audit, généraliste. Changer de profil est instantané, sans nouvelle analyse.",
  },
  {
    num: "03",
    icon: "lens" as const,
    titre: "Copilote sourcé",
    texte:
      "Questions illimitées. Chaque réponse cite la page exacte, cliquable vers le passage du document d'origine. Épinglez une réponse pour l'ajouter à votre note.",
  },
  {
    num: "04",
    icon: "split" as const,
    titre: "Détection de contradictions",
    texte:
      "Le teaser annonce 14 M€ de CA, l'annexe du bilan en montre 12,8 M€. FinLens croise vos documents et met les deux passages côte à côte.",
  },
  {
    num: "05",
    icon: "tbl" as const,
    titre: "Comparateur de dossiers",
    texte:
      "Confrontez plusieurs entreprises ou périodes ligne par ligne, sur les indicateurs qui comptent, chaque cellule reliée à sa source.",
  },
  {
    num: "06",
    icon: "dl" as const,
    titre: "Note d'investissement",
    texte:
      "Mémo prêt pour le comité — PDF ou Word, avec vos ajouts épinglés classés par catégorie et les sources conservées.",
  },
];

const ETAPES = [
  { n: "1", titre: "Créez l'espace", texte: "Un dossier par entreprise étudiée. Déposez tous les documents pertinents." },
  { n: "2", titre: "Recevez la synthèse", texte: "Extraction complète, score de risque et contradictions dès l'indexation." },
  { n: "3", titre: "Interrogez", texte: "Le Copilote répond en illimité, chaque affirmation renvoie à sa page source." },
  { n: "4", titre: "Exportez", texte: "La note part en comité, au format de votre fonds, sans ressaisie." },
];

export default async function LandingPage() {
  const user = await getOptionalSession();
  const connecte = Boolean(user);

  return (
    <>
      <IconSprite />
      <noscript>
        <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <ScrollReveal />
      <TopbarPublique connecte={connecte} />

      <section className="hero noise">
        <div className="wrap hero__grid">
          <div>
            <span className="hero__pill">
              <span className="dot" />
              Réponses sourcées à la page près
            </span>
            <h1>
              Lisez 300 pages
              <br />
              en 3 minutes.
              <br />
              <em>Sans perdre la source.</em>
            </h1>
            <p className="lead">
              FinLens ingère vos rapports annuels, due diligences et bilans, en extrait l&apos;essentiel,
              détecte les contradictions entre documents et répond à vos questions en citant la page
              exacte.
            </p>
            <div className="hero__cta">
              <Link href={connecte ? "/dossiers?nouveau=1" : "/inscription"} className="btn btn--ink btn--lg">
                Analyser un premier dossier
              </Link>
              <Link href="/demo/tableau-de-bord" className="btn btn--outline-ink btn--lg">
                Explorer la plateforme →
              </Link>
            </div>
            <div className="hero__facts">
              <div>
                <b>3 min</b>
                <span>pour un rapport de 300 p.</span>
              </div>
              <div>
                <b>0</b>
                <span>hallucination — 100 % sourcé</span>
              </div>
              <div>
                <b>UE</b>
                <span>données hébergées en Europe</span>
              </div>
            </div>
          </div>

          <div className="hero__stage">
            <span className="hero__float hero__float--a" aria-hidden="true">
              p.148
            </span>
            <span className="hero__float hero__float--b" aria-hidden="true">
              p.62
            </span>
            <span className="hero__float hero__float--c" aria-hidden="true">
              p.171
            </span>
            <DemoCopilote />
          </div>
        </div>
      </section>

      <div className="targets">
        <div className="wrap targets__in">
          <b>Conçu pour</b>
          <span>Private Equity</span>
          <span>Venture Capital</span>
          <span>M&amp;A / Banques d&apos;affaires</span>
          <span>Family Offices</span>
          <span>Direction financière</span>
          <span>Audit &amp; conseil</span>
        </div>
      </div>

      <div className="wrap">
        <section className="section" id="produit">
          <span className="eyebrow">La plateforme</span>
          <h2>Six modules, un seul flux de travail</h2>
          <p className="sub">
            Pensé pour le vocabulaire, les formats et les livrables d&apos;un professionnel de
            l&apos;investissement — pas pour un chatbot généraliste.
          </p>
          <div className="grid-3">
            {MODULES.map((module, i) => (
              <div
                className="card feat reveal"
                key={module.num}
                style={{ "--reveal-delay": `${i * 0.07}s` } as React.CSSProperties}
              >
                <span className="num">{module.num}</span>
                <h3>
                  <Icon name={module.icon} className="feat__icon" />
                  {module.titre}
                </h3>
                <p>{module.texte}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 16 }}>
          <span className="eyebrow">En pratique</span>
          <h2>Du PDF au mémo, en quatre temps</h2>
          <div className="grid-4">
            {ETAPES.map((etape, i) => (
              <div
                className="step reveal"
                key={etape.n}
                style={{ "--reveal-delay": `${i * 0.07}s` } as React.CSSProperties}
              >
                <div className="n">{etape.n}</div>
                <h3>{etape.titre}</h3>
                <p>{etape.texte}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="comparatif">
          <span className="eyebrow">Pourquoi FinLens</span>
          <h2>Face aux trois alternatives réelles</h2>
          <p className="sub">
            La question n&apos;est pas « IA ou pas », mais qui lit le document — et si vous pouvez vérifier
            ce qu&apos;on vous en dit.
          </p>
          <div className="vstable reveal">
            <table>
              <thead>
                <tr>
                  <th scope="col">Critère</th>
                  <th scope="col" className="is-us">
                    FinLens
                  </th>
                  <th scope="col">IA généraliste</th>
                  <th scope="col">Analyste junior</th>
                  <th scope="col">Lecture manuelle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Délai par dossier</td>
                  <td className="is-us">3 minutes</td>
                  <td>Quelques minutes</td>
                  <td>2 à 3 jours</td>
                  <td>2 à 3 jours</td>
                </tr>
                <tr>
                  <td>Citation de la page exacte</td>
                  <td className="is-us">
                    <span className="yes">
                      <Icon name="check" />
                      Systématique
                    </span>
                  </td>
                  <td>
                    <span className="no">
                      <Icon name="cross" />
                      Non fiable
                    </span>
                  </td>
                  <td>
                    <span className="partial">Sur demande</span>
                  </td>
                  <td>
                    <span className="yes">
                      <Icon name="check" />
                      Oui
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Risque d&apos;information inventée</td>
                  <td className="is-us">
                    <span className="yes">
                      <Icon name="check" />
                      Nul — RAG contraint
                    </span>
                  </td>
                  <td>
                    <span className="no">
                      <Icon name="cross" />
                      Réel
                    </span>
                  </td>
                  <td>
                    <span className="partial">Erreur humaine</span>
                  </td>
                  <td>
                    <span className="partial">Erreur humaine</span>
                  </td>
                </tr>
                <tr>
                  <td>Contradictions entre documents</td>
                  <td className="is-us">
                    <span className="yes">
                      <Icon name="check" />
                      Détectées
                    </span>
                  </td>
                  <td>
                    <span className="no">
                      <Icon name="cross" />
                      Non
                    </span>
                  </td>
                  <td>
                    <span className="partial">Si le temps le permet</span>
                  </td>
                  <td>
                    <span className="partial">Si le temps le permet</span>
                  </td>
                </tr>
                <tr>
                  <td>Confidentialité des documents</td>
                  <td className="is-us">
                    <span className="yes">
                      <Icon name="check" />
                      Isolés, hébergés en UE
                    </span>
                  </td>
                  <td>
                    <span className="no">
                      <Icon name="cross" />
                      Incertaine
                    </span>
                  </td>
                  <td>
                    <span className="yes">
                      <Icon name="check" />
                      Oui
                    </span>
                  </td>
                  <td>
                    <span className="yes">
                      <Icon name="check" />
                      Oui
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Coût par dossier</td>
                  <td className="is-us">Quelques euros</td>
                  <td>Faible</td>
                  <td>800 à 1 500 €</td>
                  <td>Votre temps</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" id="roi">
          <span className="eyebrow">Retour sur investissement</span>
          <h2>Combien FinLens vous fait économiser</h2>
          <p className="sub">
            Déplacez les curseurs selon votre réalité. Le calcul compare le temps d&apos;analyse humaine
            actuel au coût de l&apos;abonnement.
          </p>
          <CalculateurRoi />
        </section>

        <section className="section" id="fiabilite">
          <span className="eyebrow">Fiabilité &amp; confidentialité</span>
          <h2>Ce qui rend une réponse vérifiable</h2>
          <p className="sub">
            Un analyste ne peut pas défendre en comité un chiffre qu&apos;il n&apos;a pas pu vérifier.
            C&apos;est la contrainte qui a dicté l&apos;architecture.
          </p>
          <div className="trust">
            <div className="t reveal">
              <div>
                <b>
                  <Icon name="lens" className="trust__icon" />
                  Le moteur ne répond que sur vos documents
                </b>
                <p>
                  L&apos;architecture RAG contraint chaque réponse aux passages indexés. Quand
                  l&apos;information n&apos;y figure pas, le produit l&apos;indique au lieu de la deviner.
                </p>
              </div>
            </div>
            <div className="t reveal" style={{ "--reveal-delay": "0.07s" } as React.CSSProperties}>
              <div>
                <b>
                  <Icon name="shield" className="trust__icon" />
                  Vos documents n&apos;entraînent aucun modèle
                </b>
                <p>
                  Documents isolés par organisation, hébergés en Union européenne, jamais utilisés pour
                  entraîner un modèle public.
                </p>
              </div>
            </div>
            <div className="t reveal" style={{ "--reveal-delay": "0.14s" } as React.CSSProperties}>
              <div>
                <b>
                  <Icon name="trash" className="trust__icon" />
                  Suppression réelle, pas un simple masquage
                </b>
                <p>
                  Un dossier supprimé passe en corbeille 30 jours, puis est purgé de la base et de
                  l&apos;index. La suppression de compte est en self-service.
                </p>
              </div>
            </div>
          </div>
          <div className="compliance">
            <span>
              <Icon name="check" />
              Hébergement UE (Francfort)
            </span>
            <span>
              <Icon name="check" />
              Chiffrement en transit et au repos
            </span>
            <span>
              <Icon name="check" />
              Cloisonnement par organisation
            </span>
            <span>
              <Icon name="check" />
              Droit à l&apos;effacement en self-service
            </span>
          </div>
        </section>

        <section className="section" id="tarifs">
          <Tarifs />
        </section>

        <div className="cta-band noise">
          <h2>Le prochain dossier peut être lu ce soir.</h2>
          <p>Créez un espace, déposez un rapport, posez votre première question.</p>
          <Link href={connecte ? "/dossiers?nouveau=1" : "/inscription"} className="btn btn--ink btn--lg">
            Analyser un premier dossier
          </Link>
        </div>
      </div>

      <footer className="footer">
        <div className="wrap footer__in">
          <Logo size={15} />
          <nav>
            <AncreDouce cible="produit">Produit</AncreDouce>
            <AncreDouce cible="tarifs">Tarifs</AncreDouce>
            <AncreDouce cible="fiabilite">Sécurité</AncreDouce>
            <Link href="/connexion">Se connecter</Link>
          </nav>
          <span>© {new Date().getFullYear()} FinLens — Hébergé en Union européenne</span>
        </div>
      </footer>
    </>
  );
}
