"use client";

import { useNow } from "@/hooks/useNow";
import { getOpenStatus } from "@/lib/hours";

const DOT = { open: "bg-emerald-400", closing: "bg-mostarda", closed: "bg-brasa" } as const;

export function OpenStatus({ variant = "pill" }: { variant?: "pill" | "inline" }) {
  const now = useNow();
  const status = now ? getOpenStatus(now) : null;
  const base = variant === "pill" ? "rounded-full border border-osso/20 bg-carvao/60 px-3 py-1.5 text-xs" : "text-sm";
  return (
    <span className={`inline-flex min-w-44 items-center gap-2 font-semibold ${base}`}>
      <span aria-hidden className={`size-2 rounded-full ${status ? DOT[status.state] : "bg-fumaca/40"}`} />
      {status ? (
        <span>
          {status.label} <span className="font-normal text-osso/70">· {status.detail}</span>
        </span>
      ) : (
        <span className="text-transparent">Carregando</span>
      )}
    </span>
  );
}
