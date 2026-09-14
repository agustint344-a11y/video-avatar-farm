/**
 * BUILD "propolio-juantombo" (Dr. Juan Tomás) — propóleo: garganta/boca/heridas sí; "antibiótico natural"/cura-todo no. EARTH. QR ×6 (qr_guia_jt).
 *   node scripts/build_propolio.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "propoleo-juantombo";
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
  ["quedate conmigo porque te voy", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el propóleo de verdad", "Los mitos peligrosos", "Las advertencias que casi nadie dice"] }],
  ["para que sirve el propolio de", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Garganta y boca (aftas, encías)", "Heriditas y piel", "Apoyo en resfríos (un empujoncito)"] }],
  ["el propolio es un antibiotico natural", 7, "MythVsTruth", { theme: T, myth: "El propóleo es un antibiótico natural: reemplaza al del médico.", truth: "Rotundamente falso. Calma una garganta irritada, no cura una infección seria. Jamás reemplaces un antibiótico recetado por propóleo." }],
  ["el propolio cura el cancer o", 7, "MythVsTruth", { theme: T, myth: "El propóleo cura o previene el cáncer.", truth: "No hay ninguna evidencia seria de eso. Dejar un tratamiento por gotitas de propóleo puede ser trágico. No caigas en esa mentira." }],
  ["como es natural el propolio es", 7, "MythVsTruth", { theme: T, myth: "Como es natural, el propóleo es inofensivo.", truth: "Falso. Es de los productos de la colmena que MÁS alergias causa. La primera vez, poquísima cantidad y observá cómo reaccionás." }],
  ["se lo puedo dar tranquilo a", 7, "MythVsTruth", { theme: T, myth: "Se lo puedo dar tranquilo a mi bebé.", truth: "No. Riesgo de alergia y, ojo, muchas gotas vienen con alcohol. Nunca le des propóleo a un bebé sin hablar con el pediatra." }],
  ["vamos al paso a paso para", 8, "Steps", { theme: T, eyebrow: "Cómo usarlo bien", title: "Con criterio", steps: [{ title: "Prueba de alergia", sub: "la 1ª vez, una sola gota y observá" }, { title: "Dosis justa", sub: "más NO es mejor (más riesgo)" }, { title: "Directo al problema", sub: "spray/gotas en garganta, o buche" }] }],
  ["la miel el propolio el polen", 7.5, "Checklist", { theme: T, title: "No confundas los de la colmena", items: ["Miel: calma la tos, endulza", "Propóleo: garganta, boca, heriditas", "Polen y jalea real: otra cosa distinta"] }],
  ["el propolio no es un antibiotico natural", 7, "PullQuote", { theme: T, quote: "El propóleo no es un antibiótico natural que reemplaza a la medicina, ni una cura milagrosa para todo: es una herramienta noble de la colmena, con efectos reales para la garganta, la boca y las heriditas, usada con criterio." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["el dr juan tomas y en", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON CRITERIO MÉDICO", title: "Dr. Juan Tomás", sub: "El propóleo, con criterio" }],
  ["el propolio es literalmente el sistema", 3.6, "KeywordPop", { theme: T, word: "EL ESCUDO DE LA COLMENA", sub: "defensa contra microbios", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["para el dolor de garganta esas", 5, "LowerThird", { theme: T, accentText: "USO REAL 1", title: "Garganta y boca", sub: "dolor de garganta, aftas, encías" }],
  ["las heridas y la piel", 5, "LowerThird", { theme: T, accentText: "USO REAL 2", title: "Heriditas y piel", sub: "cicatrizante, antimicrobiano" }],
  ["para que sirve el propolio de", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["el propolio calma una garganta irritada", 4.5, "KeywordPop", { theme: T, word: "NO ES ANTIBIÓTICO", sub: "no cura infecciones serias", pos: "center" }],
  ["una senora que voy a llamar rosa", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Rosa", sub: "usó propóleo en vez del antibiótico → se complicó" }],
  ["el propolio es un antibiotico natural", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["las interacciones del propolio con los", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["es uno de los productos de la", 5.5, "Callout", { theme: T, icon: "🐝", title: "Alergias", sub: "de los que MÁS alergia da — 1ª vez, mínima cantidad", tone: "warn" }],
  ["vos tomas anticoagulantes esos remedios", 5.5, "Callout", { theme: T, icon: "💊", title: "Anticoagulantes / presión", sub: "puede interactuar — consultá con tu médico", tone: "warn" }],
  ["muchas vienen disueltas en alcohol", 5, "Callout", { theme: T, icon: "🍼", title: "Bebés y alcohol", sub: "muchas gotas llevan alcohol — nunca sin el pediatra", tone: "warn" }],
  ["lo voy a llamar damian que", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Damián", sub: "spray al inicio de un resfrío → uso correcto" }],
  ["lo tenes ordenado en la guia", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["que remedio casero sirve para que", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía: lo natural con criterio", items: ["Qué remedio sirve para qué", "En qué dosis y cómo usarlo", "Cuándo dejar de improvisar y ver al médico"] }],
  ["que sea natural no quiere decir", 3.6, "KeywordPop", { theme: T, word: "NATURAL ≠ INOFENSIVO", sub: "usá siempre la cabeza", pos: "center" }],
  ["la hice justamente para que", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
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
