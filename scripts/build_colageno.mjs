/**
 * FASE 7 — BUILD "colageno-40" (Dra. Elena Vidal) — ESTILO DOPAMÍNICO.
 *   node scripts/build_colageno.mjs
 * Avatar en PiP sobre b-roll (avatar minoría), kit3 (tarjetas blancas), tema CLINIC en kit/kit2,
 * denso: muchos componentes + overlays + b-roll por frase. 20+ min.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SLUG = "colageno-40";
const FPS = 30;
const T = "clinic"; // tema de kit/kit2 para este canal
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => {
  const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5);
  for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); }
  return null;
};
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

/* ── COMPONENTES full-screen ── */
const compBeats = [
  ["te voy a mostrar por qué", 6, "Checklist", { theme: T, title: "En este video", items: ["Por qué cae tu colágeno después de los 40", "Los 4 enemigos que lo destruyen", "Cómo fabricar MÁS, gratis y desde adentro"] }],
  ["de tu colágeno cada año", 5, "BigNumberCard", { eyebrow: "Desde los 25 años", value: 1, suffix: "% por año", label: "vas perdiendo colágeno" }],
  ["80% del envejecimiento", 5, "BigNumberCard", { eyebrow: "Envejecimiento del rostro", value: 80, suffix: "%", label: "viene del sol, no de los años" }],
  ["es demasiado grande para atravesar", 7, "MythVsTruth", { theme: T, myth: "Las cremas \"con colágeno\" reconstruyen tu piel.", truth: "La molécula es demasiado grande para penetrar: hidrata la superficie y nada más. El colágeno lo fabricás vos, desde adentro." }],
  ["cuanto más cara la crema", 6.5, "MythVsTruth", { theme: T, myth: "Cuanto más cara la crema, mejor funciona.", truth: "El precio es marketing y envase. Pagá los INGREDIENTES (retinol, vitamina C), no la etiqueta famosa." }],
  ["mis alimentos estrella", 8, "Checklist", { theme: T, title: "Alimentos estrella para tu colágeno", items: ["Pimiento rojo y cítricos (vitamina C)", "Pescado y huevos (proteína)", "Caldo de huesos (glicina y prolina)", "Verduras verdes y frutos rojos (antioxidantes)", "Ajo y soja (azufre)"] }],
  ["una rutina simple y realista", 8, "Steps", { theme: T, eyebrow: "Tu rutina antiedad", title: "3 pasos, desde mañana", steps: [{ title: "Mañana: protector solar", sub: "cara, cuello y manos, todos los días" }, { title: "Día: vitamina C + proteína + agua", sub: "comida real y colorida" }, { title: "Noche: dormí 7-8 h + retinol", sub: "con cuidado y constancia" }] }],
  ["Andá a un dermatólogo", 7, "AnnotatedImage", { eyebrow: "Consultá antes", title: "Cuándo ir al dermatólogo", image: "img/col_derma.jpg", points: [{ label: "Un lunar que cambia", x: 32, y: 42, side: "left" }, { label: "Mancha nueva que crece", x: 70, y: 55, side: "right" }, { label: "Lesión que no cierra", x: 45, y: 78, side: "left" }] }],
  ["la juventud de tu piel no está", 6.5, "PullQuote", { theme: T, quote: "La juventud de tu piel no está en un frasco de $200. Está en lo que hacés todos los días." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

/* ── OVERLAYS ── */
const ovBeats = [
  ["Soy la doctora Elena Vidal", 5, "LowerThird", { theme: T, accentText: "REJUVENECIMIENTO", title: "Dra. Elena Vidal", sub: "Antiedad con evidencia" }],
  ["una palabra: estrógeno", 3.5, "KeywordPop", { theme: T, word: "ESTRÓGENO", sub: "cae en la menopausia y el colágeno cae con él", pos: "bottom" }],
  ["el más importante de todos, por lejos", 5, "LowerThird", { theme: T, accentText: "ENEMIGO 1", title: "El sol", sub: "la causa nº1 del envejecimiento" }],
  ["Se llama fotoenvejecimiento", 3, "KeywordPop", { theme: T, word: "FOTOENVEJECIMIENTO", pos: "center" }],
  ["el azúcar. Y este casi nadie", 5, "LowerThird", { theme: T, accentText: "ENEMIGO 2", title: "El azúcar", sub: "glicación: endurece tu colágeno" }],
  ["que se llama glicación", 3, "KeywordPop", { theme: T, word: "GLICACIÓN", sub: "el azúcar caramela tu piel", pos: "bottom" }],
  ["el estrés crónico y la falta de sueño", 5, "LowerThird", { theme: T, accentText: "ENEMIGO 3", title: "Estrés y falta de sueño", sub: "el cortisol degrada tu colágeno" }],
  ["El cigarrillo es una de las peores", 5, "LowerThird", { theme: T, accentText: "ENEMIGO 4", title: "Cigarrillo y alcohol", sub: "radicales libres y deshidratación" }],
  ["la vitamina C. Presta atención", 5, "LowerThird", { theme: T, accentText: "PILAR 1", title: "Vitamina C", sub: "sin ella NO se fabrica colágeno" }],
  ["la proteína, que son los ladrillos", 5, "LowerThird", { theme: T, accentText: "PILAR 2", title: "Proteína", sub: "los ladrillos: glicina y prolina" }],
  ["en mi guía de rejuvenecimiento", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de rejuvenecimiento", items: ["Protocolo completo, paso a paso", "Cantidades y horarios exactos", "Rutinas de día y de noche"] }],
  ["el protector solar. Si de todo", 5, "LowerThird", { theme: T, accentText: "PILAR 3", title: "Protector solar", sub: "el antiedad nº1, probado y barato" }],
  ["bajá el azúcar para frenar", 5, "LowerThird", { theme: T, accentText: "PILAR 4", title: "Menos azúcar", sub: "frená la glicación" }],
  ["dormí para reparar", 5, "LowerThird", { theme: T, accentText: "PILAR 5", title: "Dormir y bajar el estrés", sub: "tu piel se repara de noche" }],
  ["sumá antioxidantes", 5, "LowerThird", { theme: T, accentText: "PILAR 6", title: "Antioxidantes + retinol", sub: "protegen y estimulan el colágeno" }],
  ["es el retinol", 3, "KeywordPop", { theme: T, word: "RETINOL", sub: "el único tópico que sí estimula colágeno", pos: "bottom" }],
  ["la hidratación y el movimiento", 5, "LowerThird", { theme: T, accentText: "PILAR 7", title: "Hidratación y movimiento", sub: "agua + ejercicio de fuerza" }],
  ["si estás embarazada o buscando", 5, "Callout", { theme: T, icon: "🤰", title: "Embarazo: sin retinol", sub: "los derivados de vitamina A están contraindicados", tone: "warn" }],
  ["dos o tres veces por semana, siempre de noche", 4.5, "Callout", { theme: T, icon: "🌙", title: "Retinol: de a poco y de noche", sub: "y protector solar al día siguiente", tone: "warn" }],
  ["no reemplaza la consulta con tu profesional", 4.5, "Callout", { theme: T, icon: "🩺", title: "No reemplaza a tu médico", sub: "esto es divulgación educativa", tone: "info" }],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (inComp(from)) { ovMiss.push(`${a} (en comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

/* ── B-ROLL (PiP sobre b-roll por default) ── */
const IMGMAP = JSON.parse(fs.existsSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`)) ? fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`), "utf8").replace(/^﻿/, "") : "{}");
const DROP = new Set((() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_drop.json`), "utf8")); } catch { return []; } })());
const stock = [];
try { stock.push(...JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_needstock.json`), "utf8").replace(/^﻿/, ""))); } catch {}
const CAP_VID = sec(25), CAP_IMG = sec(10), MIN = sec(1.8);
const cands = [];
for (const it of stock) {
  if (DROP.has(it.name)) continue;
  const from = at(it.anchor); if (from == null) continue;
  const imgFile = IMGMAP[it.name];
  if (imgFile && fs.existsSync(path.join(ROOT, "public", "img", imgFile))) cands.push({ from, name: it.name, kind: "image", src: `img/${imgFile}`, cap: CAP_IMG });
  else { const vid = path.join(ROOT, "public", "broll", `${SLUG}_${it.name}.mp4`); if (fs.existsSync(vid)) cands.push({ from, name: it.name, kind: "video", src: `broll/${SLUG}_${it.name}.mp4`, cap: CAP_VID }); }
}
cands.sort((a, b) => a.from - b.from);
const uniq = []; for (const c of cands) if (!uniq.length || c.from - uniq[uniq.length - 1].from > sec(0.5)) uniq.push(c);
const broll = []; const brollMiss = [];
for (let i = 0; i < uniq.length; i++) {
  const c = uniq[i]; if (inComp(c.from)) { brollMiss.push(`${c.name}(comp)`); continue; }
  const nextB = i + 1 < uniq.length ? uniq[i + 1].from : Infinity;
  const dur = Math.min(c.cap, nextB - c.from, nextCompStart(c.from) - c.from);
  if (dur < MIN) { brollMiss.push(`${c.name}(sliver)`); continue; }
  broll.push({ from: c.from, dur, kind: c.kind, src: c.src }); // pip default true
}

const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const total = components.length + overlays.length + broll.length;
console.log(`✓ componentes ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`✓ overlays ${overlays.length}/${ovBeats.length}${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}% (PiP)${brollMiss.length ? " · " + brollMiss.join(", ") : ""}`);
console.log(`✓ TOTAL ${total} beats en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
