"use client";

import { Minus, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { MENU_BY_ID } from "@/data/menu";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useNow } from "@/hooks/useNow";
import { useScrollLock } from "@/hooks/useScrollLock";
import { formatBRL } from "@/lib/format";
import { getOpenStatus } from "@/lib/hours";
import { buttonClass } from "@/components/ui/Button";
import { CheckoutForm } from "./CheckoutForm";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, clear } = useCart();
  const [view, setView] = useState<"cart" | "sent">("cart");
  const [wasOpen, setWasOpen] = useState(isOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const now = useNow();

  // Reset to the cart view every time the drawer closes.
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) setView("cart");
  }

  useFocusTrap(panelRef, isOpen, close);
  useScrollLock(isOpen);

  const closed = now !== null && getOpenStatus(now).state === "closed";

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "visible" : "invisible"}`} inert={!isOpen}>
      <div aria-hidden onClick={close} className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`drawer absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-carvao-2 shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-osso/10 px-5 py-4">
          <h2 id="cart-title" className="font-display text-3xl font-black uppercase">
            Seu pedido
          </h2>
          <button type="button" onClick={close} aria-label="Fechar pedido" className="grid size-10 place-items-center hover:text-brasa">
            <X aria-hidden className="size-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {view === "sent" ? (
            <div className="space-y-5 py-10 text-center">
              <p className="font-display text-3xl font-black uppercase text-brasa">Pedido pronto!</p>
              <p>Abrimos o WhatsApp com seu pedido. É só enviar a mensagem por lá.</p>
              <div className="flex flex-col gap-3">
                <button type="button" className={buttonClass("primary", "md")} onClick={() => { clear(); close(); }}>
                  Limpar carrinho
                </button>
                <button type="button" className={buttonClass("outline", "md")} onClick={() => setView("cart")}>
                  Voltar
                </button>
              </div>
            </div>
          ) : lines.length === 0 ? (
            <div className="space-y-5 py-16 text-center">
              <p className="text-lg">Seu pedido está vazio.</p>
              <Link href="/cardapio" onClick={close} className={buttonClass("primary", "md")}>
                Ver cardápio
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {closed && (
                <p className="border-l-4 border-mostarda bg-carvao px-3 py-2 text-sm">Estamos fechados agora; seu pedido entra na fila assim que abrirmos.</p>
              )}
              <ul className="space-y-4">
                {lines.map((line) => {
                  const item = MENU_BY_ID.get(line.id);
                  if (!item) return null;
                  return (
                    <li key={line.id} className="flex items-center gap-3">
                      {item.image ? (
                        <Image src={item.image} alt="" width={56} height={56} className="size-14 shrink-0 object-cover" />
                      ) : (
                        <span aria-hidden className="grid size-14 shrink-0 place-items-center bg-carvao-3 font-stencil text-xl text-brasa">F&amp;F</span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{item.name}</p>
                        <p className="text-sm text-osso/70">{formatBRL(item.priceCents)}</p>
                      </div>
                      <div className="flex items-center border border-osso/20">
                        <button type="button" aria-label={`Diminuir quantidade de ${item.name}`} onClick={() => setQty(line.id, line.qty - 1)} className="grid size-8 place-items-center hover:text-brasa">
                          <Minus aria-hidden className="size-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{line.qty}</span>
                        <button type="button" aria-label={`Aumentar quantidade de ${item.name}`} onClick={() => setQty(line.id, line.qty + 1)} className="grid size-8 place-items-center hover:text-brasa">
                          <Plus aria-hidden className="size-4" />
                        </button>
                      </div>
                      <button type="button" aria-label={`Remover ${item.name}`} onClick={() => remove(line.id)} className="grid size-8 place-items-center text-osso/60 hover:text-brasa">
                        <Trash2 aria-hidden className="size-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <CheckoutForm lines={lines} onSent={() => setView("sent")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
