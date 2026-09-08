/**
 * BUILD "clavo-juantombo" (Dr. Juan Tomás) — clavo de olor: dolor/antiinflamatorio. Tema EARTH. QR ×6 (qr_guia_jt).
 *   node scripts/build_clavo.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "clavo-juantombo";
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
  ["asi que quedate conmigo", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el clavo de verdad", "Cómo usarlo bien (y poco)", "Las advertencias serias"] }],
  ["mas clavo no es mejor", 7, "Compare", { theme: T, title: "El poder del eugenol", left: { label: "Poco y bien", sub: "un clavo, con cuidado: ayuda" }, right: { label: "En exceso", sub: "irrita y puede ser tóxico" } }],
  ["para que sirve el clavo de olor segun la evidencia", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Dolor dental (alivio temporal)", "Salud de la boca y aliento", "Digestión", "Antioxidante potente"] }],
  ["cura las infecciones y reemplaza a los antibioticos", 7, "MythVsTruth", { theme: T, myth: "El clavo cura infecciones y reemplaza a los antibióticos.", truth: "Falso y peligroso. Es antiséptico suave, pero NO cura una infección seria ni reemplaza un antibiótico recetado." }],
  ["si es bueno cuanto mas clavo mejor", 7, "MythVsTruth", { theme: T, myth: "Cuanto más clavo, mejor.", truth: "Falso. Es potente: en exceso irrita y puede ser tóxico, sobre todo el aceite. Poco y bien." }],
  ["masticar clavos todo el dia blanquea", 7, "MythVsTruth", { theme: T, myth: "Masticar clavos blanquea los dientes y cura las caries.", truth: "Falso. Ayuda puntual con el dolor y el aliento, pero no cura una caries (eso lo resuelve el dentista) y en exceso irrita las encías." }],
  ["como es natural no puede hacer mal", 7, "MythVsTruth", { theme: T, myth: "Como es natural, no puede hacer mal.", truth: "Falso. Por lo potente, en exceso es tóxico, afecta la coagulación e irrita. Natural no es inofensivo." }],
  ["para una infusion digestiva o para un buche", 8, "Steps", { theme: T, eyebrow: "Cómo usarlo bien", title: "Paso a paso", steps: [{ title: "2-3 clavos en una taza", sub: "no más" }, { title: "Agua casi hirviendo, tapá 10 min", sub: "infusión o buche tibio" }, { title: "Dolor de muela: 1 gota de aceite", sub: "puente hasta el dentista" }] }],
  ["el clavo de olor es un aliado real pero puntual", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El clavo, siendo realista", steps: [{ when: "Al momento", text: "alivia un dolor de muela un rato" }, { when: "En el día a día", text: "digestión y aliento" }, { when: "Nunca", text: "no cura ni reemplaza al médico" }] }],
  ["no un milagro sino una pequena gran herramienta", 7, "PullQuote", { theme: T, quote: "El clavo de olor no es un milagro: es una pequeña gran herramienta de la naturaleza, de esas que usaban nuestros abuelos con sabiduría." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["juan tomas y en este canal", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON CRITERIO MÉDICO", title: "Dr. Juan Tomás", sub: "El clavo de olor, bien usado" }],
  ["un compuesto que se llama eugenol", 3.6, "KeywordPop", { theme: T, word: "EUGENOL", sub: "el analgésico natural del clavo", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["el clavo te compra tiempo nada mas", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["gracias por regalarme estos minutos", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["lo mas conocido es el dolor de muelas", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Dolor dental", sub: "alivio temporal — igual, al dentista" }],
  ["la salud de la boca en general", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Salud de la boca", sub: "antiséptico y buen aliento" }],
  ["lo tercero es la digestion", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Digestión", sub: "menos pesadez y gases" }],
  ["lo cuarto es su poder antioxidante", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Antioxidante", sub: "de los más potentes que hay" }],
  ["vino a verme un hombre lo voy a llamar don ramon", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Don Ramón, 60 años", sub: "se pasó de clavos y se irritó" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["las advertencias porque que algo sea natural", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["tragar aceite de clavo puro", 5.5, "Callout", { theme: T, icon: "☠️", title: "No excederse con el aceite", sub: "concentrado: tóxico si se traga — lejos de los niños", tone: "warn" }],
  ["si tomas anticoagulantes", 5.5, "Callout", { theme: T, icon: "💊", title: "Anticoagulantes y cirugía", sub: "puede aumentar el sangrado — consultá", tone: "warn" }],
  ["si tenes el estomago sensible", 5, "Callout", { theme: T, icon: "🔥", title: "Estómago sensible", sub: "concentrado puede irritar — empezá con poco", tone: "warn" }],
  ["en los ninos pequenos", 5, "Callout", { theme: T, icon: "🧒", title: "Niños pequeños", sub: "el aceite NO se usa sin indicación médica", tone: "warn" }],
  ["con lo potente", 3.6, "KeywordPop", { theme: T, word: "MENOS ES MÁS", sub: "es potente: poco y bien", pos: "center" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["cuando compres clavo de olor elegi los enteros", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo elegirlo y guardarlo" }],
  ["simple honesto y con los pies en la tierra", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Cantidades justas y seguras", "Cómo usarlo para cada cosa", "Combinaciones que funcionan"] }],
  ["un fuerte abrazo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
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
