import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, trackErrors } from "./helpers";

const ROUTES: [string, string][] = [
  ["/", "Chapa de ferro. Fumaça de lenha."],
  ["/cardapio", "Feito na chapa, no fogo e na hora."],
  ["/sobre", "De um food truck a um endereço com cheiro de lenha."],
  ["/galeria", "Fumaça, chapa e gente feliz."],
  ["/reservas", "Sua mesa, sem fila."],
  ["/contato", "Chega mais."],
];

for (const [path, title] of ROUTES) {
  test(`rota ${path} abre sem erros`, async ({ page }) => {
    const errors = trackErrors(page);
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}

test("navega pelo cabeçalho (desktop)", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.getByRole("banner").getByRole("link", { name: "Galeria" }).click();
  await expect(page).toHaveURL(/\/galeria$/);
  await expect(page.getByRole("banner").getByRole("link", { name: "Galeria" })).toHaveAttribute("aria-current", "page");
});

test("menu mobile abre, navega e fecha com Esc", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "Reservas" }).click();
  await expect(page).toHaveURL(/\/reservas$/);
  await expect(dialog).toBeHidden();
  await toggle.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("rota inexistente mostra a 404", async ({ page }) => {
  const res = await page.goto("/nao-existe");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Essa passou do ponto." })).toBeVisible();
});

test.describe("status no fuso de São Paulo", () => {
  test.use({ timezoneId: "Asia/Tokyo" });
  test("visitante em Tóquio vê o status de SP", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    await page.clock.setFixedTime(new Date("2026-10-20T22:00:00Z")); // terça 19:00 em SP
    await page.goto("/");
    const banner = page.getByRole("banner");
    await expect(banner.getByText("Aberto agora")).toBeVisible();
    await expect(banner.getByText("até 23h")).toBeVisible();
  });
});
