import { SCHEDULE, SITE } from "@/data/site";

export const WEEKDAY_NAMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"] as const;

export type ZonedNow = { dateISO: string; weekday: number; minutes: number };

export function weekdayOfISO(dateISO: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDaysISO(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export function zonedNow(date: Date, timeZone: string = SITE.timeZone): ZonedNow {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  const dateISO = `${parts.year}-${parts.month}-${parts.day}`;
  return { dateISO, weekday: weekdayOfISO(dateISO), minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function formatDateLongBR(dateISO: string): string {
  const [y, m, d] = dateISO.split("-");
  return `${WEEKDAY_NAMES[weekdayOfISO(dateISO)]}, ${d}/${m}/${y}`;
}

export function formatHour(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

export function describeDay(weekday: number): string {
  const day = SCHEDULE[weekday];
  if (!day) return "Fechado";
  return `${formatHour(day.open)} ${day.close === 1440 ? "à" : "às"} ${formatHour(day.close)}`;
}

export type OpenStatus = { state: "open" | "closing" | "closed"; label: string; detail: string };

export function getOpenStatus(date: Date): OpenStatus {
  const { weekday, minutes } = zonedNow(date);
  const today = SCHEDULE[weekday];
  if (today && minutes >= today.open && minutes < today.close) {
    const until = `até ${today.close === 1440 ? "meia-noite" : formatHour(today.close)}`;
    return today.close - minutes <= 30
      ? { state: "closing", label: "Fecha em breve", detail: until }
      : { state: "open", label: "Aberto agora", detail: until };
  }
  if (today && minutes < today.open) {
    return { state: "closed", label: "Fechado", detail: `abre hoje às ${formatHour(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (weekday + i) % 7;
    const day = SCHEDULE[d];
    if (day) {
      const when = i === 1 ? "amanhã" : WEEKDAY_NAMES[d];
      return { state: "closed", label: "Fechado", detail: `abre ${when} às ${formatHour(day.open)}` };
    }
  }
  return { state: "closed", label: "Fechado", detail: "" };
}

export const RESERVATION = { stepMin: 30, lastSeatingBeforeCloseMin: 90, leadMin: 60, windowDays: 60 } as const;

export function getReservationSlots(dateISO: string, now: Date): string[] {
  const { dateISO: today, minutes } = zonedNow(now);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) return [];
  if (dateISO < today || dateISO > addDaysISO(today, RESERVATION.windowDays)) return [];
  const day = SCHEDULE[weekdayOfISO(dateISO)];
  if (!day) return [];
  const slots: string[] = [];
  for (let t = day.open; t <= day.close - RESERVATION.lastSeatingBeforeCloseMin; t += RESERVATION.stepMin) {
    if (dateISO === today && t < minutes + RESERVATION.leadMin) continue;
    slots.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return slots;
}
