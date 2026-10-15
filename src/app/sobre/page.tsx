import { Beef, Beer, Flame, Wheat } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import brasa from "@/assets/images/scenes/brasa.jpg";
import cozinha from "@/assets/images/scenes/cozinha.jpg";
import { MAPS_SEARCH_URL } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TIMELINE } from "@/data/timeline";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Do food truck de 2017 ao endereço com cheiro de lenha na Vila Madalena: conheça a história da Ferro & Fumaça.",
};

const PILLARS = [
  { icon: Beef, title: "Carne", text: "Blend próprio de acém, peito e costela Angus, maturado por 21 dias e moído toda manhã." },
  { icon: Wheat, title: "Pão", text: "Brioche de fermentação natural, assado em fornadas pequenas antes de abrir a casa." },
  { icon: Flame, title: "Fumaça", text: "Lenha de laranjeira e 12 horas de defumação lenta. Nada de fumaça líquida." },
  { icon: Beer, title: "Chope", text: "Torneiras de cervejarias artesanais do bairro, servido trincando." },
];

const STATS = [
  ["250 mil", "burgers servidos"],
  ["12 h", "de defumação"],
  ["21 dias", "de maturação"],
  ["120", "lugares"],
];

export default function SobrePage() {
  return (
    <>
      <PageHero label="Nossa história" title="De um food truck a um endereço com cheiro de lenha." image={brasa} imageAlt="Carne sobre a grelha com chamas por baixo" />

      <section aria-label="História" className="py-20 lg:py-28">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5 text-lg text-osso/85">
            <SectionLabel number="01">Como tudo começou</SectionLabel>
            <p>
              A Ferro &amp; Fumaça nasceu em 2017 como um food truck nas feiras gastronômicas de Pinheiros: uma chapa de ferro de 30 kg, um defumador improvisado e uma fila que só crescia.
            </p>
            <p>
              O nome vem dos sobrenomes dos sócios: Bruno <strong className="text-brasa">Ferr</strong>az, que domina a chapa, e Léo <strong className="text-brasa">Fum</strong>agalli, que nunca deixa o defumador apagar. Em 2019 a dupla trocou as rodas por um endereço fixo na Vila Madalena.
            </p>
            <p>A casa cresceu, ganhou varanda e balcão de frente pra chapa, mas a regra continua a mesma: carne moída no dia, pão saído do forno e fumaça de verdade.</p>
          </div>
          <Reveal className="relative aspect-[4/5] overflow-hidden">
            <Image src={cozinha} alt="Cozinheiro de avental finalizando um prato sob luz quente" fill placeholder="blur" sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="pilares" className="bg-osso py-20 text-carvao lg:py-28">
        <Container>
          <SectionLabel number="02" tone="light">
            O que não muda
          </SectionLabel>
          <h2 id="pilares" className="mt-3 font-display text-5xl font-black uppercase sm:text-6xl">
            Quatro pilares
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80} className="h-full">
                <div className="h-full border-2 border-carvao p-6">
                  <Icon aria-hidden className="size-9 text-brasa-escura" />
                  <h2 className="mt-4 font-display text-3xl font-black uppercase">{title}</h2>
                  <p className="mt-2 text-carvao/80">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="linha-do-tempo" className="py-20 lg:py-28">
        <Container>
          <SectionLabel number="03">Linha do tempo</SectionLabel>
          <h2 id="linha-do-tempo" className="mt-3 font-display text-5xl font-black uppercase sm:text-6xl">
            Brasa acesa desde 2017
          </h2>
          <ol className="mt-12 space-y-10 border-l-2 border-brasa/60 pl-8">
            {TIMELINE.map((m) => (
              <li key={m.year} className="relative">
                <span aria-hidden className="absolute top-2 -left-[2.55rem] size-4 rounded-full border-4 border-carvao bg-brasa" />
                <p className="font-stencil text-4xl font-black text-brasa">{m.year}</p>
                <h3 className="mt-1 font-display text-2xl font-black uppercase">{m.title}</h3>
                <p className="mt-1 max-w-xl text-osso/75">{m.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-label="Números" className="border-y border-osso/10 bg-carvao-2 py-16">
        <Container>
          <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block font-stencil text-5xl font-black text-brasa lg:text-6xl">{value}</span>
                  <span className="font-display text-lg font-bold uppercase tracking-wider">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="visite" className="py-20 text-center lg:py-28">
        <Container>
          <h2 id="visite" className="font-display text-5xl font-black uppercase sm:text-7xl">
            Venha sentir o cheiro de perto
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/reservas" size="lg">
              Reservar mesa
            </Button>
            <Button href={MAPS_SEARCH_URL} variant="outline" size="lg">
              Como chegar
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
