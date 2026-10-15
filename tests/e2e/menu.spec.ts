import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, trackErrors } from "./helpers";

test("cardápio lista categorias, adiciona itens e persiste", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/cardapio");
  for (const name of ["Burgers", "Da Brasa", "Porções", "Sobremesas & Shakes", "Bebidas"]) {
    await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
  }
  await expect(page.getByRole("button", { name: /^Adicionar .+ ao pedido$/ })).toHaveCount(26);

  await page.getByRole("button", { name: "Adicionar Smash Clássico ao pedido" }).click();
  await page.getByRole("button", { name: "Adicionar Smash Clássico ao pedido" }).click();
  await page.getByRole("button", { name: "Adicionar Batata Rústica ao pedido" }).click();
  await expect(page.getByRole("button", { name: "Abrir pedido (3 itens)" })).toBeVisible();
  await expect(page.getByText("+1 Batata Rústica no pedido")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: "Abrir pedido (3 itens)" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("carrinho salvo corrompido não quebra o site", async ({ page }) => {
  const errors = trackErrors(page);
  await page.addInitScript(() => localStorage.setItem("ff:cart:v1", "{lixo"));
  await page.goto("/cardapio");
  await expect(page.getByRole("button", { name: "Abrir pedido (0 itens)" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("navegação de categorias rola até a seção", async ({ page }) => {
  await page.goto("/cardapio");
  const nav = page.getByRole("navigation", { name: "Categorias do cardápio" });
  await nav.getByRole("link", { name: "Bebidas" }).click();
  await expect(page).toHaveURL(/#bebidas$/);
  await expect(page.getByRole("heading", { level: 2, name: "Bebidas" })).toBeInViewport();
  await expect(nav.getByRole("link", { name: "Bebidas" })).toHaveAttribute("aria-current", "true");
});
