/**
 * FASE 7 — BUILD "sarcopenia-elena" (Dra. Elena Vidal) — el queso vs la sarcopenia / músculo en la vejez.
 * ESTILO DOPAMÍNICO + DENSO (PiP + kit + tema CLINIC). Regla del canal: 35-45 componentes/overlays.
 *   node scripts/build_sarcopenia.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "sarcopenia-elena";
const FPS = 30;
const T = "clinic";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["asi que quedate hasta el final", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Qué es la sarcopenia (la enemiga silenciosa)", "El alimento que la combate y por qué", "El error que arruina todo el esfuerzo"] }],
  ["se calcula que una persona mayor", 6, "BigNumberCard", { eyebrow: "Dato clave", value: 5, suffix: "%", label: "de músculo por década tras los 60 (más si te quedás quieto)" }],
  ["el musculo es tu independencia", 6, "PullQuote", { theme: T, quote: "El músculo no es estética: es tu independencia. Pelear por tu músculo es pelear por tu libertad." }],
  ["el queso es una joya", 7.5, "Checklist", { theme: T, title: "Por qué el queso es una joya", items: ["Proteína concentrada (mucha en poco)", "Leucina: enciende el músculo mayor", "Calcio, B12 y K2: también cuida el hueso"] }],
  ["hicimos dos cosas simples", 6.5, "Steps", { theme: T, eyebrow: "Caso real · Doña Marta (74)", title: "Lo que hicimos", steps: [{ title: "Proteína en cada comida", sub: "huevo o queso, carne/pescado, legumbres" }, { title: "Ejercicios de fuerza simples", sub: "en la silla, en casa" }, { title: "Constancia (meses, no días)", sub: "volvió a pararse sola de la silla" }] }],
  ["la comida sin ejercicio es una obra", 6.5, "PullQuote", { theme: T, quote: "La comida sin ejercicio es una obra sin albañil. El ejercicio sin comida, un albañil sin ladrillos. Necesitás las dos." }],
  ["a mi edad ya no puedo ganar", 7, "MythVsTruth", { theme: T, myth: "A mi edad ya no puedo ganar músculo, ya es tarde.", truth: "Falso. En estudios, personas de más de 90 años ganaron fuerza con ejercicio. Nunca es tarde para empezar." }],
  ["pusieron a hacer ejercicios de fuerza", 6, "BigNumberCard", { eyebrow: "La ciencia", value: 90, suffix: " años", label: "y aún así ganaron fuerza y músculo" }],
  ["la proteina arruina los rinones", 7, "MythVsTruth", { theme: T, myth: "La proteína arruina los riñones.", truth: "Falso en riñones sanos: la proteína no daña, la necesitás. La precaución es solo si YA tenés enfermedad renal." }],
  ["solo la carne roja tiene proteina", 7, "MythVsTruth", { theme: T, myth: "Solo la carne roja tiene proteína de verdad.", truth: "Falso. Queso, huevos, pescado, pollo y legumbres bien combinadas aportan proteína de calidad. La variedad es tu amiga." }],
  ["con salir a caminar ya cuido", 7, "MythVsTruth", { theme: T, myth: "Con salir a caminar ya cuido mi músculo.", truth: "Ojo: caminar es salud, pero no construye músculo de fuerza. Para eso hay que exigirle: levantar, empujar, cargar." }],
  ["paso 1 proteina en cada comida", 8, "Steps", { theme: T, eyebrow: "Manos a la obra", title: "El plan, en pasos", steps: [{ title: "Proteína en CADA comida", sub: "repartida en el día, una palma por comida" }, { title: "El queso como aliado", sub: "+ huevos, pescado, pollo, legumbres" }, { title: "Ejercicio de fuerza + sol y descanso", sub: "el estímulo que da la orden de construir" }] }],
  ["el ejercicio rey se llama sentadilla", 8, "Steps", { theme: T, eyebrow: "Empezá en tu silla", title: "Fuerza simple en casa", steps: [{ title: "Sentadilla en la silla", sub: "sentarte y pararte, varias veces" }, { title: "Puntas de pie y empujar la pared", sub: "sostenido de una mesa" }, { title: "2-3 veces por semana", sub: "sin dolor, aumentando de a poco" }] }],
  ["los anos no son el problema", 7, "PullQuote", { theme: T, quote: "Los años no son el problema. El problema es dejar de darle a tu cuerpo una razón para seguir siendo fuerte." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["autora elena vidal", 5, "LowerThird", { theme: T, accentText: "FUERZA A CUALQUIER EDAD", title: "Dra. Elena Vidal", sub: "Envejecer fuerte, con evidencia" }],
  ["la sarcopenia es la perdida progresiva", 3.6, "KeywordPop", { theme: T, word: "SARCOPENIA", sub: "pérdida de músculo con la edad", pos: "center" }],
  ["con la debilidad vienen las caidas", 5, "Callout", { theme: T, icon: "⚠️", title: "Menos músculo → más caídas", sub: "y las caídas amenazan tu independencia", tone: "warn" }],
  ["los cientificos llaman resistencia anabolica", 3.8, "KeywordPop", { theme: T, word: "RESISTENCIA ANABÓLICA", sub: "de mayor, el músculo se vuelve sordo a la proteína", pos: "center" }],
  ["la proteina es el ladrillo", 3.4, "KeywordPop", { theme: T, word: "PROTEÍNA = LADRILLO", sub: "sin ladrillos, no hay músculo", pos: "bottom" }],
  ["y ese alimento uno de los mejores", 5, "LowerThird", { theme: T, accentText: "EL ALIMENTO", title: "El queso (duro y curado)", sub: "proteína densa + leucina" }],
  ["es una bomba de proteina concentrada", 4.5, "StatChip", { theme: T, value: 35, suffix: " g", label: "de proteína por 100 g (queso duro)" }],
  ["el queso es riquisimo en un aminoacido", 3.6, "KeywordPop", { theme: T, word: "LEUCINA", sub: "el interruptor que enciende el músculo", pos: "center" }],
  ["a mi consultorio una mujer", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Doña Marta, 74 años", sub: "sarcopenia marcada, sin promesas mágicas" }],
  ["y aca llegamos a lo mas importante", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "El error que arruina todo" }],
  ["ese estimulo es el ejercicio de fuerza", 3.6, "KeywordPop", { theme: T, word: "EL ESTÍMULO", sub: "el ejercicio da la orden de construir", pos: "center" }],
  ["vamos a la parte que mas me importa", 4, "SectionTitle", { eyebrow: "ATENCIÓN", title: "Advertencias importantes" }],
  ["si tenes una enfermedad renal", 5.5, "Callout", { theme: T, icon: "🩺", title: "Enfermedad renal: NO subas la proteína solo", sub: "la cantidad la decide tu médico", tone: "warn" }],
  ["el queso con todo lo bueno", 5, "Callout", { theme: T, icon: "🧂", title: "Presión alta: quesos con menos sal", sub: "un buen trozo por comida, no medio kilo", tone: "warn" }],
  ["si sos intolerante a la lactosa", 5, "Callout", { theme: T, icon: "🧀", title: "Lactosa: los curados casi no tienen", sub: "el parmesano suele tolerarse bien", tone: "info" }],
  ["antes de empezar cualquier ejercicio", 5, "Callout", { theme: T, icon: "❤️", title: "¿Corazón, presión o articulaciones?", sub: "consultá antes y empezá suave, sin dolor", tone: "warn" }],
  ["si perdes fuerza en un solo lado", 5, "Callout", { theme: T, icon: "🚑", title: "Debilidad súbita → médico ya", sub: "sobre todo en un solo lado del cuerpo", tone: "warn" }],
  ["proteina en cada comida repartida", 3.6, "KeywordPop", { theme: T, word: "PROTEÍNA EN CADA COMIDA", sub: "repartida, no toda junta de noche", pos: "center" }],
  ["nunca jamas es tarde para empezar", 3.4, "KeywordPop", { theme: T, word: "NUNCA ES TARDE", sub: "el músculo responde a cualquier edad", pos: "center" }],
  ["con todo el plan ordenado las cantidades", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi método de fuerza", items: ["Cuánta proteína según tu peso", "El queso y las mejores fuentes", "Rutina de fuerza paso a paso"] }],
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
