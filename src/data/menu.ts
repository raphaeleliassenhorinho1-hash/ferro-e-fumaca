import type { StaticImageData } from "next/image";
import ancho from "@/assets/images/menu/ancho-maturado.jpg";
import batata from "@/assets/images/menu/batata-rustica.jpg";
import bolinhos from "@/assets/images/menu/bolinhos-de-costela.jpg";
import brasaPicante from "@/assets/images/menu/brasa-picante.jpg";
import brownie from "@/assets/images/menu/brownie-na-chapa.jpg";
import costela12h from "@/assets/images/menu/costela-12h.jpg";
import costelaDefumada from "@/assets/images/menu/costela-defumada.jpg";
import ferroDuplo from "@/assets/images/menu/ferro-duplo.jpg";
import linguica from "@/assets/images/menu/linguica-artesanal.jpg";
import mac from "@/assets/images/menu/mac-and-cheese.jpg";
import onion from "@/assets/images/menu/onion-rings.jpg";
import pannaCotta from "@/assets/images/menu/panna-cotta.jpg";
import picanha from "@/assets/images/menu/picanha-na-chapa.jpg";
import ribs from "@/assets/images/menu/ribs-bbq.jpg";
import shakeDoce from "@/assets/images/menu/shake-de-doce-de-leite.jpg";
import shakeMalte from "@/assets/images/menu/shake-de-malte.jpg";
import smashClassico from "@/assets/images/menu/smash-classico.jpg";
import smashinho from "@/assets/images/menu/smashinho.jpg";
import trufado from "@/assets/images/menu/trufado.jpg";
import veggie from "@/assets/images/menu/veggie-na-brasa.jpg";

export type Tag = "mais-pedido" | "picante" | "vegetariano" | "novo";
export const TAG_LABELS: Record<Tag, string> = { "mais-pedido": "Mais pedido", picante: "Picante", vegetariano: "Vegetariano", novo: "Novo" };

export type CategoryId = "burgers" | "da-brasa" | "porcoes" | "sobremesas" | "bebidas";
export type Category = { id: CategoryId; name: string; intro: string };
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  category: CategoryId;
  tags: Tag[];
  image?: StaticImageData;
  imageAlt?: string;
};

export const CATEGORIES: Category[] = [
  { id: "burgers", name: "Burgers", intro: "Blend próprio, chapa de ferro e brioche da casa." },
  { id: "da-brasa", name: "Da Brasa", intro: "Carnes defumadas na lenha de laranjeira e grelhadas na brasa." },
  { id: "porcoes", name: "Porções", intro: "Pra dividir. Ou não." },
  { id: "sobremesas", name: "Sobremesas & Shakes", intro: "O final feliz." },
  { id: "bebidas", name: "Bebidas", intro: "Chope gelado, drinks e opções sem álcool." },
];

export const MENU: MenuItem[] = [
  { id: "smash-classico", category: "burgers", name: "Smash Clássico", priceCents: 3690, tags: ["mais-pedido"], image: smashClassico,
    imageAlt: "Burger com dois smashes e queijo cheddar derretido escorrendo",
    description: "Dois smashes de 90 g, queijo prato, cebola na chapa, picles da casa e molho Fumaça." },
  { id: "ferro-duplo", category: "burgers", name: "Ferro Duplo", priceCents: 4990, tags: ["mais-pedido"], image: ferroDuplo,
    imageAlt: "Burger alto com duas carnes, bacon e cheddar em fundo escuro",
    description: "Dois blends de 150 g, cheddar inglês, bacon de barriga defumado na casa e maionese de alho assado." },
  { id: "costela-12h", category: "burgers", name: "Costela 12h", priceCents: 5290, tags: ["novo"], image: costela12h,
    imageAlt: "Sanduíche de carne desfiada com molho rosado no pão brioche",
    description: "Costela desfiada defumada por 12 horas, queijo coalho tostado, cebola roxa em conserva e barbecue de rapadura." },
  { id: "brasa-picante", category: "burgers", name: "Brasa Picante", priceCents: 4690, tags: ["picante"], image: brasaPicante,
    imageAlt: "Burger com molho alaranjado picante e folhas verdes sobre tábua escura",
    description: "Blend de 180 g, pepper jack, jalapeños na brasa, cebola crispy e maionese de chipotle." },
  { id: "trufado", category: "burgers", name: "Trufado", priceCents: 5490, tags: [], image: trufado,
    imageAlt: "Burger com queijo derretido e cebola caramelizada em pão brilhante",
    description: "Blend de 180 g, queijo brie, cogumelos salteados na manteiga e aioli de trufa negra." },
  { id: "veggie-na-brasa", category: "burgers", name: "Veggie na Brasa", priceCents: 4290, tags: ["vegetariano"], image: veggie,
    imageAlt: "Burger vegetariano com abacate, folhas e legumes frescos",
    description: "Hambúrguer de cogumelos e grão-de-bico, muçarela de búfala, tomate assado e pesto de rúcula." },
  { id: "smashinho", category: "burgers", name: "Smashinho", priceCents: 2990, tags: [], image: smashinho,
    imageAlt: "Cheeseburger simples no pão brioche sobre fundo claro",
    description: "Para os pequenos: um smash de 90 g, queijo prato e ketchup da casa, com batata pequena." },

  { id: "costela-defumada", category: "da-brasa", name: "Costela Defumada", priceCents: 9890, tags: ["mais-pedido"], image: costelaDefumada,
    imageAlt: "Costela bovina defumada com crosta escura fatiada na tábua",
    description: "500 g de costela bovina defumada por 12 horas na lenha de laranjeira, com farofa de manteiga e vinagrete. Serve 2." },
  { id: "picanha-na-chapa", category: "da-brasa", name: "Picanha na Chapa", priceCents: 8990, tags: [], image: picanha,
    imageAlt: "Fatias de carne grelhada ao ponto sobre tábua de madeira",
    description: "350 g de picanha Angus fatiada, alho confitado, batata rústica e chimichurri da casa." },
  { id: "ancho-maturado", category: "da-brasa", name: "Ancho Maturado", priceCents: 10990, tags: [], image: ancho,
    imageAlt: "Bife ancho grosso sendo cortado, rosado por dentro",
    description: "400 g de ancho maturado por 21 dias, sal de parrilla e manteiga de ervas, com purê rústico." },
  { id: "ribs-bbq", category: "da-brasa", name: "Ribs BBQ", priceCents: 7990, tags: [], image: ribs,
    imageAlt: "Costelinha suína com barbecue numa tábua com batatas",
    description: "600 g de costelinha suína no barbecue de rapadura, com coleslaw. Serve 2." },

  { id: "batata-rustica", category: "porcoes", name: "Batata Rústica", priceCents: 2490, tags: ["vegetariano"], image: batata,
    imageAlt: "Porção de batatas fritas douradas em fundo escuro",
    description: "Batatas com casca, páprica defumada e aioli da casa." },
  { id: "onion-rings", category: "porcoes", name: "Onion Rings", priceCents: 2690, tags: ["vegetariano"], image: onion,
    imageAlt: "Anéis de cebola empanados e crocantes sobre papel",
    description: "Anéis de cebola empanados na cerveja, com barbecue." },
  { id: "mac-and-cheese", category: "porcoes", name: "Mac & Cheese Defumado", priceCents: 2990, tags: [], image: mac,
    imageAlt: "Massa cremosa com molho de queijo num prato fundo",
    description: "Macarrão com cheddar, queijo defumado e farofa de bacon." },
  { id: "bolinhos-de-costela", category: "porcoes", name: "Bolinhos de Costela", priceCents: 3290, tags: ["mais-pedido"], image: bolinhos,
    imageAlt: "Bolinhos de carne dourados servidos sobre folhas de rúcula",
    description: "Seis bolinhos de costela defumada com requeijão e geleia de pimenta." },
  { id: "linguica-artesanal", category: "porcoes", name: "Linguiça Artesanal", priceCents: 3490, tags: [], image: linguica,
    imageAlt: "Espetos de carne grelhada com batatas fritas e tomate",
    description: "Linguiça de pernil defumada na casa, cebola caramelizada e mostarda escura." },

  { id: "brownie-na-chapa", category: "sobremesas", name: "Brownie na Chapa", priceCents: 2690, tags: [], image: brownie,
    imageAlt: "Brownie de chocolate com bolas de sorvete e calda",
    description: "Brownie meio amargo aquecido na chapa, com sorvete de creme e calda quente." },
  { id: "panna-cotta", category: "sobremesas", name: "Panna Cotta de Doce de Leite", priceCents: 1990, tags: ["novo"], image: pannaCotta,
    imageAlt: "Potinhos de panna cotta com morangos frescos por cima",
    description: "Panna cotta de doce de leite com um toque de fumaça e morangos." },
  { id: "shake-de-malte", category: "sobremesas", name: "Shake de Malte", priceCents: 2490, tags: [], image: shakeMalte,
    imageAlt: "Milkshake de chocolate com chantilly e canudo",
    description: "Sorvete de creme, malte crocante e chantilly." },
  { id: "shake-de-doce-de-leite", category: "sobremesas", name: "Shake de Doce de Leite", priceCents: 2490, tags: [], image: shakeDoce,
    imageAlt: "Milkshake cremoso com biscoito e calda de chocolate no copo",
    description: "Sorvete de creme, doce de leite e paçoca." },

  { id: "chope-pilsen", category: "bebidas", name: "Chope Pilsen da Casa", priceCents: 1690, tags: [], description: "400 ml, leve e bem gelado." },
  { id: "chope-ipa", category: "bebidas", name: "Chope IPA", priceCents: 2290, tags: [], description: "400 ml de cervejaria artesanal parceira." },
  { id: "limonada-defumada", category: "bebidas", name: "Limonada Defumada", priceCents: 1490, tags: ["novo"], description: "Limão-taiti, alecrim e um toque de fumaça." },
  { id: "caipirinha", category: "bebidas", name: "Caipirinha de Cachaça Artesanal", priceCents: 2490, tags: [], description: "Limão, açúcar e cachaça de alambique." },
  { id: "refrigerante", category: "bebidas", name: "Refrigerante Lata", priceCents: 790, tags: [], description: "350 ml." },
  { id: "agua", category: "bebidas", name: "Água Mineral", priceCents: 590, tags: [], description: "500 ml, com ou sem gás." },
];

export const MENU_BY_ID: ReadonlyMap<string, MenuItem> = new Map(MENU.map((i) => [i.id, i]));
export const MENU_IDS: ReadonlySet<string> = new Set(MENU.map((i) => i.id));
export const FEATURED: MenuItem[] = MENU.filter((i) => i.tags.includes("mais-pedido"));

export function priceOf(id: string): number {
  return MENU_BY_ID.get(id)?.priceCents ?? 0;
}

export function itemsByCategory(id: CategoryId): MenuItem[] {
  return MENU.filter((i) => i.category === id);
}
