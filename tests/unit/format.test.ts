import { expect, it } from "vitest";
import { formatBRL, parseBRLToCents } from "@/lib/format";

const R = "R$ ";

it("formata centavos em reais", () => {
  expect(formatBRL(3690)).toBe(`${R}36,90`);
  expect(formatBRL(0)).toBe(`${R}0,00`);
  expect(formatBRL(10990)).toBe(`${R}109,90`);
  expect(formatBRL(123456)).toBe(`${R}1.234,56`);
});

it("lê valores digitados em reais", () => {
  expect(parseBRLToCents("120")).toBe(12000);
  expect(parseBRLToCents("120,50")).toBe(12050);
  expect(parseBRLToCents("120.50")).toBe(12050);
  expect(parseBRLToCents("R$ 1.234,56")).toBe(123456);
  expect(parseBRLToCents("1.234")).toBe(123400);
  expect(parseBRLToCents("  50 ")).toBe(5000);
  expect(parseBRLToCents("")).toBeNull();
  expect(parseBRLToCents("abc")).toBeNull();
  expect(parseBRLToCents("12,345")).toBeNull();
});
