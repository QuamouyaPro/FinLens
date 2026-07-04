import type { InputHTMLAttributes } from "react";

type Tone = "light" | "dark";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  /** "light" pour le dashboard (fond clair), "dark" pour l'auth et les surfaces zinc-950. */
  tone?: Tone;
};

const LABEL: Record<Tone, string> = {
  light: "text-sm font-medium text-slate-900",
  dark: "text-sm font-medium text-zinc-300",
};

const FIELD: Record<Tone, string> = {
  light:
    "border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:bg-slate-50 disabled:text-slate-400",
  dark: "border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 disabled:bg-zinc-900/50 disabled:text-zinc-600",
};

const HINT: Record<Tone, string> = {
  light: "text-xs text-slate-500",
  dark: "text-xs text-zinc-500",
};

export default function Input({
  label,
  hint,
  id,
  tone = "light",
  className = "",
  ...props
}: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={LABEL[tone]}>
        {label}
      </label>
      <input
        id={id}
        className={`h-10 rounded-lg border px-3 py-2 text-sm outline-none transition-all duration-300 ease-in-out disabled:cursor-not-allowed ${FIELD[tone]} ${className}`}
        {...props}
      />
      {hint && <p className={HINT[tone]}>{hint}</p>}
    </div>
  );
}
