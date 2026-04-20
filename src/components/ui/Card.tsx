import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/70 bg-[var(--card)] shadow-[0_24px_80px_-48px_rgba(197,23,63,0.24)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
