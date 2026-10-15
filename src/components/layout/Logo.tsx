import Link from "next/link";

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="group flex flex-col leading-none" aria-label="Ferro & Fumaça — início">
      <span className="font-stencil text-2xl font-black uppercase tracking-wide text-osso transition-colors group-hover:text-brasa lg:text-[1.7rem]">
        Ferro <span className="text-brasa">&amp;</span> Fumaça
      </span>
      <span className="mt-1 font-display text-[0.65rem] font-bold uppercase tracking-[0.4em] text-fumaca">Burger &amp; Grill</span>
    </Link>
  );
}
