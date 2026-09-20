/**
 * BUILD "bicarbonato-elena" (Dra. Elena Vidal) — bicarbonato para mayores, 13 usos. CLINIC. QR x6.
 * Flujo Fish + InfiniteTalk: audio master (mp3) + avatar SOLO en tramos on-camera (muteado, trimBefore).
 *   node scripts/build_colageno70.mjs
 * Salidas: src/VideoEdit/data/cues_bicarbonato-elena.json  +  _v3/bicarbonato-elena_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "bicarbonato-elena";
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
  ["hay una caja que cuesta", "puede jugarte muy en contra"],       // hook
  ["soy la doctora elena vidal", "algun que otro susto"],           // presentación + retención
  ["lo deje reunido y explicado", "el primer enlace de la descripcion"], // CTA1
  ["vino a verme una paciente", "la estaba perjudicando"],          // caso Susana
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
  ["con un solo pote de bicarbonato", 9, "Checklist", { theme: T, title: "13 usos de un solo pote", items: ["Acidez y digestión pesada (ocasional)", "Pies: olor, durezas y baño relajante", "Piel: exfoliar suave y calmar picazón", "Boca, dientes y dentadura postiza", "Garganta, desodorante e higiene del hogar"] }],
  ["no podes alcalinizar la sangre", 8, "MythVsTruth", { theme: T, myth: "El bicarbonato 'alcaliniza el cuerpo' y cura enfermedades.", truth: "Tu cuerpo regula su pH solo (riñones y pulmones). No podés alcalinizar la sangre; lo único que sumás tomándolo a diario es SODIO." }],
  ["para la acidez ocasional media cucharadita", 8.5, "Steps", { theme: T, eyebrow: "Cómo usarlo bien", title: "Las medidas seguras", steps: [{ title: "Acidez: ½ cucharadita en agua", sub: "ocasional, no todos los días" }, { title: "Pies: un puñado en agua tibia", sub: "15-20 min, el uso más seguro" }, { title: "Boca: 1 vez por semana máximo", sub: "es abrasivo para el esmalte" }] }],
  ["si tenes presion alta tomar bicarbonato", 8, "MythVsTruth", { theme: T, myth: "Tomar bicarbonato todos los días es un hábito saludable.", truth: "Es riesgoso: es sodio (como la sal). Con presión alta, riñón o corazón puede hincharte y descompensar tu presión. Como bebida, solo ocasional." }],
  ["para usar por fuera el bicarbonato", 8, "PullQuote", { theme: T, quote: "Para usar por fuera, el bicarbonato es tu amigo casi siempre. Para tomar por dentro, es un recurso de emergencia ocasional. Ahí está toda la diferencia.", author: "Dra. Elena Vidal" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS (van ENCIMA; QR exento del choque con componentes) ----------
const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "bicarbonato: úsalo bien" }],
  ["el bicarbonato es sodio", 3.8, "KeywordPop", { theme: T, word: "SODIO = SAL", sub: "por eso, en exceso, es un riesgo", pos: "center" }],
  ["su gran superpoder es uno solo", 3.8, "KeywordPop", { theme: T, word: "NEUTRALIZA EL ÁCIDO", sub: "ese único truco explica casi todos sus usos", pos: "center" }],
  ["el primer uso y el mas conocido", 4.5, "SectionTitle", { theme: T, eyebrow: "USO", title: "Acidez y digestión" }],
  ["un regalo para tus pies", 4.5, "SectionTitle", { theme: T, eyebrow: "USO", title: "Los pies" }],
  ["el cuarto uso es la boca", 4.5, "SectionTitle", { theme: T, eyebrow: "USO", title: "Boca y dientes" }],
  ["si usas dentadura postiza", 5, "Callout", { theme: T, icon: "🦷", title: "Dentadura postiza", sub: "en remojo con bicarbonato: limpia y quita olores", tone: "info" }],
  ["hay un sexto grupo de usos", 4.5, "SectionTitle", { theme: T, eyebrow: "USO", title: "En casa" }],
  ["tomar bicarbonato disuelto en agua todos los dias", 5.5, "Callout", { theme: T, icon: "⚠️", title: "El error más común", sub: "tomarlo a diario 'para alcalinizar' = sodio de más", tone: "warn" }],
  ["media cucharadita de bicarbonato tiene", 3.8, "KeywordPop", { theme: T, word: "MUCHO SODIO", sub: "media cucharadita = casi el tope diario de algunos hipertensos", pos: "center" }],
  ["si sos diabetico o tenes mala circulacion", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Diabetes / mala circulación", sub: "cuidá tus pies; ante una herida, al médico", tone: "warn" }],
  ["cuidado con los medicamentos", 5, "Callout", { theme: T, icon: "💊", title: "Con medicación", sub: "separá el bicarbonato al menos 2 horas y consultá", tone: "warn" }],
  ["el bicarbonato no adelgaza", 4, "KeywordPop", { theme: T, word: "NO HACE MAGIA", sub: "no adelgaza, no desintoxica, no cura el cáncer", pos: "center" }],
  ["alcanza con el bicarbonato de sodio comun", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía natural", items: ["Las medidas exactas de cada uso", "Con qué combinarlo (y con qué no)", "La lista de cuándo NO usarlo"] }],
  // ---- QR ×6: los 3 CTAs reales + 3 extras ----
  ["en los comentarios de este video", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],   // CTA1 (~4.6')
  ["un regalo para tus pies", 7, "QRTag", { theme: T, corner: "bl", src: QR }],               // extra (pies)
  ["fijada en los comentarios", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],           // CTA2 (~10.5')
  ["para los pies un punado", 7, "QRTag", { theme: T, corner: "bl", src: QR }],               // extra (pasos)
  ["la tenes en el primer enlace", 7, "QRTag", { theme: T, corner: "bl", src: QR }],          // extra (cierre)
  ["en los comentarios compartilo", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],       // CTA3 (~19.6')
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
