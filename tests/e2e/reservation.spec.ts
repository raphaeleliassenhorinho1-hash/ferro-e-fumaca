import { expect, test } from "@playwright/test";
import { addDaysISO, getReservationSlots, weekdayOfISO, zonedNow } from "../../src/lib/hours";
import { expectNoHorizontalOverflow, trackErrors } from "./helpers";

function findDate(predicate: (iso: string) => boolean): string {
  const today = zonedNow(new Date()).dateISO;
  for (let i = 1; i < 30; i++) {
    const iso = addDaysISO(today, i);
    if (predicate(iso)) return iso;
  }
  throw new Error("no date found");
}

const nextOpen = findDate((iso) => getReservationSlots(iso, new Date()).length > 0);
const nextMonday = findDate((iso) => weekdayOfISO(iso) === 1);

test("envio vazio mostra os erros e foca o nome", async ({ page }) => {
  await page.goto("/reservas");
  await page.getByRole("button", { name: "Solicitar reserva" }).click();
  for (const msg of ["Informe seu nome completo.", "Informe um telefone válido com DDD.", "Escolha a data.", "Escolha um horário."]) {
    await expect(page.getByText(msg)).toBeVisible();
  }
  await expect(page.getByLabel("Nome")).toBeFocused();
});

test("segunda-feira é recusada", async ({ page }) => {
  await page.goto("/reservas");
  await page.getByLabel("Data").fill(nextMonday);
  await expect(page.getByText("Fechamos às segundas. Escolha outro dia.")).toBeVisible();
  await expect(page.getByLabel("Horário")).toBeDisabled();
});

test("reserva válida gera código e link do WhatsApp", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/reservas");
  await page.getByLabel("Nome").fill("Ana Souza");
  const phone = page.getByLabel("WhatsApp ou telefone");
  await phone.pressSequentially("11988887777");
  await expect(phone).toHaveValue("(11) 98888-7777");
  await page.getByLabel("Data").fill(nextOpen);
  const firstSlot = getReservationSlots(nextOpen, new Date())[0];
  await page.getByLabel("Horário").selectOption(firstSlot);
  await page.getByRole("button", { name: "Aumentar pessoas" }).click();
  await page.getByRole("button", { name: "Aumentar pessoas" }).click();
  await expect(page.getByText("4 pessoas")).toBeVisible();
  await page.getByText("Varanda", { exact: true }).click();
  await page.getByLabel("Ocasião").selectOption("aniversario");
  await expectNoHorizontalOverflow(page);
  await page.getByRole("button", { name: "Solicitar reserva" }).click();

  await expect(page.getByRole("heading", { name: "Reserva solicitada!" })).toBeVisible();
  const code = (await page.getByText(/^FF-[A-Z2-9]{4}$/).textContent()) ?? "";
  expect(code).toMatch(/^FF-[A-Z2-9]{4}$/);
  const href = decodeURIComponent((await page.getByRole("link", { name: "Confirmar pelo WhatsApp" }).getAttribute("href")) ?? "");
  expect(href).toContain(`Código: ${code}`);
  expect(href).toContain("Pessoas: 4");
  expect(href).toContain("Área: Varanda");

  await page.getByRole("button", { name: "Fazer outra reserva" }).click();
  await expect(page.getByLabel("Nome")).toHaveValue("");
  expect(errors).toEqual([]);
});
