/**
 * BUILD "colageno70-elena" (Dra. Elena Vidal) — el alimento de $1 (huevo) para piel firme a los 70. CLINIC. QR ×6.
 * Flujo Fish + InfiniteTalk: audio master (mp3) + avatar SOLO en tramos on-camera (muteado, trimBefore).
 *   node scripts/build_colageno70.mjs
 * Salidas: src/VideoEdit/data/cues_colageno70-elena.json  +  _v3/colageno70-elena_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "colageno70-elena";
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
  ["si te miras al espejo", "donde las cremas no llegan"],       // hook
  ["soy la doctora elena vidal", "mirarte al espejo y reconocerte"], // presentación + retención
  ["y si te esta gustando entender", "el primer enlace de la descripcion"], // CTA1
  ["vino a verme a una paciente", "comida que ya tenia en su casa"], // caso Marta
  ["si este video te sirvio", "te espero en el proximo video"],  // cierre
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
  ["la piel del dorso de tu mano", 8, "Checklist", { theme: T, title: "Autochequeo: ¿bajó tu colágeno?", items: ["Pellizcás la piel de la mano y tarda en volver", "Líneas horizontales en el cuello por la mañana", "Uñas quebradizas y pelo sin cuerpo", "Es normal con la edad… y se puede reponer"] }],
  ["la molecula de colageno es enorme", 7.5, "MythVsTruth", { theme: T, myth: "La crema con colágeno rellena la piel desde afuera.", truth: "La molécula es demasiado grande para atravesar la piel: se queda en la superficie. La firmeza se fabrica DESDE ADENTRO." }],
  ["glicina y prolina el huevo", 8, "Checklist", { theme: T, title: "Los ladrillos del colágeno (en el huevo)", items: ["Glicina y prolina: los 2 ladrillos", "Proteína completa (todos los aminoácidos)", "Azufre y zinc en la yema", "Barato y en tu cocina"] }],
  ["el terror al huevo por el colesterol", 8, "MythVsTruth", { theme: T, myth: "El huevo tapa las arterias y dispara el colesterol.", truth: "En la mayoría de personas sanas no lo dispara como se creía. Si tenés colesterol alto, diabetes o problema cardíaco, la cantidad la definís con tu médico." }],
  ["se llama constancia", 7.5, "PullQuote", { theme: T, quote: "La verdadera fórmula secreta no se vende en ningún frasco: se llama constancia. Los que ganan son los que la sostienen en el tiempo.", author: "Dra. Elena Vidal" }],
  ["cocinalo de la forma mas sana", 8, "Steps", { theme: T, eyebrow: "Cómo hacerlo bien", title: "El plan en 3 pasos", steps: [{ title: "1 o 2 huevos al día", sub: "si estás sana; si no, consultá" }, { title: "Hervido, pochado o revuelto suave", sub: "poca grasa, nada de fritura" }, { title: "Siempre con vitamina C", sub: "kiwi, naranja, pimiento o limón" }] }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS (van ENCIMA; QR exento del choque con componentes) ----------
const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "piel firme a los 70, sin cremas" }],
  ["tu piel como un colchon", 5, "Callout", { theme: T, icon: "🛏️", title: "Tu piel es un colchón", sub: "la firmeza está en los resortes (colágeno), no en la tela", tone: "info" }],
  ["el colageno es literalmente", 3.6, "KeywordPop", { theme: T, word: "COLÁGENO", sub: "la proteína más abundante del cuerpo", pos: "center" }],
  ["casi un tercio en apenas", 3.8, "KeywordPop", { theme: T, word: "⅓ EN 5 AÑOS", sub: "colágeno de la piel que se pierde tras la menopausia", pos: "center" }],
  ["el estrogeno esa hormona", 3.8, "KeywordPop", { theme: T, word: "ESTRÓGENO", sub: "protegía tu colágeno; al bajar, la fábrica se frena", pos: "center" }],
  ["el alimento del que te hablo es el huevo", 4.5, "SectionTitle", { theme: T, eyebrow: "EL ALIMENTO DE $1", title: "El huevo" }],
  ["ese encendedor es la vitamina c", 5, "Callout", { theme: T, icon: "⚡", title: "Vitamina C = el encendedor", sub: "sin ella, la fábrica de colágeno no arranca", tone: "info" }],
  ["tambien necesita zinc y cobre", 3.8, "KeywordPop", { theme: T, word: "ZINC + COBRE", sub: "las herramientas del obrero (yema, frutos secos)", pos: "center" }],
  ["una piel mas firme y con menos", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Piel más firme", sub: "menos arrugas finas" }],
  ["el cuello y las manos", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Cuello y manos", sub: "las zonas que más delatan la edad" }],
  ["el pelo y las unas", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Pelo y uñas", sub: "el mismo kit de reparación" }],
  ["proteina de altisima calidad", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Músculo y saciedad", sub: "clave después de los 60" }],
  ["comer la proteina sin la vitamina c", 5.5, "Callout", { theme: T, icon: "⚠️", title: "El error #1", sub: "comer proteína SIN vitamina C = fábrica a media máquina", tone: "warn" }],
  ["nunca comas el huevo crudo", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Precauciones", sub: "nunca crudo; si tenés colesterol alto/diabetes, consultá la cantidad", tone: "warn" }],
  ["todo el protocolo con las cantidades", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de rejuvenecimiento", items: ["El alimento del colágeno y cómo tomarlo", "Las frutas para la vitamina C", "Rutina para cara, cuello y manos"] }],
  // ---- QR ×6: los 3 CTAs reales + 3 extras ----
  ["en los comentarios de este video", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],   // CTA1 (~11')
  ["una piel mas firme y con menos", 7, "QRTag", { theme: T, corner: "bl", src: QR }],        // extra (beneficio)
  ["de la descripcion y tambien fijada", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],  // CTA2 (~15.7')
  ["no fue magico ni fue rapido", 7, "QRTag", { theme: T, corner: "bl", src: QR }],           // extra (caso)
  ["cocinalo de la forma mas sana", 7, "QRTag", { theme: T, corner: "bl", src: QR }],         // extra (pasos)
  ["en los comentarios compartilo", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],       // CTA3 (~22')
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

// ---------- B-ROLL: tapizar todo lo que NO es avatar ni componente ----------
const pool = [];
for (let i = 1; i <= 22; i++) { const nm = `broll/${SLUG}_s_${String(i).padStart(2, "0")}.mp4`; if (fs.existsSync(path.join(ROOT, "public", nm))) pool.push(nm); }
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
