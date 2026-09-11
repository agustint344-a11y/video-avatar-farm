/**
 * BUILD "vinagre-elena" (Dra. Elena Vidal) — vinagre de manzana: azúcar, adelgazar, peligros. CLINIC. QR ×6.
 *   node scripts/build_vinagre.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "vinagre-elena";
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
  ["quedate conmigo", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el vinagre de verdad", "Cómo tomarlo seguro (nunca puro)", "Los mitos y las advertencias"] }],
  ["nunca jamas lo tomes puro", 7.5, "Compare", { theme: T, title: "La regla de oro", left: { label: "Diluido, con comida", sub: "seguro y con algún beneficio" }, right: { label: "Puro y en ayunas", sub: "¡daña dientes y estómago!" } }],
  ["para que sirve el vinagre de manzana segun la evidencia", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Suaviza el pico de azúcar tras comer", "Un poco de saciedad", "Aderezo rico y bajo en calorías"] }],
  ["el vinagre de manzana en ayunas quema grasa", 7, "MythVsTruth", { theme: T, myth: "El vinagre en ayunas quema grasa y adelgaza solo.", truth: "Falso. No quema grasa. A lo sumo, un apoyo diminuto dentro de un plan. Adelgazar es alimentación, movimiento y descanso." }],
  ["el vinagre de manzana cura la diabetes", 7, "MythVsTruth", { theme: T, myth: "El vinagre de manzana cura la diabetes.", truth: "Falso. Ayuda modestamente a suavizar el azúcar, pero NO cura ni reemplaza tu tratamiento. Nunca abandones tu medicación." }],
  ["el vinagre de manzana te desintoxica", 7, "MythVsTruth", { theme: T, myth: "Te desintoxica y te limpia el hígado y la sangre.", truth: "Falso. Para eso tenés hígado y riñones, que trabajan solos las 24 horas. No hay limpieza mágica, es puro marketing." }],
  ["ponerse vinagre puro o mal diluido en la piel", 7, "MythVsTruth", { theme: T, myth: "En la piel cura el acné y sirve de tónico facial.", truth: "Cuidado. Puro o mal diluido puede causar quemaduras químicas. Para tu piel, un dermatólogo, no un video." }],
  ["la forma correcta y segura de tomarlo", 8, "Steps", { theme: T, eyebrow: "Cómo tomarlo", title: "Si querés probarlo", steps: [{ title: "Nunca puro, siempre diluido", sub: "1 cucharada en un vaso grande de agua" }, { title: "Con las comidas", sub: "no en ayunas y concentrado" }, { title: "Cuidá los dientes", sub: "sorbete y no cepillarte enseguida" }] }],
  ["hablemos de expectativas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El vinagre, siendo realista", steps: [{ when: "Con las comidas", text: "suaviza el pico de azúcar" }, { when: "A veces", text: "un poco más de saciedad" }, { when: "Nunca", text: "no derrite grasa ni cura nada" }] }],
  ["no una pocion magica para adelgazar", 7, "PullQuote", { theme: T, quote: "El vinagre de manzana no es una poción mágica para adelgazar: es un condimento humilde con un pequeño extra para el azúcar, que hay que usar con cabeza." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["en este canal me tomo el trabajo", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "El vinagre de manzana, sin mitos" }],
  ["es el acido acetico", 3.6, "KeywordPop", { theme: T, word: "ÁCIDO ACÉTICO", sub: "hace lo bueno y también lo malo", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["ese efecto sobre el azucar en sangre que te venia contando", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Azúcar en sangre", sub: "suaviza el pico tras comer" }],
  ["la sensacion de saciedad", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Saciedad", sub: "ayuda a comer con menos ansiedad" }],
  ["y es en la cocina", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "En la cocina", sub: "aderezo rico y bajo en calorías" }],
  ["la forma mas rica mas natural y mas segura", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["vino a verme una mujer la voy a llamar marta", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Marta, 45 años", sub: "lo tomaba puro y en ayunas" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["como parte de una alimentacion cuidada", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["las advertencias porque el vinagre de manzana", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["el acido acetico del vinagre con el uso repetido", 5.5, "Callout", { theme: T, icon: "🦷", title: "Tus dientes", sub: "erosiona el esmalte, que no se recupera — diluí y usá sorbete", tone: "warn" }],
  ["tu estomago y tu esofago", 5, "Callout", { theme: T, icon: "🔥", title: "Estómago y esófago", sub: "con reflujo o gastritis, mejor evitalo", tone: "warn" }],
  ["si tomas ciertos medicamentos", 5, "Callout", { theme: T, icon: "💊", title: "Medicamentos", sub: "diuréticos, insulina y diabetes — consultá", tone: "warn" }],
  ["otro paciente lo voy a llamar jorge", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Jorge, 55 años", sub: "lo usó bien, dentro de un cambio real" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["muchos eligen el que dicen", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo elegirlo y guardarlo" }],
  ["que tiene la madre", 3.6, "KeywordPop", { theme: T, word: "LA MADRE", sub: "buena señal, pero no hace milagros", pos: "center" }],
  ["las mejores formas de usarlo", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Cantidades y diluciones seguras", "Cómo cuidar tus dientes", "Qué esperar de verdad"] }],
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
