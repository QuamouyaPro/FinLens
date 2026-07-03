import Link from "next/link";
import { logout } from "@/app/(auth)/actions";

export default function Sidebar({ fullName }: { fullName: string | null }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white px-4 py-6">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-lg font-semibold tracking-tight text-navy-dark">
            FinLens
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            className="rounded-md px-3 py-2 text-sm font-medium text-navy-dark hover:bg-slate-100"
          >
            Mes espaces de travail
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4">
        <span className="truncate px-2 text-sm text-slate-500">
          {fullName ?? "Mon compte"}
        </span>
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-navy-dark"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
