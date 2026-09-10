/**
 * BUILD "bicarbonato-juantombo" (Dr. Juan Tomás) — bicarbonato: antiácido/limpieza + mitos peligrosos. EARTH. QR ×6 (qr_guia_jt).
 *   node scripts/build_bicarbonato.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "bicarbonato-juantombo";
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
  ["quedate conmigo", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Para qué sirve el bicarbonato de verdad", "Cómo usarlo seguro", "Los mitos peligrosos que tenés que conocer"] }],
  ["los usos seguros y realmente buenos", 7.5, "Compare", { theme: T, title: "La regla de oro", left: { label: "Por fuera (casa y piel)", sub: "seguro y muy útil" }, right: { label: "Tomado, seguido", sub: "¡peligroso: altísimo en sodio!" } }],
  ["para que sirve el bicarbonato de verdad", 7.5, "Checklist", { theme: T, title: "Para qué SÍ sirve", items: ["Antiácido de emergencia (ocasional)", "Limpiar y desodorizar la casa", "Aliviar una picadura (por fuera)"] }],
  ["el bicarbonato cura el cancer", 7, "MythVsTruth", { theme: T, myth: "El bicarbonato cura el cáncer porque alcaliniza el cuerpo.", truth: "Rotundamente falso y peligrosísimo. El cuerpo regula su acidez solo. Abandonar un tratamiento real por esto puede costar la vida." }],
  ["tomar bicarbonato en ayunas", 7, "MythVsTruth", { theme: T, myth: "Tomarlo en ayunas te limpia la sangre y te desintoxica.", truth: "Falso. Para eso tenés hígado y riñones. Tomarlo a diario solo te mete sodio de más y descompensa tu estómago." }],
  ["el bicarbonato es un buen blanqueador", 7, "MythVsTruth", { theme: T, myth: "Es un buen blanqueador de dientes para usar siempre.", truth: "Cuidado. Es abrasivo: usarlo seguido te desgasta el esmalte, que no se recupera. Alguna vez puntual, no como hábito." }],
  ["como es natural y casero", 7, "MythVsTruth", { theme: T, myth: "Como es natural y casero, cuanto más tomes, mejor.", truth: "Todo lo contrario. Es de los remedios donde el exceso es claramente peligroso. Poco y ocasional; mucho y seguido hace daño." }],
  ["si vas a usarlo como antiacido", 8, "Steps", { theme: T, eyebrow: "Antiácido de emergencia", title: "Solo si alguna vez lo usás", steps: [{ title: "Media cucharadita, no una colmada", sub: "en un buen vaso de agua" }, { title: "Muy ocasional, nunca rutina", sub: "no todos los días" }, { title: "Si es frecuente, al médico", sub: "hay que estudiar la causa" }] }],
  ["hablemos de expectativas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El bicarbonato, siendo realista", steps: [{ when: "Ocasional", text: "alivia una acidez puntual" }, { when: "En la casa", text: "limpia y desodoriza barato" }, { when: "Nunca", text: "no cura, no desintoxica, no alcaliniza" }] }],
  ["no un veneno que hay que temerle", 7, "PullQuote", { theme: T, quote: "El bicarbonato no es un veneno ni una medicina milagrosa: es una herramienta casera útil y barata que hay que usar con cabeza, sobre todo al tomarla." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["juan tomas y en este canal", 5, "LowerThird", { theme: T, accentText: "REMEDIOS CON CRITERIO MÉDICO", title: "Dr. Juan Tomás", sub: "El bicarbonato, con cabeza" }],
  ["la propiedad de neutralizar los acidos", 3.6, "KeywordPop", { theme: T, word: "NEUTRALIZA EL ÁCIDO", sub: "de ahí sale casi todo lo que sí hace", pos: "center" }],
  ["disponible en los comentarios de este video", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["darte alivio rapido", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Antiácido ocasional", sub: "neutraliza el ácido, alivio rápido" }],
  ["lo segundo y muy util", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Limpieza del hogar", sub: "desodoriza y limpia, sin riesgo" }],
  ["lo tercero algunos usos externos", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Uso externo suave", sub: "por ejemplo, una picadura" }],
  ["por fuera es un gran aliado de la casa", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["vino a verme un hombre lo voy a llamar don alberto", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Don Alberto, 60 años", sub: "lo tomaba después de cada comida" }],
  ["en esa guia que te deje en los comentarios", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["las advertencias porque el bicarbonato tomado mal", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["nunca tomes bicarbonato todos los dias", 5.5, "Callout", { theme: T, icon: "☠️", title: "Nunca a diario ni en cantidad", sub: "altísimo en sodio: sube la presión y descompensa", tone: "warn" }],
  ["si tenes presion alta problemas del corazon", 5.5, "Callout", { theme: T, icon: "❤️", title: "Presión, corazón o riñones", sub: "por el sodio, es especialmente riesgoso — no lo tomes solo", tone: "warn" }],
  ["si tomas medicacion el bicarbonato", 5, "Callout", { theme: T, icon: "💊", title: "Si tomás medicación", sub: "cambia la absorción de muchos remedios — consultá", tone: "warn" }],
  ["para que sirve el bicarbonato de verdad", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["no te olvides de que te deje todo", 7, "QRTag", { theme: T, corner: "bl", src: QR }],
  ["en la cocina tene tu bicarbonato", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Su lugar: la casa" }],
  ["para todos la regla de oro es simple", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía de remedios naturales", items: ["Usos seguros del bicarbonato", "Qué NUNCA hacer con él", "Remedios caseros con criterio"] }],
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
