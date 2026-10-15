import { MapPin, MessageCircle, Phone, Plus } from "lucide-react";
import type { Metadata } from "next";
import bar from "@/assets/images/scenes/bar.jpg";
import { HoursTable } from "@/components/info/HoursTable";
import { OpenStatus } from "@/components/info/OpenStatus";
import { MAPS_SEARCH_URL } from "@/components/layout/SiteFooter";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FAQ } from "@/data/faq";
import { SITE } from "@/data/site";
import { CONTACT_MESSAGE, whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description: "Endereço, horários, mapa e perguntas frequentes da Ferro & Fumaça, na Vila Madalena.",
};

const MAP_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&z=15&output=embed`;

export default function ContatoPage() {
  return (
    <>
      <PageHero label="Contato" title="Chega mais." subtitle="Estamos na Vila Madalena, de terça a domingo." image={bar} imageAlt="Balcão de bar iluminado com garrafas ao fundo" />

      <section aria-label="Como falar com a gente" className="py-16 lg:py-24">
        <Container className="grid gap-6 md:grid-cols-3">
          <div className="bg-carvao-2 p-6 ring-1 ring-osso/10">
            <MapPin aria-hidden className="size-8 text-brasa" />
            <h2 className="mt-4 font-display text-2xl font-black uppercase">Endereço</h2>
            <p className="mt-2 text-osso/85">
              {SITE.address.street}
              <br />
              {SITE.address.district} · {SITE.address.city}
            </p>
            <a href={MAPS_SEARCH_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold text-brasa underline-offset-4 hover:underline">
              Como chegar →
            </a>
          </div>
          <div className="bg-carvao-2 p-6 ring-1 ring-osso/10">
            <Phone aria-hidden className="size-8 text-brasa" />
            <h2 className="mt-4 font-display text-2xl font-black uppercase">Telefone</h2>
            <p className="mt-2 text-osso/85">{SITE.phoneDisplay}</p>
            <p className="mt-2 text-sm text-osso/60">De terça a domingo, no horário de funcionamento.</p>
          </div>
          <div className="bg-carvao-2 p-6 ring-1 ring-osso/10">
            <MessageCircle aria-hidden className="size-8 text-brasa" />
            <h2 className="mt-4 font-display text-2xl font-black uppercase">WhatsApp</h2>
            <p className="mt-2 text-osso/85">Pedidos, eventos e dúvidas.</p>
            <a
              href={whatsappUrl(CONTACT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex bg-brasa px-4 py-2 font-display text-sm font-extrabold uppercase tracking-wider text-carvao hover:bg-osso"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </Container>
      </section>

      <section aria-labelledby="horarios" className="pb-16 lg:pb-24">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel>Funcionamento</SectionLabel>
            <h2 id="horarios" className="mt-3 font-display text-5xl font-black uppercase">
              Horários
            </h2>
            <div className="mt-4">
              <OpenStatus variant="inline" />
            </div>
            <HoursTable className="mt-6" />
          </div>
          <iframe
            src={MAP_SRC}
            title="Mapa da região da Vila Madalena"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full border-0 ring-1 ring-osso/10 [filter:grayscale(1)_invert(0.92)_contrast(0.9)_hue-rotate(180deg)] lg:h-full lg:min-h-96"
          />
        </Container>
      </section>

      <section aria-labelledby="faq" className="border-t border-osso/10 bg-carvao-2 py-16 lg:py-24">
        <Container className="max-w-4xl">
          <SectionLabel>Dúvidas</SectionLabel>
          <h2 id="faq" className="mt-3 font-display text-5xl font-black uppercase">
            Perguntas frequentes
          </h2>
          <div className="mt-8 divide-y divide-osso/10 border-y border-osso/10">
            {FAQ.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-xl font-bold uppercase [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <Plus aria-hidden className="size-6 shrink-0 text-brasa transition-transform group-open:rotate-45" />
                </summary>
                <p className="pb-5 text-osso/80">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
