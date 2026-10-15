import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Ferro & Fumaça — Burger & Grill na Vila Madalena";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const assets = join(process.cwd(), "src/assets");
const photo = `data:image/jpeg;base64,${await readFile(join(assets, "images/scenes/hero-burger.jpg"), "base64")}`;
const stencil = await readFile(join(assets, "fonts/BigShouldersStencil-900.ttf"));
const barlow = await readFile(join(assets, "fonts/Barlow-600.ttf"));

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#12100E" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" width={1200} height={750} style={{ position: "absolute", top: -60, left: 250, width: 1000, height: 625, objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, #12100E 38%, rgba(18,16,14,0.55) 70%, rgba(18,16,14,0.1))" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", color: "#F3EADB" }}>
          <div style={{ fontFamily: "Barlow", fontSize: 30, color: "#E8501C", letterSpacing: 6 }}>BURGER & GRILL · VILA MADALENA</div>
          <div style={{ fontFamily: "Stencil", fontSize: 132, lineHeight: 0.95, marginTop: 18, display: "flex", flexDirection: "column" }}>
            <span>FERRO &</span>
            <span>FUMAÇA</span>
          </div>
          <div style={{ fontFamily: "Barlow", fontSize: 36, marginTop: 28 }}>Chapa de ferro. Fumaça de lenha.</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Stencil", data: stencil, weight: 900, style: "normal" },
        { name: "Barlow", data: barlow, weight: 600, style: "normal" },
      ],
    },
  );
}
