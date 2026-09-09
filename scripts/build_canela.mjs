/**
 * BUILD "canela-elena" (Dra. Elena Vidal) — canela: azúcar/antioxidante, Ceylán vs Cassia. CLINIC. QR ×6.
 *   node scripts/build_canela.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "canela-elena";
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
  ["quedate conmigo", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve la canela de verdad", "El secreto: Ceylán vs Cassia", "Cómo usarla bien y las advertencias"] }],
  ["existen para lo que nos importa dos grandes tipos", 7.5, "Compare", { theme: T, title: "Las dos canelas", left: { label: "Cassia (la común)", sub: "mucha cumarina: ojo con el exceso" }, right: { label: "Ceylán (la verdadera)", sub: "poca cumarina: la de todos los días" } }],
  ["para que sirve la canela segun la evidencia", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Apoyo modesto para el azúcar en sangre", "Antioxidante potente", "Antiinflamatorio", "En estudio: colesterol"] }],
  ["la canela cura la diabetes", 7, "MythVsTruth", { theme: T, myth: "La canela cura la diabetes.", truth: "Rotundamente falso. Ayuda modestamente como apoyo, pero NO cura ni reemplaza tu tratamiento. Nunca abandones tu medicación." }],
  ["la canela en ayunas", 7, "MythVsTruth", { theme: T, myth: "La canela en ayunas quema grasa y adelgaza.", truth: "Falso. No hay evidencia seria. Adelgazar es alimentación, movimiento y descanso." }],
  ["cuanta mas canela mejor", 7, "MythVsTruth", { theme: T, myth: "Cuanta más canela, mejor.", truth: "Falso, es al revés. Más canela común = más cumarina y más riesgo para el hígado. Poco y bien." }],
  ["como es natural no puede hacer mal", 7, "MythVsTruth", { theme: T, myth: "Como es natural, no puede hacer mal.", truth: "Falso. La Cassia en exceso puede afectar el hígado y la coagulación. Natural no es inofensivo." }],
  ["vamos entonces a como usarla bien", 8, "Steps", { theme: T, eyebrow: "Cómo usarla bien", title: "Paso a paso", steps: [{ title: "Elegí Ceylán (la verdadera)", sub: "en rama, se desarma fácil" }, { title: "½ a 1 cucharadita al día", sub: "más NO es mejor" }, { title: "En avena, yogur, café o infusión", sub: "con constancia" }] }],
  ["hablemos de expectativas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "La canela, siendo realista", steps: [{ when: "Con constancia", text: "un apoyo modesto para el azúcar" }, { when: "Cada día", text: "aporte antioxidante" }, { when: "Siempre", text: "no cura ni adelgaza" }] }],
  ["una pequena aliada deliciosa", 7, "PullQuote", { theme: T, quote: "La canela no es una cura milagrosa: es una pequeña aliada deliciosa de todos los días, de esas que hacen que cuidarse sea también un placer." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["en este canal me tomo", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "La canela, bien usada" }],
  ["el secreto mas importante del video", 4, "SectionTitle", { eyebrow: "EL SECRETO", title: "Ceylán vs Cassia" }],
  ["una sustancia llamada cumarina", 3.6, "KeywordPop", { theme: T, word: "CUMARINA", sub: "en exceso, afecta el hígado", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["lo primero y lo mas estudiado", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Azúcar en sangre", sub: "apoyo modesto, no cura" }],
  ["es un aliado no un remedio", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["lo segundo es su enorme poder antioxidante", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Antioxidante potente", sub: "de las especias más altas" }],
  ["tercero es su efecto", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Antiinflamatorio", sub: "modula la inflamación de fondo" }],
  ["vino a verme una mujer la voy a llamar susana", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Susana, 58 años", sub: "tomaba la común a cucharadas" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["las advertencias porque que algo sea natural", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["la cumarina de la canela cassia", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Cumarina (canela común)", sub: "en exceso sobrecarga el hígado — elegí Ceylán", tone: "warn" }],
  ["si tomas anticoagulantes", 5, "Callout", { theme: T, icon: "💊", title: "Anticoagulantes", sub: "puede aumentar el sangrado — consultá", tone: "warn" }],
  ["si tenes diabetes y tomas medicacion", 5, "Callout", { theme: T, icon: "🩸", title: "Diabetes con medicación", sub: "podría bajar más el azúcar — controlá", tone: "warn" }],
  ["en el embarazo como condimento", 5, "Callout", { theme: T, icon: "🤰", title: "Embarazo", sub: "condimento OK; en dosis altas, consultá", tone: "info" }],
  ["busca la canela", 3.6, "KeywordPop", { theme: T, word: "ELEGÍ CEYLÁN", sub: "la verdadera, para el día a día", pos: "center" }],
  ["media cucharadita a una cucharadita", 4, "StatChip", { theme: T, value: 1, suffix: " cdita", label: "al día alcanza y sobra" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["cuando compres canela", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo elegirla y guardarla" }],
  ["la canela combina hermoso", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["simple honesto y realista", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Cómo distinguir las canelas", "Cantidades seguras", "Combinaciones que funcionan"] }],
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
