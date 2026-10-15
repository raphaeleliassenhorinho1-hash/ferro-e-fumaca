"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { MENU_BY_ID, priceOf } from "@/data/menu";
import { SITE } from "@/data/site";
import { computeTotals, validateCheckout, type CartLine, type CheckoutDetails, type CheckoutErrors, type PaymentMethod } from "@/lib/cart";
import { formatBRL } from "@/lib/format";
import { buildOrderMessage, whatsappUrl } from "@/lib/whatsapp";

const EMPTY: CheckoutDetails = { fulfillment: "delivery", name: "", address: "", neighborhood: "", complement: "", payment: "", changeFor: "", notes: "" };
const FIELD_ORDER = ["name", "address", "neighborhood", "payment", "changeFor"] as const;

const inputClass = "mt-1 w-full border border-osso/20 bg-carvao px-3 py-2.5 text-osso placeholder:text-fumaca/60 focus:border-brasa focus:outline-none aria-[invalid=true]:border-brasa";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} className="mt-1 text-sm text-brasa">
          {error}
        </p>
      )}
    </div>
  );
}

function Segmented<T extends string>({ legend, name, value, options, onChange, error }: {
  legend: string; name: string; value: T | ""; options: { value: T; label: string }[]; onChange(v: T): void; error?: string;
}) {
  return (
    <fieldset id={`co-${name}`} tabIndex={-1} aria-describedby={error ? `co-${name}-erro` : undefined}>
      <legend className="text-sm font-semibold">{legend}</legend>
      <div className="mt-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer border border-osso/20 px-2 py-2.5 text-center text-sm font-semibold has-checked:border-brasa has-checked:bg-brasa has-checked:text-carvao has-focus-visible:outline-2 has-focus-visible:outline-brasa">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={`co-${name}-erro`} className="mt-1 text-sm text-brasa">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function CheckoutForm({ lines, onSent }: { lines: CartLine[]; onSent(): void }) {
  const [details, setDetails] = useState<CheckoutDetails>(EMPTY);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const delivery = details.fulfillment === "delivery";
  const totals = computeTotals(lines, priceOf, details.fulfillment, SITE.delivery);

  const set = <K extends keyof CheckoutDetails>(key: K, value: CheckoutDetails[K]) => setDetails((d) => ({ ...d, [key]: value }));

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validateCheckout(details, totals);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#co-${first}`)?.focus();
      return;
    }
    const items = lines.flatMap((l) => {
      const item = MENU_BY_ID.get(l.id);
      return item ? [{ name: item.name, qty: l.qty, unitCents: item.priceCents }] : [];
    });
    window.open(whatsappUrl(buildOrderMessage(items, totals, details)), "_blank", "noopener");
    onSent();
  }

  const invalid = (key: keyof CheckoutErrors) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `co-${key}-erro` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      <dl className="space-y-1.5 border-y border-osso/15 py-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-osso/75">Subtotal</dt>
          <dd>{formatBRL(totals.subtotalCents)}</dd>
        </div>
        {delivery && (
          <div className="flex justify-between">
            <dt className="text-osso/75">Entrega</dt>
            <dd>{totals.deliveryCents === 0 ? "grátis" : formatBRL(totals.deliveryCents)}</dd>
          </div>
        )}
        {totals.missingForFreeCents > 0 && (
          <p className="text-xs text-mostarda">Faltam {formatBRL(totals.missingForFreeCents)} para o frete grátis.</p>
        )}
        <div className="flex justify-between pt-1 font-display text-xl font-black uppercase">
          <dt>Total</dt>
          <dd>{formatBRL(totals.totalCents)}</dd>
        </div>
      </dl>

      <Segmented
        legend="Como você quer receber?"
        name="fulfillment"
        value={details.fulfillment}
        options={[{ value: "delivery", label: "Delivery" }, { value: "pickup", label: "Retirada" }]}
        onChange={(v) => set("fulfillment", v)}
      />

      <Field id="co-name" label="Nome" error={errors.name}>
        <input id="co-name" className={inputClass} autoComplete="name" value={details.name} onChange={(e) => set("name", e.target.value)} {...invalid("name")} />
      </Field>

      {delivery && (
        <>
          <Field id="co-address" label="Endereço (rua e número)" error={errors.address}>
            <input id="co-address" className={inputClass} autoComplete="street-address" value={details.address} onChange={(e) => set("address", e.target.value)} {...invalid("address")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field id="co-neighborhood" label="Bairro" error={errors.neighborhood}>
              <input id="co-neighborhood" className={inputClass} value={details.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} {...invalid("neighborhood")} />
            </Field>
            <Field id="co-complement" label="Complemento (opcional)">
              <input id="co-complement" className={inputClass} value={details.complement} onChange={(e) => set("complement", e.target.value)} />
            </Field>
          </div>
        </>
      )}

      <Segmented<PaymentMethod>
        legend="Pagamento"
        name="payment"
        value={details.payment}
        options={[
          { value: "pix", label: "Pix" },
          { value: "cartao", label: delivery ? "Cartão na entrega" : "Cartão na retirada" },
          { value: "dinheiro", label: "Dinheiro" },
        ]}
        onChange={(v) => set("payment", v)}
        error={errors.payment}
      />

      {details.payment === "dinheiro" && (
        <Field id="co-changeFor" label="Troco para (opcional)" error={errors.changeFor}>
          <input id="co-changeFor" className={inputClass} inputMode="decimal" placeholder="Ex.: 150" value={details.changeFor} onChange={(e) => set("changeFor", e.target.value)} {...invalid("changeFor")} />
        </Field>
      )}

      <Field id="co-notes" label="Observações (opcional)">
        <textarea id="co-notes" rows={2} className={inputClass} placeholder="Ex.: sem cebola" value={details.notes} onChange={(e) => set("notes", e.target.value)} />
      </Field>

      <button type="submit" className="w-full bg-brasa px-5 py-4 font-display text-lg font-black uppercase tracking-wider text-carvao transition-colors hover:bg-osso">
        Enviar pedido pelo WhatsApp
      </button>
    </form>
  );
}
