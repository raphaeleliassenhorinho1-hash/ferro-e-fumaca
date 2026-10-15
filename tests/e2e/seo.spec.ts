import { expect, test } from "@playwright/test";

const TITLES: [string, string][] = [
  ["/", "Ferro & Fumaça · Burger & Grill na Vila Madalena"],
  ["/cardapio", "Cardápio · Ferro & Fumaça"],
  ["/sobre", "Sobre · Ferro & Fumaça"],
  ["/galeria", "Galeria · Ferro & Fumaça"],
  ["/reservas", "Reservas · Ferro & Fumaça"],
  ["/contato", "Contato · Ferro & Fumaça"],
];

test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop"));

for (const [path, title] of TITLES) {
  test(`metadados de ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  });
}

test("imagem de compartilhamento e JSON-LD", async ({ page, request }) => {
  await page.goto("/");
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  const res = await request.get(new URL(og ?? "").pathname);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
  const json = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(json["@type"]).toBe("Restaurant");
  expect(json.name).toBe("Ferro & Fumaça");
});
