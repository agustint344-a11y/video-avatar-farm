/**
 * FASE 5 — fotos web reales (DuckDuckGo Images, sin API key).
 *   node scripts/fetch_bing.mjs <slug> _v3/<slug>_needphoto.json
 *
 * needphoto.json: [{ "name":"s_034", "query":"semillas de sesamo ajonjoli" }, ...]
 * Baja hasta 4 candidatas por momento a public/real/<slug>_<name>_N.jpg
 * Filtra dominios de stock/marca de agua. Después se auditan por visión (contact sheet).
 */
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const [slug, listPath] = process.argv.slice(2);
if (!slug || !listPath) {
  console.error("Uso: node scripts/fetch_bing.mjs <slug> <needphoto.json>");
  process.exit(1);
}
const OUT = path.join(process.cwd(), "public", "real");
fs.mkdirSync(OUT, { recursive: true });

const BLOCK = [
  "shutterstock", "istockphoto", "gettyimages", "dreamstime", "alamy",
  "123rf", "depositphotos", "stock.adobe", "vecteezy", "freepik",
  "lookaside", "fbsbx", "pinimg",
];
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

const getVqd = async (q) => {
  const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&iar=images&iax=images&ia=images`, {
    headers: { "User-Agent": UA },
  });
  const html = await res.text();
  const m = html.match(/vqd=["']?([\d-]+)["']?/) || html.match(/vqd=([\d-]+)&/);
  if (!m) throw new Error("no pude obtener vqd de DuckDuckGo");
  return m[1];
};

const searchImages = async (q) => {
  const vqd = await getVqd(q);
  const url = `https://duckduckgo.com/i.js?l=es-es&o=json&q=${encodeURIComponent(q)}&vqd=${vqd}&f=,,,&p=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Referer: "https://duckduckgo.com/", Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`i.js HTTP ${res.status}`);
  const data = await res.json();
  return (data.results || [])
    .map((r) => r.image)
    .filter((u) => u && /^https?:\/\//.test(u) && !BLOCK.some((b) => u.includes(b)));
};

const download = async (url, dest) => {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
  await pipeline(res.body, fs.createWriteStream(dest));
};

const items = JSON.parse(fs.readFileSync(listPath, "utf8").replace(/^﻿/, ""));
let total = 0;
for (const it of items) {
  try {
    const urls = (await searchImages(it.query)).slice(0, 4);
    let n = 0;
    for (const u of urls) {
      const ext = (u.split("?")[0].match(/\.(jpe?g|png|webp)$/i) || [".jpg"])[0].toLowerCase();
      const dest = path.join(OUT, `${slug}_${it.name}_${n + 1}${ext}`);
      try { await download(u, dest); n++; total++; } catch {}
    }
    console.log(`✓ ${it.name}: ${n} fotos ← ${it.query}`);
    await new Promise((r) => setTimeout(r, 500));
  } catch (e) {
    console.log(`✗ ${it.name}: ${e.message}`);
  }
}
console.log(`\nFotos web: ${total} bajadas → auditá por visión antes del build (contact sheet).`);
