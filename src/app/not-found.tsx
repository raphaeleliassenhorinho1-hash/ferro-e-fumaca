import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="flex min-h-svh items-center pt-24 pb-16">
      <Container className="text-center">
        <p aria-hidden className="font-stencil text-[9rem] leading-none font-black text-brasa sm:text-[14rem]">
          404
        </p>
        <h1 className="font-display text-5xl font-black uppercase sm:text-6xl">Essa passou do ponto.</h1>
        <p className="mt-4 text-lg text-osso/80">A página que você procurou virou carvão.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/cardapio" size="lg">
            Ver cardápio
          </Button>
          <Button href="/" variant="outline" size="lg">
            Voltar ao início
          </Button>
        </div>
      </Container>
    </section>
  );
}
