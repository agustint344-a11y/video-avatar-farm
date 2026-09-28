/**
 * BUILD "bebidas-rinones-elena" (Dra. Elena Vidal) — 4 bebidas matutinas para los riñones. CLINIC. QR x6. Pool 48.
 * Flujo Fish + InfiniteTalk: audio master (mp3) + avatar SOLO en tramos on-camera (muteado, trimBefore).
 *   node scripts/build_colageno70.mjs
 * Salidas: src/VideoEdit/data/cues_bebidas-rinones-elena.json  +  _v3/bebidas-rinones-elena_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "bebidas-rinones-elena";
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
  ["la forma en que arrancas", "con respaldo que le dan"],                  // hook
  ["soy la doctora elena vidal", "cosas mas inteligentes que podes"],       // presentación + retención
  ["y antes de contarte las", "el primer enlace de la descripcion"],        // CTA1
  ["vino a verme una paciente", "con la que arrancaba el"],                 // caso Teresa
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
  ["tus rinones no necesitan que", 8.5, "MythVsTruth", { theme: T, myth: "Hay que \"limpiar\" los riñones con una bebida mágica.", truth: "Tus riñones SON el filtro y se limpian solos 24 h. Vos les das las condiciones: agua y menos carga." }],
  ["tu orina es de un", 9, "Checklist", { theme: T, title: "¿Tus riñones piden agua?", items: ["Orina amarillo oscuro, no clarita", "Casi todo té, mate o gaseosa", "Cansancio, boca seca, dolor de cabeza", "Pies o tobillos hinchados a la noche"] }],
  ["tu cuerpo ya tiene su", 8.5, "MythVsTruth", { theme: T, myth: "Necesitás tés y jugos \"detox\" caros.", truth: "Tu detox ya existe: riñones e hígado. Necesitan agua, buena comida y menos sal, azúcar y alcohol." }],
  ["la estrella siempre es el", 8.5, "Checklist", { theme: T, title: "Las 4 bebidas de la mañana", items: ["Vaso de agua natural al levantarte", "Agua tibia con medio limón", "Infusión suave de jengibre", "Agua de cebada"] }],
  ["esto no es un tratamiento", 8.5, "Steps", { theme: T, eyebrow: "Qué esperar", title: "Cuidado y prevención", steps: [{ title: "Días: más energía, menos hinchazón", sub: "orina más clara" }, { title: "Meses: riñones y presión cuidados", sub: "no se siente, se construye" }, { title: "La clave: constancia", sub: "como los cimientos de una casa" }] }],
  ["paso 1", 9, "Steps", { theme: T, eyebrow: "Cómo hacerlo", title: "Mañana temprano, en 3 pasos", steps: [{ title: "Vaso de agua al levantarte", sub: "antes del café" }, { title: "Sumá UNA de las otras tres", sub: "limón, jengibre o cebada" }, { title: "Cuidá el resto del día", sub: "agua, menos sal y gaseosas, presión y azúcar" }] }],
  ["no necesitan pociones magicas", 8, "PullQuote", { theme: T, quote: "Tus riñones no necesitan pociones mágicas: necesitan agua, buenas condiciones y constancia.", author: "Dra. Elena Vidal" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS (van ENCIMA; QR exento del choque con componentes) ----------
const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "4 bebidas matutinas para tus riñones" }],
  ["tenes dos rinones del tamano", 3.8, "KeywordPop", { theme: T, word: "2 FILTROS", sub: "filtran toda tu sangre muchas veces por día", pos: "center" }],
  ["se pierde un poco la", 5.5, "Callout", { theme: T, icon: "💧", title: "Con los años baja la sed", sub: "muchos mayores andan deshidratados sin darse cuenta", tone: "info" }],
  ["la numero 1", 5, "LowerThird", { theme: T, accentText: "BEBIDA 1 · LA MÁS IMPORTANTE", title: "Un vaso de agua natural", sub: "apenas te levantás" }],
  ["la numero 2", 5, "LowerThird", { theme: T, accentText: "BEBIDA 2", title: "Agua tibia con limón", sub: "medio limón, en ayunas" }],
  ["aporta citrato una sustancia", 3.8, "KeywordPop", { theme: T, word: "CITRATO", sub: "ayuda a prevenir piedras en el riñón", pos: "center" }],
  ["la numero 3", 5, "LowerThird", { theme: T, accentText: "BEBIDA 3", title: "Infusión suave de jengibre", sub: "antiinflamatoria y tibia" }],
  ["y la numero 4", 5, "LowerThird", { theme: T, accentText: "BEBIDA 4", title: "Agua de cebada", sub: "el remedio de la abuela" }],
  ["el primer beneficio es", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Mejor eliminación", sub: "menos desechos, menos hinchazón" }],
  ["el segundo beneficio es", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Menos piedras en el riñón", sub: "hidratación + citrato" }],
  ["el tercer beneficio va", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Presión y corazón", sub: "cuidás uno, cuidás el otro" }],
  ["y el cuarto beneficio", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Energía y claridad", sub: "la deshidratación cansa y nubla" }],
  ["el error numero 1", 5.5, "Callout", { theme: T, icon: "⚠️", title: "El error #1", sub: "creer que es un \"detox\" y seguir con gaseosas y sal", tone: "warn" }],
  ["la sal en exceso y", 3.8, "KeywordPop", { theme: T, word: "SAL Y AZÚCAR", sub: "los grandes enemigos del riñón", pos: "center" }],
  ["si vos ya tenes una", 6, "Callout", { theme: T, icon: "⚠️", title: "¿Ya tenés enfermedad renal?", sub: "líquidos y potasio los decide tu nefrólogo, no un video", tone: "warn" }],
  ["todo el detalle con las", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía natural", items: ["Las recetas de las 4 bebidas", "Cantidades exactas", "Alimentos que cuidan tus riñones"] }],
  // ---- QR ×6 ----
  ["en los comentarios de este video", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],   // CTA1 (~4.5')
  ["la numero 3", 7, "QRTag", { theme: T, corner: "bl", src: QR }],                          // extra
  ["fijada en los comentarios", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],          // CTA2 (~7.3')
  ["esto no es un tratamiento", 7, "QRTag", { theme: T, corner: "bl", src: QR }],            // extra
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
