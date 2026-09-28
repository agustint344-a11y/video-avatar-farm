/**
 * BUILD "desinflaman-elena" (Dra. Elena Vidal) — 33 alimentos que desinflaman después de los 50. CLINIC. QR x6. Pool 48.
 * Flujo Fish + InfiniteTalk: audio master (mp3) + avatar SOLO en tramos on-camera (muteado, trimBefore).
 *   node scripts/build_colageno70.mjs
 * Salidas: src/VideoEdit/data/cues_desinflaman-elena.json  +  _v3/desinflaman-elena_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "desinflaman-elena";
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
  ["hay un fuego silencioso que", "que probablemente ya tenes en"],         // hook
  ["soy la doctora elena vidal", "cada vez que vayas a"],                   // presentación + retención
  ["y antes de empezar con", "el primer enlace de la descripcion"],        // CTA1
  ["vino a verme una paciente", "lo que habia en su"],                      // caso Marta
  ["si este video te sirvio", "te espero en el proximo video"],            // cierre
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
  ["ningun alimento por si solo", 8.5, "MythVsTruth", { theme: T, myth: "Hay un alimento milagroso que cura la inflamación.", truth: "Ninguno solo cura nada. Lo que baja el fuego es lo que comés TODOS los días, con tu tratamiento." }],
  ["y como te das cuenta", 9, "Checklist", { theme: T, title: "¿Tu fuego interno está alto?", items: ["Te levantás rígida, manos o rodillas duras", "Hinchada aunque comas poco", "Cansada sin motivo", "Más olvidos y piel apagada"] }],
  ["con estos ya pasamos los", 8, "Checklist", { theme: T, title: "Los 6 grupos bomberos", items: ["Hojas verdes y crucíferas · vegetales de colores", "Frutas del bosque y cítricos", "Grasas buenas: oliva, palta, pescado, nueces", "Especias · té verde · legumbres · yogur"] }],
  ["te armo un dia completo", 10, "Steps", { theme: T, eyebrow: "Un día de ejemplo", title: "Comer para desinflamar", steps: [{ title: "Desayuno", sub: "yogur + avena + frutos rojos + chía · té verde" }, { title: "Almuerzo", sub: "½ plato de hojas y colores con oliva + pescado o lentejas" }, { title: "Cena", sub: "verduras al horno con cúrcuma, pimienta y romero + huevo o pollo" }] }],
  ["los alimentos que mas inflaman", 9, "Checklist", { theme: T, title: "Lo que echa nafta al fuego", items: ["Azúcar y dulces industriales", "Harinas refinadas, pan blanco, galletitas", "Ultraprocesados y fritos", "Fiambres, embutidos y alcohol en exceso"] }],
  ["comer sano es caro", 8.5, "MythVsTruth", { theme: T, myth: "Comer sano es caro.", truth: "Lentejas, avena, zanahoria, ajo, repollo y sardinas están entre lo más barato… y lo más antiinflamatorio." }],
  ["paso 1", 9, "Steps", { theme: T, eyebrow: "Cómo empezar hoy", title: "Los primeros 3 pasos", steps: [{ title: "½ plato de verduras y colores", sub: "almuerzo y cena" }, { title: "Grasas buenas", sub: "oliva, palta, frutos secos, pescado graso" }, { title: "Reemplazá de a uno", sub: "fruta en vez de postre, agua en vez de gaseosa" }] }],
  ["y un paso extra", 8, "Checklist", { theme: T, title: "Y además…", items: ["Especias todos los días", "Intestino: yogur o kéfir, legumbres, fibra", "Caminata diaria de 20-30 min", "Dormir 7-8 horas"] }],
  ["ese fuego silencioso que te", 8, "PullQuote", { theme: T, quote: "Ese fuego no se apaga con una pastilla carísima: se apaga tres veces por día, cada vez que elegís qué ponés en tu plato.", author: "Dra. Elena Vidal" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS (van ENCIMA; QR exento del choque con componentes) ----------
const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "33 alimentos que desinflaman" }],
  ["inflamacion del envejecimiento", 3.8, "KeywordPop", { theme: T, word: "INFLAMACIÓN SILENCIOSA", sub: "no la sentís, pero te desgasta", pos: "center" }],
  ["la tercera el intestino cambia", 5, "Callout", { theme: T, icon: "🔥", title: "Por qué sube después de los 50", sub: "grasa abdominal · menos músculo · intestino desordenado", tone: "info" }],
  ["primer grupo las verduras", 5, "LowerThird", { theme: T, accentText: "GRUPO 1", title: "Hojas verdes", sub: "espinaca, acelga, rúcula, kale, brócoli" }],
  ["segundo grupo los vegetales", 5, "LowerThird", { theme: T, accentText: "GRUPO 2", title: "Vegetales de colores", sub: "tomate, zanahoria, calabaza, ajo, cebolla" }],
  ["tercer grupo las frutas", 5, "LowerThird", { theme: T, accentText: "GRUPO 3", title: "Frutas del bosque y cítricos", sub: "arándanos, frutillas, naranja, cerezas" }],
  ["cuarto grupo y uno de", 5, "LowerThird", { theme: T, accentText: "GRUPO 4", title: "Grasas buenas", sub: "oliva extra virgen, palta, pescado azul, nueces" }],
  ["el gran apagafuegos", 3.8, "KeywordPop", { theme: T, word: "OMEGA 3", sub: "el gran apagafuegos", pos: "center" }],
  ["quinto grupo las especias", 5, "LowerThird", { theme: T, accentText: "GRUPO 5", title: "Especias y hierbas", sub: "cúrcuma, jengibre, canela, romero, orégano" }],
  ["siempre con una pizca de", 3.8, "KeywordPop", { theme: T, word: "CÚRCUMA + PIMIENTA", sub: "sin pimienta casi no se absorbe", pos: "center" }],
  ["y el sexto grupo", 5, "LowerThird", { theme: T, accentText: "GRUPO 6", title: "Té verde, legumbres, avena, yogur", sub: "y chocolate amargo con moderación" }],
  ["la forma de cocinar tambien", 5.5, "Callout", { theme: T, icon: "🍳", title: "Truco de cocina", sub: "vapor u horno > hervido largo · ajo picado reposado · tomate con oliva", tone: "info" }],
  ["el primer beneficio es", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Menos dolor", sub: "articulaciones menos rígidas" }],
  ["el segundo beneficio es", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Más energía", sub: "la inflamación agota" }],
  ["el tercer beneficio va", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Corazón y cerebro", sub: "arterias y memoria cuidadas desde el plato" }],
  ["y el cuarto beneficio", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Piel más luminosa", sub: "se nota por fuera" }],
  ["a mi edad ya no", 3.8, "KeywordPop", { theme: T, word: "NUNCA ES TARDE", sub: "el cuerpo responde a cualquier edad", pos: "center" }],
  ["pensar que un solo alimento", 5.5, "Callout", { theme: T, icon: "⚠️", title: "El error #1", sub: "un arándano no compensa un día de azúcar y frituras", tone: "warn" }],
  ["si tomas anticoagulantes", 6, "Callout", { theme: T, icon: "⚠️", title: "Con medicación, consultá", sub: "anticoagulantes: hojas verdes estables · diabetes: ojo con la fruta", tone: "warn" }],
  ["todo el detalle con la", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía natural", items: ["La lista completa de los 33", "Recetas para combinarlos", "Plan de comidas antiinflamatorias"] }],
  // ---- QR ×6 ----
  ["en los comentarios de este video", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],   // CTA1 (~2')
  ["cuarto grupo y uno de", 7, "QRTag", { theme: T, corner: "bl", src: QR }],                // extra
  ["fijada en los comentarios", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],          // CTA2 (~9')
  ["el primer beneficio es", 7, "QRTag", { theme: T, corner: "bl", src: QR }],               // extra
  ["paso 2", 7, "QRTag", { theme: T, corner: "bl", src: QR }],                               // extra
  ["la tenes en el primer enlace", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],       // CTA3
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
