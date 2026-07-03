export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-8 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-lg font-semibold tracking-tight text-navy-dark">
          FinLens
        </span>
      </div>
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        {children}
      </div>
    </div>
  );
}
