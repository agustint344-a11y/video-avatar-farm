/**
 * BUILD "eucalipto-juantombo" (Dr. Juan Tomás) — eucalipto: congestión/respiratorio. EARTH. QR ×6 (qr_guia_jt).
 *   node scripts/build_eucalipto.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "eucalipto-juantombo";
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
  ["quedate conmigo", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el eucalipto de verdad", "Cómo hacer una vaporización segura", "Qué NUNCA hacer con él"] }],
  ["la forma correcta de aprovechar el eucalipto", 7.5, "Compare", { theme: T, title: "La regla de oro", left: { label: "Respirado / en la piel", sub: "seguro y efectivo" }, right: { label: "Tomado (el aceite)", sub: "¡peligroso, puede ser tóxico!" } }],
  ["para que sirve el eucalipto y como se usa bien", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Congestión nasal y del pecho", "Alivio de la tos y la garganta", "Ungüentos sobre el pecho", "Antiséptico y aroma"] }],
  ["tomar unas gotas de aceite de eucalipto cura la gripe", 7, "MythVsTruth", { theme: T, myth: "Tomar unas gotas de aceite de eucalipto cura la gripe más rápido.", truth: "Falso y peligroso. El aceite NO se toma: puede ser tóxico. Se respira o se usa sobre la piel diluido." }],
  ["el eucalipto cura el asma", 7, "MythVsTruth", { theme: T, myth: "El eucalipto cura el asma.", truth: "Falso. Alivia una congestión, pero no cura el asma, e incluso puede empeorarla en algunos. El asma se trata con el médico." }],
  ["se lo puedo poner tranquilo a mi bebe", 7, "MythVsTruth", { theme: T, myth: "Como es un vapor natural, se lo puedo poner a mi bebé.", truth: "Falso y peligroso. En bebés el eucaliptol puede afectar seriamente la respiración. Nada de eucalipto en los más chiquitos sin el pediatra." }],
  ["como es natural no puede hacer mal", 7, "MythVsTruth", { theme: T, myth: "Como es natural, no puede hacer mal.", truth: "Falso. El aceite puede ser tóxico si se toma y peligroso en niños. Natural no es inofensivo." }],
  ["para la vaporizacion calenta agua", 8, "Steps", { theme: T, eyebrow: "Vaporización segura", title: "Paso a paso", steps: [{ title: "Agua caliente, fuera del fuego", sub: "unas hojas o 2-3 gotas, no más" }, { title: "Cara a ~30 cm, ojos cerrados", sub: "toalla en la cabeza, 5-10 min" }, { title: "1-2 veces al día", sub: "siempre un adulto" }] }],
  ["hablemos de expectativas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El eucalipto, siendo realista", steps: [{ when: "Al vaporizar", text: "respirás y descansás mejor" }, { when: "Durante el resfrío", text: "alivia los síntomas" }, { when: "Nunca", text: "no cura la infección ni reemplaza al médico" }] }],
  ["no un milagro sino un gran aliado de los dias de frio", 7, "PullQuote", { theme: T, quote: "El eucalipto no es un milagro: es un gran aliado de los días de frío, de esos que usaban nuestros abuelos con sabiduría." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["juan tomas y en este canal", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON CRITERIO MÉDICO", title: "Dr. Juan Tomás", sub: "El eucalipto, bien usado" }],
  ["un compuesto que se llama eucaliptol", 3.6, "KeywordPop", { theme: T, word: "EUCALIPTOL", sub: "afloja el moco y despeja las vías", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["el eucalipto se respira o se usa sobre la piel", 3.6, "KeywordPop", { theme: T, word: "NUNCA SE TOMA", sub: "se respira o va en la piel, diluido", pos: "center" }],
  ["lo mas util es la congestion", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Congestión", sub: "afloja el moco, destapa" }],
  ["en ninguno te estas tomando el eucalipto", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["el alivio de la tos y la garganta", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Tos y garganta", sub: "calma la irritación" }],
  ["unguentos para el pecho", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Ungüento en el pecho", sub: "para respirar mejor de noche" }],
  ["vino a la consulta una mujer muy preocupada", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Doña Rosa y su nieto", sub: "casi le da el aceite a tomar" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["las advertencias porque con el eucalipto", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["nunca tomes el aceite esencial", 5.5, "Callout", { theme: T, icon: "☠️", title: "NUNCA tomes el aceite", sub: "concentrado: tóxico, sobre todo en niños", tone: "warn" }],
  ["los bebes y los ninos pequenos", 5.5, "Callout", { theme: T, icon: "🍼", title: "Bebés y niños pequeños", sub: "puede afectar su respiración — solo con el pediatra", tone: "warn" }],
  ["si sos asmatico", 5, "Callout", { theme: T, icon: "🫁", title: "Asma", sub: "el vapor fuerte puede irritar — consultá", tone: "warn" }],
  ["en el embarazo y la lactancia", 5, "Callout", { theme: T, icon: "🤰", title: "Embarazo y lactancia", sub: "evitá el aceite o consultá con tu médico", tone: "info" }],
  ["el mejor momento para una vaporizacion", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["dos o tres gotas no mas", 4, "StatChip", { theme: T, value: 3, suffix: " gotas", label: "de aceite, no más" }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["cuando compres eucalipto", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo elegirlo y guardarlo" }],
  ["simple honesto y con los pies en la tierra", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Vaporización segura paso a paso", "Cuidados con los más chicos", "Qué usar para cada cosa"] }],
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
