import type { ReactNode } from "react";

export function SectionLabel({ number, children, tone = "dark" }: { number?: string; children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p className={`flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.25em] ${tone === "dark" ? "text-brasa" : "text-brasa-escura"}`}>
      <span aria-hidden className="h-px w-8 bg-current" />
      {number ? `Nº ${number} — ` : ""}
      {children}
    </p>
  );
}
