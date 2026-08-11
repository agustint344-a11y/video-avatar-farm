/**
 * FASE 7 — BUILD "joya-70-80-elena" (Dra. Elena Vidal) — las 8 capacidades de un envejecimiento saludable.
 * ESTILO DOPAMÍNICO + DENSO (PiP + kit + tema CLINIC). 8 joyas numeradas + componentes.
 *   node scripts/build_joya.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "joya-70-80-elena";
const FPS = 30;
const T = "clinic";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["las 8 capacidades que de verdad", 5.5, "BigNumberCard", { eyebrow: "Hoy", value: 8, suffix: "", label: "señales de que estás envejeciendo como una joya" }],
  ["cuerpo de 80 anos bien tratado", 6, "PullQuote", { theme: T, quote: "Un cuerpo de 80 años bien tratado le gana, y por lejos, a uno de 60 abandonado. Nunca es tarde para cuidarlo." }],
  ["ahi tenes las 8", 8, "Checklist", { theme: T, title: "Las 8 joyas (repaso)", items: ["Pararte de la silla sin manos", "Equilibrio en un pie", "Buen apretón / abrir frascos", "Subir escaleras sin ahogarte", "Caminar a buen paso", "Agacharte y levantarte del piso", "Dormir bien + mente clara", "Reírte, vínculos y propósito"] }],
  ["a mi edad lo que perdi", 7, "MythVsTruth", { theme: T, myth: "A mi edad, lo que perdí ya no vuelve.", truth: "Falso. El equilibrio se reentrena, la fuerza se recupera a los 70, 80 y 90, y la mente se reactiva. Nunca es tarde." }],
  ["si no puedo hacer las ocho", 7, "MythVsTruth", { theme: T, myth: "Si no puedo hacer las 8, estoy mal.", truth: "Falso. No es un examen: es un mapa. Si tenés 5, cuidá esas 5 y trabajá suave las otras 3. Se trata de avanzar." }],
  ["estas cosas se cuidan una por una", 7, "MythVsTruth", { theme: T, myth: "Cada una de estas cosas se cuida por separado.", truth: "No: están todas conectadas. Cuando caminás cuidás corazón, piernas y equilibrio a la vez. Tirás de un hilo y se mueve la red." }],
  ["son una sola red", 6, "PullQuote", { theme: T, quote: "Estas 8 cosas no son 8 islas: son una sola red. Empujá una para el lado bueno, y las demás la acompañan." }],
  ["primero la base de casi todo moverte", 8, "Steps", { theme: T, eyebrow: "Cómo cuidarlas", title: "El plan, en 4 claves", steps: [{ title: "Moverte cada día", sub: "caminar + algo de fuerza suave" }, { title: "Comer de verdad", sub: "proteína en cada comida, colores, agua" }, { title: "Sueño y mente activa", sub: "descanso + leer, charlar, aprender" }, { title: "Vínculos y propósito", sub: "reírte, ver gente, tener un para qué" }] }],
  ["envejecer bien es seguir siendo capaz", 6.5, "PullQuote", { theme: T, quote: "Envejecer bien no es ganarle al tiempo. Es seguir siendo capaz: pararte, caminar, abrazar, y tener ganas de un mañana." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["en los proximos minutos vamos", 5, "LowerThird", { theme: T, accentText: "ENVEJECER CON SALUD", title: "Dra. Elena Vidal", sub: "Tu edad real no es la del documento" }],
  ["es tu edad biologica", 3.6, "KeywordPop", { theme: T, word: "EDAD BIOLÓGICA", sub: "qué tan bien funciona tu cuerpo", pos: "center" }],
  ["levantarte de una silla sin apoyarte", 5, "LowerThird", { theme: T, accentText: "JOYA 1", title: "Pararte de la silla sin manos", sub: "piernas fuertes = independencia" }],
  ["mantener el equilibrio en un pie", 5, "LowerThird", { theme: T, accentText: "JOYA 2", title: "Equilibrio en un pie", sub: "menos caídas, más vida" }],
  ["tener un buen apreton de manos", 5, "LowerThird", { theme: T, accentText: "JOYA 3", title: "Buen apretón / abrir frascos", sub: "espejo de tu salud general" }],
  ["lo que los medicos llamamos fuerza de agarre", 3.6, "KeywordPop", { theme: T, word: "FUERZA DE AGARRE", sub: "ventana a tu vitalidad", pos: "bottom" }],
  ["subir un tramo de escaleras sin quedarte", 5, "LowerThird", { theme: T, accentText: "JOYA 4", title: "Subir escaleras sin ahogarte", sub: "buen corazón y pulmones" }],
  ["caminar a buen ritmo con paso firme", 5, "LowerThird", { theme: T, accentText: "JOYA 5", title: "Caminar a buen paso", sub: "un resumen de toda tu vitalidad" }],
  ["el sexto cisno vital", 3.6, "KeywordPop", { theme: T, word: "SEXTO SIGNO VITAL", sub: "la velocidad al caminar", pos: "center" }],
  ["y levantarte del piso", 5, "LowerThird", { theme: T, accentText: "JOYA 6", title: "Agacharte y levantarte del piso", sub: "fuerza + equilibrio + flexibilidad" }],
  ["dormir bien y tener la mente despierta", 5, "LowerThird", { theme: T, accentText: "JOYA 7", title: "Dormir bien + mente clara", sub: "dos tesoros que se cuidan entre sí" }],
  ["reirte tener con quien compartir", 5, "LowerThird", { theme: T, accentText: "JOYA 8", title: "Reírte, vínculos y propósito", sub: "quizás el secreto más grande" }],
  ["la soledad en tambio hace", 4.5, "Callout", { theme: T, icon: "❤️", title: "La soledad daña como fumar", sub: "los vínculos son salud, no un lujo", tone: "warn" }],
  ["hablarte de la parte mas importante", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Advertencias importantes" }],
  ["siempre cerca de algo firme", 5, "Callout", { theme: T, icon: "⚠️", title: "Medite, no se lastime", sub: "probá cerca de un apoyo o con alguien al lado", tone: "warn" }],
  ["si de repente perdes fuerza", 5.5, "Callout", { theme: T, icon: "🚑", title: "Cambios BRUSCOS → médico ya", sub: "fuerza en un solo lado, mareo, falta de aire", tone: "warn" }],
  ["antes de empezar cualquier ejercicio nuevo", 5, "Callout", { theme: T, icon: "🩺", title: "Consultá antes de ejercitar", sub: "empezá suave, de a poco y sin dolor", tone: "info" }],
  ["vamos a lo practico como conservar", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo recuperarlas" }],
  ["nunca es tarde para recuperar terreno", 3.4, "KeywordPop", { theme: T, word: "NUNCA ES TARDE", sub: "el cuerpo responde a cualquier edad", pos: "center" }],
  ["con el plan completo las rutinas", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía para tu fuerza", items: ["Rutina de fuerza y equilibrio", "Paso a paso según cómo estás hoy", "Fácil, en casa y segura"] }],
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
console.log(`✓ TOTAL ${total} beats · ${components.length + overlays.length} comp/ov en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
