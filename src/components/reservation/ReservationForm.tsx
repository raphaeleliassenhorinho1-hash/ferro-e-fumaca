"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { useNow } from "@/hooks/useNow";
import { addDaysISO, formatDateLongBR, getReservationSlots, RESERVATION, zonedNow } from "@/lib/hours";
import { maskPhone } from "@/lib/phone";
import {
  AREA_LABELS, generateReservationCode, MAX_PEOPLE, OCCASION_LABELS, validateDate, validateReservation,
  type Area, type Occasion, type ReservationErrors, type ReservationInput,
} from "@/lib/reservation";
import { buildReservationMessage, CONTACT_MESSAGE, whatsappUrl } from "@/lib/whatsapp";

const EMPTY: ReservationInput = { name: "", phone: "", email: "", date: "", time: "", people: 2, area: "", occasion: "", notes: "" };
const ORDER = ["name", "phone", "email", "date", "time", "people"] as const;
const input = "mt-1 w-full border border-osso/20 bg-carvao-2 px-3 py-3 text-osso placeholder:text-fumaca/60 focus:border-brasa focus:outline-none aria-[invalid=true]:border-brasa disabled:opacity-50";

export function ReservationForm() {
  const now = useNow();
  const [data, setData] = useState<ReservationInput>(EMPTY);
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [code, setCode] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (code) successRef.current?.focus();
  }, [code]);

  const today = now ? zonedNow(now).dateISO : undefined;
  const dateError = data.date && now ? validateDate(data.date, now) : undefined;
  const slots = data.date && now && !dateError ? getReservationSlots(data.date, now) : [];
  const set = <K extends keyof ReservationInput>(key: K, value: ReservationInput[K]) => setData((d) => ({ ...d, [key]: value }));
  const err = (key: keyof ReservationErrors) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `rs-${key}-erro` : undefined,
  });
  const errorText = (field: keyof ReservationErrors) =>
    errors[field] ? (
      <p id={`rs-${field}-erro`} className="mt-1 text-sm text-brasa">
        {errors[field]}
      </p>
    ) : null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validateReservation(data, new Date());
    setErrors(found);
    const first = ORDER.find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#rs-${first}`)?.focus();
      return;
    }
    setCode(generateReservationCode());
  }

  if (code) {
    return (
      <div className="bg-carvao-2 p-6 ring-1 ring-brasa/50 sm:p-10">
        <h2 ref={successRef} tabIndex={-1} className="font-display text-5xl font-black uppercase outline-none">
          Reserva solicitada!
        </h2>
        <p className="mt-3 text-osso/80">Confirme pelo WhatsApp para garantir sua mesa. Guarde o código:</p>
        <p className="mt-4 font-stencil text-6xl font-black text-brasa">{code}</p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            ["Data", formatDateLongBR(data.date)],
            ["Horário", data.time],
            ["Pessoas", String(data.people)],
            ["Área", data.area ? AREA_LABELS[data.area] : "Sem preferência"],
          ].map(([label, value]) => (
            <div key={label} className="border-l-2 border-brasa pl-3">
              <dt className="text-sm text-osso/60">{label}</dt>
              <dd className="font-semibold capitalize">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappUrl(buildReservationMessage(data, code))} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "lg")}>
            Confirmar pelo WhatsApp
          </a>
          <button
            type="button"
            className={buttonClass("outline", "lg")}
            onClick={() => {
              setData(EMPTY);
              setErrors({});
              setCode(null);
            }}
          >
            Fazer outra reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="rs-name" className="font-semibold">Nome</label>
        <input id="rs-name" autoComplete="name" className={input} value={data.name} onChange={(e) => set("name", e.target.value)} {...err("name")} />
        {errorText("name")}
      </div>
      <div>
        <label htmlFor="rs-phone" className="font-semibold">WhatsApp ou telefone</label>
        <input id="rs-phone" inputMode="tel" autoComplete="tel" placeholder="(11) 98888-7777" className={input} value={data.phone} onChange={(e) => set("phone", maskPhone(e.target.value))} {...err("phone")} />
        {errorText("phone")}
      </div>
      <div>
        <label htmlFor="rs-email" className="font-semibold">E-mail (opcional)</label>
        <input id="rs-email" type="email" autoComplete="email" className={input} value={data.email} onChange={(e) => set("email", e.target.value)} {...err("email")} />
        {errorText("email")}
      </div>
      <div>
        <label htmlFor="rs-date" className="font-semibold">Data</label>
        <input
          id="rs-date"
          type="date"
          min={today}
          max={today ? addDaysISO(today, RESERVATION.windowDays) : undefined}
          className={`${input} [color-scheme:dark]`}
          value={data.date}
          onChange={(e) => {
            set("date", e.target.value);
            set("time", "");
          }}
          aria-invalid={errors.date || dateError ? true : undefined}
          aria-describedby={errors.date || dateError ? "rs-date-erro" : undefined}
        />
        {(dateError || errors.date) && (
          <p id="rs-date-erro" className="mt-1 text-sm text-brasa">
            {dateError ?? errors.date}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="rs-time" className="font-semibold">Horário</label>
        <select id="rs-time" className={input} disabled={slots.length === 0} value={data.time} onChange={(e) => set("time", e.target.value)} {...err("time")}>
          <option value="">{data.date && !dateError && slots.length === 0 ? "Sem horários" : "Escolha"}</option>
          {slots.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {data.date && !dateError && now && slots.length === 0 && (
          <p className="mt-1 text-sm text-mostarda">{data.date === today ? "Não há mais horários hoje. Que tal amanhã?" : "Não há horários disponíveis nesta data."}</p>
        )}
        {errorText("time")}
      </div>
      <div>
        <span id="rs-people-label" className="font-semibold">Pessoas</span>
        <div className="mt-1 flex items-center gap-3">
          <button type="button" aria-label="Diminuir pessoas" disabled={data.people <= 1} onClick={() => set("people", data.people - 1)} className="grid size-12 place-items-center border border-osso/20 hover:border-brasa disabled:opacity-40">
            <Minus aria-hidden className="size-5" />
          </button>
          <output id="rs-people" tabIndex={-1} aria-live="polite" aria-labelledby="rs-people-label" className="min-w-24 text-center font-display text-2xl font-black">
            {data.people} {data.people === 1 ? "pessoa" : "pessoas"}
          </output>
          <button type="button" aria-label="Aumentar pessoas" disabled={data.people >= MAX_PEOPLE} onClick={() => set("people", data.people + 1)} className="grid size-12 place-items-center border border-osso/20 hover:border-brasa disabled:opacity-40">
            <Plus aria-hidden className="size-5" />
          </button>
        </div>
        {data.people >= MAX_PEOPLE && (
          <p className="mt-2 text-sm text-mostarda">
            Mais de 12 pessoas?{" "}
            <a href={whatsappUrl(CONTACT_MESSAGE)} target="_blank" rel="noopener noreferrer" className="underline">
              Fale com a gente sobre eventos.
            </a>
          </p>
        )}
        {errorText("people")}
      </div>
      <div>
        <label htmlFor="rs-occasion" className="font-semibold">Ocasião</label>
        <select id="rs-occasion" className={input} value={data.occasion} onChange={(e) => set("occasion", e.target.value as Occasion | "")}>
          <option value="">Nenhuma</option>
          {Object.entries(OCCASION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <fieldset className="sm:col-span-2">
        <legend className="font-semibold">Área preferida (opcional)</legend>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {(Object.entries(AREA_LABELS) as [Area, string][]).map(([value, label]) => (
            <label key={value} className="cursor-pointer border border-osso/20 px-2 py-3 text-center text-sm font-semibold has-checked:border-brasa has-checked:bg-brasa has-checked:text-carvao has-focus-visible:outline-2 has-focus-visible:outline-brasa">
              <input type="radio" name="area" value={value} checked={data.area === value} onChange={() => set("area", value)} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <label htmlFor="rs-notes" className="font-semibold">Observações (opcional)</label>
        <textarea id="rs-notes" rows={3} className={input} placeholder="Ex.: cadeira para bebê" value={data.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>
      <button type="submit" className={`${buttonClass("primary", "lg")} sm:col-span-2`}>
        Solicitar reserva
      </button>
    </form>
  );
}
