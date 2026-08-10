/**
 * FASE 7 — BUILD "vitamina-venas-agustin" (Agustín Landívar) — vitamina K2 para la circulación.
 * ESTILO DOPAMÍNICO (PiP + kit + tema EARTH cálido).
 *   node scripts/build_agustin.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "vitamina-venas-agustin";
const FPS = 30;
const T = "earth";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["asi que quedate hasta esa parte", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Qué es esta vitamina olvidada", "Cómo trabaja adentro tuyo", "Cómo obtenerla bien (y quiénes NO)"] }],
  ["la vitamina no hace el trabajo", 6, "PullQuote", { theme: T, quote: "La vitamina no hace el trabajo. El que lo hace es tu cuerpo; ella solo le da la llave para empezar." }],
  ["esta vitamina destapa las arterias", 7, "MythVsTruth", { theme: T, myth: "Esta vitamina destapa las arterias y las venas.", truth: "Falso y peligroso. Ayuda a frenar que se acumule más calcio, no rompe lo que ya está. No abandones un tratamiento por esto." }],
  ["si tomo mucho calcio", 7, "MythVsTruth", { theme: T, myth: "Si tomo mucho calcio, tengo los huesos fuertes y listo.", truth: "Falso. Sin las vitaminas que lo dirigen (D y K2), ese calcio puede terminar en tus arterias. La dirección importa más que la cantidad." }],
  ["como es natural y es una vitamina", 7, "MythVsTruth", { theme: T, myth: "Es natural, puedo tomar la dosis que quiera.", truth: "No. Es liposoluble, se acumula, y más no es mejor. Natural no significa sin límites." }],
  ["con la pastilla ya esta", 7, "MythVsTruth", { theme: T, myth: "Con la pastilla ya está, no cambio nada más.", truth: "El más tramposo. Ninguna vitamina compensa el cigarrillo, el sedentarismo o el exceso de sal. Trabaja acompañada." }],
  ["la fuente mas potente del mundo", 7.5, "Checklist", { theme: T, title: "Dónde está la vitamina K2", items: ["Quesos madurados y fermentados", "La yema del huevo", "Manteca de pasto, hígado y carnes", "Fermentados: chucrut, kéfir, yogur"] }],
  ["paso uno suma estas fuentes", 8, "Steps", { theme: T, eyebrow: "Cómo aprovecharla", title: "En pasos simples", steps: [{ title: "Sumala de forma regular", sub: "constancia, no atracón" }, { title: "Comela con grasa buena", sub: "es liposoluble: se absorbe mejor" }, { title: "Acompañala: sol y caminata", sub: "la K2 es socia de la vitamina D" }] }],
  ["cuando juntas las piezas", 7.5, "Checklist", { theme: T, title: "Las 5 piezas para tus piernas", items: ["Vasos cuidados con buena comida", "Mover el segundo corazón (caminar)", "Buena hidratación", "Menos sal y ultraprocesados", "Nada de cigarrillo"] }],
  ["cuidar tu salud no es correr detras", 7, "PullQuote", { theme: T, quote: "Cuidar tu salud no es correr detrás de la última pastilla milagrosa. Es entender tu cuerpo y darle las herramientas correctas." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["soy agustin landibar", 5, "LowerThird", { theme: T, accentText: "BIENESTAR NATURAL", title: "Agustín Landívar", sub: "Medicina natural, sin humo" }],
  ["a eso los medicos lo llaman calcificacion", 3.4, "KeywordPop", { theme: T, word: "CALCIFICACIÓN", sub: "calcio en la pared del vaso", pos: "center" }],
  ["es la verdadera olvidada", 3.4, "KeywordPop", { theme: T, word: "VITAMINA K2", sub: "la hermana olvidada de la K1", pos: "bottom" }],
  ["necesitan una llave para encenderse", 3.2, "KeywordPop", { theme: T, word: "LA LLAVE", sub: "la K2 enciende la limpieza", pos: "center" }],
  ["el primer beneficio y el mas estudiado", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Arterias más flexibles", sub: "menos calcio en las paredes" }],
  ["el segundo beneficio es sobre la circulacion", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Mejor circulación", sub: "apoyo de fondo, no cura várices" }],
  ["el tercer beneficio es para tus huesos", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Huesos más fuertes", sub: "el calcio va a donde debe" }],
  ["trabajar en equipo con la vitamina", 3.4, "KeywordPop", { theme: T, word: "SOCIA: VITAMINA D", sub: "una trae el calcio, la K2 lo ubica", pos: "center" }],
  ["el segundo corazon", 3.4, "KeywordPop", { theme: T, word: "SEGUNDO CORAZÓN", sub: "la pantorrilla bombea la sangre", pos: "bottom" }],
  ["y ahora llegamos a la parte mas importante", 4, "SectionTitle", { eyebrow: "ATENCIÓN", title: "Advertencias importantes" }],
  ["si vos tomas anticoagulantes", 5.5, "Callout", { theme: T, icon: "💊", title: "Anticoagulantes: NO toques la vitamina K", sub: "warfarina / Sintrom → solo con tu médico", tone: "warn" }],
  ["no disuelve coagulos ni destapa", 5, "Callout", { theme: T, icon: "⛔", title: "No disuelve coágulos", sub: "no destapa venas ya obstruidas", tone: "warn" }],
  ["si tenes una pierna hinchada", 5, "Callout", { theme: T, icon: "🚑", title: "Pierna hinchada, roja o con dolor", sub: "es urgencia médica: consultá hoy", tone: "warn" }],
  ["esta vitamina es lo que se llama", 4.5, "Callout", { theme: T, icon: "⚠️", title: "Liposoluble: más NO es mejor", sub: "se acumula; comela con grasa buena", tone: "warn" }],
  ["si tenes una enfermedad de rinon", 5, "Callout", { theme: T, icon: "🩺", title: "Riñón, hígado, embarazo o medicación", sub: "consultá antes de sumar nada", tone: "info" }],
  ["ahora vamos a lo practico", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "De dónde sacarla" }],
  ["camina todos los dias aunque sea", 4.5, "StatChip", { theme: T, value: 30, suffix: " min", label: "de caminata al día" }],
  ["paso cuatro y el mas importante", 5, "Callout", { theme: T, icon: "👨‍⚕️", title: "¿Suplemento? Primero tu médico", sub: "sobre todo si tomás algún remedio", tone: "warn" }],
  ["la primera y la mas poderosa de todas", 3.4, "KeywordPop", { theme: T, word: "MOVIMIENTO", sub: "el mejor amigo de tu circulación", pos: "center" }],
  ["y la quinta pieza la que sostiene", 4.5, "Callout", { theme: T, icon: "🚭", title: "No fumar", sub: "el cigarrillo endurece y angosta los vasos", tone: "warn" }],
  ["te deje todo reunido en una guia", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de circulación", items: ["Las mejores fuentes de K2", "Combinaciones que funcionan", "Rutina paso a paso para tus piernas"] }],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

const IMGMAP = JSON.parse(fs.existsSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`)) ? fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`), "utf8").replace(/^﻿/, "") : "{}");
const DROP = new Set((() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_drop.json`), "utf8")); } catch { return []; } })());
const stock = [];
try { stock.push(...JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_needstock.json`), "utf8").replace(/^﻿/, ""))); } catch {}
const CAP_VID = sec(25), CAP_IMG = sec(10), MIN = sec(1.8);
const cands = [];
for (const it of stock) { if (DROP.has(it.name)) continue; const from = at(it.anchor); if (from == null) continue; const imgFile = IMGMAP[it.name]; if (imgFile && fs.existsSync(path.join(ROOT, "public", "img", imgFile))) cands.push({ from, name: it.name, kind: "image", src: `img/${imgFile}`, cap: CAP_IMG }); else { const vid = path.join(ROOT, "public", "broll", `${SLUG}_${it.name}.mp4`); if (fs.existsSync(vid)) cands.push({ from, name: it.name, kind: "video", src: `broll/${SLUG}_${it.name}.mp4`, cap: CAP_VID }); } }
cands.sort((a, b) => a.from - b.from);
const uniq = []; for (const c of cands) if (!uniq.length || c.from - uniq[uniq.length - 1].from > sec(0.5)) uniq.push(c);
const broll = []; const brollMiss = [];
for (let i = 0; i < uniq.length; i++) { const c = uniq[i]; if (inComp(c.from)) { brollMiss.push(`${c.name}(comp)`); continue; } const nextB = i + 1 < uniq.length ? uniq[i + 1].from : Infinity; const dur = Math.min(c.cap, nextB - c.from, nextCompStart(c.from) - c.from); if (dur < MIN) { brollMiss.push(`${c.name}(sliver)`); continue; } broll.push({ from: c.from, dur, kind: c.kind, src: c.src }); }

const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const total = components.length + overlays.length + broll.length;
console.log(`✓ componentes ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`✓ overlays ${overlays.length}/${ovBeats.length}${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}% (PiP)${brollMiss.length ? " · " + brollMiss.join(", ") : ""}`);
console.log(`✓ TOTAL ${total} beats en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
