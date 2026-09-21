/**
 * BUILD "garbanzo-elena" (Dra. Elena Vidal) — garbanzo para la fuerza (sarcopenia). CLINIC. QR x6. Pool 48.
 * Flujo Fish + InfiniteTalk: audio master (mp3) + avatar SOLO en tramos on-camera (muteado, trimBefore).
 *   node scripts/build_colageno70.mjs
 * Salidas: src/VideoEdit/data/cues_garbanzo-elena.json  +  _v3/garbanzo-elena_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "garbanzo-elena";
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
  ["si te cuesta levantarte de la silla", "se llama sarcopenia"],   // hook
  ["soy la doctora elena vidal", "sin depender de nadie"],          // presentación + retención
  ["antes de contarte como comer", "el primer enlace de la descripcion"], // CTA1
  ["vino a verme una paciente", "le devolvi la independencia"],     // caso Dora
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
  ["te cuesta levantarte de una silla baja", 8.5, "Checklist", { theme: T, title: "¿Estás perdiendo músculo?", items: ["Te cuesta pararte de la silla sin los brazos", "Aflojó la fuerza de la mano", "Caminás más lento o te cansás", "Brazos y piernas más finos o blandos"] }],
  ["una taza de garbanzos cocidos", 8.5, "Checklist", { theme: T, title: "Qué trae el garbanzo", items: ["Proteína vegetal (los ladrillos del músculo)", "Fibra: energía pareja y saciedad", "Hierro, magnesio, potasio y zinc", "Barato y en tu alacena"] }],
  ["combinar el garbanzo con un cereal", 8, "MythVsTruth", { theme: T, myth: "La proteína del garbanzo es incompleta, no sirve.", truth: "Combinado con un cereal (arroz o pan) es tan completo como la carne, más barato y con fibra. El truco de las abuelas." }],
  ["que esperar con el tiempo", 8.5, "Steps", { theme: T, eyebrow: "Qué esperar", title: "El músculo vuelve, despacio", steps: [{ title: "Semanas 2-3: más energía", sub: "menos esfuerzo en lo de siempre" }, { title: "Mes 1-1½: más fuerza real", sub: "te levantás con menos esfuerzo" }, { title: "Mes 2-3: fuerza y estabilidad claras", sub: "piernas y brazos más firmes" }] }],
  ["suma el garbanzo a tu semana", 8.5, "Steps", { theme: T, eyebrow: "Cómo hacerlo", title: "El plan en 3 pasos", steps: [{ title: "Garbanzo varias veces + un cereal", sub: "guiso, ensalada, hummus, tostado" }, { title: "Proteína en cada comida", sub: "no solo el garbanzo" }, { title: "Ejercicio de fuerza suave a diario", sub: "silla, puntas de pie, botellita" }] }],
  ["perder fuerza con los anos no es", 8, "PullQuote", { theme: T, quote: "Nunca es tarde. Tu músculo responde a cualquier edad; solo está esperando que le des el material y la orden para volver a construir.", author: "Dra. Elena Vidal" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS (van ENCIMA; QR exento del choque con componentes) ----------
const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "recuperá tu fuerza" }],
  ["se llama sarcopenia", 3.8, "KeywordPop", { theme: T, word: "SARCOPENIA", sub: "la pérdida de músculo con la edad", pos: "center" }],
  ["el musculo es tu red de seguridad", 5, "Callout", { theme: T, icon: "🛟", title: "El músculo = tu red de seguridad", sub: "sin él, una caída no se amortigua", tone: "info" }],
  ["mas fuerza y mas musculo", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Más fuerza y músculo", sub: "levantarte sin empujarte" }],
  ["el equilibrio y la proteccion", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Equilibrio", sub: "tu mejor seguro contra caídas" }],
  ["el azucar y la energia", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Azúcar y energía", sub: "la fibra libera energía pareja" }],
  ["la digestion y la saciedad", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Digestión y saciedad", sub: "fibra que te ordena y te llena" }],
  ["comer la proteina pero no mover", 5.5, "Callout", { theme: T, icon: "⚠️", title: "El error #1", sub: "comer proteína SIN moverte: los ladrillos se quedan quietos", tone: "warn" }],
  ["si tenes una enfermedad renal", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Enfermedad renal", sub: "definí la proteína con tu médico; no la subas por tu cuenta", tone: "warn" }],
  ["proteina mas movimiento", 3.8, "KeywordPop", { theme: T, word: "PROTEÍNA + MOVIMIENTO", sub: "ninguna de las dos sola alcanza", pos: "center" }],
  ["lo deje reunido y explicado", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía natural", items: ["Cuánto garbanzo y cómo prepararlo", "Las combinaciones para proteína completa", "La rutina de ejercicios suaves en casa"] }],
  // ---- QR ×6: los 3 CTAs reales + 3 extras ----
  ["en los comentarios de este video", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],   // CTA1 (~5.1')
  ["mas fuerza y mas musculo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],              // extra (beneficio)
  ["fijada en los comentarios", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],           // CTA2 (~7.6')
  ["suma el garbanzo a tu semana", 7, "QRTag", { theme: T, corner: "bl", src: QR }],          // extra (pasos)
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
