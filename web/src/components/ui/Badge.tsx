import type { HTMLAttributes } from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "pending"
  | "error"
  | "info"
  | "neutral";

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const VARIANTS: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  pending: "bg-slate-100 text-slate-600",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  neutral: "bg-slate-100 text-slate-600",
};

export default function Badge({
  variant = "neutral",
  className = "",
  ...props
}: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
