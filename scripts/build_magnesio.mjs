/**
 * BUILD "magnesio-elena" (Dra. Elena Vidal) — magnesio: tipos, calambres, sueño. CLINIC. QR ×6.
 *   node scripts/build_magnesio.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "magnesio-elena";
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
  ["quedate conmigo", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el magnesio de verdad", "El secreto: qué tipo elegir", "Cómo reponerlo y las advertencias"] }],
  ["no todos los magnesios son iguales", 8, "Compare", { theme: T, title: "No todos son iguales", left: { label: "Citrato / Glicinato", sub: "se absorben bien: para calambres y descanso" }, right: { label: "Óxido (el barato)", sub: "se absorbe poco: sobre todo laxante" } }],
  ["para que sirve el magnesio segun la evidencia", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Músculos y calambres", "Descanso y relajación", "Tránsito intestinal", "Apoyo modesto a la presión"] }],
  ["el magnesio cura la ansiedad", 7, "MythVsTruth", { theme: T, myth: "El magnesio cura la ansiedad y la depresión.", truth: "Falso dicho así. Puede ayudar a relajarte si andabas bajo, pero la ansiedad y la depresión se tratan con un profesional. No abandones ningún tratamiento." }],
  ["cuanto mas magnesio mejor", 7, "MythVsTruth", { theme: T, myth: "Cuanto más magnesio, mejor y más rápido dormís.", truth: "Falso, es al revés. Pasarte solo te da diarrea y malestar. El cuerpo repone lo que le falta, no acumula superpoderes." }],
  ["como es natural y es un mineral", 7, "MythVsTruth", { theme: T, myth: "Como es natural y es un mineral, lo puede tomar cualquiera sin riesgo.", truth: "Falso. En quien tiene los riñones comprometidos puede ser peligroso, y puede interferir con medicamentos. Natural no es inofensivo." }],
  ["vamos entonces a como aprovecharlo bien", 8, "Steps", { theme: T, eyebrow: "Cómo usarlo bien", title: "Paso a paso", steps: [{ title: "Primero, la comida", sub: "semillas, frutos secos, legumbres, hoja verde" }, { title: "Elegí el tipo según lo que buscás", sub: "citrato, glicinato u óxido" }, { title: "Dosis sensata, con constancia", sub: "más NO es mejor" }] }],
  ["hablemos de expectativas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El magnesio, siendo realista", steps: [{ when: "Si andabas bajo", text: "aflojan calambres y tensión" }, { when: "Con constancia", text: "descansás un poco mejor" }, { when: "Nunca", text: "no cura la ansiedad ni hace magia" }] }],
  ["no una pastilla magica de las que", 7, "PullQuote", { theme: T, quote: "El magnesio no es una pastilla mágica: es un mineral esencial y humilde que, bien repuesto, ayuda a que tu cuerpo funcione un poco mejor cada día." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["en este canal me tomo el trabajo", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "El magnesio, bien usado" }],
  ["participa en cientos de reacciones", 4, "StatChip", { theme: T, value: 300, suffix: "+", label: "reacciones en tu cuerpo" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["el magnesio es clave para que", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Músculos y calambres", sub: "ayuda al músculo a relajarse" }],
  ["lo segundo y muy pedido", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Descanso y relajación", sub: "una ayuda suave, no un somnífero" }],
  ["lo tercero es el", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Tránsito intestinal", sub: "el tipo correcto ayuda a ir de cuerpo" }],
  ["es la diferencia entre que te funcione", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["el detalle mas importante del video", 4, "SectionTitle", { eyebrow: "EL SECRETO", title: "Qué tipo de magnesio" }],
  ["el suplemento es para cuando la comida", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["vino a verme una mujer la voy a llamar silvia", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Silvia, 50 años", sub: "mezclaba suplementos sin criterio" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["las advertencias porque aunque el magnesio", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["si tenes problemas en los rinones", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Riñones", sub: "si hay enfermedad renal, solo con tu médico", tone: "warn" }],
  ["el efecto laxante", 5, "Callout", { theme: T, icon: "🚽", title: "Efecto laxante", sub: "demasiado (óxido/citrato) da diarrea — bajá la dosis", tone: "warn" }],
  ["las interacciones con medicamentos", 5, "Callout", { theme: T, icon: "💊", title: "Interacciones", sub: "separá de antibióticos y tiroides varias horas", tone: "warn" }],
  ["no mezcles suplementos a lo loco", 5, "Callout", { theme: T, icon: "🧴", title: "No acumules", sub: "multis, laxantes y antiácidos ya traen magnesio", tone: "info" }],
  ["el aceite o el spray de magnesio en la piel", 3.6, "KeywordPop", { theme: T, word: "EL SPRAY NO HACE MAGIA", sub: "para reponer, mejor tomado", pos: "center" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["si compras un suplemento fijate bien", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo elegir el suplemento" }],
  ["las mejores formas de reponerlo", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Qué tipo de magnesio elegir", "Cantidades seguras", "Cómo reponerlo desde la comida"] }],
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
