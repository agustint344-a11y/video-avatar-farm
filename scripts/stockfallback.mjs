/**
 * FASE 5 — stock de Pexels.
 *   node scripts/stockfallback.mjs <slug> _v3/<slug>_needstock.json
 *
 * needstock.json: [{ "name":"s_012", "query":"chia seeds soaking water" }, ...]
 * Baja el mejor clip a public/broll/<slug>_<name>.mp4  (PREFIJADO por slug → sin colisión).
 * Requiere PEXELS_API_KEY (viene por --env-file-if-exists=.env, o export).
 */
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const [slug, listPath] = process.argv.slice(2);
const KEY = process.env.PEXELS_API_KEY;
if (!slug || !listPath) {
  console.error("Uso: node scripts/stockfallback.mjs <slug> <needstock.json>");
  process.exit(1);
}
if (!KEY) {
  console.error("Falta PEXELS_API_KEY. Ponela en .env (gratis: pexels.com/api).");
  process.exit(1);
}

const OUT = path.join(process.cwd(), "public", "broll");
fs.mkdirSync(OUT, { recursive: true });

const items = JSON.parse(fs.readFileSync(listPath, "utf8").replace(/^﻿/, ""));

/** Elige el mejor video_file: mp4, ancho <=1920, el más grande por debajo de eso. */
const pickFile = (video) => {
  const files = (video.video_files || [])
    .filter((f) => f.file_type === "video/mp4" && f.width && f.width <= 1920)
    .sort((a, b) => b.width - a.width);
  return files[0] || (video.video_files || [])[0];
};

const download = async (url, dest) => {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
  await pipeline(res.body, fs.createWriteStream(dest));
};

let ok = 0, fail = 0;
for (const it of items) {
  const name = it.name;
  const dest = path.join(OUT, `${slug}_${name}.mp4`);
  try {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(it.query)}&per_page=5&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: KEY } });
    if (!res.ok) throw new Error(`search HTTP ${res.status}`);
    const data = await res.json();
    const video = (data.videos || [])[0];
    if (!video) { console.log(`· ${name}: sin resultados para "${it.query}"`); fail++; continue; }
    const file = pickFile(video);
    if (!file?.link) { console.log(`· ${name}: sin archivo descargable`); fail++; continue; }
    await download(file.link, dest);
    console.log(`✓ ${name} ← ${it.query}  (${file.width}x${file.height})`);
    ok++;
    await new Promise((r) => setTimeout(r, 350)); // respetar rate limit
  } catch (e) {
    console.log(`✗ ${name}: ${e.message}`);
    fail++;
  }
}
console.log(`\nStock: ${ok} ok, ${fail} sin bajar → los faltantes caen a avatar/foto/IA.`);
