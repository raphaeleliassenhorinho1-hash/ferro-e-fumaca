import { SITE } from "@/data/site";
import { formatBRL } from "@/lib/format";

export type FaqItem = { question: string; answer: string };

const { delivery } = SITE;

export const FAQ: FaqItem[] = [
  { question: "Vocês aceitam reservas?", answer: "Sim! Reservas de terça a domingo para até 12 pessoas, direto pela página de Reservas. A confirmação chega pelo WhatsApp." },
  { question: "Tem opção vegetariana?", answer: "Tem: o Veggie na Brasa, de cogumelos e grão-de-bico, além da Batata Rústica e dos Onion Rings." },
  {
    question: "Qual a área de entrega?",
    answer: `Entregamos num raio de ${delivery.radiusKm} km a partir da Vila Madalena. A taxa é de ${formatBRL(delivery.feeCents)} e a entrega é grátis em pedidos a partir de ${formatBRL(delivery.freeFromCents)}.`,
  },
  { question: "Posso levar meu pet?", answer: "Pode! A varanda é pet friendly e tem água fresca pros visitantes de quatro patas." },
  { question: "Vocês fazem eventos?", answer: "Fazemos aniversários, confraternizações e fechamento da casa para grupos a partir de 13 pessoas. Chama a gente no WhatsApp." },
  { question: "Quais formas de pagamento?", answer: "Pix, cartões de crédito e débito e dinheiro." },
];
