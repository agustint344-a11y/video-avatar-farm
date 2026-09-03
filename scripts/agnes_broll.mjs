/**
 * B-ROLL con Agnes AI (video a medida) + Pexels de respaldo.
 *   node scripts/agnes_broll.mjs <slug> [--images] [--only s_03,s_10] [--force]
 *
 * Lee _v3/<slug>_needstock.json: [{ name, anchor, query, aprompt?, source? }]
 *   - source "pexels"  → NO lo toca Agnes (lo baja el script de Pexels).
 *   - source "agnes"|ausente → lo genera Agnes. prompt = aprompt || query (enriquecido).
 *   --images → genera IMAGEN (rápida) en vez de video para los de Agnes.
 *
 * Baja a public/broll/<slug>_<name>.mp4  (o .png con --images → luego se usa como still).
 * Lo que Agnes no logre cae a _v3/<slug>_pexels_fallback.json para stockfallback.mjs.
 *
 * Requiere AGNES_API_KEY en .env (o export). Límite video: 2 req/min → procesa de a 2.
 */
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const ROOT = process.cwd();
const [slug, ...rest] = process.argv.slice(2);
const IMAGES = rest.includes("--images");
const FORCE = rest.includes("--force");
const onlyArg = (rest.find((a) => a.startsWith("--only=")) || "").split("=")[1]
  || (rest.includes("--only") ? rest[rest.indexOf("--only") + 1] : "");
const ONLY = onlyArg ? new Set(onlyArg.split(",").map((s) => s.trim())) : null;

const KEYS = (process.env.AGNES_API_KEYS || process.env.AGNES_API_KEY || "")
  .split(",").map((s) => s.trim()).filter(Boolean);
if (!slug || !KEYS.length) {
  console.error("Uso: AGNES_API_KEYS=k1,k2 node scripts/agnes_broll.mjs <slug> [--images] [--only s_03,s_10]");
  process.exit(1);
}
const BASE = "https://apihub.agnes-ai.com";
const hdr = (key) => ({ Authorization: `Bearer ${key}`, "Content-Type": "application/json" });
const OUT = path.join(ROOT, "public", "broll");
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const items = JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${slug}_needstock.json`), "utf8").replace(/^﻿/, ""));
const agnes = items.filter((it) => (it.source || "agnes") === "agnes" && (!ONLY || ONLY.has(it.name)));
const toPexels = items.filter((it) => it.source === "pexels").map((it) => it.name);

const enrich = (it) => it.aprompt
  || `cinematic realistic footage of ${it.query}, natural lighting, shallow depth of field, professional b-roll, high detail, no text`;

const download = async (url, dest) => {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
  await pipeline(res.body, fs.createWriteStream(dest));
};

async function genImage(it, key) {
  const dest = path.join(OUT, `${slug}_${it.name}.png`);
  if (fs.existsSync(dest) && !FORCE) return { skip: true };
  const r = await fetch(`${BASE}/v1/images/generations`, {
    method: "POST", headers: hdr(key),
    body: JSON.stringify({ model: "agnes-image-2.5-flash", prompt: enrich(it), size: "1280x720" }),
  }).then((x) => x.json());
  const url = r?.data?.[0]?.url;
  if (!url) throw new Error(r?.message || r?.error?.message || "sin url");
  await download(url, dest);
}

async function submitVideo(it, key) {
  const r = await fetch(`${BASE}/v1/videos`, {
    method: "POST", headers: hdr(key),
    body: JSON.stringify({ model: "agnes-video-v2.0", prompt: enrich(it), width: 1920, height: 1080 }),
  }).then((x) => x.json());
  if (!r?.video_id) throw new Error(r?.message || r?.error?.message || JSON.stringify(r).slice(0, 120));
  return r.video_id;
}
async function pollVideo(vid, key) {
  for (let i = 0; i < 60; i++) {
    const r = await fetch(`${BASE}/agnesapi?video_id=${vid}`, { headers: hdr(key) }).then((x) => x.json());
    if (r.status === "completed") return r.url;
    if (r.status === "failed" || r.status === "error") throw new Error(r.error || "failed");
    await sleep(6000);
  }
  throw new Error("timeout");
}

const fallback = [];
const results = [];
// Cola compartida; un WORKER por key trabaja en paralelo. Cada key respeta su propio
// 1 req/min sola (submit→render ~73s→next da el espaciado). Con N keys → ~N clips/min.
let qi = 0;
const nextItem = () => (qi < agnes.length ? agnes[qi++] : null);

async function worker(key, wid) {
  let it;
  while ((it = nextItem())) {
    const ext = IMAGES ? "png" : "mp4";
    const dest = path.join(OUT, `${slug}_${it.name}.${ext}`);
    if (fs.existsSync(dest) && !FORCE) { console.log(`• ${it.name} (ya existe)`); continue; }
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      try {
        if (IMAGES) { await genImage(it, key); }
        else { const vid = await submitVideo(it, key); const url = await pollVideo(vid, key); await download(url, dest); }
        ok = true;
      } catch (e) {
        if (/rate limit/i.test(e.message) && attempt < 2) { console.log(`  …rate limit k${wid}, espero 62s (${it.name})`); await sleep(62000); }
        else { console.log(`✗ ${it.name} [k${wid}]: ${e.message} → pexels`); fallback.push(it.name); break; }
      }
    }
    if (ok) { results.push(it.name); console.log(`✓ ${it.name} [k${wid}] ← ${it.query}`); }
  }
}

console.log(`Agnes: ${agnes.length} clips · ${KEYS.length} key(s) en paralelo${IMAGES ? " · IMÁGENES" : ""}`);
await Promise.all(KEYS.map((k, i) => worker(k, i + 1)));

// Lo marcado como pexels + lo que falló Agnes → lista de respaldo para stockfallback.mjs
const pexelsAll = [...new Set([...toPexels, ...fallback])];
if (pexelsAll.length) {
  const list = items.filter((it) => pexelsAll.includes(it.name));
  fs.writeFileSync(path.join(ROOT, "_v3", `${slug}_pexels_fallback.json`), JSON.stringify(list, null, 2));
}
console.log(`\nAgnes: ${results.length} ok · fallback pexels: ${pexelsAll.length}${pexelsAll.length ? " (" + pexelsAll.join(",") + ")" : ""}`);
if (pexelsAll.length) console.log(`→ node --env-file-if-exists=.env scripts/stockfallback.mjs ${slug} _v3/${slug}_pexels_fallback.json`);
