import type { Metadata } from "next";
import Image from "next/image";
import bebidas from "@/assets/images/scenes/bebidas.jpg";
import chapa from "@/assets/images/scenes/chapa.jpg";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { DrinkList } from "@/components/menu/DrinkList";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MobileCartBar } from "@/components/menu/MobileCartBar";
import { TagBadge } from "@/components/menu/TagBadge";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { CATEGORIES, itemsByCategory, type Tag } from "@/data/menu";

export const metadata: Metadata = {
  title: "Cardápio",
  description: "Smash burgers, carnes defumadas na lenha, porções, shakes e chope gelado. Monte seu pedido e envie pelo WhatsApp.",
};

const TAGS: Tag[] = ["mais-pedido", "picante", "vegetariano", "novo"];

export default function CardapioPage() {
  return (
    <>
      <PageHero
        label="Cardápio"
        title="Feito na chapa, no fogo e na hora."
        subtitle="Todos os burgers vêm no brioche da casa. Monte seu pedido e envie direto pelo WhatsApp."
        image={chapa}
        imageAlt="Três burgers lado a lado em fundo escuro"
      />
      <CategoryNav categories={CATEGORIES} />
      <div className="pb-28 lg:pb-10">
        <Container className="flex flex-wrap items-center gap-2 pt-8 text-sm text-osso/70">
          <span>Legenda:</span>
          {TAGS.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </Container>
        {CATEGORIES.map((category) => (
          <section key={category.id} id={category.id} aria-labelledby={`${category.id}-title`} className="scroll-mt-36 py-12 lg:scroll-mt-44">
            <Container>
              <h2 id={`${category.id}-title`} className="font-display text-5xl font-black uppercase sm:text-6xl">
                {category.name}
              </h2>
              <p className="mt-2 mb-8 text-lg text-osso/70">{category.intro}</p>
              {category.id === "bebidas" ? (
                <div className="grid items-start gap-10 lg:grid-cols-[1fr_2fr]">
                  <div className="relative hidden aspect-[4/5] overflow-hidden lg:block">
                    <Image src={bebidas} alt="Copo de chope gelado sobre o balcão do bar" fill placeholder="blur" sizes="33vw" className="object-cover" />
                  </div>
                  <DrinkList items={itemsByCategory("bebidas")} />
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {itemsByCategory(category.id).map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </Container>
          </section>
        ))}
      </div>
      <MobileCartBar />
    </>
  );
}
