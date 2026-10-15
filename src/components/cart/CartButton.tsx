"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { itemCount, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Abrir pedido (${itemCount} ${itemCount === 1 ? "item" : "itens"})`}
      className="relative grid size-11 place-items-center text-osso transition-colors hover:text-brasa"
    >
      <ShoppingBag aria-hidden className="size-6" />
      {itemCount > 0 && (
        <span aria-hidden className="absolute top-0.5 right-0 grid min-w-5 place-items-center rounded-full bg-brasa px-1 text-[0.7rem] font-bold text-carvao">
          {itemCount}
        </span>
      )}
    </button>
  );
}
