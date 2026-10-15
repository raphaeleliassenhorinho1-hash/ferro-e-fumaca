import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, trackErrors } from "./helpers";

test("início: seções, favoritos e chamada final", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Chapa de ferro. Fumaça de lenha." })).toBeVisible();
  for (const name of ["Os mais pedidos", "Do açougue à chapa", "Um food truck que criou raízes", "Quem prova, volta", "Direto da chapa", "Bateu a fome?"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await page.getByRole("button", { name: "Adicionar Ferro Duplo ao pedido" }).click();
  await expect(page.getByRole("button", { name: "Abrir pedido (1 item)" })).toBeVisible();
  await page.getByRole("button", { name: "Fazer pedido" }).click();
  await expect(page.getByRole("dialog", { name: "Seu pedido" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "Ver cardápio" }).first().click();
  await expect(page).toHaveURL(/\/cardapio$/);
  expect(errors).toEqual([]);
});

test("sobre: pilares, linha do tempo e números", async ({ page }) => {
  await page.goto("/sobre");
  for (const name of ["Carne", "Pão", "Fumaça", "Chope"]) await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
  for (const year of ["2017", "2019", "2022", "2024", "2026"]) await expect(page.getByText(year, { exact: true })).toBeVisible();
  await expect(page.getByText("250 mil", { exact: true })).toBeVisible();
});

test("contato: WhatsApp, horários, FAQ, mapa e telefone", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/contato");
  const wa = page.getByRole("link", { name: "Chamar no WhatsApp" });
  expect(decodeURIComponent((await wa.getAttribute("href")) ?? "")).toBe("https://wa.me/?text=Olá! Vim pelo site da Ferro & Fumaça.");
  await expect(wa).toHaveAttribute("target", "_blank");
  const table = page.getByRole("table", { name: "Horários de funcionamento" });
  await expect(table.getByRole("row")).toHaveCount(7);
  await expect.poll(() => table.locator('tr[aria-current="date"]').count()).toBe(1);
  await page.getByText("Qual a área de entrega?").click();
  await expect(page.getByText(/grátis em pedidos a partir de R\$\s150,00/)).toBeVisible();
  await expect(page.getByTitle("Mapa da região da Vila Madalena")).toBeAttached();
  await expect(page.locator("main").getByText("(11) 1777-0450")).toBeVisible();
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("galeria: filtros e visualizador", async ({ page }) => {
  await page.goto("/galeria");
  const thumbs = page.getByRole("button", { name: /^Ampliar foto/ });
  await expect(thumbs).toHaveCount(16);
  for (const [label, n] of [["Ambiente", 4], ["Bastidores", 6], ["Comida", 6], ["Todos", 16]] as const) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect(page.getByRole("button", { name: label, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(thumbs).toHaveCount(n);
  }
  await thumbs.first().click();
  const viewer = page.getByRole("dialog", { name: "Visualizador de fotos" });
  await expect(viewer.getByText("1 / 16")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(viewer.getByText("2 / 16")).toBeVisible();
  await viewer.getByRole("button", { name: "Próxima foto" }).click();
  await expect(viewer.getByText("3 / 16")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
  await expect(thumbs.first()).toBeFocused();

  await page.getByRole("button", { name: "Ambiente", exact: true }).click();
  await thumbs.first().click();
  await expect(viewer.getByText("1 / 4")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(viewer.getByText("4 / 4")).toBeVisible();
});
