import { expect, it } from "vitest";
import { isValidPhone, maskPhone, onlyDigits } from "@/lib/phone";

it("aplica máscara progressiva", () => {
  expect(maskPhone("")).toBe("");
  expect(maskPhone("1")).toBe("(1");
  expect(maskPhone("11")).toBe("(11");
  expect(maskPhone("119")).toBe("(11) 9");
  expect(maskPhone("1198888")).toBe("(11) 9888-8");
  expect(maskPhone("1133334444")).toBe("(11) 3333-4444");
  expect(maskPhone("11988887777")).toBe("(11) 98888-7777");
  expect(maskPhone("(11) 98888-777712")).toBe("(11) 98888-7777");
});

it("valida telefone brasileiro", () => {
  expect(onlyDigits("(11) 98888-7777")).toBe("11988887777");
  expect(isValidPhone("(11) 98888-7777")).toBe(true);
  expect(isValidPhone("(11) 3333-4444")).toBe(true);
  expect(isValidPhone("(11) 88888-7777")).toBe(false);
  expect(isValidPhone("(10) 3333-4444")).toBe(false);
  expect(isValidPhone("(11) 3333-444")).toBe(false);
});
