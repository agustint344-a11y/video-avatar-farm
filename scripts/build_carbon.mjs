/**
 * BUILD "carbon-juantombo" (Dr. Juan Tomás) — carbón activado: detox/moda + anula medicamentos. EARTH. QR ×6 (qr_guia_jt).
 *   node scripts/build_carbon.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "carbon-juantombo";
const FPS = 30;
const T = "earth";
const QR = "img/qr_guia_jt.png";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["quedate conmigo", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el carbón de verdad", "Por qué es tan potente", "Las advertencias y los mitos peligrosos"] }],
  ["es a la vez un medicamento que salva vidas", 7.5, "Compare", { theme: T, title: "Dos mundos distintos", left: { label: "En el hospital", sub: "medicamento que salva vidas (intoxicaciones)" }, right: { label: "Como moda 'detox'", sub: "casi no sirve y puede ser peligroso" } }],
  ["para que sirve el carbon activado de verdad", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Intoxicaciones/sobredosis (en el hospital)", "Gases (evidencia floja, ocasional)", "…y poco más honesto que eso"] }],
  ["el carbon activado te desintoxica", 7, "MythVsTruth", { theme: T, myth: "El carbón activado te desintoxica y te purifica el cuerpo.", truth: "Falso. Para eso tenés hígado y riñones. El carbón solo actúa en el intestino en el momento, no limpia tu sangre. Es puro marketing." }],
  ["blanquea los dientes y es genial", 7, "MythVsTruth", { theme: T, myth: "Blanquea los dientes y es genial para la higiene bucal.", truth: "Cuidado. Es abrasivo: desgasta el esmalte, que no se recupera. Los dentistas lo desaconsejan." }],
  ["cura la resaca si lo tomas", 7, "MythVsTruth", { theme: T, myth: "El carbón activado cura la resaca.", truth: "Falso. No atrapa bien el alcohol, y cuando llega la resaca el alcohol ya se absorbió. No sirve para eso." }],
  ["como es natural el carbon activado es inofensivo", 7, "MythVsTruth", { theme: T, myth: "Como es natural, el carbón activado es inofensivo.", truth: "Rotundamente falso. Atrapa medicamentos y nutrientes, puede anular tu tratamiento, constiparte y enmascarar sangrados." }],
  ["vamos entonces a como usarlo", 8, "Steps", { theme: T, eyebrow: "Si acaso lo usás", title: "Con criterio", steps: [{ title: "Solo muy ocasional (gases)", sub: "y hay opciones mejores" }, { title: "Lejos de medicamentos y comidas", sub: "varias horas de separación" }, { title: "Intoxicación = al médico", sub: "eso no es casero, es la guardia" }] }],
  ["hablemos de expectativas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El carbón, siendo realista", steps: [{ when: "En una emergencia", text: "útil, en manos del médico" }, { when: "Como moda", text: "no purifica ni desintoxica nada" }, { when: "Con medicación", text: "puede anularla: peligroso" }] }],
  ["no una moda inofensiva de bienestar", 7, "PullQuote", { theme: T, quote: "El carbón activado no es una moda inofensiva de bienestar: es una herramienta médica potente que tiene su lugar en la guardia de un hospital, no en tu rutina de las redes." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["juan tomas y en este canal", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON CRITERIO MÉDICO", title: "Dr. Juan Tomás", sub: "El carbón activado, con criterio" }],
  ["el carbon no distingue lo bueno de lo malo", 3.6, "KeywordPop", { theme: T, word: "ATRAPA TODO", sub: "veneno, nutrientes… y tus remedios", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["es en las intoxicaciones y sobredosis", 5, "LowerThird", { theme: T, accentText: "USO REAL 1", title: "Intoxicaciones", sub: "en el hospital: salva vidas" }],
  ["un uso menor y con evidencia despareja", 5, "LowerThird", { theme: T, accentText: "USO REAL 2", title: "Gases", sub: "evidencia floja, muy ocasional" }],
  ["su gran uso real el que le da", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["el carbon activado puede anular tus medicamentos", 4.5, "KeywordPop", { theme: T, word: "ANULA TUS MEDICAMENTOS", sub: "incluidos los anticonceptivos", pos: "center" }],
  ["vino a la consulta una mujer joven", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Sofía", sub: "carbón detox + anticonceptivos = riesgo" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["hay otras advertencias importantes", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["si tomas cualquier medicacion no tomes carbon", 5.5, "Callout", { theme: T, icon: "💊", title: "Si tomás medicación", sub: "el carbón puede anularla — hablá con tu médico", tone: "warn" }],
  ["puede causar estrenimiento y molestias digestivas", 5.5, "Callout", { theme: T, icon: "⚫", title: "Estreñimiento y heces negras", sub: "puede enmascarar un sangrado digestivo", tone: "warn" }],
  ["te atrapa los nutrientes", 5, "Callout", { theme: T, icon: "🥗", title: "Te atrapa los nutrientes", sub: "tomado seguido, te deja peor nutrido", tone: "warn" }],
  ["un senor lo voy a llamar don mario", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Don Mario", sub: "el carbón le anulaba la pastilla de la presión" }],
  ["lo que de verdad te purifica", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["cada tanto aparece un producto de moda", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía: modas con criterio", items: ["Qué sirve y qué no", "Por qué el 'detox' es un mito", "Remedios caseros seguros"] }],
  ["usa siempre la cabeza natural o no", 3.6, "KeywordPop", { theme: T, word: "NATURAL ≠ INOFENSIVO", sub: "usá siempre la cabeza", pos: "center" }],
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
