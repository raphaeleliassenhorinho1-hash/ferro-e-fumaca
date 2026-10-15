import { expect, test, type Page } from "@playwright/test";

async function captureWindowOpen(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __opened: string[] };
    w.__opened = [];
    window.open = (url?: string | URL) => {
      w.__opened.push(String(url));
      return null;
    };
  });
  return async () => decodeURIComponent((await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened[0])).split("?text=")[1]);
}

test("pedido completo de delivery vai para o WhatsApp", async ({ page }) => {
  await page.goto("/cardapio");
  await page.getByRole("button", { name: "Adicionar Smash Clássico ao pedido" }).click();
  await page.getByRole("button", { name: "Adicionar Batata Rústica ao pedido" }).click();
  await page.getByRole("button", { name: "Abrir pedido (2 itens)" }).click();
  const dialog = page.getByRole("dialog", { name: "Seu pedido" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Aumentar quantidade de Smash Clássico" }).click();
  await expect(dialog.getByText(/R\$\s106,70/)).toBeVisible();

  await dialog.getByLabel("Nome").fill("João");
  await dialog.getByLabel("Endereço (rua e número)").fill("Rua das Flores, 123");
  await dialog.getByLabel("Bairro").fill("Pinheiros");
  await dialog.getByLabel("Complemento (opcional)").fill("apto 42");
  await dialog.getByText("Dinheiro", { exact: true }).click();
  await dialog.getByLabel("Troco para (opcional)").fill("120");
  await dialog.getByLabel("Observações (opcional)").fill("sem cebola & sem picles #1");

  const opened = await captureWindowOpen(page);
  await dialog.getByRole("button", { name: "Enviar pedido pelo WhatsApp" }).click();
  const text = await opened();
  expect(text).toContain("2x Smash Clássico");
  expect(text).toContain("*Total: R$ 106,70*");
  expect(text).toContain("Rua das Flores, 123 — Pinheiros (apto 42)");
  expect(text).toContain("sem cebola & sem picles #1");

  await expect(dialog.getByText("Abrimos o WhatsApp com seu pedido. É só enviar a mensagem por lá.")).toBeVisible();
  await dialog.getByRole("button", { name: "Limpar carrinho" }).click();
  await expect(page.getByRole("button", { name: "Abrir pedido (0 itens)" })).toBeVisible();
});

test("valida o checkout e aceita retirada", async ({ page }) => {
  await page.goto("/cardapio");
  await page.getByRole("button", { name: "Adicionar Onion Rings ao pedido" }).click();
  await page.getByRole("button", { name: "Abrir pedido (1 item)" }).click();
  const dialog = page.getByRole("dialog", { name: "Seu pedido" });
  await dialog.getByRole("button", { name: "Enviar pedido pelo WhatsApp" }).click();
  for (const msg of ["Informe seu nome.", "Informe rua e número.", "Informe o bairro.", "Escolha a forma de pagamento."]) {
    await expect(dialog.getByText(msg)).toBeVisible();
  }
  await expect(dialog.getByLabel("Nome")).toBeFocused();

  await dialog.getByText("Retirada", { exact: true }).click();
  await expect(dialog.getByLabel("Endereço (rua e número)")).toBeHidden();
  await dialog.getByLabel("Nome").fill("Ana");
  await dialog.getByText("Pix", { exact: true }).click();
  const opened = await captureWindowOpen(page);
  await dialog.getByRole("button", { name: "Enviar pedido pelo WhatsApp" }).click();
  const text = await opened();
  expect(text).toContain("*Retirada no balcão*");
  expect(text).not.toContain("Entrega:");
});

test("Esc fecha a gaveta e devolve o foco; carrinho vazio orienta", async ({ page }) => {
  await page.goto("/");
  const cartButton = page.getByRole("button", { name: "Abrir pedido (0 itens)" });
  await cartButton.click();
  const dialog = page.getByRole("dialog", { name: "Seu pedido" });
  await expect(dialog.getByText("Seu pedido está vazio.")).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Ver cardápio" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(cartButton).toBeFocused();
});

test("barra de pedido no celular", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/cardapio");
  await page.getByRole("button", { name: "Adicionar Trufado ao pedido" }).click();
  await page.getByRole("button", { name: /^Ver pedido \(1\)/ }).click();
  await expect(page.getByRole("dialog", { name: "Seu pedido" })).toBeVisible();
});
