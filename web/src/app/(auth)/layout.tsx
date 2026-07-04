import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-16">
      {/* Lueurs d'arrière-plan très diffuses — profondeur sans surcharge */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[500px] w-[800px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(99,102,241,0.10),transparent_75%)]" />
        <div className="absolute -bottom-64 -right-40 h-[600px] w-[600px] bg-[radial-gradient(closest-side,rgba(124,58,237,0.06),transparent_75%)]" />
      </div>

      <div className="relative flex w-full max-w-sm flex-col items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <span className="h-2 w-2 rounded-full bg-zinc-950" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-zinc-50">
            FinLens
          </span>
        </Link>
        <p className="mt-2 text-sm text-zinc-400">
          Bienvenue sur votre espace d&apos;analyse
        </p>

        <div className="mt-8 w-full rounded-2xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
          {children}
        </div>

        <p className="mt-8 max-w-sm text-center text-xs leading-relaxed text-zinc-500">
          Vos documents restent confidentiels : chiffrés, cloisonnés par espace
          de travail, jamais réutilisés.
        </p>
      </div>
    </div>
  );
}
