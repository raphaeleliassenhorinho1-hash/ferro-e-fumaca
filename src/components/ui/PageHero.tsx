import Image, { type StaticImageData } from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function PageHero({ label, title, subtitle, image, imageAlt }: { label: string; title: string; subtitle?: string; image: StaticImageData; imageAlt: string }) {
  return (
    <section className="relative isolate flex min-h-[60svh] items-end overflow-hidden pt-28 pb-14 lg:min-h-[64svh] lg:pb-20">
      <Image src={image} alt={imageAlt} fill placeholder="blur" sizes="100vw" className="-z-20 object-cover" loading="eager" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-carvao via-carvao/75 to-carvao/30" />
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.95] font-black uppercase sm:text-6xl lg:text-8xl">{title}</h1>
        {subtitle && <p className="mt-5 max-w-2xl text-lg text-osso/85">{subtitle}</p>}
      </Container>
    </section>
  );
}
