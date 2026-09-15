/**
 * BUILD "vitaminad-elena" (Dra. Elena Vidal) — vitamina D: huesos/músculos/defensas sí; "cuanto más mejor"/detox no. CLINIC. QR ×6.
 *   node scripts/build_vitaminad.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "vitaminad-elena";
const FPS = 30;
const T = "clinic";
const QR = "img/qr_guia.png";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["quedate conmigo porque te voy", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve la vitamina D de verdad", "Los mitos (¿cuanto más mejor?)", "Cómo medirla y las advertencias"] }],
  ["para que sirve que es lo", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Huesos fuertes (absorbe el calcio)", "Fuerza muscular", "Ayuda a las defensas", "Previene la osteoporosis"] }],
  ["cuanta mas vitamina d mejor", 7, "MythVsTruth", { theme: T, myth: "Cuanta más vitamina D, mejor: tomo por las dudas.", truth: "Falso y peligroso. Se acumula en la grasa y el hígado; en exceso te intoxica: sube el calcio, daña los riñones. La dosis justa, ni una gota de más." }],
  ["si me siento cansado con poca", 7, "MythVsTruth", { theme: T, myth: "Si estoy cansado, seguro es la vitamina D.", truth: "Ojo. El cansancio tiene mil causas: sueño, estrés, anemia, tiroides. Tomarla a ciegas es comprar un repuesto sin saber qué se rompió. Medí primero." }],
  ["la vitamina d cura o previene", 7, "MythVsTruth", { theme: T, myth: "La vitamina D cura el cáncer, la depresión, el corazón.", truth: "El marketing se voló. Que los enfermos tengan la D baja no significa que la D baja cause la enfermedad: muchas veces es al revés. Los grandes estudios no vieron ese milagro." }],
  ["por la ventana ya tengo", 7, "MythVsTruth", { theme: T, myth: "Con el sol por la ventana ya tengo toda la que necesito.", truth: "Falso. El vidrio bloquea los rayos que la producen. Tomar sol detrás de un vidrio casi no genera nada." }],
  ["no te suplementes a ciegas la", 8, "Steps", { theme: T, eyebrow: "Cómo hacerlo bien", title: "Con criterio", steps: [{ title: "Medí con un análisis", sub: "un simple examen de sangre" }, { title: "Que el médico calcule la dosis", sub: "según tu nivel y tu caso" }, { title: "Sol con cabeza, sin quemarte", sub: "unos minutos, horarios suaves" }] }],
  ["las personas mayores que fabrican menos", 8, "Checklist", { theme: T, title: "Quiénes suelen estar bajos", items: ["Personas mayores y de piel oscura", "Poco sol / trabajo encerrado", "Obesidad, embarazo y bebés"] }],
  ["la vitamina d no es un milagro", 7, "PullQuote", { theme: T, quote: "La vitamina D no es un milagro en pastilla que cura todo, ni un invento de los laboratorios: es una hormona fundamental que tu cuerpo fabrica con el sol y que cuida tus huesos, tus músculos y tus defensas. Ni la ignores, ni la tomes a lo loco." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["soy la doctora elena vidal y", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "La vitamina D, sin mitos" }],
  ["en realidad no es exactamente una", 3.6, "KeywordPop", { theme: T, word: "ES UNA HORMONA", sub: "no una vitamina común", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["y prevenir esa enfermedad", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Huesos", sub: "absorbe el calcio, previene osteoporosis" }],
  ["lo segundo los musculos la vitamina", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Músculos", sub: "fuerza; menos caídas en mayores" }],
  ["el sistema inmune aca tenemos", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Defensas", sub: "ayuda si estabas bajo (sin milagros)" }],
  ["la reuni en una guia que", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["se puede acumular hasta niveles toxicos", 4, "KeywordPop", { theme: T, word: "SE ACUMULA", sub: "en exceso, te intoxica", pos: "center" }],
  ["presta muchisima atencion las advertencias", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["hay suplementos con dosis altisimas", 5.5, "Callout", { theme: T, icon: "💊", title: "Cuidado con las megadosis", sub: "esas ampollas/gotas altas causan intoxicaciones", tone: "warn" }],
  ["hay gente que tiene que tener", 5, "Callout", { theme: T, icon: "🩺", title: "Riñón, paratiroides, medicación", sub: "manejala siempre con tu médico", tone: "warn" }],
  ["el sol en exceso sin proteccion", 5, "Callout", { theme: T, icon: "☀️", title: "El sol, con cabeza", sub: "no te quemes: riesgo de cáncer de piel", tone: "warn" }],
  ["lo tenes ordenado y explicado", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["la voy a llamar cristina muy", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Cristina", sub: "megadosis sin control → intoxicación" }],
  ["los pescados grasos como el salmon", 3.6, "KeywordPop", { theme: T, word: "POCOS ALIMENTOS", sub: "pescado graso, huevo, fortificados", pos: "center" }],
  ["la d3 es la misma forma", 5, "LowerThird", { theme: T, accentText: "SUPLEMENTO", title: "D3 mejor que D2", sub: "y tomala con una comida con grasa" }],
  ["no te dejes marear por las", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["la hice con muchisimo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["a los bebes se les da", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de bienestar natural", items: ["Qué análisis valen la pena", "Sol, alimentos y suplemento con criterio", "Lo que sirve vs. el marketing"] }],
  ["gracias por regalarme estos minutos", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
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
