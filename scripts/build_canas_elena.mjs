/**
 * BUILD "canas-elena" (Dra. Elena Vidal) — aceite de romero para oscurecer canas. CLINIC. QR x6. Pool 48.
 * Flujo Fish + InfiniteTalk: audio master (mp3) + avatar SOLO en tramos on-camera (muteado, trimBefore).
 *   node scripts/build_colageno70.mjs
 * Salidas: src/VideoEdit/data/cues_canas-elena.json  +  _v3/canas-elena_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "canas-elena";
const FPS = 30;
const T = "clinic";
const QR = "img/qr_guia.png";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const atEnd = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i + N - 1].endMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

// ---------- AVATAR on-camera (minoría): [inicio, fin], cap por ventana ----------
const MAXWIN = sec(42);
const avatarBeats = [
  ["y si te dijera que hay una forma", "mientras vos descansas"],   // hook
  ["soy la doctora elena vidal", "tu propio espejo"],               // presentación + retención
  ["lo deje reunido y explicado", "el primer enlace de la descripcion"], // CTA1
  ["vino a verme una paciente", "olor a amoniaco"],                 // caso Rosa
  ["si este video te sirvio", "te espero en el proximo video"],     // cierre
];
const avatarSegs = []; const avatarCuts = []; const avatarMiss = [];
let clip = 0;
for (const [aS, aE] of avatarBeats) {
  const from = at(aS); let end = atEnd(aE);
  if (from == null || end == null || end <= from) { avatarMiss.push(`${aS} → ${aE}`); continue; }
  let dur = end - from; if (dur > MAXWIN) dur = MAXWIN;
  avatarSegs.push({ from, dur, clip });
  avatarCuts.push({ startSec: +(from / FPS).toFixed(3), endSec: +((from + dur) / FPS).toFixed(3), durSec: +(dur / FPS).toFixed(3) });
  clip += dur;
}
const avatarRanges = avatarSegs.map((s) => [s.from, s.from + s.dur]);
const inAvatar = (f) => avatarRanges.some(([a, b]) => f >= a - sec(0.3) && f < b + sec(0.3));

// ---------- COMPONENTES full-screen (tapan avatar/b-roll) ----------
const compBeats = [
  ["el estres sostenido por ejemplo", 8.5, "Checklist", { theme: T, title: "Qué acelera las canas", items: ["Genética (no se elige)", "Estrés crónico sostenido", "Mala alimentación (faltan minerales)", "Cigarrillo", "Tiroides o anemia"] }],
  ["no te arranques una cana", 8, "MythVsTruth", { theme: T, myth: "Si te arrancás una cana, salen siete.", truth: "Falso. De cada folículo sale UN solo pelo. Pero no las arranques igual: tironear lastima el folículo y lo debilita." }],
  ["que esperar con el tiempo", 8.5, "Steps", { theme: T, eyebrow: "Qué esperar", title: "Es una carrera de fondo", steps: [{ title: "Semana 1: brillo y suavidad", sub: "el color todavía no cambia" }, { title: "Mes 1: tono más parejo", sub: "canas menos marcadas" }, { title: "Mes 2-3: color natural + menos caída", sub: "el efecto acumulado" }] }],
  ["funciona mucho mejor y se nota mas", 8, "MythVsTruth", { theme: T, myth: "Oscurece igual cualquier color de pelo.", truth: "Se nota mucho más en castaños y oscuros. En rubios o pelo totalmente blanco el color casi no cambia: ahí lo aprovechás por brillo, salud y menos caída." }],
  ["consegui un buen aceite base", 8.5, "Steps", { theme: T, eyebrow: "Cómo hacerlo", title: "El método en 3 pasos", steps: [{ title: "Aceite base + romero (y salvia)", sub: "infusionado; esencial siempre diluido" }, { title: "De noche: aplicá y masajeá 3-5 min", sub: "el masaje activa la circulación" }, { title: "Cubrí, dormí y lavá a la mañana", sub: "2-3 noches por semana" }] }],
  ["el secreto no es esconder la edad", 8, "PullQuote", { theme: T, quote: "Tus canas no son una sentencia. El secreto no es esconder la edad: es cuidarte con cariño y dejar que el color y el brillo vuelvan solos.", author: "Dra. Elena Vidal" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS (van ENCIMA; QR exento del choque con componentes) ----------
const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "canas: el aceite que las oscurece" }],
  ["fabrican un pigmento que se llama melanina", 3.8, "KeywordPop", { theme: T, word: "MELANINA", sub: "el pigmento que le da color a tu pelo", pos: "center" }],
  ["el aceite del que te hablo", 4.5, "SectionTitle", { theme: T, eyebrow: "EL PROTAGONISTA", title: "Aceite de romero y salvia" }],
  ["el romero hace dos cosas", 5, "Callout", { theme: T, icon: "🌿", title: "El romero hace 2 cosas", sub: "mejora la circulación y aporta tono oscuro", tone: "info" }],
  ["y por eso se aplica de noche", 5, "Callout", { theme: T, icon: "🌙", title: "Por eso, de noche", sub: "8 horas para nutrir la raíz mientras dormís", tone: "info" }],
  ["el oscurecimiento gradual", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Oscurece las canas", sub: "gradual y natural" }],
  ["es sobre la caida del cabello", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Menos caída", sub: "el romero fortalece la raíz" }],
  ["el brillo y la textura", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Brillo y textura", sub: "sella la fibra, se ve joven" }],
  ["la salud del cuero cabelludo", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Cuero cabelludo sano", sub: "la base de todo pelo sano" }],
  ["antes de usarlo en todo", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Antes de empezar", sub: "prueba de alergia; el esencial de romero, nunca puro", tone: "warn" }],
  ["si estas embarazada o amamantando", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Cuándo consultar", sub: "embarazo, epilepsia, cuero lastimado o medicación → al médico", tone: "warn" }],
  ["los minerales como el cobre", 3.8, "KeywordPop", { theme: T, word: "COBRE · ZINC · HIERRO", sub: "la materia prima del pigmento (comida)", pos: "center" }],
  ["todo el detalle con la receta", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía natural", items: ["La receta exacta del aceite", "El masaje y cada cuánto aplicarlo", "Los alimentos que cuidan tu color"] }],
  // ---- QR ×6: los 3 CTAs reales + 3 extras ----
  ["en los comentarios de este video", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],   // CTA1 (~5.2')
  ["el oscurecimiento gradual", 7, "QRTag", { theme: T, corner: "bl", src: QR }],             // extra (beneficio)
  ["fijada en los comentarios", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],           // CTA2 (~8.7')
  ["consegui un buen aceite base", 7, "QRTag", { theme: T, corner: "bl", src: QR }],          // extra (pasos)
  ["la tenes en el primer enlace", 7, "QRTag", { theme: T, corner: "bl", src: QR }],          // extra (cierre)
  ["en los comentarios compartilo", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],       // CTA3 (~18')
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

// ---------- B-ROLL: tapizar todo lo que NO es avatar ni componente ----------
const pool = [];
for (let i = 1; i <= 48; i++) { const nm = `broll/${SLUG}_s_${String(i).padStart(2, "0")}.mp4`; if (fs.existsSync(path.join(ROOT, "public", nm))) pool.push(nm); }
const CLIP = sec(5.0), MINB = sec(1.6);
const blocked = [...avatarRanges, ...compRanges].sort((a, b) => a[0] - b[0]);
const merged = [];
for (const r of blocked) { if (merged.length && r[0] <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]); else merged.push([r[0], r[1]]); }
const free = []; let cur = 0;
for (const [a, b] of merged) { if (a > cur) free.push([cur, a]); cur = Math.max(cur, b); }
if (cur < durationInFrames) free.push([cur, durationInFrames]);
const broll = []; let pi = 0;
for (const [a, b] of free) {
  let f = a;
  while (b - f >= MINB) {
    let d = Math.min(CLIP, b - f);
    if ((b - f - d) > 0 && (b - f - d) < MINB) d = b - f;
    broll.push({ from: f, dur: d, kind: "video", src: pool[pi % pool.length], pip: false });
    pi++; f += d;
  }
}
broll.sort((x, y) => x.from - y.from);

const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, audioSrc: `${SLUG}.mp3`, avatarSrc: `${SLUG}_avatar.mp4`, avatarSegs, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
fs.mkdirSync(path.join(ROOT, "_v3"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "_v3", `${SLUG}_avatarcuts.json`), JSON.stringify(avatarCuts, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const qr = overlays.filter((o) => o.comp === "QRTag").length;
const avf = avatarSegs.reduce((s, a) => s + a.dur, 0);
console.log(`✓ avatar ${avatarSegs.length}/${avatarBeats.length} segs ~${Math.round(avf / FPS)}s (clip usa ${Math.round(clip / FPS)}s de 268s)${avatarMiss.length ? " MISS: " + avatarMiss.join(" | ") : ""}`);
console.log(`✓ componentes ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`✓ overlays ${overlays.length}/${ovBeats.length} (QR ${qr})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}%`);
console.log(`✓ TOTAL ${components.length + overlays.length + broll.length + avatarSegs.length} beats · ${(durationInFrames / FPS / 60).toFixed(1)} min`);
