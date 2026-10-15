"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartButton } from "@/components/cart/CartButton";
import { useCart } from "@/components/cart/CartProvider";
import { OpenStatus } from "@/components/info/OpenStatus";
import { useScrolled } from "@/hooks/useScrolled";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NAV_LINKS } from "./nav";

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const { open } = useCart();

  return (
    <header
      role="banner"
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${scrolled ? "border-b border-osso/10 bg-carvao/90 backdrop-blur-md" : "bg-gradient-to-b from-carvao/80 to-transparent"}`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Logo />
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`font-display text-[0.95rem] font-bold uppercase tracking-widest transition-colors hover:text-brasa ${active ? "text-brasa" : "text-osso"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="hidden xl:block">
            <OpenStatus />
          </div>
          <CartButton />
          <button
            type="button"
            onClick={open}
            className="hidden bg-brasa px-4 py-2.5 font-display text-sm font-extrabold uppercase tracking-wider text-carvao transition-colors hover:bg-osso lg:inline-flex"
          >
            Peça agora
          </button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
