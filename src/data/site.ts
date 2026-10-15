export const SITE = {
  name: "Ferro & Fumaça",
  tagline: "Burger & Grill",
  description: "Smash burgers na chapa, costela defumada na lenha de laranjeira e chope gelado na Vila Madalena.",
  address: { street: "Rua das Brasas, 450", district: "Vila Madalena", city: "São Paulo – SP" },
  mapsQuery: "Vila Madalena, São Paulo",
  phoneDisplay: "(11) 1777-0450",
  whatsapp: "", // digits with country code, e.g. "5511999999999"; empty in the demo
  instagram: "", // optional handle; hidden when empty
  timeZone: "America/Sao_Paulo",
  delivery: { feeCents: 800, freeFromCents: 15000, radiusKm: 5 },
  developer: { name: "Raphael Elias Senhorinho" },
  foundedYear: 2017,
  copyrightYear: 2026,
} as const;

/** Minutes since 00:00; close ≤ 1440 (1440 = midnight). */
export type DaySchedule = { open: number; close: number } | null;

/** Indexed by weekday, 0 = Sunday. */
export const SCHEDULE: readonly DaySchedule[] = [
  { open: 720, close: 1320 },
  null,
  { open: 1080, close: 1380 },
  { open: 1080, close: 1380 },
  { open: 1080, close: 1380 },
  { open: 1080, close: 1440 },
  { open: 720, close: 1440 },
];
