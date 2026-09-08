/**
 * BUILD "laurel-elena" (Dra. Elena Vidal) — laurel: digestión/antioxidante. Tema CLINIC. QR ×6.
 *   node scripts/build_laurel.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "laurel-elena";
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
  ["asi que quedate conmigo", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el laurel de verdad", "Cómo prepararlo bien", "Un detalle de seguridad clave"] }],
  ["si hervis la hoja de laurel", 7, "Compare", { theme: T, title: "Cómo NO perder lo bueno", left: { label: "Hervida 30 min", sub: "los aceites se van con el vapor" }, right: { label: "Infusión tapada 10 min", sub: "conservás lo bueno" } }],
  ["para que sirve el laurel segun la evidencia", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Digestión: menos pesadez e hinchazón", "Antioxidante suave", "En estudio: apoyo para el azúcar", "Efecto relajante y de calma"] }],
  ["el agua de laurel adelgaza", 7, "MythVsTruth", { theme: T, myth: "El agua de laurel adelgaza y quema grasa.", truth: "Rotundamente falso. No hay evidencia. Puede desinflamar la sensación de hinchazón, pero eso no es adelgazar." }],
  ["el laurel cura la diabetes", 7, "MythVsTruth", { theme: T, myth: "El laurel cura la diabetes.", truth: "Falso y peligroso. Se estudia como posible pequeño apoyo, pero NO cura ni reemplaza tu medicación. Nunca la abandones." }],
  ["quemar hojas de laurel en tu casa", 7, "MythVsTruth", { theme: T, myth: "Quemar laurel cura enfermedades y limpia las energías.", truth: "Sin efecto comprobado sobre tu salud física. Si te relaja el aroma, disfrutalo como ritual, pero no esperes que cure nada." }],
  ["como es natural no puede hacer mal", 7, "MythVsTruth", { theme: T, myth: "Como es natural, no puede hacer mal.", truth: "Falso. La hoja entera puede lastimar si se traga, puede afectar el azúcar y en el embarazo hay que tener cuidado. Natural no es inofensivo." }],
  ["agarra una o dos hojas de laurel", 8, "Steps", { theme: T, eyebrow: "La infusión bien hecha", title: "Paso a paso", steps: [{ title: "1-2 hojas, rotas con la mano", sub: "liberan mejor sus aceites" }, { title: "Agua casi hirviendo, apagá y tapá", sub: "reposar 10-15 min" }, { title: "Colá y tomá después de comer", sub: "podés sumar limón o jengibre" }] }],
  ["hablemos de expectativas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El laurel, siendo realista", steps: [{ when: "Después de comer", text: "digestión más liviana" }, { when: "Como hábito", text: "un momento de calma" }, { when: "Siempre", text: "un apoyo suave, no un milagro" }] }],
  ["no una hoja magica sino una pequena aliada", 7, "PullQuote", { theme: T, quote: "El laurel no es una hoja mágica: es una pequeña aliada de todos los días, de esas humildes que estaban siempre en el frasco de la cocina." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "El laurel, bien usado" }],
  ["son sus aceites esenciales", 3.6, "KeywordPop", { theme: T, word: "ACEITES ESENCIALES", sub: "ahí está casi todo lo bueno", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["el laurel es una ayuda suave", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["el aroma del laurel tiene", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["lo primero y lo mas respaldado", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Digestión", sub: "menos pesadez e hinchazón" }],
  ["lo segundo es su efecto antioxidante", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Antioxidante", sub: "combate los radicales libres" }],
  ["controlar el azucar", 5, "LowerThird", { theme: T, accentText: "EN ESTUDIO", title: "Azúcar en sangre", sub: "posible apoyo, NO cura" }],
  ["la voy a llamar marta", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Marta, 55 años", sub: "esperaba adelgazar y se frustraba" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["las advertencias porque que algo sea natural", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["la hoja de laurel entera no se come", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Nunca tragues la hoja entera", sub: "es dura y filosa: retirala del plato", tone: "warn" }],
  ["si estas embarazada", 5, "Callout", { theme: T, icon: "🤰", title: "Embarazo", sub: "como condimento OK; en infusión, consultá", tone: "info" }],
  ["si tenes diabetes y tomas medicacion", 5, "Callout", { theme: T, icon: "💊", title: "Diabetes con medicación", sub: "podría bajar más el azúcar — controlá", tone: "warn" }],
  ["si estas por operarte", 5, "Callout", { theme: T, icon: "🩺", title: "Antes de una cirugía", sub: "suspender infusiones días antes", tone: "warn" }],
  ["dejarlas reposar tapado", 4, "StatChip", { theme: T, value: 10, suffix: " min", label: "de reposo, tapada" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["elegi hojas enteras de buen color", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo elegirlo y guardarlo" }],
  ["simple honesto y realista", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Cómo preparar el laurel", "Cantidades y combinaciones", "Qué usar para cada cosa"] }],
  ["te mando un abrazo enorme", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
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
