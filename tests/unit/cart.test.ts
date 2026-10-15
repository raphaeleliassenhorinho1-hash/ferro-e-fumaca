import { expect, it } from "vitest";
import { cartReducer, computeTotals, EMPTY_CART, sanitizeLines, validateCheckout, type CheckoutDetails } from "@/lib/cart";

const rules = { feeCents: 800, freeFromCents: 15000 };
const price = (id: string) => ({ a: 3690, b: 2490 } as Record<string, number>)[id] ?? 0;

it("adiciona, incrementa e limita a 20", () => {
  let s = cartReducer(EMPTY_CART, { type: "add", id: "a" });
  expect(s.lines).toEqual([{ id: "a", qty: 1 }]);
  s = cartReducer(s, { type: "add", id: "a" });
  expect(s.lines[0].qty).toBe(2);
  for (let i = 0; i < 25; i++) s = cartReducer(s, { type: "add", id: "a" });
  expect(s.lines[0].qty).toBe(20);
});

it("setQty remove com 0, limita a 20, ignora id ausente; remove/clear; não muta", () => {
  const s = { lines: [{ id: "a", qty: 2 }] };
  expect(cartReducer(s, { type: "setQty", id: "a", qty: 5 }).lines).toEqual([{ id: "a", qty: 5 }]);
  expect(cartReducer(s, { type: "setQty", id: "a", qty: 0 }).lines).toEqual([]);
  expect(cartReducer(s, { type: "setQty", id: "a", qty: 99 }).lines[0].qty).toBe(20);
  expect(cartReducer(s, { type: "setQty", id: "z", qty: 3 })).toEqual(s);
  expect(cartReducer(s, { type: "remove", id: "a" }).lines).toEqual([]);
  expect(cartReducer(s, { type: "clear" })).toEqual(EMPTY_CART);
  expect(s.lines).toEqual([{ id: "a", qty: 2 }]);
});

it("saneia dados salvos", () => {
  const known = new Set(["a", "b", "c", "d"]);
  expect(sanitizeLines("{lixo", known)).toEqual([]);
  expect(sanitizeLines(null, known)).toEqual([]);
  expect(
    sanitizeLines(
      [{ id: "a", qty: 2 }, { id: "ghost", qty: 1 }, { id: "b", qty: 0 }, { id: "b", qty: -3 }, { id: "c", qty: 2.7 }, { id: "a", qty: 19 }, "lixo", null, { id: "d" }],
      known,
    ),
  ).toEqual([{ id: "a", qty: 20 }, { id: "c", qty: 2 }]);
});

it("calcula totais, taxa e frete grátis", () => {
  expect(computeTotals([{ id: "a", qty: 2 }, { id: "b", qty: 1 }], price, "delivery", rules)).toEqual({
    itemCount: 3, subtotalCents: 9870, deliveryCents: 800, totalCents: 10670, missingForFreeCents: 5130,
  });
  const p = (c: number) => () => c;
  expect(computeTotals([{ id: "x", qty: 1 }], p(15000), "delivery", rules)).toMatchObject({ deliveryCents: 0, missingForFreeCents: 0 });
  expect(computeTotals([{ id: "x", qty: 1 }], p(14999), "delivery", rules)).toMatchObject({ deliveryCents: 800, missingForFreeCents: 1 });
  expect(computeTotals([{ id: "a", qty: 1 }], price, "pickup", rules)).toMatchObject({ deliveryCents: 0, missingForFreeCents: 0, totalCents: 3690 });
  expect(computeTotals([], price, "delivery", rules)).toEqual({ itemCount: 0, subtotalCents: 0, deliveryCents: 0, totalCents: 0, missingForFreeCents: 0 });
});

it("valida o checkout", () => {
  const totals = computeTotals([{ id: "a", qty: 2 }, { id: "b", qty: 1 }], price, "delivery", rules);
  const ok: CheckoutDetails = { fulfillment: "delivery", name: "João", address: "Rua das Flores, 123", neighborhood: "Pinheiros", complement: "", payment: "pix", changeFor: "", notes: "" };
  expect(validateCheckout(ok, totals)).toEqual({});
  expect(validateCheckout({ ...ok, name: " ", address: "", neighborhood: "", payment: "" }, totals)).toEqual({
    name: "Informe seu nome.", address: "Informe rua e número.", neighborhood: "Informe o bairro.", payment: "Escolha a forma de pagamento.",
  });
  expect(validateCheckout({ ...ok, fulfillment: "pickup", address: "", neighborhood: "" }, totals)).toEqual({});
  expect(validateCheckout({ ...ok, payment: "dinheiro", changeFor: "100" }, totals)).toEqual({ changeFor: "O troco precisa ser igual ou maior que o total." });
  expect(validateCheckout({ ...ok, payment: "dinheiro", changeFor: "abc" }, totals)).toEqual({ changeFor: "Valor inválido." });
  expect(validateCheckout({ ...ok, payment: "dinheiro", changeFor: "120" }, totals)).toEqual({});
  expect(validateCheckout({ ...ok, payment: "pix", changeFor: "abc" }, totals)).toEqual({});
});
