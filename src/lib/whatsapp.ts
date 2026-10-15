import { SITE } from "@/data/site";
import type { CheckoutDetails, Totals } from "@/lib/cart";
import { formatBRL, parseBRLToCents } from "@/lib/format";
import { formatDateLongBR } from "@/lib/hours";
import { AREA_LABELS, OCCASION_LABELS, type ReservationInput } from "@/lib/reservation";

export const CONTACT_MESSAGE = "Olá! Vim pelo site da Ferro & Fumaça.";

export function whatsappUrl(text: string, phone: string = SITE.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export type OrderItem = { name: string; qty: number; unitCents: number };

function paymentLabel(details: CheckoutDetails): string {
  switch (details.payment) {
    case "pix":
      return "Pix";
    case "cartao":
      return details.fulfillment === "delivery" ? "Cartão na entrega" : "Cartão na retirada";
    case "dinheiro": {
      const change = parseBRLToCents(details.changeFor);
      return change === null ? "Dinheiro" : `Dinheiro (troco para ${formatBRL(change)})`;
    }
    default:
      return "";
  }
}

export function buildOrderMessage(items: OrderItem[], totals: Totals, details: CheckoutDetails): string {
  const delivery = details.fulfillment === "delivery";
  const lines = [`*Novo pedido — ${SITE.name}*`, ""];
  for (const item of items) lines.push(`${item.qty}x ${item.name} — ${formatBRL(item.qty * item.unitCents)}`);
  lines.push("", `Subtotal: ${formatBRL(totals.subtotalCents)}`);
  if (delivery) lines.push(`Entrega: ${totals.deliveryCents === 0 ? "grátis" : formatBRL(totals.deliveryCents)}`);
  lines.push(`*Total: ${formatBRL(totals.totalCents)}*`, "");
  if (delivery) {
    const complement = details.complement.trim() ? ` (${details.complement.trim()})` : "";
    lines.push(`*Entrega:* ${details.address.trim()} — ${details.neighborhood.trim()}${complement}`);
  } else {
    lines.push("*Retirada no balcão*");
  }
  lines.push(`*Pagamento:* ${paymentLabel(details)}`, `*Nome:* ${details.name.trim()}`);
  if (details.notes.trim()) lines.push(`*Obs.:* ${details.notes.trim()}`);
  return lines.join("\n");
}

export function buildReservationMessage(input: ReservationInput, code: string): string {
  const lines = [`*Pedido de reserva — ${SITE.name}*`, `Código: ${code}`, `Nome: ${input.name.trim()}`, `Telefone: ${input.phone}`];
  if (input.email.trim()) lines.push(`E-mail: ${input.email.trim()}`);
  lines.push(`Data: ${formatDateLongBR(input.date)}`, `Horário: ${input.time}`, `Pessoas: ${input.people}`);
  if (input.area) lines.push(`Área: ${AREA_LABELS[input.area]}`);
  if (input.occasion) lines.push(`Ocasião: ${OCCASION_LABELS[input.occasion]}`);
  if (input.notes.trim()) lines.push(`Obs.: ${input.notes.trim()}`);
  return lines.join("\n");
}
