/**
 * FASE 7 — BUILD "manzanilla-elena" (Dra. Elena Vidal) — té de manzanilla: beneficios, riesgos y verdades.
 * DENSO + Timeline estrella (kit4). Tema CLINIC.
 *   node scripts/build_manzanilla.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "manzanilla-elena";
const FPS = 30;
const T = "clinic";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["asi que quedate hasta el final", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Qué le hace la manzanilla a tu cuerpo", "Sus riesgos y quiénes NO deberían tomarla", "Cómo prepararla bien"] }],
  ["esos son los verdaderos protagonistas", 7, "Checklist", { theme: T, title: "Para qué SÍ es buena", items: ["Digestión: calma el estómago", "Calma y sueño (suave, no un somnífero)", "Antiinflamatoria y antioxidante", "Piel: compresas para irritación"] }],
  ["la planta fue la excusa perfecta", 6, "PullQuote", { theme: T, quote: "La planta fue la excusa perfecta para crear un momento de calma. Y esa combinación es la que de verdad funciona." }],
  ["primer mito la manzanilla", 7, "MythVsTruth", { theme: T, myth: "La manzanilla cura la gastritis y las úlceras.", truth: "Falso. Ayuda a calmar la molestia y a desinflamar un poco, pero no cura. Puede acompañar tu tratamiento, nunca reemplazarlo." }],
  ["como es natural puedo tomar toda", 7, "MythVsTruth", { theme: T, myth: "Como es natural, puedo tomar toda la que quiera.", truth: "Falso. Más fuerte y más tazas no es mejor: en exceso da somnolencia, molestias o interactúa con tus remedios. Moderación." }],
  ["la manzanilla sirve para absolutamente todo", 7, "MythVsTruth", { theme: T, myth: "La manzanilla sirve para absolutamente todo.", truth: "Falso. Es excelente para la digestión y la calma, pero no es una cura universal. Hace pocas cosas, y las hace bien." }],
  ["cuarto mito el te de", 7, "MythVsTruth", { theme: T, myth: "El té de sobrecito no sirve, tiene que ser de la planta.", truth: "Falso (con matiz). Un buen sobre conserva sus activos. Lo que arruina una manzanilla no es el formato: es prepararla mal." }],
  ["la temperatura del agua no uses", 8, "Steps", { theme: T, eyebrow: "Cómo prepararla bien", title: "Paso a paso", steps: [{ title: "Agua NO hirviendo", sub: "volcala apenas antes del hervor" }, { title: "Tapá la taza", sub: "así no se escapan los aceites" }, { title: "Reposar 5 a 10 min", sub: "colar; 1-2 tazas al día" }] }],
  ["desde la primera taza lo mas probable", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "La manzanilla, con el tiempo", steps: [{ when: "Primera taza", text: "calorcito y calma inmediata" }, { when: "Semanas", text: "estómago más tranquilo y mejor sueño" }, { when: "Con el hábito", text: "una aliada diaria de tu bienestar" }] }],
  ["en un mundo que te ofrece pastillas para todo", 7, "PullQuote", { theme: T, quote: "En un mundo que te ofrece pastillas para todo y soluciones rápidas para nada, hay una sabiduría enorme en volver a lo simple y bien hecho." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "REMEDIOS NATURALES CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "Beneficios, riesgos y verdades" }],
  ["el primer beneficio y el mas famoso", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Calma el estómago", sub: "relaja el músculo digestivo" }],
  ["el estomago y los nervios estan", 3.6, "KeywordPop", { theme: T, word: "ESTÓMAGO Y NERVIOS", sub: "cuando la mente afloja, el estómago también", pos: "center" }],
  ["el segundo gran beneficio es sobre el sueno", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Calma y mejor sueño", sub: "suave; NO es un somnífero" }],
  ["se une a ciertos receptores del cerebro", 3.6, "KeywordPop", { theme: T, word: "APIGENINA", sub: "actúa suave sobre receptores de calma", pos: "center" }],
  ["viene del ritual en si", 3.4, "KeywordPop", { theme: T, word: "EL RITUAL", sub: "parar, respirar: la mitad del efecto", pos: "bottom" }],
  ["es antiinflamatoria y antioxidante", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Antiinflamatoria", sub: "flavonoides antioxidantes" }],
  ["el uso en la piel y por fuera", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Uso en la piel", sub: "compresas para irritación y ojos" }],
  ["una mujer la voy a llamar", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Doña Carmen, 60 años", sub: "el estómago cerrado por los nervios" }],
  ["la manzanilla es suave si pero", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Los riesgos (que nadie cuenta)" }],
  ["el primer riesgo y el mas importante es la alergia", 5.5, "Callout", { theme: T, icon: "🌼", title: "Alergia: familia de las margaritas", sub: "cuidado si sos alérgico al polen/ambrosía", tone: "warn" }],
  ["si tomas anticoagulantes", 5.5, "Callout", { theme: T, icon: "💊", title: "Anticoagulantes: cumarinas", sub: "puede aumentar el sangrado — consultá", tone: "warn" }],
  ["el tercer riesgo es el embarazo", 5, "Callout", { theme: T, icon: "🤰", title: "Embarazo, lactancia y bebés", sub: "prudencia y consultar antes", tone: "warn" }],
  ["los sedantes y las cirugias", 5, "Callout", { theme: T, icon: "🛏️", title: "Sedantes y cirugías", sub: "potencia el sueño; suspender antes de operarte", tone: "warn" }],
  ["si tenes un dolor de estomago fuerte", 5, "Callout", { theme: T, icon: "🩺", title: "No reemplaza al médico", sub: "dolor fuerte, sangre o baja de peso → consultá", tone: "info" }],
  ["mas no es mejor una o dos", 3.4, "KeywordPop", { theme: T, word: "MÁS NO ES MEJOR", sub: "la moderación es la clave", pos: "center" }],
  ["vamos a lo practico como preparar", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo prepararla bien" }],
  ["tapa la taza cubri la infusion", 3.6, "KeywordPop", { theme: T, word: "TAPÁ LA TAZA", sub: "los aceites se escapan con el vapor", pos: "center" }],
  ["una o dos tazas al dia", 4.5, "StatChip", { theme: T, value: 2, suffix: " tazas", label: "al día, cantidad prudente" }],
  ["no te olvides de que te deje", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Qué usar para cada cosa", "Cantidades y cuidados de cada uno", "Cómo aprovechar cada taza"] }],
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
console.log(`✓ TOTAL ${total} beats · ${components.length + overlays.length} comp/ov en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
