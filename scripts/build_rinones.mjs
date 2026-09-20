/**
 * BUILD "rinones-elena" (Dra. Elena Vidal) — 7 síntomas silenciosos de fallo renal. CLINIC. QR ×6.
 * Flujo Fish + InfiniteTalk: audio master (mp3) + avatar SOLO en tramos on-camera.
 *   node scripts/build_rinones.mjs
 * Salidas: cues_rinones-elena.json  +  _v3/rinones-elena_avatarcuts.json (cortes de audio en seg)
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "rinones-elena";
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

// ---------- AVATAR on-camera: pares [anchorInicio, anchorFin] ----------
const avatarBeats = [
  ["los organos mas silenciosos y mas", "sin caer en el panico"],
  ["soy la doctora elena vidal", "con calma y con informacion"],
  ["toda esta informacion como cuidar", "los que menos se conocen"],
  ["un solo sintoma de estos aislado", "ahi si hay que actuar"],
  ["si este video te sirvio", "nos vemos en el proximo video"],
];
const avatarSegs = []; const avatarCuts = []; const avatarMiss = [];
let clip = 0;
for (const [aS, aE] of avatarBeats) {
  const from = at(aS); const end = atEnd(aE);
  if (from == null || end == null || end <= from) { avatarMiss.push(`${aS} → ${aE}`); continue; }
  const dur = end - from;
  avatarSegs.push({ from, dur, clip });
  avatarCuts.push({ startSec: +(from / FPS).toFixed(3), endSec: +(end / FPS).toFixed(3), durSec: +(dur / FPS).toFixed(3) });
  clip += dur;
}
const avatarRanges = avatarSegs.map((s) => [s.from, s.from + s.dur]);
const inAvatar = (f) => avatarRanges.some(([a, b]) => f >= a - sec(0.3) && f < b + sec(0.3));

const compBeats = [
  ["controlan tu presion arterial mantienen", 7, "Checklist", { theme: T, title: "Qué hacen tus riñones", items: ["Filtran la sangre (sacan desechos)", "Controlan la presión arterial", "Equilibran minerales (sodio, potasio)", "Ayudan a fabricar glóbulos rojos"] }],
  ["con dos analisis simples alcanza", 7.5, "Checklist", { theme: T, title: "Detectarlo es fácil y barato", items: ["Sangre: creatinina → filtrado glomerular", "Orina: ¿pierde proteínas (albúmina)?", "Son de rutina, accesibles"] }],
  ["hay que tomar litros y litros", 7, "MythVsTruth", { theme: T, myth: "Hay que tomar litros de agua para 'limpiar' los riñones.", truth: "No. Con una hidratación normal alcanza. Forzar cantidades enormes no desintoxica más y en algunas personas puede ser contraproducente." }],
  ["los suplementos y los test detox", 7, "MythVsTruth", { theme: T, myth: "Los suplementos y tés 'detox' limpian los riñones.", truth: "Peligroso. Muchas hierbas, el exceso de proteína y los 'detox' pueden sobrecargar o dañar el riñón. El mejor cuidado no viene en un frasco." }],
  ["el cuidado del rinon es en", 8, "Steps", { theme: T, eyebrow: "Cómo cuidarlos", title: "Lo que de verdad los protege", steps: [{ title: "Menos sal y ultraprocesados", sub: "es el regalo más grande" }, { title: "Controlar azúcar y presión", sub: "los dos grandes enemigos" }, { title: "Moverte, no fumar, hidratarte", sub: "y no abusar de antiinflamatorios" }] }],
  ["tus rinones son silenciosos trabajadores", 7.5, "PullQuote", { theme: T, quote: "Tus riñones no te van a gritar cuando estén en problemas: te van a susurrar. Aprendé a escuchar esos susurros, porque detectar a tiempo un problema renal puede salvarte de la diálisis.", author: "Dra. Elena Vidal" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextStop = (f) => { const l = [...components.map((c) => c.from), ...avatarSegs.map((s) => s.from)].filter((x) => x > f); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "7 señales que no hay que ignorar" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["sintoma numero 1 el cansancio", 4.5, "SectionTitle", { theme: T, eyebrow: "SÍNTOMA #1", title: "Cansancio que no se va" }],
  ["produce menos de esa hormona", 3.6, "KeywordPop", { theme: T, word: "ANEMIA", sub: "menos glóbulos rojos → agotamiento", pos: "center" }],
  ["sintoma numero 2 y para", 4.5, "SectionTitle", { theme: T, eyebrow: "SÍNTOMA #2", title: "Cambios en la orina" }],
  ["primero la espuma si notas", 3.6, "KeywordPop", { theme: T, word: "ORINA ESPUMOSA", sub: "puede ser pérdida de proteínas", pos: "center" }],
  ["sintoma numero 3", 4.5, "SectionTitle", { theme: T, eyebrow: "SÍNTOMA #3", title: "Hinchazón (edema)" }],
  ["la reuni en una guia que", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["sintoma numero 4", 4.5, "SectionTitle", { theme: T, eyebrow: "SÍNTOMA #4", title: "Picazón en la piel" }],
  ["sintoma numero 5", 4.5, "SectionTitle", { theme: T, eyebrow: "SÍNTOMA #5", title: "Calambres / piernas inquietas" }],
  ["numero 6 la falta de", 4.5, "SectionTitle", { theme: T, eyebrow: "SÍNTOMA #6", title: "Falta de aire" }],
  ["sintoma numero 7 la presion", 4.5, "SectionTitle", { theme: T, eyebrow: "SÍNTOMA #7", title: "Presión arterial alta" }],
  ["ves el circulo vicioso la presion", 3.6, "KeywordPop", { theme: T, word: "CÍRCULO VICIOSO", sub: "presión ↔ riñón se dañan mutuamente", pos: "center" }],
  ["los dos grandes enemigos del rinon", 5, "Callout", { theme: T, icon: "🩸", title: "Diabetes y presión alta", sub: "las 2 grandes causas — controlate los riñones", tone: "warn" }],
  ["es una causa real y frecuente", 5.5, "Callout", { theme: T, icon: "💊", title: "Cuidado con los antiinflamatorios", sub: "tomarlos a diario por tu cuenta daña el riñón", tone: "warn" }],
  ["esos dos analisis simples", 3.6, "KeywordPop", { theme: T, word: "2 ANÁLISIS SIMPLES", sub: "sangre + orina", pos: "center" }],
  ["explicado en la guia que te", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["cocina mas en casa lee las", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía para cuidar tus riñones", items: ["Qué comer y qué evitar", "Qué análisis pedir y cada cuánto", "Lo que los protege vs. las modas"] }],
  ["no te quedes con la duda", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["detectar a tiempo un problema renal", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["gracias por regalarme estos minutos", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

// --- B-ROLL: TAPIZAR todo el tiempo sin avatar/componente (evita fondo negro) ---
// Los clips de Agnes son ~5s y no loopean, así que se tilea con clips de 5s cicleando
// el pool en orden del guión (s_01..s_22) → cobertura ~100%, avatar minoría.
const DROP = new Set((() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_drop.json`), "utf8")); } catch { return []; } })());
const stock = [];
try { stock.push(...JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_needstock.json`), "utf8").replace(/^﻿/, ""))); } catch {}
const pool = [];
for (const it of stock) { if (DROP.has(it.name)) continue; const vid = path.join(ROOT, "public", "broll", `${SLUG}_${it.name}.mp4`); if (fs.existsSync(vid)) pool.push(`broll/${SLUG}_${it.name}.mp4`); }
const CLIP = sec(5.0), MINB = sec(1.6);
// intervalos ocupados (avatar + componentes) → intervalos libres a rellenar
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
    if ((b - f - d) > 0 && (b - f - d) < MINB) d = b - f; // sin sobrantes chicos
    broll.push({ from: f, dur: d, kind: "video", src: pool[pi % pool.length], pip: false });
    pi++; f += d;
  }
}
broll.sort((x, y) => x.from - y.from);
const brollMiss = [];

const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, audioSrc: `${SLUG}.mp3`, avatarSrc: `${SLUG}_avatar.mp4`, avatarSegs, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
fs.writeFileSync(path.join(ROOT, "_v3", `${SLUG}_avatarcuts.json`), JSON.stringify(avatarCuts, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const qr = overlays.filter((o) => o.comp === "QRTag").length;
const avf = avatarSegs.reduce((s, a) => s + a.dur, 0);
const total = components.length + overlays.length + broll.length + avatarSegs.length;
console.log(`✓ avatar ${avatarSegs.length}/${avatarBeats.length} segs ~${Math.round(avf / FPS)}s${avatarMiss.length ? " MISS: " + avatarMiss.join(" | ") : ""}`);
console.log(`✓ componentes ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`✓ overlays ${overlays.length}/${ovBeats.length} (QR ${qr})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}%${brollMiss.length ? " · " + brollMiss.join(", ") : ""}`);
console.log(`✓ TOTAL ${total} beats en ${(durationInFrames / FPS / 60).toFixed(1)} min`);
