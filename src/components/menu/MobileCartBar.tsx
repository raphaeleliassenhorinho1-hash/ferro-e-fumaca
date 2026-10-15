"use client";

import { useCart } from "@/components/cart/CartProvider";
import { formatBRL } from "@/lib/format";

export function MobileCartBar() {
  const { itemCount, subtotalCents, open } = useCart();
  if (itemCount === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 p-3 lg:hidden">
      <button type="button" onClick={open} className="w-full bg-brasa py-4 font-display text-lg font-black uppercase tracking-wider text-carvao shadow-2xl">
        Ver pedido ({itemCount}) · {formatBRL(subtotalCents)}
      </button>
    </div>
  );
}
