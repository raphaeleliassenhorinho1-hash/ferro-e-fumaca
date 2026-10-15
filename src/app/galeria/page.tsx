import type { Metadata } from "next";
import carneGrelha from "@/assets/images/scenes/carne-grelha.jpg";
import { GalleryView } from "@/components/gallery/GalleryView";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Galeria",
  description: "Fotos da chapa, da brasa, do salão e dos bastidores da Ferro & Fumaça.",
};

export default function GaleriaPage() {
  return (
    <>
      <PageHero label="Galeria" title="Fumaça, chapa e gente feliz." image={carneGrelha} imageAlt="Bife grelhado rosado por dentro em fundo escuro" />
      <section aria-label="Fotos" className="py-14 lg:py-20">
        <Container>
          <GalleryView />
        </Container>
      </section>
    </>
  );
}
