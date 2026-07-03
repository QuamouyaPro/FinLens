import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Élève la carte au survol (pour les cartes cliquables). */
  interactive?: boolean;
  /** Retire le padding interne par défaut (p-6). */
  flush?: boolean;
};

export default function Card({
  interactive = false,
  flush = false,
  className = "",
  ...props
}: Props) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${
        flush ? "" : "p-6"
      } ${
        interactive
          ? "transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
          : ""
      } ${className}`}
      {...props}
    />
  );
}
