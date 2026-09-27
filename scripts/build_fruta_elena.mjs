/**
 * BUILD "fruta-elena" (Dra. Elena Vidal) — fruta antes de dormir (kiwi). CLINIC. QR x6. Pool 48.
 * Flujo Fish + InfiniteTalk: audio master (mp3) + avatar SOLO en tramos on-camera (muteado, trimBefore).
 *   node scripts/build_colageno70.mjs
 * Salidas: src/VideoEdit/data/cues_fruta-elena.json  +  _v3/fruta-elena_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "fruta-elena";
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
  ["si te cuesta dormir de un tiron", "le cambio las noches"],      // hook
  ["soy la doctora elena vidal", "volver a dormir bien"],          // presentación + retención
  ["antes de contarte cual es la fruta", "el primer enlace de la descripcion"], // CTA1
  ["vino a verme una paciente", "le devolvi sus noches"],          // caso Nélida
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
  ["los viejos duermen menos", 8, "MythVsTruth", { theme: T, myth: "Los mayores duermen menos porque necesitan menos.", truth: "Falso. A cualquier edad necesitás 7-8 horas de buen sueño. Lo que baja es la melatonina, no la necesidad. Resignarte a dormir mal cuesta caro." }],
  ["te despertas cansada", 8.5, "Checklist", { theme: T, title: "¿El mal dormir te afecta?", items: ["Te despertás cansada aunque duermas horas", "Café/mate para no caerte a media tarde", "Más irritable y olvidadiza", "Te dormís en el sillón de tarde"] }],
  ["la mas estudiada para el sueno es el kiwi", 8.5, "Checklist", { theme: T, title: "Por qué el kiwi", items: ["Serotonina: el ladrillo de la melatonina", "Folato y antioxidantes", "Fibra y agua: digestión liviana", "Estudios: te dormís antes y mejor"] }],
  ["que esperar", 8.5, "Steps", { theme: T, eyebrow: "Qué esperar", title: "El sueño vuelve, con paciencia", steps: [{ title: "Días: si el problema era leve", sub: "algunas mejoran rápido" }, { title: "Semanas: si venía de años", sub: "el cuerpo vuelve a confiar en la noche" }, { title: "La clave: no rendirse a las 2 noches", sub: "es como un jardín" }] }],
  ["come dos kiwis", 8.5, "Steps", { theme: T, eyebrow: "Cómo hacerlo", title: "El plan en 3 pasos", steps: [{ title: "2 kiwis ~1 hora antes de dormir", sub: "o cerezas / dátiles" }, { title: "Higiene del sueño", sub: "sin cafeína de tarde, sin pantallas, cena liviana" }, { title: "Rutina constante cada noche", sub: "el cuerpo ama las rutinas" }] }],
  ["el secreto no es una pastilla mas fuerte", 8, "PullQuote", { theme: T, quote: "Dormir mal con los años no es algo que tengas que aceptar. El secreto no es una pastilla más fuerte: es darle a tu cuerpo lo que necesita para volver a dormir.", author: "Dra. Elena Vidal" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS (van ENCIMA; QR exento del choque con componentes) ----------
const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "la fruta para dormir mejor" }],
  ["una hormona que se llama melatonina", 3.8, "KeywordPop", { theme: T, word: "MELATONINA", sub: "la hormona del sueño: baja con la edad", pos: "center" }],
  ["la mas estudiada para el sueno es el kiwi", 4.5, "SectionTitle", { theme: T, eyebrow: "LA PROTAGONISTA", title: "El kiwi" }],
  ["las cerezas acidas", 3.8, "KeywordPop", { theme: T, word: "CEREZAS Y DÁTILES", sub: "otras aliadas del sueño", pos: "center" }],
  ["conciliar el sueno mas rapido", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Dormir más rápido y profundo", sub: "menos despertares" }],
  ["sobre el animo y la cabeza", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Ánimo y memoria", sub: "el cerebro se limpia al dormir" }],
  ["para tu corazon y tu presion", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Corazón y presión", sub: "dormir mal la sube" }],
  ["sobre el peso y el azucar", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Peso y azúcar", sub: "el mal dormir da más hambre" }],
  ["comerla pero seguir haciendo", 5.5, "Callout", { theme: T, icon: "⚠️", title: "El error #1", sub: "la fruta no gana contra el café tarde y el celular en la cama", tone: "warn" }],
  ["cafe o mate por la tarde", 5, "Callout", { theme: T, icon: "☕", title: "Higiene del sueño", sub: "sin cafeína de tarde; luces bajas y sin pantalla antes de dormir", tone: "info" }],
  ["si tu problema para dormir es serio", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Cuándo consultar", sub: "insomnio serio, ronquidos fuertes o apnea → al médico", tone: "warn" }],
  ["todo el detalle con la fruta la hora exacta", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía natural", items: ["La fruta y la hora exacta", "Las combinaciones que ayudan", "La rutina para dormir de un tirón"] }],
  // ---- QR ×6: los 3 CTAs reales + 3 extras ----
  ["en los comentarios de este video", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],   // CTA1 (~4.5')
  ["conciliar el sueno mas rapido", 7, "QRTag", { theme: T, corner: "bl", src: QR }],         // extra (beneficio)
  ["fijada en los comentarios", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],           // CTA2 (~7.3')
  ["come dos kiwis", 7, "QRTag", { theme: T, corner: "bl", src: QR }],                        // extra (pasos)
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
