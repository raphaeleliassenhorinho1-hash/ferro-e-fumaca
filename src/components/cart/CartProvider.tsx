"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { priceOf } from "@/data/menu";
import type { CartLine } from "@/lib/cart";
import { dispatchCart, getCartSnapshot, getServerCartSnapshot, subscribeCart } from "./cart-store";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  qtyOf(id: string): number;
  add(id: string): void;
  setQty(id: string, qty: number): void;
  remove(id: string): void;
  clear(): void;
  isOpen: boolean;
  open(): void;
  close(): void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { lines } = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCartSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount: lines.reduce((n, l) => n + l.qty, 0),
      subtotalCents: lines.reduce((n, l) => n + l.qty * priceOf(l.id), 0),
      qtyOf: (id) => lines.find((l) => l.id === id)?.qty ?? 0,
      add: (id) => dispatchCart({ type: "add", id }),
      setQty: (id, qty) => dispatchCart({ type: "setQty", id, qty }),
      remove: (id) => dispatchCart({ type: "remove", id }),
      clear: () => dispatchCart({ type: "clear" }),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [lines, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
