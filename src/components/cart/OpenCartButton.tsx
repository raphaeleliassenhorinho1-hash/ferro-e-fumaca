"use client";

import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button";
import { useCart } from "./CartProvider";

export function OpenCartButton({ children, variant = "primary", size = "lg" }: { children: ReactNode; variant?: "primary" | "outline"; size?: "md" | "lg" }) {
  const { open } = useCart();
  return (
    <button type="button" onClick={open} className={buttonClass(variant, size)}>
      {children}
    </button>
  );
}
