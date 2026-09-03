/**
 * Planificador de b-roll para "coins".
 * Recorre captions, detecta secciones por los títulos y coloca un candidato cada ~STEP seg.
 * Salida: _v3/coins_needphoto.json (fotos macro específicas) y _v3/coins_needstock.json (videos de movimiento).
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "captions_coins.json"), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return caps[i].startMs; } return null; };

// marcadores de sección (ms) → bucket de queries de FOTO
const markers = [
  ["__intro__", 0],
  ["The old wheat penny", null],
  ["The buffalo nickel", null],
  ["The old silver dime", null],
  ["the pile of 90", null],
  ["The silver dollar", null],
  ["The old gold coin", null],
  ["The odd old copper", null],
  ["the air coin", null],
  ["The old paper money", null],
  ["number one is not one particular", null],
].map(([p, v]) => [p, v == null ? at(p) : v]).filter(([, ms]) => ms != null).sort((a, b) => a[1] - b[1]);

const PHOTO = {
  "__intro__": ["mason jar full of old coins", "coffee can full of old coins", "hands sorting a pile of old coins", "pile of old american coins"],
  "The old wheat penny": ["wheat penny lincoln cent macro", "1909 s vdb wheat penny", "old copper wheat pennies pile", "1943 steel penny"],
  "The buffalo nickel": ["buffalo nickel coin macro", "indian head buffalo nickel", "old buffalo nickels coins"],
  "The old silver dime": ["mercury dime silver coin macro", "1916 d mercury dime", "barber silver dime coin"],
  "the pile of 90": ["pile of silver coins quarters dimes", "junk silver us coins", "standing liberty quarter coin", "walking liberty half dollar coin", "silver war nickel"],
  "The silver dollar": ["morgan silver dollar coin macro", "peace silver dollar coin", "carson city morgan dollar cc"],
  "The old gold coin": ["us gold coin double eagle", "liberty head gold coin", "saint gaudens gold coin twenty dollar"],
  "The odd old copper": ["indian head penny coin", "large cent copper coin", "two cent piece coin", "flying eagle cent"],
  "the air coin": ["doubled die penny error coin", "off center strike error coin", "1955 doubled die cent"],
  "The old paper money": ["old large size us banknote", "silver certificate dollar bill", "gold certificate note", "star note serial number bill", "national bank note old"],
  "number one is not one particular": ["old coin collection album", "hands holding old silver coins", "jar of coins spilled on table"],
};
const VIDEO = ["jar of coins spilling", "hands sorting coins close up", "old coins pile macro", "counting coins on table", "coins falling slow motion"];

const secOf = (ms) => { let s = markers[0][0]; for (const [p, m] of markers) if (ms >= m) s = p; return s; };

const STEP = 8.5; // seg
const endMs = caps[caps.length - 1].endMs;
const idxAfter = (ms) => { for (let i = 0; i < caps.length; i++) if (caps[i].startMs >= ms) return i; return -1; };

const photo = [], stock = [];
let n = 0, vi = 0;
const pick = {}; // bucket → rotating idx
for (let t = 9; t * 1000 < endMs - 4000; t += STEP) {
  const i = idxAfter(t * 1000);
  if (i < 0 || i + 5 >= caps.length) continue;
  const anchor = caps.slice(i, i + 5).map((w) => w.text).join(" ");
  const sec = secOf(caps[i].startMs);
  n++;
  const name = "s_" + String(n).padStart(3, "0");
  const isVideo = n % 4 === 0; // 1 de cada 4 = video de movimiento
  if (isVideo) {
    stock.push({ name, anchor, query: VIDEO[vi++ % VIDEO.length], src: "stock" });
  } else {
    const bucket = PHOTO[sec] || PHOTO["__intro__"];
    const k = (pick[sec] = (pick[sec] ?? 0) + 1);
    photo.push({ name, anchor, query: bucket[k % bucket.length], src: "photo" });
  }
}
fs.mkdirSync(path.join(ROOT, "_v3"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "_v3", "coins_needphoto.json"), JSON.stringify(photo, null, 1));
fs.writeFileSync(path.join(ROOT, "_v3", "coins_needstock.json"), JSON.stringify(stock, null, 1));
console.log(`secciones detectadas: ${markers.length}`);
console.log(`candidatos: ${n}  → fotos ${photo.length} · videos ${stock.length}`);
console.log("primeras fotos:", photo.slice(0, 4).map((p) => p.name + ":" + p.query).join(" | "));
