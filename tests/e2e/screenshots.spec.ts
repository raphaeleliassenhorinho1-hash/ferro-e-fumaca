import { test } from "@playwright/test";

// Generates the README/portfolio screenshots. Run with: SHOTS=1 npx playwright test screenshots
test.skip(!process.env.SHOTS, "set SHOTS=1 to generate screenshots");
test.use({ reducedMotion: "reduce" });
test.setTimeout(120_000);

const ROUTES = [
  ["inicio", "/"],
  ["cardapio", "/cardapio"],
  ["sobre", "/sobre"],
  ["galeria", "/galeria"],
  ["reservas", "/reservas"],
  ["contato", "/contato"],
];

for (const [slug, path] of ROUTES) {
  test(`print ${slug}`, async ({ page }, info) => {
    await page.goto(path);
    for (let y = 0; y < 12000; y += 600) await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `docs/screenshots/${info.project.name}-${slug}.png` });
    await page.screenshot({ path: `test-results/shots/${info.project.name}-${slug}-full.png`, fullPage: true });
  });
}

test("print gaveta do pedido", async ({ page }, info) => {
  await page.goto("/cardapio");
  for (const name of ["Smash Clássico", "Batata Rústica", "Shake de Malte"]) {
    await page.getByRole("button", { name: `Adicionar ${name} ao pedido` }).click();
  }
  await page.getByRole("button", { name: "Abrir pedido (3 itens)" }).click();
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `docs/screenshots/${info.project.name}-pedido.png` });
});
