import { describe, expect, it } from "vitest";
import { addDaysISO, describeDay, formatDateLongBR, getOpenStatus, getReservationSlots, zonedNow } from "@/lib/hours";

// São Paulo = UTC−3; 2026-10-15 is a Thursday
const at = (iso: string) => new Date(iso);

it("converte para o dia de São Paulo, não o de UTC", () => {
  expect(zonedNow(at("2026-10-20T01:30:00Z"))).toEqual({ dateISO: "2026-10-19", weekday: 1, minutes: 22 * 60 + 30 });
});

it.each([
  ["2026-10-19T23:00:00Z", "closed", "Fechado", "abre amanhã às 18h"],
  ["2026-10-20T20:00:00Z", "closed", "Fechado", "abre hoje às 18h"],
  ["2026-10-20T22:00:00Z", "open", "Aberto agora", "até 23h"],
  ["2026-10-21T01:45:00Z", "closing", "Fecha em breve", "até 23h"],
  ["2026-10-21T02:00:00Z", "closed", "Fechado", "abre amanhã às 18h"],
  ["2026-10-24T02:00:00Z", "open", "Aberto agora", "até meia-noite"],
  ["2026-10-24T02:40:00Z", "closing", "Fecha em breve", "até meia-noite"],
  ["2026-10-24T03:30:00Z", "closed", "Fechado", "abre hoje às 12h"],
  ["2026-10-26T01:30:00Z", "closed", "Fechado", "abre terça às 18h"],
])("status em %s", (iso, state, label, detail) => {
  expect(getOpenStatus(at(iso))).toEqual({ state, label, detail });
});

it("descreve dias e datas", () => {
  expect(describeDay(1)).toBe("Fechado");
  expect(describeDay(2)).toBe("18h às 23h");
  expect(describeDay(5)).toBe("18h à 0h");
  expect(describeDay(0)).toBe("12h às 22h");
  expect(formatDateLongBR("2026-10-24")).toBe("sábado, 24/10/2026");
  expect(addDaysISO("2026-10-15", 60)).toBe("2026-12-14");
  expect(addDaysISO("2026-12-31", 1)).toBe("2027-01-01");
});

describe("horários de reserva", () => {
  const now = at("2026-10-15T15:00:00Z");
  it("gera de 30 em 30 até fechamento − 90 min", () => {
    expect(getReservationSlots("2026-10-20", now)).toEqual(["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]);
    const sex = getReservationSlots("2026-10-23", now);
    expect([sex.length, sex[0], sex.at(-1)]).toEqual([10, "18:00", "22:30"]);
    const sab = getReservationSlots("2026-10-24", now);
    expect([sab.length, sab[0], sab.at(-1)]).toEqual([22, "12:00", "22:30"]);
    const dom = getReservationSlots("2026-10-25", now);
    expect([dom.length, dom[0], dom.at(-1)]).toEqual([18, "12:00", "20:30"]);
  });
  it("respeita fechado, passado e janela de 60 dias", () => {
    expect(getReservationSlots("2026-10-19", now)).toEqual([]);
    expect(getReservationSlots("2026-10-14", now)).toEqual([]);
    expect(getReservationSlots("2026-12-13", now)).toHaveLength(18);
    expect(getReservationSlots("2026-12-15", now)).toEqual([]);
  });
  it("para hoje, só a partir de agora + 60 min", () => {
    expect(getReservationSlots("2026-10-20", at("2026-10-20T22:10:00Z"))).toEqual(["20:30", "21:00", "21:30"]);
    expect(getReservationSlots("2026-10-20", at("2026-10-21T00:40:00Z"))).toEqual([]);
  });
});
