import type { Metadata } from "next";
import { Barlow, Big_Shoulders, Big_Shoulders_Stencil } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders({ subsets: ["latin"], variable: "--font-big-shoulders", display: "swap" });
const stencil = Big_Shoulders_Stencil({ subsets: ["latin"], variable: "--font-big-shoulders-stencil", display: "swap" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow", display: "swap" });

export const metadata: Metadata = {
  title: "Ferro & Fumaça",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${display.variable} ${stencil.variable} ${body.variable}`}>
      <body className="grain flex min-h-dvh flex-col font-body antialiased">{children}</body>
    </html>
  );
}
