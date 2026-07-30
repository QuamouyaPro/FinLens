import Link from "next/link";
import { IconSprite } from "@/components/ui/icon-sprite";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Écrans d'entrée : panneau latéral « ink » (sombre dans les deux thèmes,
 * signature de marque) + formulaire sur fond thémé.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IconSprite />
      <div className="auth">
        <aside className="auth__aside noise">
          <Link href="/">
            <Logo lensColor="var(--ink-accent)" />
          </Link>

          <div>
            <p className="auth__quote">
              300 pages lues, <em>chaque chiffre sourcé</em> à la page près.
            </p>
            <div className="k">
              <div>
                <b>3 min</b>
                <span>par rapport annuel</span>
              </div>
              <div>
                <b>0</b>
                <span>hallucination</span>
              </div>
              <div>
                <b>UE</b>
                <span>hébergement</span>
              </div>
            </div>
          </div>

          <p className="legal">
            <Icon name="shield" />
            Vos documents n&apos;entraînent aucun modèle public.
          </p>
        </aside>

        <div className="auth__panel">
          <ThemeToggle />
          {children}
        </div>
      </div>
    </>
  );
}
