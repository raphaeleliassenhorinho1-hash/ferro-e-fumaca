import { addDaysISO, getReservationSlots, RESERVATION, weekdayOfISO, zonedNow } from "@/lib/hours";
import { isValidPhone } from "@/lib/phone";
import { SCHEDULE } from "@/data/site";

export const AREA_LABELS = { salao: "Salão", varanda: "Varanda", balcao: "Balcão da chapa" } as const;
export const OCCASION_LABELS = { aniversario: "Aniversário", encontro: "Encontro", negocios: "Negócios", confraternizacao: "Confraternização" } as const;
export type Area = keyof typeof AREA_LABELS;
export type Occasion = keyof typeof OCCASION_LABELS;

export type ReservationInput = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  people: number;
  area: Area | "";
  occasion: Occasion | "";
  notes: string;
};
export type ReservationErrors = Partial<Record<"name" | "phone" | "email" | "date" | "time" | "people", string>>;

export const MAX_PEOPLE = 12;
export const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function validateDate(date: string, now: Date): string | undefined {
  if (!date) return "Escolha a data.";
  const today = zonedNow(now).dateISO;
  if (date < today) return "Escolha uma data a partir de hoje.";
  if (date > addDaysISO(today, RESERVATION.windowDays)) return "Reservas com até 60 dias de antecedência.";
  if (!SCHEDULE[weekdayOfISO(date)]) return "Fechamos às segundas. Escolha outro dia.";
  return undefined;
}

export function validateReservation(input: ReservationInput, now: Date): ReservationErrors {
  const errors: ReservationErrors = {};
  const name = input.name.trim();
  if (name.length < 3 || !/\p{L}/u.test(name)) errors.name = "Informe seu nome completo.";
  if (!isValidPhone(input.phone)) errors.phone = "Informe um telefone válido com DDD.";
  if (input.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) errors.email = "E-mail inválido.";
  const dateError = validateDate(input.date, now);
  if (dateError) errors.date = dateError;
  if (!input.time) errors.time = "Escolha um horário.";
  else if (!dateError && !getReservationSlots(input.date, now).includes(input.time)) errors.time = "Horário indisponível para esta data.";
  if (!Number.isInteger(input.people) || input.people < 1 || input.people > MAX_PEOPLE) {
    errors.people = "Reservas de 1 a 12 pessoas. Para grupos maiores, fale com a gente.";
  }
  return errors;
}

export function generateReservationCode(random: () => number = Math.random): string {
  let code = "FF-";
  for (let i = 0; i < 4; i++) code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  return code;
}
