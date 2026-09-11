/**
 * BUILD "miel-juantombo" (Dr. Juan Tomás) — miel: tos/garganta + advertencia bebés (botulismo). EARTH. QR ×6 (qr_guia_jt).
 *   node scripts/build_miel.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "miel-juantombo";
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
  ["quedate conmigo", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve la miel de verdad", "Cómo usarla bien", "Una advertencia que salva vidas"] }],
  ["esas dos grandes cosas", 7.5, "Compare", { theme: T, title: "Por qué funciona", left: { label: "Antibacteriana", sub: "acidez, densidad y agua oxigenada" }, right: { label: "Calma y recubre", sub: "protege la garganta irritada" } }],
  ["para que sirve la miel de verdad", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Tos y garganta (¡bien respaldado!)", "Heridas (solo miel de grado médico)", "Endulzante un poco mejor que el azúcar"] }],
  ["nunca jamas bajo ninguna circunstancia", 8, "MythVsTruth", { theme: T, myth: "Como la miel es natural, se le puede dar a un bebé.", truth: "FALSO Y PELIGROSO. Antes del año puede causar botulismo del lactante, que puede ser mortal. Nada de miel hasta el primer año cumplido." }],
  ["la miel es un azucar sano que podes comer sin ningun limite", 7, "MythVsTruth", { theme: T, myth: "Es un azúcar sano que podés comer sin límite.", truth: "Falso. Es un poco mejor que el azúcar común, pero sigue siendo azúcar: sube la glucosa y engorda igual. Con moderación." }],
  ["la miel de tu zona cura las alergias estacionales", 7, "MythVsTruth", { theme: T, myth: "La miel de tu zona cura las alergias al polen.", truth: "Falso. Suena lógico, pero la evidencia no lo respalda. No funciona como cura de las alergias." }],
  ["a cualquier herida o quemadura", 7, "MythVsTruth", { theme: T, myth: "Como es antibacteriana, le pongo la del frasco a cualquier herida.", truth: "Cuidado. La de grado médico es esterilizada; la de la cocina no, y puede infectar una herida seria. Para eso, el médico." }],
  ["vamos entonces a como usarla bien", 8, "Steps", { theme: T, eyebrow: "Cómo usarla", title: "Para mayores de 1 año", steps: [{ title: "Una cucharada para la tos", sub: "sola o en infusión tibia" }, { title: "Tibia, NUNCA hirviendo", sub: "el calor fuerte le quita propiedades" }, { title: "Como endulzante, con moderación", sub: "sigue siendo azúcar" }] }],
  ["hablemos un momento de expectativas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "La miel, siendo realista", steps: [{ when: "Con un resfrío", text: "calma la tos y la garganta" }, { when: "Como endulzante", text: "un poco mejor, con moderación" }, { when: "Antes del año", text: "jamás: puede ser mortal" }] }],
  ["no una medicina milagrosa que", 7, "PullQuote", { theme: T, quote: "La miel no es una medicina milagrosa ni un azúcar libre de culpa: es un remedio noble y con respaldo para cosas puntuales, que hay que usar con cabeza." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["juan tomas y en este canal", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON CRITERIO MÉDICO", title: "Dr. Juan Tomás", sub: "La miel, con cabeza" }],
  ["para la tos y la garganta irritada", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Tos y garganta", sub: "tan bien como algunos jarabes" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["es en las heridas", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Heridas", sub: "solo miel de grado médico" }],
  ["un endulzante un poquito mejor que el azucar", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Endulzante", sub: "un poco mejor, con moderación" }],
  ["si te agarra un resfrio con tos", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["la miel es peligrosa y puede llegar a ser mortal", 4.5, "KeywordPop", { theme: T, word: "NUNCA ANTES DEL AÑO", sub: "riesgo de botulismo del lactante", pos: "center" }],
  ["una bacteria que se llama clostridium botulinum", 3.6, "KeywordPop", { theme: T, word: "BOTULISMO DEL LACTANTE", sub: "puede ser mortal en bebés", pos: "center" }],
  ["vino a mi consulta una abuela muy angustiada", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Doña Rosa y su nieto", sub: "casi le da miel a un bebé de 8 meses" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["para que sirve la miel de verdad", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["ademas de lo de los bebes", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["nunca a menores de un ano", 5.5, "Callout", { theme: T, icon: "🚫", title: "Nunca antes del año", sub: "riesgo de botulismo — sin excepciones", tone: "warn" }],
  ["la miel sigue siendo azucar", 5.5, "Callout", { theme: T, icon: "🩸", title: "Sigue siendo azúcar", sub: "sube la glucosa igual — ojo diabetes", tone: "warn" }],
  ["comer miel a cucharadas", 5, "Callout", { theme: T, icon: "⚖️", title: "Tiene muchas calorías", sub: "natural no es libre de calorías", tone: "info" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["cuando la compres", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo elegirla y guardarla" }],
  ["la miel de verdad tiende a cristalizarse", 3.6, "KeywordPop", { theme: T, word: "SE CRISTALIZA = PURA", sub: "es buena señal, no se echó a perder", pos: "center" }],
  ["rescatar la sabiduria hermosa", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Usos seguros de la miel", "Qué NUNCA hacer (¡bebés!)", "Remedios caseros con criterio"] }],
  ["gracias de corazon por regalarme", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
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
