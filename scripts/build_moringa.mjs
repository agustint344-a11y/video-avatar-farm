/**
 * FASE 7 — BUILD "moringa-agustin" (Agustín Landívar) — ESTILO DOPAMÍNICO (PiP + kit3 + tema EARTH).
 *   node scripts/build_moringa.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "moringa-agustin";
const FPS = 30;
const T = "earth";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["Te voy a explicar exactamente qué le hace", 6, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Proteína completa para tus músculos", "Vitaminas, minerales y antioxidantes", "Cómo tomarla (y quiénes NO)"] }],
  ["pero la moringa los tiene todos", 6.5, "BigNumberCard", { eyebrow: "Proteína completa", value: 9, label: "aminoácidos esenciales — los tiene TODOS, igual que un huevo" }],
  ["y que tiene más vitamina A", 7.5, "Checklist", { theme: T, title: "Gramo por gramo, la moringa tiene…", items: ["Más hierro que la espinaca", "Más calcio que la leche", "Más potasio que la banana", "Más vitamina A que la zanahoria"] }],
  ["Paso 1, conseguí moringa en polvo", 8, "Steps", { theme: T, eyebrow: "Cómo tomarla", title: "En 3 pasos simples", steps: [{ title: "Moringa en polvo de la HOJA", sub: "no de la raíz, de buen origen" }, { title: "Empezá con ½ cucharadita", sub: "la primera semana; después 1 a 2" }, { title: "Disolvé en agua, licuado o jugo", sub: "mejor con una fruta" }] }],
  ["la moringa sola te construye músculos", 6.5, "MythVsTruth", { theme: T, myth: "La moringa sola te construye músculos.", truth: "Es una aliada espectacular, no la protagonista: necesitás proteína variada, movimiento y algo de fuerza. El trabajo lo hacés vos." }],
  ["un par de trucos para que la moringa", 7, "Checklist", { theme: T, title: "3 trucos para que rinda al máximo", items: ["Combinala con vitamina C (limón) → absorbés más hierro", "Tomala de mañana o al mediodía", "Cerca de tu actividad física"] }],
  ["Falso pensar que cualquier polvo verde", 6.5, "MythVsTruth", { theme: T, myth: "Cualquier polvo verde sirve.", truth: "La calidad importa: buscá moringa de la HOJA, pura, de verde intenso y vivo. Un verde apagado o marrón = vieja y sin nutrientes." }],
  ["en las primeras 1 o 2 semanas", 6, "BigNumberCard", { eyebrow: "Los primeros cambios", value: 14, suffix: " días", label: "lo primero que notás: más energía y menos cansancio" }],
  ["todo eso está en la guía que te dejé", 6, "SplitInfo", { eyebrow: "En los comentarios", title: "Mi guía completa de moringa", items: ["Cantidades exactas por edad", "Horarios y combinaciones", "El plan que uso con mis pacientes"] }],
  ["la verdadera fortaleza no viene", 6.5, "PullQuote", { theme: T, quote: "La verdadera fortaleza no viene de un solo polvo milagroso: viene de la suma de buenos hábitos sostenidos con constancia." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["Agustín Landívar, naturópata", 5, "LowerThird", { theme: T, accentText: "MEDICINA NATURAL", title: "Agustín Landívar", sub: "Naturópata · doctorlandivar.com" }],
  ["una proteína vegetal completa", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Proteína vegetal completa", sub: "los 9 aminoácidos esenciales" }],
  ["se llama sarcopenia", 3, "KeywordPop", { theme: T, word: "SARCOPENIA", sub: "pérdida de músculo con la edad", pos: "center" }],
  ["la moringa es una bomba de vitaminas", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Bomba de vitaminas y minerales", sub: "A, C, calcio, potasio y hierro" }],
  ["la moringa tiene una gran cantidad de hierro", 3, "KeywordPop", { theme: T, word: "HIERRO", sub: "contra el cansancio y la debilidad", pos: "bottom" }],
  ["es uno de los antioxidantes más potentes", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Antioxidante potente", sub: "escudo antienvejecimiento y antiinflamatorio" }],
  ["ayuda a controlar el azúcar en sangre", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Ayuda con el azúcar en sangre", sub: "apoyo para la prediabetes" }],
  ["cuida tu corazón, ayudando con el colesterol", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 5", title: "Cuida tu corazón", sub: "ayuda a bajar el colesterol" }],
  ["cuida tu digestión y tu intestino", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 6", title: "Cuida tu digestión", sub: "fibra + flora intestinal sana" }],
  ["fortalece tu sistema inmunológico", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 7", title: "Fortalece tus defensas", sub: "un escudo natural" }],
  ["cuida tu piel y tu cabello", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 8", title: "Piel y cabello más fuertes", sub: "nutridos desde adentro" }],
  ["Y eso incluye los riesgos", 4, "SectionTitle", { theme: T, eyebrow: "ATENCIÓN", title: "Riesgos y advertencias" }],
  ["si estás embarazada, tené muchísimo", 5, "Callout", { theme: T, icon: "🤰", title: "Embarazo: mucho cuidado", sub: "raíz y corteza prohibidas — consultá antes", tone: "warn" }],
  ["una baja brusca de azúcar", 5, "Callout", { theme: T, icon: "💉", title: "Medicación para diabetes", sub: "la moringa baja el azúcar — coordiná con tu médico", tone: "warn" }],
  ["La moringa puede bajar la presión", 4.5, "Callout", { theme: T, icon: "💊", title: "Medicación para la presión", sub: "puede bajarla de más — consultá", tone: "warn" }],
  ["podría interferir con esos remedios", 4.5, "Callout", { theme: T, icon: "🦋", title: "Medicación para la tiroides", sub: "podría interferir — avisá a tu médico", tone: "warn" }],
  ["más no es mejor", 4.5, "Callout", { theme: T, icon: "⚖️", title: "La dosis: más NO es mejor", sub: "empezá con ½ cucharadita; en exceso es laxante", tone: "warn" }],
  ["no reemplaza la consulta con tu médico", 4.5, "Callout", { theme: T, icon: "🩺", title: "No reemplaza a tu médico", sub: "es un apoyo; si te sentís muy débil, consultá", tone: "info" }],
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
