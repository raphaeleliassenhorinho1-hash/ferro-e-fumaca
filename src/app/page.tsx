import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import fogo from "@/assets/images/scenes/fogo.jpg";
import hero from "@/assets/images/scenes/hero-burger.jpg";
import processoCarne from "@/assets/images/scenes/processo-carne.jpg";
import processoFumaca from "@/assets/images/scenes/brasa.jpg";
import processoPao from "@/assets/images/scenes/processo-pao.jpg";
import salao from "@/assets/images/scenes/salao.jpg";
import { OpenCartButton } from "@/components/cart/OpenCartButton";
import { OpenStatus } from "@/components/info/OpenStatus";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GALLERY } from "@/data/gallery";
import { FEATURED } from "@/data/menu";
import { TESTIMONIALS } from "@/data/testimonials";

export const metadata: Metadata = {
  title: { absolute: "Ferro & Fumaça · Burger & Grill na Vila Madalena" },
};

const STEPS = [
  { n: "01", title: "Blend do nosso açougue", text: "Acém, peito e costela Angus, maturados por 21 dias e moídos toda manhã.", image: processoCarne, alt: "Tábua com cortes de carne crua" },
  { n: "02", title: "Pão do nosso forno", text: "Brioche de fermentação natural, assado em fornadas pequenas antes de abrir a casa.", image: processoPao, alt: "Mãos sovando massa de pão sobre a bancada" },
  { n: "03", title: "Fumaça de laranjeira", text: "Defumador de 1 tonelada aceso 12 horas antes do serviço. Sem fumaça líquida.", image: processoFumaca, alt: "Carne sobre a grelha com chamas por baixo" },
];

const STATS = [
  ["21 dias", "de maturação"],
  ["12 h", "de defumação"],
  ["300 °C", "na chapa"],
  ["0", "congelados"],
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-svh items-end overflow-hidden pt-28 pb-16 lg:items-center lg:pb-0">
        <Image src={hero} alt="Burger alto com duas carnes, queijo e salada sobre fundo preto" fill preload placeholder="blur" sizes="100vw" className="-z-20 object-cover object-[70%_center]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-carvao via-carvao/80 to-carvao/10" />
        <div aria-hidden className="absolute -bottom-40 -left-40 -z-10 size-[36rem] rounded-full bg-brasa/25 blur-3xl" />
        <Container>
          <SectionLabel>Vila Madalena · desde 2017</SectionLabel>
          <h1 className="mt-5 max-w-3xl font-display text-6xl leading-[0.88] font-black uppercase sm:text-7xl lg:text-[7.5rem]">
            Chapa de ferro. <span className="text-brasa">Fumaça de lenha.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-osso/85 sm:text-xl">
            Smash burgers na chapa a 300 °C, costela defumada por 12 horas na lenha de laranjeira e chope gelado. Do jeito que tem que ser.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/cardapio" size="lg">
              Ver cardápio
            </Button>
            <Button href="/reservas" variant="outline" size="lg">
              Reservar mesa
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-osso/75">
            <OpenStatus />
            <span>Delivery próprio na região</span>
          </div>
        </Container>
      </section>

      <Marquee items={["Smash na chapa", "Defumados na lenha", "Chope gelado", "Pão da casa"]} />

      {/* Favoritos */}
      <section aria-labelledby="favoritos" className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel number="02">Favoritos da casa</SectionLabel>
              <h2 id="favoritos" className="mt-3 font-display text-5xl font-black uppercase sm:text-6xl">
                Os mais pedidos
              </h2>
            </div>
            <Link href="/cardapio" className="font-semibold text-brasa underline-offset-4 hover:underline">
              Ver cardápio completo →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <MenuItemCard item={item} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Processo */}
      <section aria-labelledby="processo" className="bg-osso py-20 text-carvao lg:py-28">
        <Container>
          <SectionLabel number="03" tone="light">
            O processo
          </SectionLabel>
          <h2 id="processo" className="mt-3 font-display text-5xl font-black uppercase sm:text-6xl">
            Do açougue à chapa
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.n}>
                <Reveal delay={i * 100}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={step.image} alt={step.alt} fill placeholder="blur" sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
                    <span className="absolute top-0 left-0 bg-carvao px-3 py-1 font-stencil text-3xl font-black text-brasa">{step.n}</span>
                  </div>
                  <h3 className="mt-5 font-display text-3xl font-black uppercase">{step.title}</h3>
                  <p className="mt-2 text-carvao/80">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <dl className="mt-16 grid grid-cols-2 gap-8 border-t-2 border-carvao pt-10 md:grid-cols-4">
            {STATS.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block font-stencil text-5xl font-black text-brasa-escura lg:text-6xl">{value}</span>
                  <span className="font-display text-lg font-bold uppercase tracking-wider">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* A casa */}
      <section aria-labelledby="casa" className="py-20 lg:py-28">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative aspect-[4/3] overflow-hidden">
            <Image src={salao} alt="Salão do restaurante com mesas de madeira e luz baixa" fill placeholder="blur" sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </Reveal>
          <div>
            <SectionLabel number="04">A casa</SectionLabel>
            <h2 id="casa" className="mt-3 font-display text-5xl font-black uppercase sm:text-6xl">
              Um food truck que criou raízes
            </h2>
            <p className="mt-5 text-lg text-osso/80">
              Nasceu num food truck em 2017, nas feiras gastronômicas de Pinheiros. Hoje são 120 lugares na Vila Madalena, um defumador de 1 tonelada e a mesma obsessão pela chapa.
            </p>
            <Link href="/sobre" className="mt-6 inline-block font-semibold text-brasa underline-offset-4 hover:underline">
              Nossa história →
            </Link>
          </div>
        </Container>
      </section>

      {/* Depoimentos */}
      <section aria-labelledby="depoimentos" className="border-y border-osso/10 bg-carvao-2 py-20 lg:py-28">
        <Container>
          <SectionLabel number="05">Quem já veio</SectionLabel>
          <h2 id="depoimentos" className="mt-3 font-display text-5xl font-black uppercase sm:text-6xl">
            Quem prova, volta
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.author} delay={i * 80}>
                <figure className="h-full border-l-4 border-brasa bg-carvao p-6">
                  <blockquote className="font-display text-2xl leading-snug font-bold">“{t.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm text-osso/70">
                    {t.author} · {t.district}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Galeria */}
      <section aria-labelledby="galeria-home" className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel number="06">Galeria</SectionLabel>
              <h2 id="galeria-home" className="mt-3 font-display text-5xl font-black uppercase sm:text-6xl">
                Direto da chapa
              </h2>
            </div>
            <Link href="/galeria" className="font-semibold text-brasa underline-offset-4 hover:underline">
              Ver galeria →
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {GALLERY.slice(0, 6).map((photo) => (
              <li key={photo.id} className="relative aspect-square overflow-hidden">
                <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(min-width:1024px) 16vw, (min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-500 hover:scale-105" />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Chamada final */}
      <section aria-labelledby="fome" className="relative isolate overflow-hidden py-24 lg:py-32">
        <Image src={fogo} alt="" fill placeholder="blur" sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-carvao/75" />
        <Container className="text-center">
          <h2 id="fome" className="font-display text-6xl font-black uppercase sm:text-8xl">
            Bateu a fome?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-osso/85">Monte seu pedido e mande direto no WhatsApp, ou garanta sua mesa pro fim de semana.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <OpenCartButton>Fazer pedido</OpenCartButton>
            <Button href="/reservas" variant="outline" size="lg">
              Reservar mesa
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
