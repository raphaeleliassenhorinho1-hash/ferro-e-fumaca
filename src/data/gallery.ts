import type { StaticImageData } from "next/image";
import batata from "@/assets/images/menu/batata-rustica.jpg";
import costela from "@/assets/images/menu/costela-defumada.jpg";
import ferroDuplo from "@/assets/images/menu/ferro-duplo.jpg";
import ribs from "@/assets/images/menu/ribs-bbq.jpg";
import shake from "@/assets/images/menu/shake-de-malte.jpg";
import smash from "@/assets/images/menu/smash-classico.jpg";
import amigos from "@/assets/images/scenes/amigos.jpg";
import bar from "@/assets/images/scenes/bar.jpg";
import brasa from "@/assets/images/scenes/brasa.jpg";
import carneGrelha from "@/assets/images/scenes/carne-grelha.jpg";
import chapa from "@/assets/images/scenes/chapa.jpg";
import cozinha from "@/assets/images/scenes/cozinha.jpg";
import fogo from "@/assets/images/scenes/fogo.jpg";
import processoCarne from "@/assets/images/scenes/processo-carne.jpg";
import salao from "@/assets/images/scenes/salao.jpg";
import varanda from "@/assets/images/scenes/varanda.jpg";

export type GalleryCategory = "comida" | "ambiente" | "bastidores";
export const GALLERY_FILTERS: { id: "todos" | GalleryCategory; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "comida", label: "Comida" },
  { id: "ambiente", label: "Ambiente" },
  { id: "bastidores", label: "Bastidores" },
];

export type GalleryPhoto = { id: string; src: StaticImageData; alt: string; caption: string; category: GalleryCategory };

// The first six interleave categories: the home page shows them as a strip.
export const GALLERY: GalleryPhoto[] = [
  { id: "smash", src: smash, category: "comida", caption: "Smash Clássico", alt: "Burger com dois smashes e cheddar derretido" },
  { id: "salao", src: salao, category: "ambiente", caption: "O salão", alt: "Salão do restaurante com mesas de madeira e luz baixa" },
  { id: "brasa", src: brasa, category: "bastidores", caption: "Carne na brasa", alt: "Carne sobre a grelha com chamas por baixo" },
  { id: "costela", src: costela, category: "comida", caption: "Costela defumada 12 h", alt: "Costela bovina defumada com crosta escura" },
  { id: "bar", src: bar, category: "ambiente", caption: "O balcão do bar", alt: "Balcão de bar iluminado com garrafas ao fundo" },
  { id: "chapa", src: chapa, category: "bastidores", caption: "Saindo da chapa", alt: "Três burgers lado a lado em fundo escuro" },
  { id: "ferro-duplo", src: ferroDuplo, category: "comida", caption: "Ferro Duplo", alt: "Burger alto com duas carnes e bacon" },
  { id: "cozinha", src: cozinha, category: "bastidores", caption: "Finalizando o prato", alt: "Cozinheiro de avental finalizando um prato sob luz quente" },
  { id: "amigos", src: amigos, category: "ambiente", caption: "Mesa cheia", alt: "Grupo de amigos conversando e comendo à mesa" },
  { id: "ribs", src: ribs, category: "comida", caption: "Ribs BBQ", alt: "Costelinha suína com barbecue numa tábua" },
  { id: "fogo", src: fogo, category: "bastidores", caption: "A lenha acesa", alt: "Fogueira acesa na escuridão com faíscas subindo" },
  { id: "varanda", src: varanda, category: "ambiente", caption: "A varanda", alt: "Área ampla com mesas e luminárias pendentes" },
  { id: "batata", src: batata, category: "comida", caption: "Batata Rústica", alt: "Porção de batatas fritas douradas" },
  { id: "processo-carne", src: processoCarne, category: "bastidores", caption: "Cortes do dia", alt: "Tábua com cortes de carne crua e temperos" },
  { id: "shake", src: shake, category: "comida", caption: "Shake de Malte", alt: "Milkshake de chocolate com chantilly" },
  { id: "carne-grelha", src: carneGrelha, category: "bastidores", caption: "No ponto", alt: "Bife grelhado rosado por dentro em fundo escuro" },
];
