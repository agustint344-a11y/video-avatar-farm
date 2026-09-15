/**
 * BUILD "boldo-juantombo" (Dr. Juan Tomás) — boldo: digestión sí; "limpia el hígado"/adelgaza no. EARTH. QR ×6 (qr_guia_jt).
 *   node scripts/build_boldo.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "boldo-juantombo";
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
  ["quedate conmigo porque te voy", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el boldo de verdad", "Los mitos (¿limpia el hígado?)", "Cómo tomarlo y las advertencias"] }],
  ["para que sirve el boldo de", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Ayuda la digestión (estimula la bilis)", "Comida pesada y grasosa", "Molestias leves y gases"] }],
  ["el boldo limpia el higado lo", 7, "MythVsTruth", { theme: T, myth: "El boldo limpia y desintoxica el hígado.", truth: "Puro marketing. Tu hígado ya se depura solo, 24 horas. El boldo ayuda a soltar bilis para digerir, pero eso no es 'limpiar' ni 'sacar toxinas'." }],
  ["el boldo sirve para adelgazar falso", 7, "MythVsTruth", { theme: T, myth: "El boldo sirve para adelgazar.", truth: "Falso. Te desinflama un poco, pero sentirse menos hinchado no es adelgazar. No quema grasa. Adelgazar es alimentación, movimiento y descanso." }],
  ["como es natural puedo tomar todo", 7, "MythVsTruth", { theme: T, myth: "Como es natural, puedo tomar todo el que quiera.", truth: "Rotundamente no. En exceso o por mucho tiempo el boldo puede ser tóxico… justo para el hígado que dice cuidar. Ocasional y poca cantidad." }],
  ["el boldo es bueno para cualquier", 7, "MythVsTruth", { theme: T, myth: "Si tengo el hígado enfermo, más boldo.", truth: "Falso y peligroso. Si ya tenés una enfermedad del hígado, el boldo puede empeorarla. Con hígado dañado, lejos del boldo salvo que tu médico diga otra cosa." }],
  ["la forma clasica es la infusion", 8, "Steps", { theme: T, eyebrow: "Cómo tomarlo bien", title: "Con criterio", steps: [{ title: "Una infusión suave", sub: "una cucharadita, tras la comida pesada" }, { title: "Ocasional y poco tiempo", sub: "no todos los días para siempre" }, { title: "Con una taza alcanza", sub: "más NO es mejor, es más riesgo" }] }],
  ["quiero que entiendas mejor eso de", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El boldo, siendo realista", steps: [{ when: "Comida pesada", text: "ayuda la digestión, menos pesadez" }, { when: "Como 'detox'", text: "no limpia ni desintoxica nada" }, { when: "En exceso", text: "puede dañar el hígado: peligroso" }] }],
  ["el boldo no es un limpiador magico", 7, "PullQuote", { theme: T, quote: "El boldo no es un limpiador mágico del hígado, ni un adelgazante, ni una cura para todo: es un buen digestivo, un aliado noble para las comidas pesadas, que usado de forma ocasional y con criterio es una gran herramienta para la alacena." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["soy el doctor juan tomas y", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON CRITERIO MÉDICO", title: "Dr. Juan Tomás", sub: "El boldo, con criterio" }],
  ["estimula al higado a producir", 3.6, "KeywordPop", { theme: T, word: "MÁS BILIS", sub: "el 'detergente' de las grasas", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["ayudar a la digestion el boldo", 5, "LowerThird", { theme: T, accentText: "USO REAL 1", title: "Digestión pesada", sub: "el clásico después del asado" }],
  ["las molestias digestivas leves y los", 5, "LowerThird", { theme: T, accentText: "USO REAL 2", title: "Gases y pesadez", sub: "aliado suave del día a día" }],
  ["la reuni en una guia que", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["tu higado ya se depura solo", 4, "KeywordPop", { theme: T, word: "NO 'LIMPIA' NADA", sub: "tu hígado ya se depura solo", pos: "center" }],
  ["la voy a llamar norma", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Norma", sub: "'cura depurativa' de boldo → hígado irritado" }],
  ["prestá muchisima atencion las advertencias", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["el embarazo las embarazadas no deben", 5.5, "Callout", { theme: T, icon: "🤰", title: "Embarazo: PROHIBIDO", sub: "puede estimular el útero — nada de boldo", tone: "warn" }],
  ["los calculos y la obstruccion de", 5.5, "Callout", { theme: T, icon: "🪨", title: "Piedras en la vesícula", sub: "puede moverlas y complicarte — consultá antes", tone: "warn" }],
  ["afectar la coagulacion de la sangre", 5, "Callout", { theme: T, icon: "💊", title: "Anticoagulantes", sub: "puede potenciar el efecto — hablá con tu médico", tone: "warn" }],
  ["lo tenes ordenado en la guia", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["un senor que voy a llamar ernesto", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Ernesto", sub: "un té ocasional tras el asado → uso correcto" }],
  ["lo natural no es automaticamente inofensivo", 3.6, "KeywordPop", { theme: T, word: "NATURAL ≠ INOFENSIVO", sub: "usá siempre la cabeza", pos: "center" }],
  ["la hice justamente para que", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["que remedio casero sirve para que", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía: lo natural con criterio", items: ["Qué remedio sirve para qué", "En qué dosis y cómo prepararlo", "Cuándo dejar de improvisar y ver al médico"] }],
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
