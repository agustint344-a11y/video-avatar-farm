/**
 * FASE 7 — BUILD "ajo-elena" (Dra. Elena Vidal) — ajo: presión/colesterol/corazón.
 * DENSO + QR ×6 + Compare/Timeline/Steps. Tema CLINIC.
 *   node scripts/build_ajo.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "ajo-elena";
const FPS = 30;
const T = "clinic";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["asi que quedate conmigo", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el ajo de verdad", "El error que anula sus beneficios", "Quiénes deben tener cuidado"] }],
  ["el diente de ajo entero no contiene alicina", 7, "Compare", { theme: T, title: "El secreto de la alicina", left: { label: "Ajo ENTERO", sub: "casi no genera alicina" }, right: { label: "Picado + 10 min de reposo", sub: "alicina activada = poderosa" } }],
  ["para que sirve el ajo segun la evidencia", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Ayuda a bajar la presión (un poco)", "Reduce el colesterol malo", "Apoya las defensas", "Salud cardiovascular"] }],
  ["el ajo cura el cancer", 7, "MythVsTruth", { theme: T, myth: "El ajo cura el cáncer, la hipertensión o infecciones graves.", truth: "Rotundamente falso. Puede acompañar, pero NO cura enfermedades serias. Nunca abandones un tratamiento por esto." }],
  ["si es bueno cuanto mas ajo mejor", 7, "MythVsTruth", { theme: T, myth: "Cuanto más ajo, mejor.", truth: "Falso. En exceso irrita el estómago y aumenta el riesgo de sangrado. Uno o dos dientes al día alcanza y sobra." }],
  ["el ajo en ayunas", 7, "MythVsTruth", { theme: T, myth: "El ajo en ayunas quema grasa y adelgaza.", truth: "Falso. No hay evidencia sólida. Adelgazar es alimentación, movimiento y descanso. El ajo no es un quemagrasas." }],
  ["como es natural no puede hacer mal", 7, "MythVsTruth", { theme: T, myth: "Como es natural, no puede hacer mal ni interactuar con nada.", truth: "Falso y peligroso. Interactúa con anticoagulantes y con la medicación de la presión, y puede irritar el estómago. Natural no es inofensivo." }],
  ["primero agarra uno o dos dientes", 8.5, "Steps", { theme: T, eyebrow: "Cómo activar la alicina", title: "Paso a paso", steps: [{ title: "Picá o aplastá 1-2 dientes", sub: "cuanto más roto, más alicina" }, { title: "Dejá reposar 10 minutos", sub: "el paso que casi nadie respeta" }, { title: "Crudo o al FINAL de la cocción", sub: "el calor destruye la alicina" }] }],
  ["que podes esperar realmente del ajo", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El ajo, con el tiempo", steps: [{ when: "Primeras semanas", text: "es un hábito, no efecto inmediato" }, { when: "Semanas a meses", text: "presión y colesterol, efecto modesto" }, { when: "Con constancia", text: "un aliado del corazón, en silencio" }] }],
  ["pequeno aliado de todos los dias", 7, "PullQuote", { theme: T, quote: "El ajo no es una pastilla milagrosa: es un pequeño aliado de todos los días que cuida tu corazón sin que casi te des cuenta." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "El ajo, bien usado" }],
  ["esto es lo mas importante del video", 4, "SectionTitle", { eyebrow: "EL SECRETO", title: "La alicina" }],
  ["que es la sustancia responsable", 3.6, "KeywordPop", { theme: T, word: "ALICINA", sub: "el compuesto estrella del ajo", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl" }],
  ["es como comprar un fosforo y nunca rasparlo", 4.5, "PullQuote", { theme: T, quote: "Tragarte un diente entero es como comprar un fósforo y nunca rasparlo: tenés el potencial en la mano, pero no lo encendés." }],
  ["un diente entero sin romperlo", 7, "QRTag", { theme: T, corner: "bl" }],
  ["su efecto sobre la presion arterial", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Presión arterial", sub: "ayuda a bajarla un poco" }],
  ["tiene que ver con el colesterol", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Colesterol", sub: "reduce modestamente el LDL" }],
  ["el sistema inmune tus", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Defensas", sub: "apoyo en meses de frío" }],
  ["vino a verme un hombre lo voy a llamar", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Don Alberto, 62 años", sub: "lo comía mal y no veía nada" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl" }],
  ["asi que por favor no te la saltees", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["si tomas anticoagulantes", 5.5, "Callout", { theme: T, icon: "💊", title: "Anticoagulantes / antiagregantes", sub: "puede aumentar el sangrado — consultá", tone: "warn" }],
  ["si estas por operarte", 5, "Callout", { theme: T, icon: "⚠️", title: "Antes de una cirugía", sub: "suspender días antes — avisá al cirujano", tone: "warn" }],
  ["gastritis ulceras o reflujo", 5, "Callout", { theme: T, icon: "🔥", title: "Estómago sensible", sub: "crudo en ayunas irrita — con comida", tone: "warn" }],
  ["si tomas medicacion para la presion", 5, "Callout", { theme: T, icon: "🩺", title: "Medicación para la presión", sub: "puede potenciarla — controlá con tu médico", tone: "info" }],
  ["reposar unos 10 minutos", 4, "StatChip", { theme: T, value: 10, suffix: " min", label: "de reposo activan la alicina" }],
  ["el ajo picado y reposado al final de la coccion", 3.6, "KeywordPop", { theme: T, word: "AL FINAL DE LA COCCIÓN", sub: "el calor destruye la alicina", pos: "center" }],
  ["empecemos por como elegirlo", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo elegirlo y guardarlo" }],
  ["al final de la coccion no al principio", 7, "QRTag", { theme: T, corner: "bl" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl" }],
  ["existe el ajo negro que es ajo fermentado", 5, "LowerThird", { theme: T, accentText: "ALTERNATIVA", title: "Ajo negro", sub: "fermentado, más suave y tolerable" }],
  ["simple honesto y realista", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Cómo activar la alicina", "Cantidades y combinaciones seguras", "Qué usar para cada cosa"] }],
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
