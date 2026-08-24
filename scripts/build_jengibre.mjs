/**
 * FASE 7 — BUILD "jengibre-elena" (Dra. Elena Vidal) — jengibre: náuseas, inflamación, digestión.
 * DENSO + QR ×6 + Compare/Timeline/Steps. Tema CLINIC.
 *   node scripts/build_jengibre.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "jengibre-elena";
const FPS = 30;
const T = "clinic";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["quedate conmigo porque en los proximos minutos", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué SÍ sirve el jengibre", "La forma correcta de tomarlo", "Quiénes NO deberían tomarlo"] }],
  ["practicamente no tomo", 7, "Compare", { theme: T, title: "El error que casi nadie corrige", left: { label: "Rodajita simbólica", sub: "agua apenas teñida = casi nada" }, right: { label: "Cantidad real + tapado", sub: "así sí hace efecto de verdad" } }],
  ["te las voy a separar bien", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Náuseas y mareos (lo más probado)", "Antiinflamatorio (efecto modesto)", "Mejora la digestión", "Dolor menstrual"] }],
  ["mito el jengibre quema", 7, "MythVsTruth", { theme: T, myth: "El jengibre quema grasa y adelgaza.", truth: "Muy exagerado. Da algo de saciedad y un efecto mínimo. Adelgazar es alimentación, movimiento y descanso: el jengibre es un ayudante menor." }],
  ["si es bueno cuanto mas jengibre", 7, "MythVsTruth", { theme: T, myth: "Si es bueno, cuanto más jengibre, mejor.", truth: "Falso. En exceso da acidez, molestias y más riesgo de sangrado. Con una o dos tazas al día alcanza. La dosis hace al remedio y al veneno." }],
  ["el jengibre solo en agua ya cura", 7, "MythVsTruth", { theme: T, myth: "El jengibre solo, en agua, ya cura.", truth: "Falso. Es un complemento, no un tratamiento. No reemplaza a tu médico ni a tu medicación, y no cura enfermedades serias." }],
  ["como es natural no puede hacer mal", 7, "MythVsTruth", { theme: T, myth: "Como es natural, no puede hacer mal ni interactuar.", truth: "Falso. Interactúa con anticoagulantes y con medicación de diabetes y presión. Natural no es sinónimo de inofensivo." }],
  ["usa un trozo de jengibre fresco", 8, "Steps", { theme: T, eyebrow: "La infusión bien hecha", title: "Paso a paso", steps: [{ title: "Un trozo tamaño pulgar", sub: "3-4 cm, no una rodajita" }, { title: "Rallalo (más superficie)", sub: "libera más compuestos" }, { title: "Casi hirviendo, apagá y TAPÁ 10-15 min", sub: "el tapado atrapa los aceites" }] }],
  ["esperar realmente de jengibre", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El jengibre, con el tiempo", steps: [{ when: "Náuseas y mareo", text: "efecto rápido, ese mismo día" }, { when: "Digestión", text: "alivio en los primeros días" }, { when: "Articulaciones", text: "semanas, y efecto modesto" }] }],
  ["quiero que veas al jengibre como lo que es", 7, "PullQuote", { theme: T, quote: "El jengibre no es una pastilla milagrosa, es un pequeño aliado de todos los días. Y lo que te hace bien de verdad, lo sostenés en el tiempo." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "El jengibre, bien usado" }],
  ["el mas famoso se llama gingerol", 3.6, "KeywordPop", { theme: T, word: "GINGEROL", sub: "el compuesto antiinflamatorio", pos: "center" }],
  ["se transforma en otro compuesto el shogaol", 3.6, "KeywordPop", { theme: T, word: "SHOGAOL", sub: "aún más potente (seco o cocido)", pos: "center" }],
  ["quiero que grabes esto porque es el error", 4, "SectionTitle", { eyebrow: "EL ERROR", title: "Por qué no sentís nada" }],
  ["te la deje disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl" }],
  ["no le hace nada", 7, "QRTag", { theme: T, corner: "bl" }],
  ["brilla de verdad", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Náuseas y vómitos", sub: "embarazo, viajes, postoperatorio" }],
  ["es probablemente el uso con mas evidencia", 7, "QRTag", { theme: T, corner: "bl" }],
  ["el segundo beneficio importante es su efecto", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Antiinflamatorio", sub: "efecto modesto y sostenido" }],
  ["el tercer punto donde el jengibre", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Mejor digestión", sub: "menos pesadez después de comer" }],
  ["hay un cuarto uso que me parece", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Dolor menstrual", sub: "tomándolo en los primeros días" }],
  ["la voy a llamar raquel", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Raquel, 58 años", sub: "lo tomaba mal y no sentía nada" }],
  ["que te deje en los comentarios y en la descripcion", 7, "QRTag", { theme: T, corner: "bl" }],
  ["esto es la parte mas importante de todo", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["primero si tomas anticoagulantes", 5.5, "Callout", { theme: T, icon: "💊", title: "Anticoagulantes y cirugía", sub: "puede aumentar el sangrado — consultá", tone: "warn" }],
  ["segundo si tenes piedras en la vesicula", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Piedras en la vesícula", sub: "estimula la bilis: puede dar problema", tone: "warn" }],
  ["tercero si tenes problemas de estomago", 5, "Callout", { theme: T, icon: "🔥", title: "Estómago sensible", sub: "úlceras o reflujo: puede irritar", tone: "warn" }],
  ["cinco en el embarazo", 5, "Callout", { theme: T, icon: "🤰", title: "Embarazo", sub: "culinario suele ser OK; dosis altas, consultá", tone: "info" }],
  ["vamos a la preparacion que es donde", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "La infusión bien hecha" }],
  ["dejarlo reposar tapado con la tapa", 3.6, "KeywordPop", { theme: T, word: "TAPADO 10-15 MIN", sub: "atrapa los aceites volátiles", pos: "center" }],
  ["una o dos tazos al dia", 4.5, "StatChip", { theme: T, value: 2, suffix: " tazas", label: "al día es suficiente" }],
  ["natural no es sinonimo de inofensivo", 7, "QRTag", { theme: T, corner: "bl" }],
  ["dejame darte unos ultimos consejos", 4, "SectionTitle", { eyebrow: "PARA QUE DURE", title: "Elegir y conservar" }],
  ["mi truco favorito y el que mas te recomiendo", 5, "Callout", { theme: T, icon: "❄️", title: "Congelalo", sub: "rallás directo del freezer, nunca se pierde", tone: "info" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl" }],
  ["el jengibre es una raiz con evidencia real sobre todo", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Cantidades y recetas paso a paso", "Combinaciones que funcionan", "Qué usar para cada cosa"] }],
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
