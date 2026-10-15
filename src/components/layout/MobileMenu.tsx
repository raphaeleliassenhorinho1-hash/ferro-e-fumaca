"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { OpenStatus } from "@/components/info/OpenStatus";
import { SITE } from "@/data/site";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { NAV_LINKS } from "./nav";

export function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const panelRef = useRef<HTMLDivElement>(null);
  const { open: openCart } = useCart();

  // Close when the route changes (back/forward included).
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setIsOpen(false);
  }

  const close = () => setIsOpen(false);
  useFocusTrap(panelRef, isOpen, close);
  useScrollLock(isOpen);

  return (
    <>
      <button type="button" aria-label="Abrir menu" aria-expanded={isOpen} onClick={() => setIsOpen(true)} className="grid size-11 place-items-center lg:hidden">
        <Menu aria-hidden className="size-7" />
      </button>
      {isOpen && (
        <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-carvao px-6 pt-5 pb-10 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-stencil text-2xl font-black uppercase">
              Ferro <span className="text-brasa">&amp;</span> Fumaça
            </span>
            <button type="button" aria-label="Fechar menu" onClick={close} className="grid size-11 place-items-center">
              <X aria-hidden className="size-7" />
            </button>
          </div>
          <nav aria-label="Menu principal" className="mt-10">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={`block py-1.5 font-display text-5xl font-black uppercase ${pathname === link.href ? "text-brasa" : "text-osso"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto space-y-4 pt-10">
            <OpenStatus variant="inline" />
            <p className="text-sm text-osso/70">
              {SITE.address.street} · {SITE.address.district}
            </p>
            <button
              type="button"
              onClick={() => {
                close();
                openCart();
              }}
              className="w-full bg-brasa py-4 font-display text-lg font-black uppercase tracking-wider text-carvao"
            >
              Peça agora
            </button>
          </div>
        </div>
      )}
    </>
  );
}
