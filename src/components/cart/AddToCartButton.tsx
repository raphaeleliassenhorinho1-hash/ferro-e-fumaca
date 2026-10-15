"use client";

import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";
import { useCart } from "./CartProvider";

export function AddToCartButton({ id, name, variant = "full" }: { id: string; name: string; variant?: "full" | "icon" }) {
  const { add, qtyOf, open } = useCart();
  const { show } = useToast();
  const qty = qtyOf(id);

  function handleClick() {
    add(id);
    show(`+1 ${name} no pedido`, { label: "Ver pedido", onClick: open });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Adicionar ${name} ao pedido`}
        className="relative grid size-9 shrink-0 place-items-center border border-osso/30 text-osso transition-colors hover:border-brasa hover:bg-brasa hover:text-carvao"
      >
        <Plus aria-hidden className="size-4" />
        {qty > 0 && <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-mostarda text-[0.65rem] font-bold text-carvao">{qty}</span>}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Adicionar ${name} ao pedido`}
        className="inline-flex items-center gap-2 bg-brasa px-4 py-2 font-display text-sm font-extrabold uppercase tracking-wider text-carvao transition-colors hover:bg-osso"
      >
        <Plus aria-hidden className="size-4" /> Adicionar
      </button>
      {qty > 0 && <span className="text-sm font-semibold text-mostarda">No pedido: {qty}</span>}
    </div>
  );
}
