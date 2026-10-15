// Downloads the photos listed in images.manifest.json from the Unsplash CDN.
// Usage: node scripts/fetch-images.mjs [--force]
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = join(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile(join(import.meta.dirname, "images.manifest.json"), "utf8"));
const force = process.argv.includes("--force");
const SIZES = { menu: [1200, 900], scenes: [2000, 1250] };
let failed = 0;

for (const { file, id } of manifest) {
  const out = join(root, "src/assets/images", file);
  if (existsSync(out) && !force) continue;
  const [w, h] = SIZES[file.split("/")[0]];
  const url = `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&q=75&fm=jpg`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL ${file} (${res.status})`);
    failed++;
    continue;
  }
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  console.log(`ok   ${file}`);
}
process.exit(failed ? 1 : 0);
