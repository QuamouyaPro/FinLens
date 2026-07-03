import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
};

export default function Textarea({
  label,
  hint,
  id,
  className = "",
  ...props
}: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-900">
        {label}
      </label>
      <textarea
        id={id}
        className={`min-h-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition-all duration-200 ease-in-out focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
