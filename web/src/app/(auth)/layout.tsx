import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-slate-50 px-4 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy">
          <span className="h-2 w-2 rounded-full bg-white" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          FinLens
        </span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {children}
      </div>
      <p className="mt-8 max-w-sm text-center text-xs leading-relaxed text-slate-400">
        Vos documents restent confidentiels : chiffrés, cloisonnés par espace
        de travail, jamais réutilisés.
      </p>
    </div>
  );
}
