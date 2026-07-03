"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, LogOut, Plus } from "lucide-react";
import { logout } from "@/app/(auth)/actions";

const NAV = [
  {
    href: "/dashboard",
    label: "Mes espaces de travail",
    icon: FolderOpen,
    // Un espace de travail ouvert reste rattaché à cette entrée de navigation
    isActive: (path: string) =>
      path.startsWith("/dashboard") || path.startsWith("/workspace"),
  },
];

export default function Sidebar({ fullName }: { fullName: string | null }) {
  const pathname = usePathname();
  const initial = (fullName ?? "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <aside className="sticky top-0 flex h-[100dvh] w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white px-4 py-6">
      <div>
        <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            FinLens
          </span>
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = item.isActive(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/workspace/new"
            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-all duration-200 ease-in-out hover:bg-slate-50 hover:text-slate-900"
          >
            <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Nouvel espace
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 px-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
            {initial}
          </span>
          <span className="truncate text-sm font-medium text-slate-700">
            {fullName ?? "Mon compte"}
          </span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-500 transition-all duration-200 ease-in-out hover:bg-slate-50 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
