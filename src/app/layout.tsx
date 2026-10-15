import type { Metadata, Viewport } from "next";
import { RestaurantJsonLd } from "@/components/seo/RestaurantJsonLd";
import { SITE } from "@/data/site";
import { Barlow, Big_Shoulders, Big_Shoulders_Stencil } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ToastProvider } from "@/components/ui/Toaster";
import "./globals.css";

const display = Big_Shoulders({ subsets: ["latin"], variable: "--font-big-shoulders", display: "swap" });
const stencil = Big_Shoulders_Stencil({ subsets: ["latin"], variable: "--font-big-shoulders-stencil", display: "swap" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow", display: "swap" });

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = productionHost ? `https://${productionHost}` : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Ferro & Fumaça · Burger & Grill na Vila Madalena", template: "%s · Ferro & Fumaça" },
  description: SITE.description,
  openGraph: { type: "website", locale: "pt_BR", siteName: "Ferro & Fumaça" },
  twitter: { card: "summary_large_image" },
  // Fictional restaurant: keep it out of search results (link previews still work).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#12100E" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${display.variable} ${stencil.variable} ${body.variable}`}>
      <body className="grain flex min-h-dvh flex-col font-body antialiased">
        <a href="#conteudo" className="sr-only z-[70] bg-brasa px-4 py-2 font-semibold text-carvao focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          Pular para o conteúdo
        </a>
        <CartProvider>
          <ToastProvider>
            <SiteHeader />
            <main id="conteudo" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <CartDrawer />
          </ToastProvider>
        </CartProvider>
        <RestaurantJsonLd url={siteUrl} />
      </body>
    </html>
  );
}
