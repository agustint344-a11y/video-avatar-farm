/**
 * BUILD "avena-elena" (Dra. Elena Vidal) — avena: colesterol, betaglucano, fibra. CLINIC. QR ×6.
 *   node scripts/build_avena.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "avena-elena";
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
  ["conmigo porque te voy a", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve la avena de verdad", "El secreto: el betaglucano", "Cómo elegirla y las advertencias"] }],
  ["un plato de avena de verdad que un producto", 7.5, "Compare", { theme: T, title: "No es lo mismo", left: { label: "Avena de verdad", sub: "un ingrediente: avena. Baja el colesterol" }, right: { label: "\"Avena\" azucarada", sub: "barritas y cereales: casi una golosina" } }],
  ["para que sirve la avena segun la evidencia", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Baja el colesterol (¡muy probado!)", "Suaviza el azúcar en sangre", "Cuida la digestión", "Da saciedad"] }],
  ["la avena engorda porque es pura harina", 7, "MythVsTruth", { theme: T, myth: "La avena engorda porque es pura harina.", truth: "Falso. Es un carbohidrato complejo con fibra y proteínas que da saciedad. Lo que engorda es la versión azucarada, no la avena de verdad." }],
  ["la avena en ayunas quema grasa", 7, "MythVsTruth", { theme: T, myth: "La avena en ayunas quema grasa y adelgaza sola.", truth: "Falso. Ayuda por la saciedad y el colesterol, pero no quema grasa. Adelgazar es alimentación, movimiento y descanso." }],
  ["el agua de avena esa bebida colada", 7, "MythVsTruth", { theme: T, myth: "El agua de avena colada tiene todos los beneficios.", truth: "No. Al colar y tirar el grano perdés la fibra y el betaglucano. Lo que cuida el colesterol es comer la avena, no solo el agüita." }],
  ["como es sana cuanta mas avena mejor", 7, "MythVsTruth", { theme: T, myth: "Como es sana, cuanta más avena, mejor.", truth: "No. En exceso y con muchos agregados dulces, aporta muchas calorías y puede hincharte. La porción justa, con constancia." }],
  ["avena lo mas entera y menos", 8, "Steps", { theme: T, eyebrow: "Cómo elegirla y usarla", title: "Paso a paso", steps: [{ title: "Elegí avena de verdad", sub: "en copos, un solo ingrediente" }, { title: "Con agua o leche y fruta", sub: "sin azúcar agregada" }, { title: "Porción justa, con constancia", sub: "casi todos los días" }] }],
  ["hablemos de expectativas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "La avena, siendo realista", steps: [{ when: "Con constancia", text: "baja el colesterol de a poco" }, { when: "Cada mañana", text: "energía y saciedad" }, { when: "Nunca", text: "no quema grasa por sí sola" }] }],
  ["no un producto de moda de esos", 7, "PullQuote", { theme: T, quote: "La avena no es un producto de moda que promete adelgazarte, ni una bomba de carbohidratos que temer: es un alimento humilde y poderoso que cuida tu corazón cada mañana." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["en este canal me tomo el trabajo", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "La avena, sin mitos" }],
  ["fibra soluble que se llama", 3.6, "KeywordPop", { theme: T, word: "BETAGLUCANO", sub: "la fibra que baja el colesterol", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["la salud del corazon y en especial", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Corazón y colesterol", sub: "baja el colesterol malo (LDL)" }],
  ["lo segundo el azucar en sangre", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Azúcar en sangre", sub: "sube más suave tras comer" }],
  ["es una de las mejores aliadas naturales", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["lo tercero la salud digestiva", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Digestión y flora", sub: "fibra y buen tránsito" }],
  ["la saciedad y el control del peso", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Saciedad", sub: "te llena, no quema grasa" }],
  ["vino a verme un hombre lo voy a llamar raul", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Raúl, 55 años", sub: "comía cereales 'de avena' azucarados" }],
  ["la avena de verdad tiene un solo ingrediente", 3.6, "KeywordPop", { theme: T, word: "UN SOLO INGREDIENTE", sub: "avena, y nada más", pos: "center" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["hay algunas cosas que quiero que sepas", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["la avena en si naturalmente no tiene gluten", 5.5, "Callout", { theme: T, icon: "🌾", title: "Celíacos", sub: "puede contaminarse — comprá certificada SIN gluten", tone: "warn" }],
  ["si nunca comes mucha fibra", 5, "Callout", { theme: T, icon: "💨", title: "Empezá de a poco", sub: "mucha fibra de golpe hincha — subí gradual y tomá agua", tone: "info" }],
  ["si tenes diabetes y tomas medicacion", 5, "Callout", { theme: T, icon: "🩸", title: "Diabetes con medicación", sub: "elegí la sin azúcar y controlá tus valores", tone: "warn" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["cuando compres avena", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo elegirla y guardarla" }],
  ["la avena es de lo mas versatil", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["compra un paquete grande de avena simple", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Cómo elegir la avena de verdad", "Recetas sin azúcar", "Cantidades y combinaciones"] }],
  ["gracias por redalarme estos minutos", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
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
