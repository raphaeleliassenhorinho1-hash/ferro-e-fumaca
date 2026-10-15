import { parseBRLToCents } from "@/lib/format";

export const MAX_QTY = 20;

export type CartLine = { id: string; qty: number };
export type CartState = { lines: CartLine[] };
export type CartAction =
  | { type: "add"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

export const EMPTY_CART: CartState = { lines: [] };

const clamp = (qty: number) => Math.min(MAX_QTY, Math.floor(qty));

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.lines.find((l) => l.id === action.id);
      if (!existing) return { lines: [...state.lines, { id: action.id, qty: 1 }] };
      return { lines: state.lines.map((l) => (l.id === action.id ? { ...l, qty: clamp(l.qty + 1) } : l)) };
    }
    case "setQty": {
      if (!state.lines.some((l) => l.id === action.id)) return state;
      const qty = clamp(action.qty);
      if (qty <= 0) return { lines: state.lines.filter((l) => l.id !== action.id) };
      return { lines: state.lines.map((l) => (l.id === action.id ? { ...l, qty } : l)) };
    }
    case "remove":
      return { lines: state.lines.filter((l) => l.id !== action.id) };
    case "clear":
      return EMPTY_CART;
    case "hydrate":
      return { lines: action.lines };
  }
}

/** Turns whatever was stored (possibly corrupted or outdated) into valid cart lines. */
export function sanitizeLines(raw: unknown, knownIds: ReadonlySet<string>): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const merged = new Map<string, number>();
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const { id, qty } = entry as { id?: unknown; qty?: unknown };
    if (typeof id !== "string" || !knownIds.has(id)) continue;
    if (typeof qty !== "number" || !Number.isFinite(qty) || qty < 1) continue;
    merged.set(id, clamp((merged.get(id) ?? 0) + Math.floor(qty)));
  }
  return [...merged].map(([id, qty]) => ({ id, qty }));
}

export type Fulfillment = "delivery" | "pickup";
export type DeliveryRules = { feeCents: number; freeFromCents: number };
export type Totals = { itemCount: number; subtotalCents: number; deliveryCents: number; totalCents: number; missingForFreeCents: number };

export function computeTotals(lines: CartLine[], priceOf: (id: string) => number, fulfillment: Fulfillment, rules: DeliveryRules): Totals {
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);
  const subtotalCents = lines.reduce((n, l) => n + l.qty * priceOf(l.id), 0);
  const isDelivery = fulfillment === "delivery" && itemCount > 0;
  const free = subtotalCents >= rules.freeFromCents;
  const deliveryCents = isDelivery && !free ? rules.feeCents : 0;
  return {
    itemCount,
    subtotalCents,
    deliveryCents,
    totalCents: subtotalCents + deliveryCents,
    missingForFreeCents: isDelivery && !free ? rules.freeFromCents - subtotalCents : 0,
  };
}

export type PaymentMethod = "pix" | "cartao" | "dinheiro";
export type CheckoutDetails = {
  fulfillment: Fulfillment;
  name: string;
  address: string;
  neighborhood: string;
  complement: string;
  payment: PaymentMethod | "";
  changeFor: string;
  notes: string;
};
export type CheckoutErrors = Partial<Record<"name" | "address" | "neighborhood" | "payment" | "changeFor", string>>;

export function validateCheckout(details: CheckoutDetails, totals: Totals): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (details.name.trim().length < 2) errors.name = "Informe seu nome.";
  if (details.fulfillment === "delivery") {
    if (!details.address.trim()) errors.address = "Informe rua e número.";
    if (!details.neighborhood.trim()) errors.neighborhood = "Informe o bairro.";
  }
  if (!details.payment) errors.payment = "Escolha a forma de pagamento.";
  if (details.payment === "dinheiro" && details.changeFor.trim()) {
    const change = parseBRLToCents(details.changeFor);
    if (change === null) errors.changeFor = "Valor inválido.";
    else if (change < totals.totalCents) errors.changeFor = "O troco precisa ser igual ou maior que o total.";
  }
  return errors;
}
