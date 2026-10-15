import { expect, it } from "vitest";
import { FAQ } from "@/data/faq";
import { GALLERY } from "@/data/gallery";
import { CATEGORIES, FEATURED, itemsByCategory, MENU, priceOf, type Tag } from "@/data/menu";
import { TESTIMONIALS } from "@/data/testimonials";
import { TIMELINE } from "@/data/timeline";

it("cardápio do spec §10", () => {
  expect(MENU).toHaveLength(26);
  expect(new Set(MENU.map((i) => i.id)).size).toBe(26);
  expect(Object.fromEntries(MENU.map((i) => [i.id, i.priceCents]))).toEqual({
    "smash-classico": 3690, "ferro-duplo": 4990, "costela-12h": 5290, "brasa-picante": 4690, trufado: 5490,
    "veggie-na-brasa": 4290, smashinho: 2990, "costela-defumada": 9890, "picanha-na-chapa": 8990,
    "ancho-maturado": 10990, "ribs-bbq": 7990, "batata-rustica": 2490, "onion-rings": 2690, "mac-and-cheese": 2990,
    "bolinhos-de-costela": 3290, "linguica-artesanal": 3490, "brownie-na-chapa": 2690, "panna-cotta": 1990,
    "shake-de-malte": 2490, "shake-de-doce-de-leite": 2490, "chope-pilsen": 1690, "chope-ipa": 2290,
    "limonada-defumada": 1490, caipirinha: 2490, refrigerante: 790, agua: 590,
  });
  expect(CATEGORIES.map((c) => [c.id, itemsByCategory(c.id).length])).toEqual([
    ["burgers", 7], ["da-brasa", 4], ["porcoes", 5], ["sobremesas", 4], ["bebidas", 6],
  ]);
  expect(FEATURED.map((i) => i.id)).toEqual(["smash-classico", "ferro-duplo", "costela-defumada", "bolinhos-de-costela"]);
  const tagged = (t: Tag) => MENU.filter((i) => i.tags.includes(t)).map((i) => i.id);
  expect(tagged("vegetariano")).toEqual(["veggie-na-brasa", "batata-rustica", "onion-rings"]);
  expect(tagged("picante")).toEqual(["brasa-picante"]);
  expect(tagged("novo")).toEqual(["costela-12h", "panna-cotta", "limonada-defumada"]);
  for (const i of MENU) {
    if (i.category === "bebidas") expect(i.image).toBeUndefined();
    else {
      expect(i.image).toBeTruthy();
      expect(i.imageAlt?.length).toBeGreaterThan(10);
    }
  }
  expect(priceOf("ghost")).toBe(0);
});

it("galeria, depoimentos, FAQ e linha do tempo", () => {
  expect(GALLERY).toHaveLength(16);
  const count = (c: string) => GALLERY.filter((p) => p.category === c).length;
  expect([count("comida"), count("ambiente"), count("bastidores")]).toEqual([6, 4, 6]);
  expect(new Set(GALLERY.map((p) => p.id)).size).toBe(16);
  expect(GALLERY.every((p) => p.alt.length > 10 && p.caption.length > 0)).toBe(true);
  expect(TESTIMONIALS).toHaveLength(3);
  expect(FAQ).toHaveLength(6);
  expect(FAQ[2].answer).toContain("R$ 150,00");
  expect(TIMELINE.map((t) => t.year)).toEqual(["2017", "2019", "2022", "2024", "2026"]);
});
