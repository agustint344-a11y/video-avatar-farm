/**
 * FASE 7 — BUILD "curcuma-elena" (Dra. Elena Vidal) — cúrcuma para inflamación/articulaciones.
 * DENSO + QR ×6 + Compare/Timeline estrella. Tema CLINIC.
 *   node scripts/build_curcuma.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "curcuma-elena";
const FPS = 30;
const T = "clinic";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["asi que quedate hasta el final", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Qué hace la cúrcuma en tu cuerpo", "El secreto para que funcione", "Sus riesgos y quiénes NO deberían tomarla"] }],
  ["curcuma sola casi no sirve", 7, "Compare", { theme: T, title: "El secreto de la absorción", left: { label: "Cúrcuma SOLA", sub: "tu cuerpo casi no la absorbe" }, right: { label: "+ pimienta + grasa", sub: "absorción multiplicada = poderosa" } }],
  ["vamos a los beneficios concretos", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Articulaciones: menos inflamación y dolor", "Antioxidante potente", "Mejora la digestión (bilis)", "En estudio: ánimo y cerebro"] }],
  ["la curcuma cura el cancer", 7, "MythVsTruth", { theme: T, myth: "La cúrcuma cura el cáncer y la artritis.", truth: "Rotundamente falso. Se investiga como apoyo, pero NO cura esas enfermedades. Nunca abandones un tratamiento por esto." }],
  ["si es buena cuanta mas curcuma", 7, "MythVsTruth", { theme: T, myth: "Cuanta más cúrcuma, mejor.", truth: "Falso. En exceso irrita el estómago y trae problemas. Media a una cucharadita al día, bien absorbida, es suficiente." }],
  ["la curcuma sola en agua ya hace", 7, "MythVsTruth", { theme: T, myth: "La cúrcuma sola, en agua, ya hace efecto.", truth: "Falso, el error más común. Sin pimienta negra y sin grasa, tu cuerpo casi no la absorbe. Tomarla sola es casi no tomar nada." }],
  ["como es natural no puede tener", 7, "MythVsTruth", { theme: T, myth: "Como es natural, no puede tener contraindicaciones.", truth: "Falso y peligroso. Interactúa con anticoagulantes, puede molestar una vesícula con piedras, irritar el estómago. Natural no es inofensivo." }],
  ["se hace asi calentas una taza", 8, "Steps", { theme: T, eyebrow: "La leche dorada", title: "Paso a paso", steps: [{ title: "Leche tibia (no hervir)", sub: "común o vegetal" }, { title: "½ cdita de cúrcuma + PIZCA de pimienta", sub: "la pimienta activa todo" }, { title: "Un toque de miel/canela", sub: "la leche ya aporta la grasa" }] }],
  ["en las primeras semanas lo mas honesto", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "La cúrcuma, con el tiempo", steps: [{ when: "Primeras semanas", text: "digestión más liviana" }, { when: "1 a 2 meses", text: "articulaciones más cómodas" }, { when: "Con constancia", text: "menos inflamación de fondo" }] }],
  ["cuidarte no siempre esta en lo mas caro", 7, "PullQuote", { theme: T, quote: "Cuidarte no siempre está en lo más caro o lo más nuevo: muchas veces está en lo simple, lo natural y lo bien hecho." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "La cúrcuma, bien usada" }],
  ["que se llama curcumina", 3.6, "KeywordPop", { theme: T, word: "CURCUMINA", sub: "el compuesto antiinflamatorio", pos: "center" }],
  ["y este es el secreto que casi nadie", 4, "SectionTitle", { eyebrow: "EL SECRETO", title: "Por qué casi no la absorbés" }],
  ["dejé disponible en los comentarios de este video y tambien", 7, "QRTag", { theme: T, corner: "bl" }],
  ["un compuesto llamado piperina", 3.6, "KeywordPop", { theme: T, word: "PIPERINA", sub: "la pimienta multiplica la absorción", pos: "center" }],
  ["yo tome curcuma y no senti nada", 7, "QRTag", { theme: T, corner: "bl" }],
  ["el primer beneficio y el mas estudiado", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Articulaciones", sub: "menos inflamación y dolor" }],
  ["es un antioxidante potente", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Antioxidante potente", sub: "menos daño en tus células" }],
  ["el tercer beneficio es sobre la digestion", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Mejor digestión", sub: "estimula la bilis" }],
  ["verme una mujer la voy a llamar", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Doña Marta, 65 años", sub: "la tomaba mal y no veía nada" }],
  ["la receta de la leche dorada y las combinaciones", 7, "QRTag", { theme: T, corner: "bl" }],
  ["muchos canales esconden porque no es tan bonita", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Los riesgos" }],
  ["si tomas anticoagulantes", 5.5, "Callout", { theme: T, icon: "💊", title: "Anticoagulantes y cirugía", sub: "puede aumentar el sangrado — consultá", tone: "warn" }],
  ["si tenes piedras en la vesicula", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Piedras en la vesícula", sub: "estimula la bilis: puede dar cólico", tone: "warn" }],
  ["puede irritar el estomago", 5, "Callout", { theme: T, icon: "🔥", title: "Estómago sensible y riñón", sub: "en exceso: acidez; ojo con cálculos", tone: "warn" }],
  ["si estas embarazada o amamantando", 5, "Callout", { theme: T, icon: "🤰", title: "Embarazo y lactancia", sub: "como condimento OK; en dosis altas, consultá", tone: "info" }],
  ["el error mas comun de todos", 3.6, "KeywordPop", { theme: T, word: "SIEMPRE PIMIENTA + GRASA", sub: "sin eso, no se absorbe", pos: "center" }],
  ["vamos a lo practico como preparar", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo tomarla" }],
  ["media a una cucharadita de curcuma por dia", 4.5, "StatChip", { theme: T, value: 1, suffix: " cdita", label: "al día, bien absorbida" }],
  ["no te olvides de que te deje todo en la guia", 7, "QRTag", { theme: T, corner: "bl" }],
  ["no la veas como una pastilla", 7, "QRTag", { theme: T, corner: "bl" }],
  ["con todas las recetas las cantidades", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["La receta de la leche dorada", "Cantidades y combinaciones seguras", "Qué usar para cada cosa"] }],
  ["te mando un abrazo enorme", 7, "QRTag", { theme: T, corner: "bl" }],
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
const qr = overlays.filter((o) => o.comp === "QRTag").length;
const total = components.length + overlays.length + broll.length;
console.log(`✓ componentes ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`✓ overlays ${overlays.length}/${ovBeats.length} (QR ${qr})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}%${brollMiss.length ? " · " + brollMiss.join(", ") : ""}`);
console.log(`✓ TOTAL ${total} beats · ${components.length + overlays.length} comp/ov en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
