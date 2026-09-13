/**
 * BUILD "limon-juantombo" (Dr. Juan Tomás) — limón: vitamina C, hierro + mito "alcalinizar". EARTH. QR ×6 (qr_guia_jt).
 *   node scripts/build_limon.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "limon-juantombo";
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
  ["quedate conmigo", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el limón de verdad", "Cómo usarlo sin lastimarte", "Los mitos peligrosos desarmados"] }],
  ["que sea bien diluida", 7.5, "Compare", { theme: T, title: "La regla de oro", left: { label: "Diluido, con comidas", sub: "seguro y con beneficios reales" }, right: { label: "Jugo puro en ayunas", sub: "¡daña dientes y estómago!" } }],
  ["para que sirve el limon de verdad", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Vitamina C y defensas", "Ayuda a absorber el hierro", "Comer con menos sal", "Previene ciertos cálculos renales"] }],
  ["el limon alcaliniza el cuerpo", 8, "MythVsTruth", { theme: T, myth: "El limón alcaliniza el cuerpo y así previene el cáncer.", truth: "Rotundamente falso. Tu sangre regula su acidez sola, es imposible alcalinizarla comiendo. Y el limón es ácido, no alcalino." }],
  ["el agua con limon en ayunas quema grasa", 7, "MythVsTruth", { theme: T, myth: "El agua con limón en ayunas quema grasa y adelgaza.", truth: "Falso. El limón no quema grasa. Solo ayuda si reemplaza una bebida azucarada, por lo que reemplaza, no por magia." }],
  ["el limon te desintoxica y te limpia el higado", 7, "MythVsTruth", { theme: T, myth: "El limón te desintoxica y te limpia el hígado.", truth: "Falso. Para eso tenés hígado y riñones, que trabajan solos de maravilla. No hay limpieza mágica, es puro marketing." }],
  ["el limon con bicarbonato es una bomba", 7, "MythVsTruth", { theme: T, myth: "El limón con bicarbonato cura el cáncer.", truth: "Rotundamente falso y peligroso. Es la misma mentira de 'alcalinizar' disfrazada. No tiene ningún respaldo." }],
  ["como usarlo bien y sin hacerte dano", 8, "Steps", { theme: T, eyebrow: "Cómo usarlo", title: "Sin lastimarte", steps: [{ title: "Nunca el jugo puro", sub: "medio limón en un vaso grande de agua" }, { title: "Cuidá los dientes", sub: "sorbete y no cepillarte enseguida" }, { title: "Mejor con las comidas", sub: "sabor, vitamina C y hierro juntos" }] }],
  ["hablemos de expectativas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El limón, siendo realista", steps: [{ when: "En las comidas", text: "sabor, vitamina C y más hierro" }, { when: "Reemplazando peor", text: "menos sal y menos azúcar" }, { when: "Nunca", text: "no adelgaza, no alcaliniza, no cura" }] }],
  ["no una medicina milagrosa que cura", 7, "PullQuote", { theme: T, quote: "El limón no es una medicina milagrosa que cura y alcaliniza y adelgaza: es un alimento humilde, sabroso y nutritivo, un gran aliado de la cocina sana." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["juan tomas y en este canal", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON CRITERIO MÉDICO", title: "Dr. Juan Tomás", sub: "El limón, sin mitos" }],
  ["gran fuente de vitamina c", 3.6, "KeywordPop", { theme: T, word: "VITAMINA C", sub: "defensas, piel y absorción de hierro", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["tener buenos niveles de vitamina", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Vitamina C y defensas", sub: "pero NO cura la gripe" }],
  ["ayuda a absorber el hierro", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Absorbe el hierro", sub: "un chorrito en legumbres y verduras" }],
  ["ahi el limon si es un gran aliado", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["puede ayudar a prevenir cierto tipo", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Cálculos renales", sub: "el citrato ayuda a prevenirlos" }],
  ["vino a verme una mujer la voy a llamar beatriz", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Beatriz, 50 años", sub: "jugo puro en ayunas: dientes y estómago" }],
  ["no podes alcalinizar tu sangre", 3.6, "KeywordPop", { theme: T, word: "NO SE PUEDE ALCALINIZAR", sub: "tu sangre se regula sola", pos: "center" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["hay un par de advertencias mas", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["cuida tus dientes que es el", 5.5, "Callout", { theme: T, icon: "🦷", title: "Tus dientes", sub: "el ácido erosiona el esmalte — diluí y usá sorbete", tone: "warn" }],
  ["si tenes reflujo gastritis o acidez", 5, "Callout", { theme: T, icon: "🔥", title: "Estómago", sub: "con reflujo o gastritis, poco y diluido", tone: "warn" }],
  ["el limon en la piel con el sol", 5.5, "Callout", { theme: T, icon: "☀️", title: "Limón + sol = manchas", sub: "puede quemar y manchar la piel", tone: "warn" }],
  ["un paciente lo voy a llamar don hector", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Don Héctor, 60 años", sub: "lo sumó bien, dentro de una buena dieta" }],
  ["usa el limon para comer con menos sal", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["cuando compres limones", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo elegirlos y aprovecharlos" }],
  ["la ralladura de la cascara del limon", 3.6, "KeywordPop", { theme: T, word: "NO TIRES LA CÁSCARA", sub: "la ralladura tiene sabor y antioxidantes", pos: "center" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["quedate con lo que si sirve", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Usos reales del limón", "Cómo no lastimarte los dientes", "Los mitos peligrosos"] }],
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
