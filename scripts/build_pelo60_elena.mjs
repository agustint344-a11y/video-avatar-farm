/**
 * BUILD "pelo60-elena" (Dra. Elena Vidal) — agua de ortiga+romero para la caida del pelo. CLINIC. QR x6. Pool 48.
 * Flujo Fish + InfiniteTalk: audio master (mp3) + avatar SOLO en tramos on-camera (muteado, trimBefore).
 *   node scripts/build_colageno70.mjs
 * Salidas: src/VideoEdit/data/cues_pelo60-elena.json  +  _v3/pelo60-elena_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "pelo60-elena";
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
  ["si pasaste los 60", "donde de verdad importa en la raiz"],      // hook
  ["soy la doctora elena vidal", "tu pelo con cuerpo"],             // presentación + retención
  ["antes de contarte que es", "el primer enlace de la descripcion"], // CTA1
  ["vino a verme una paciente", "contenta con ella misma otra vez"], // caso Marta
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
  ["te sentis mas cansada de lo normal", 8.5, "Checklist", { theme: T, title: "Señales de que te falta hierro", items: ["Cansancio y falta de aire", "Uñas quebradizas o con estrías", "Palidez y ojeras marcadas", "Sentís frío cuando otros no", "…y el pelo que se cae"] }],
  ["cortarte el pelo hace que crezca", 8, "MythVsTruth", { theme: T, myth: "Cortar el pelo o un champú caro frenan la caída.", truth: "El pelo crece desde la raíz (viva), no de las puntas. El champú toca la superficie y se enjuaga: no corrige una falta de hierro. Se juega en la raíz." }],
  ["una pequena farmacia natural", 8.5, "Checklist", { theme: T, title: "Qué trae la ortiga", items: ["Hierro (la falta más común de la caída)", "Sílice: hebra más gruesa y fuerte", "Zinc: la fábrica del pelo lo necesita", "Antioxidantes para el cuero cabelludo"] }],
  ["que esperar con el tiempo", 8.5, "Steps", { theme: T, eyebrow: "Qué esperar", title: "Es una carrera de fondo", steps: [{ title: "Semanas: se cae menos", sub: "menos pelo en el peine" }, { title: "Mes 2-3: pelitos nuevos en la raíz", sub: "el pelo crece 1 cm/mes" }, { title: "Mes 4-6: cambio de densidad real", sub: "el efecto acumulado" }] }],
  ["preparas la infusion poniendo", 8.5, "Steps", { theme: T, eyebrow: "Cómo hacerlo", title: "El método en 3 pasos", steps: [{ title: "Infusioná ortiga (y romero) tapada", sub: "colá y dejá entibiar" }, { title: "Tomá 1-2 tazas al día", sub: "o sumala a tu agua del día" }, { title: "Opcional: último enjuague, no lo saques", sub: "también actúa por fuera" }] }],
  ["tu pelo que se cae no es una sentencia", 8, "PullQuote", { theme: T, quote: "Tu pelo que se cae no es una sentencia: muchas veces es tu cuerpo pidiéndote nutrientes. El secreto no es el champú más caro, es alimentar la raíz.", author: "Dra. Elena Vidal" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS (van ENCIMA; QR exento del choque con componentes) ----------
const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "más pelo desde la raíz" }],
  ["es una infusion de ortiga", 4.5, "SectionTitle", { theme: T, eyebrow: "EL PROTAGONISTA", title: "Agua de ortiga y romero" }],
  ["el masaje no es un lujo", 5, "Callout", { theme: T, icon: "💆", title: "El masaje = medio tratamiento", sub: "bombea sangre y nutrientes a la raíz — y es gratis", tone: "info" }],
  ["un cabello mas grueso", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Hebra más gruesa", sub: "hierro, sílice y zinc" }],
  ["es sobre la caida en si", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Menos caída", sub: "si venía por falta de nutrientes" }],
  ["el brillo y la salud del cuero cabelludo", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Cuero cabelludo sano", sub: "la tierra fértil del pelo" }],
  ["la ortiga es buena para todo tu cuerpo", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Más energía", sub: "combate el cansancio de la anemia" }],
  ["seguir con el hierro por el piso", 5.5, "Callout", { theme: T, icon: "⚠️", title: "El error #1", sub: "no medir el hierro y abandonar a las 2 semanas", tone: "warn" }],
  ["si tomas medicacion para la presion", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Consultá antes", sub: "medicación (presión/azúcar/anticoagulantes) o embarazo → al médico", tone: "warn" }],
  ["no te suplementes hierro por tu cuenta", 5, "Callout", { theme: T, icon: "🩸", title: "Hierro: solo si el análisis lo indica", sub: "en exceso también es un problema", tone: "warn" }],
  ["carnes magras huevo legumbres", 3.8, "KeywordPop", { theme: T, word: "HIERRO · ZINC · PROTEÍNA", sub: "carnes magras, huevo, legumbres, hoja verde", pos: "center" }],
  ["todo el detalle con la receta exacta", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía natural", items: ["La receta del agua de ortiga y romero", "El enjuague y cada cuánto tomarla", "Los alimentos que fortalecen el pelo"] }],
  // ---- QR ×6: los 3 CTAs reales + 3 extras ----
  ["en los comentarios de este video", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],   // CTA1 (~4.8')
  ["un cabello mas grueso", 7, "QRTag", { theme: T, corner: "bl", src: QR }],                 // extra (beneficio)
  ["fijada en los comentarios", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],           // CTA2 (~8.6')
  ["preparas la infusion poniendo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],         // extra (pasos)
  ["la tenes en el primer enlace", 7, "QRTag", { theme: T, corner: "bl", src: QR }],          // extra (cierre)
  ["en los comentarios compartilo", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],       // CTA3 (~17.9')
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
