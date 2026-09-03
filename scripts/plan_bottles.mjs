/**
 * Planificador de b-roll para "bottles" — todo Agnes (imágenes a medida).
 * Recorre captions, detecta secciones por los títulos y coloca un candidato cada ~STEP seg,
 * con un aprompt cinematográfico específico de esa botella.
 * Salida: _v3/bottles_needstock.json  [{name, anchor, query, aprompt, source:"agnes"}]
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "captions_bottles.json"), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return caps[i].startMs; } return null; };

const markers = [
  ["__intro__", 0],
  ["The embossed medicine bottle", null],
  ["The bitters bottle", null],
  ["The old soda and mineral water", null],
  ["The historical flask", null],
  ["The poison bottle", null],
  ["The ink bottle", null],
  ["The fruit jar", null],
  ["The barber bottle", null],
  ["The milk bottle", null],
  ["number one is not one particular", null],
].map(([p, v]) => [p, v == null ? at(p) : v]).filter(([, ms]) => ms != null).sort((a, b) => a[1] - b[1]);

const STYLE = ", cinematic realistic macro photograph, warm natural light, shallow depth of field, rustic antique cellar or wood-shelf background, extremely detailed, sharp focus, photorealistic, no watermark";
const SUB = {
  "__intro__": [
    "antique colored glass bottles half-buried in dark dirt at an old bottle dig site",
    "a dusty wooden cellar shelf lined with old amber and aqua glass bottles",
    "weathered hands lifting a dirty antique glass bottle out of the soil",
    "a wooden crate full of dusty antique bottles in an old barn",
  ],
  "The embossed medicine bottle": [
    "an antique aqua embossed medicine bottle with raised lettering, held to the light",
    "a group of old patent-medicine cure bottles in amber and aqua on a wood shelf",
    "a close-up of embossed lettering on an antique glass medicine bottle",
  ],
  "The bitters bottle": [
    "an antique amber cabin-shaped figural bitters bottle on dark wood",
    "a green figural fish-shaped bitters bottle under museum lighting",
    "a barrel-shaped amber bitters bottle with embossing, moody light",
  ],
  "The old soda and mineral water": [
    "an antique aqua blob-top soda bottle embossed with a town name",
    "a colorful painted-label 1950s soda pop bottle, vivid logo",
    "an old Hutchinson soda bottle with an internal wire stopper, cellar background",
  ],
  "The historical flask": [
    "an antique amber historical glass flask embossed with an American eagle",
    "an aqua early-American hand-blown portrait flask with a pontil scar",
    "an olive-green historical whiskey flask held up to the light",
  ],
  "The poison bottle": [
    "an antique cobalt blue ribbed poison bottle embossed POISON, dark moody background",
    "a skull-shaped cobalt blue poison bottle on dark wood",
    "a green ribbed coffin-shaped antique poison bottle",
  ],
  "The ink bottle": [
    "a tiny antique aqua eight-sided umbrella ink bottle on an old writing desk",
    "an antique cobalt blue teakettle ink bottle with a spout",
    "a small amber master ink bottle, hand-blown, warm light",
  ],
  "The fruit jar": [
    "an antique amber Ball Mason fruit jar glowing in warm light",
    "a cornflower blue antique canning jar with a wire bail lid on a pantry shelf",
    "an old aqua wax-sealer fruit jar with a zinc lid",
  ],
  "The barber bottle": [
    "an ornate hand-painted cobalt blue barber bottle with flowers and a pewter top",
    "a cranberry art-glass barber bottle on a vintage barbershop counter",
    "a milk-glass hand-painted antique barber bottle, elegant lighting",
  ],
  "The milk bottle": [
    "an antique embossed dairy milk bottle with a town name and cream-top neck",
    "a pyroglaze painted-label milk bottle with a red farm graphic",
    "an old cream-top milk bottle with a bulging neck on a farmhouse porch",
  ],
  "number one is not one particular": [
    "a wooden crate overflowing with colorful antique glass bottles",
    "a shelf of glowing antique bottles backlit by a dusty cellar window",
    "weathered hands sorting through a box of dusty old bottles",
  ],
};
const secOf = (ms) => { let s = markers[0][0]; for (const [p, m] of markers) if (ms >= m) s = p; return s; };
const STEP = 9.5;
const endMs = caps[caps.length - 1].endMs;
const idxAfter = (ms) => { for (let i = 0; i < caps.length; i++) if (caps[i].startMs >= ms) return i; return -1; };

const out = []; let n = 0; const pick = {};
for (let t = 9; t * 1000 < endMs - 4000; t += STEP) {
  const i = idxAfter(t * 1000);
  if (i < 0 || i + 5 >= caps.length) continue;
  const anchor = caps.slice(i, i + 5).map((w) => w.text).join(" ");
  const sec = secOf(caps[i].startMs);
  const bucket = SUB[sec] || SUB["__intro__"];
  const k = (pick[sec] = (pick[sec] ?? 0) + 1);
  const subject = bucket[k % bucket.length];
  n++;
  out.push({ name: "s_" + String(n).padStart(3, "0"), anchor, query: subject, aprompt: subject + STYLE, source: "agnes" });
}
fs.mkdirSync(path.join(ROOT, "_v3"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "_v3", "bottles_needstock.json"), JSON.stringify(out, null, 1));
console.log(`secciones: ${markers.length} | candidatos Agnes: ${n}`);
console.log("muestra:", out.slice(0, 3).map((o) => o.name + ": " + o.query.slice(0, 40)).join(" | "));
