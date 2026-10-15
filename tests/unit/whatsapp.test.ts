import { expect, it } from "vitest";
import { computeTotals, type CheckoutDetails } from "@/lib/cart";
import type { ReservationInput } from "@/lib/reservation";
import { buildOrderMessage, buildReservationMessage, whatsappUrl } from "@/lib/whatsapp";

const R = "R$ ";
const rules = { feeCents: 800, freeFromCents: 15000 };
const items = [
  { name: "Smash Clássico", qty: 2, unitCents: 3690 },
  { name: "Batata Rústica", qty: 1, unitCents: 2490 },
];
const totalsFor = (f: "delivery" | "pickup", sub = 9870) => computeTotals([{ id: "x", qty: 1 }], () => sub, f, rules);
const base: CheckoutDetails = { fulfillment: "delivery", name: "João", address: "Rua das Flores, 123", neighborhood: "Pinheiros", complement: "apto 42", payment: "dinheiro", changeFor: "120", notes: "sem cebola no Clássico" };

it("monta o pedido de delivery do spec", () => {
  expect(buildOrderMessage(items, totalsFor("delivery"), base)).toBe(
    [
      "*Novo pedido — Ferro & Fumaça*", "",
      `2x Smash Clássico — ${R}73,80`, `1x Batata Rústica — ${R}24,90`, "",
      `Subtotal: ${R}98,70`, `Entrega: ${R}8,00`, `*Total: ${R}106,70*`, "",
      "*Entrega:* Rua das Flores, 123 — Pinheiros (apto 42)",
      `*Pagamento:* Dinheiro (troco para ${R}120,00)`, "*Nome:* João", "*Obs.:* sem cebola no Clássico",
    ].join("\n"),
  );
});

it("retirada com Pix, sem observação", () => {
  const msg = buildOrderMessage(items, totalsFor("pickup"), { ...base, fulfillment: "pickup", payment: "pix", notes: "  " });
  expect(msg).toContain("*Retirada no balcão*");
  expect(msg).toContain("*Pagamento:* Pix");
  expect(msg).not.toContain("Entrega:");
  expect(msg).not.toContain("*Obs.:*");
  expect(msg).toContain(`*Total: ${R}98,70*`);
});

it("frete grátis e cartão", () => {
  const msg = buildOrderMessage(items, totalsFor("delivery", 15000), { ...base, payment: "cartao", complement: "" });
  expect(msg).toContain("Entrega: grátis");
  expect(msg).toContain("*Pagamento:* Cartão na entrega");
  expect(msg).toContain("*Entrega:* Rua das Flores, 123 — Pinheiros\n");
});

it("monta a reserva completa e a mínima", () => {
  const r: ReservationInput = { name: "Ana Souza", phone: "(11) 98888-7777", email: "", date: "2026-10-24", time: "20:00", people: 4, area: "varanda", occasion: "aniversario", notes: "cadeira para bebê" };
  expect(buildReservationMessage(r, "FF-7K3Q")).toBe(
    [
      "*Pedido de reserva — Ferro & Fumaça*", "Código: FF-7K3Q", "Nome: Ana Souza", "Telefone: (11) 98888-7777",
      "Data: sábado, 24/10/2026", "Horário: 20:00", "Pessoas: 4", "Área: Varanda", "Ocasião: Aniversário", "Obs.: cadeira para bebê",
    ].join("\n"),
  );
  const min = buildReservationMessage({ ...r, email: "ana@exemplo.com", area: "", occasion: "", notes: "" }, "FF-AAAA");
  expect(min.split("\n")).toEqual([
    "*Pedido de reserva — Ferro & Fumaça*", "Código: FF-AAAA", "Nome: Ana Souza", "Telefone: (11) 98888-7777",
    "E-mail: ana@exemplo.com", "Data: sábado, 24/10/2026", "Horário: 20:00", "Pessoas: 4",
  ]);
});

it("codifica a URL e faz ida e volta com caracteres especiais", () => {
  const text = "Pão & Cia #1? ç\n🍔";
  const url = whatsappUrl(text, "");
  expect(url.startsWith("https://wa.me/?text=")).toBe(true);
  expect(decodeURIComponent(url.slice("https://wa.me/?text=".length))).toBe(text);
  expect(whatsappUrl("oi", "5511999999999")).toBe("https://wa.me/5511999999999?text=oi");
});
