import { expect, it } from "vitest";
import { generateReservationCode, validateReservation, type ReservationInput } from "@/lib/reservation";

const now = new Date("2026-10-15T15:00:00Z");
const ok: ReservationInput = { name: "Ana Souza", phone: "(11) 98888-7777", email: "", date: "2026-10-24", time: "20:00", people: 4, area: "varanda", occasion: "aniversario", notes: "" };
const PEOPLE = "Reservas de 1 a 12 pessoas. Para grupos maiores, fale com a gente.";
const MONDAY = "Fechamos às segundas. Escolha outro dia.";

it("aceita reserva válida", () => expect(validateReservation(ok, now)).toEqual({}));

it.each([
  [{ name: "  A " }, "name", "Informe seu nome completo."],
  [{ name: "123" }, "name", "Informe seu nome completo."],
  [{ phone: "(11) 8888-777" }, "phone", "Informe um telefone válido com DDD."],
  [{ email: "ana@" }, "email", "E-mail inválido."],
  [{ date: "" }, "date", "Escolha a data."],
  [{ date: "2026-10-19" }, "date", MONDAY],
  [{ date: "2026-10-14" }, "date", "Escolha uma data a partir de hoje."],
  [{ date: "2026-12-15" }, "date", "Reservas com até 60 dias de antecedência."],
  [{ date: "2026-12-14" }, "date", MONDAY],
  [{ time: "" }, "time", "Escolha um horário."],
  [{ date: "2026-10-20", time: "22:00" }, "time", "Horário indisponível para esta data."],
  [{ date: "2026-10-20", time: "17:30" }, "time", "Horário indisponível para esta data."],
  [{ people: 0 }, "people", PEOPLE],
  [{ people: 13 }, "people", PEOPLE],
  [{ people: 2.5 }, "people", PEOPLE],
] as const)("%o → erro em %s", (patch, field, msg) => {
  expect(validateReservation({ ...ok, ...patch }, now)).toEqual({ [field]: msg });
});

it("aceita e-mail válido e 12 pessoas", () => {
  expect(validateReservation({ ...ok, email: "ana@exemplo.com", people: 12 }, now)).toEqual({});
});

it("com data inválida não avalia o horário contra a lista", () => {
  expect(validateReservation({ ...ok, date: "2026-10-19", time: "20:00" }, now)).toEqual({ date: MONDAY });
});

it("gera código sem caracteres ambíguos", () => {
  expect(generateReservationCode(() => 0)).toBe("FF-AAAA");
  expect(generateReservationCode(() => 0.999999)).toBe("FF-9999");
  expect(generateReservationCode()).toMatch(/^FF-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/);
});
