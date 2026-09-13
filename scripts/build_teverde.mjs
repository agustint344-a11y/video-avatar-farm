/**
 * BUILD "teverde-elena" (Dra. Elena Vidal) — té verde: antioxidante, energía, "quema grasa". CLINIC. QR ×6.
 *   node scripts/build_teverde.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "teverde-elena";
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
  ["conmigo porque te voy a explicar", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el té verde de verdad", "Cómo prepararlo bien y cuándo", "Los mitos y las advertencias"] }],
  ["para que sirve el te verde segun la evidencia", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Antioxidante potente", "Salud del corazón", "Energía tranquila y concentración", "Efecto en el peso: diminuto"] }],
  ["esa combinacion de cafeina con l teanina", 7, "Compare", { theme: T, title: "Energía: café vs. té verde", left: { label: "Café", sub: "más fuerte, a veces nervios y temblor" }, right: { label: "Té verde", sub: "energía tranquila (cafeína + L-teanina)" } }],
  ["el te verde quema de grasa", 7, "MythVsTruth", { theme: T, myth: "El té verde quema grasa y adelgaza solo.", truth: "Falso. Su efecto sobre el metabolismo es diminuto. No derrite grasa; a lo sumo un aliado dentro de un plan de verdad." }],
  ["el te verde cura el cancer", 7, "MythVsTruth", { theme: T, myth: "El té verde cura el cáncer.", truth: "No. Sus antioxidantes se asocian a menor riesgo de enfermedades, pero eso no es curar. Ningún té cura el cáncer." }],
  ["el te verde te desintoxica", 7, "MythVsTruth", { theme: T, myth: "El té verde te desintoxica y te limpia el cuerpo.", truth: "Falso. Para eso tenés hígado y riñones. Es sano por sus antioxidantes, no por 'limpiar toxinas'. Eso es marketing." }],
  ["cuanto mas te verde tomes mejor", 7, "MythVsTruth", { theme: T, myth: "Cuanto más té verde tomes, mejor.", truth: "No. El exceso es demasiada cafeína (nervios e insomnio), y los extractos concentrados pueden dañar el hígado. 2-3 tazas alcanza." }],
  ["y hay errores muy comunes que arruinan", 8, "Steps", { theme: T, eyebrow: "Cómo prepararlo", title: "Paso a paso", steps: [{ title: "Agua NO hirviendo", sub: "el agua muy caliente lo amarga y lo arruina" }, { title: "Solo 2-3 minutos de reposo", sub: "más tiempo = amargo" }, { title: "Lejos de las comidas con hierro", sub: "entre comidas, 2-3 tazas al día" }] }],
  ["hablemos de expectativas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El té verde, siendo realista", steps: [{ when: "Con constancia", text: "antioxidantes y corazón más sano" }, { when: "Cada taza", text: "energía tranquila y foco" }, { when: "Nunca", text: "no derrite grasa ni cura nada" }] }],
  ["no una pocion magica para adelgazar", 7, "PullQuote", { theme: T, quote: "El té verde no es una poción mágica para adelgazar: es una bebida noble y milenaria, llena de antioxidantes, que cuida tu cuerpo de a poquito todos los días." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["en este canal me tomo el trabajo", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "El té verde, sin mitos" }],
  ["unos antioxidantes potentes que se llaman catequinas", 3.6, "KeywordPop", { theme: T, word: "CATEQUINAS", sub: "los antioxidantes estrella del té verde", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["su enorme poder antioxidante", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Antioxidante potente", sub: "un gesto antiedad desde adentro" }],
  ["es la salud del corazon", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Salud del corazón", sub: "ayuda modestamente al colesterol" }],
  ["esa energia tranquila y la concentracion", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Energía tranquila", sub: "foco sin el nerviosismo del café" }],
  ["tomar te verde con regularidad", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["vino a verme una mujer la voy a llamar carla", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Carla, 40 años", sub: "tomaba 12 tazas y cápsulas concentradas" }],
  ["el detalle que casi nadie conoce", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["las advertencias porque aunque el te verde", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["el te verde tiene cafeina menos que el cafe", 5.5, "Callout", { theme: T, icon: "☕", title: "Cafeína", sub: "si sos sensible o de noche, moderá", tone: "warn" }],
  ["el embarazo y la lactancia", 5, "Callout", { theme: T, icon: "🤰", title: "Embarazo y lactancia", sub: "limitá bastante y consultá", tone: "warn" }],
  ["extractos concentrados de te verde", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Extractos concentrados", sub: "en dosis altas pueden dañar el hígado", tone: "warn" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["consejos para elegirlo y guardarlo", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo elegirlo y guardarlo" }],
  ["y esta el famoso matcha", 3.6, "KeywordPop", { theme: T, word: "MATCHA", sub: "la hoja entera: más potente, más cafeína", pos: "center" }],
  ["dos o tres tazas", 4, "StatChip", { theme: T, value: 3, suffix: " tazas", label: "al día es lo ideal" }],
  ["las mejores formas de prepararlo", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Cómo prepararlo sin amargarlo", "Cuándo tomarlo", "Cantidades seguras"] }],
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
