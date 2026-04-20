import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/60 bg-[var(--card)] shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
