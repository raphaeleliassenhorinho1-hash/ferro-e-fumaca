import Link from "next/link";
import { SITE } from "@/data/site";
import { describeDay } from "@/lib/hours";
import { NAV_LINKS } from "./nav";

const HOURS: [string, number][] = [
  ["Segunda", 1],
  ["Terça a quinta", 2],
  ["Sexta", 5],
  ["Sábado", 6],
  ["Domingo", 0],
];

export const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;

export function SiteFooter() {
  return (
    <footer className="border-t border-osso/10 bg-carvao-2">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-stencil text-3xl font-black uppercase">
            Ferro <span className="text-brasa">&amp;</span> Fumaça
          </p>
          <p className="mt-3 text-osso/75">Smash na chapa, carne na brasa e chope gelado desde {SITE.foundedYear}.</p>
          <p className="mt-4 inline-block border border-mostarda/50 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-mostarda">
            Restaurante fictício · projeto de portfólio
          </p>
        </div>
        <div>
          <h2 className="font-display text-lg font-black uppercase tracking-wider text-brasa">Visite</h2>
          <address className="mt-3 not-italic text-osso/85">
            {SITE.address.street}
            <br />
            {SITE.address.district} · {SITE.address.city}
          </address>
          <p className="mt-2 text-osso/85">{SITE.phoneDisplay}</p>
          {SITE.instagram && <p className="mt-2 text-osso/85">@{SITE.instagram}</p>}
          <a href={MAPS_SEARCH_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold text-brasa underline-offset-4 hover:underline">
            Como chegar →
          </a>
        </div>
        <div>
          <h2 className="font-display text-lg font-black uppercase tracking-wider text-brasa">Horários</h2>
          <dl className="mt-3 space-y-1 text-sm">
            {HOURS.map(([label, day]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-osso/75">{label}</dt>
                <dd>{describeDay(day)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <nav aria-label="Rodapé">
          <h2 className="font-display text-lg font-black uppercase tracking-wider text-brasa">Navegue</h2>
          <ul className="mt-3 grid grid-cols-2 gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-osso/85 hover:text-brasa">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-osso/10">
        <p className="mx-auto w-full max-w-7xl px-4 py-5 text-xs text-osso/60 sm:px-6 lg:px-8">
          © {SITE.copyrightYear} Ferro &amp; Fumaça · Desenvolvido por {SITE.developer.name} · Fotos:{" "}
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
            Unsplash
          </a>
        </p>
      </div>
    </footer>
  );
}
