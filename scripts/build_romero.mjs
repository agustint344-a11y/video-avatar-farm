/**
 * FASE 7 — BUILD "romero-elena" (Dra. Elena Vidal) — ESTILO DOPAMÍNICO (PiP + kit3 + tema CLINIC).
 *   node scripts/build_romero.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "romero-elena";
const FPS = 30;
const T = "clinic";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["te voy a explicar exactamente qué le hace", 6, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Frena la caída y despierta el cabello", "Rejuvenece tu piel", "Cómo usarlo bien (y quiénes NO)"] }],
  ["comparó el aceite de romero contra el minoxidil", 7, "MythVsTruth", { theme: T, myth: "Solo un medicamento caro hace crecer el pelo.", truth: "En un estudio, el aceite de romero hizo crecer el cabello IGUAL que el minoxidil, y con menos picazón." }],
  ["cuidá tres cosas", 7, "Checklist", { theme: T, title: "Para que el romero rinda", items: ["Cuidá el hierro (causa oculta de la caída)", "Suficiente proteína (el pelo es proteína)", "Bajá el estrés y dormí bien"] }],
  ["el romero te hace crecer el pelo en una semana", 6.5, "MythVsTruth", { theme: T, myth: "El romero hace crecer el pelo en una semana.", truth: "El cabello crece lento: los resultados se ven a los 2-4 meses de uso CONSTANTE. El secreto es la paciencia." }],
  ["el aceite de romero, cuanto más fuerte", 6.5, "MythVsTruth", { theme: T, myth: "Cuanto más aceite y más fuerte, mejor.", truth: "Más NO es mejor: el aceite esencial puro irrita y quema el cuero cabelludo. Poquito, bien diluido y constante." }],
  ["poné un par de ramitas de romero", 8, "Steps", { theme: T, eyebrow: "Cómo hacer el agua de romero", title: "En 3 pasos simples", steps: [{ title: "Ramitas en agua caliente", sub: "reposar 10 a 15 minutos, tapado" }, { title: "Colar", sub: "hasta que tome color y aroma" }, { title: "Tomar, tónico facial o enjuague capilar", sub: "3-4 veces por semana" }] }],
  ["andá a un profesional", 7, "AnnotatedImage", { eyebrow: "Consultá antes", title: "Cuándo ir al médico", image: "img/rom_caida.jpg", points: [{ label: "Caída repentina", x: 34, y: 38, side: "left" }, { label: "Caída por mechones", x: 60, y: 60, side: "right" }, { label: "¿Tiroides o hierro?", x: 44, y: 82, side: "left" }] }],
  ["verte y sentirte más joven no viene de un solo frasco", 6.5, "PullQuote", { theme: T, quote: "Rejuvenecer de verdad no es una compra: es un hábito que cultivás todos los días, con cariño hacia vos misma." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["Soy la doctora Elena Vidal", 5, "LowerThird", { theme: T, accentText: "REJUVENECIMIENTO", title: "Dra. Elena Vidal", sub: "Antiedad con evidencia" }],
  ["el romero frena la caída del cabello", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Frena la caída del cabello", sub: "y ayuda a que vuelva a crecer" }],
  ["hacia los folículos", 3, "KeywordPop", { theme: T, word: "CIRCULACIÓN", sub: "despierta el folículo dormido", pos: "bottom" }],
  ["una hormona llamada DHT", 3, "KeywordPop", { theme: T, word: "DHT", sub: "la culpable de que el pelo se afine", pos: "center" }],
  ["también sana el cuero cabelludo", 5, "LowerThird", { theme: T, accentText: "BONUS", title: "Cuero cabelludo sano", sub: "menos caspa, grasa y picazón" }],
  ["un tesoro para tu piel", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Rejuvenece tu piel", sub: "antioxidante y antiinflamatorio" }],
  ["mejora tu circulación en todo", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Circulación, energía y memoria", sub: "más oxígeno a tu cerebro" }],
  ["te ayuda con la digestión", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Mejora la digestión", sub: "desinflama y aliviana" }],
  ["en mi guía de rejuvenecimiento", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de rejuvenecimiento", items: ["Rutina exacta para la caída", "Cuidado de la piel, paso a paso", "Combinaciones que funcionan"] }],
  ["Y eso incluye las advertencias", 4, "SectionTitle", { eyebrow: "ATENCIÓN", title: "Cuidados importantes" }],
  ["estás embarazada o buscando", 5, "Callout", { theme: T, icon: "🤰", title: "Embarazo: no en dosis medicinales", sub: "puede estimular el útero — consultá", tone: "warn" }],
  ["tenés epilepsia o convulsiones", 5, "Callout", { theme: T, icon: "⚡", title: "Epilepsia: sin aceite esencial", sub: "en dosis altas puede desencadenar convulsiones", tone: "warn" }],
  ["presión arterial muy alta", 4.5, "Callout", { theme: T, icon: "💊", title: "Presión o anticoagulantes", sub: "consultá con tu médico antes", tone: "warn" }],
  ["nunca te apliques el aceite esencial de romero puro", 5, "Callout", { theme: T, icon: "⚠️", title: "Nunca el aceite esencial PURO", sub: "siempre diluido + prueba en la piel", tone: "warn" }],
  ["no reemplaza la consulta con tu médico", 4.5, "Callout", { theme: T, icon: "🩺", title: "No reemplaza a tu médico", sub: "es un apoyo; caída fuerte → consultá", tone: "info" }],
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
