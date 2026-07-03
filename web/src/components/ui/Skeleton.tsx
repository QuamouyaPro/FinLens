import type { HTMLAttributes } from "react";

/** Bloc grisé qui pulse doucement — à préférer aux pages vides pendant les chargements. */
export default function Skeleton({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`}
      {...props}
    />
  );
}
