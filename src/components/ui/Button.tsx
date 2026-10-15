import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brasa text-carvao hover:bg-osso",
  outline: "border-2 border-osso/70 text-osso hover:border-brasa hover:text-brasa",
  ghost: "text-osso underline-offset-4 hover:text-brasa hover:underline",
};
const SIZES: Record<Size, string> = { md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `inline-flex items-center justify-center gap-2 font-display font-extrabold uppercase tracking-wider transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({ href, variant, size, className, children, ...rest }: Common & { href?: string } & Omit<ComponentProps<"button">, "className">) {
  if (href) {
    const external = href.startsWith("http");
    return (
      <Link href={href} className={buttonClass(variant, size, className)} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
