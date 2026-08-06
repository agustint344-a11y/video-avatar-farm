/**
 * FASE 7 — BUILD "agua-jamaica" (EDICIÓN DENSA, plan por MOMENTO).
 *   node scripts/build_jamaica.mjs
 * Aplica las 5 reglas: decisión por frase, 25-40 componentes, queries por frase (en needstock),
 * pacing variado, avatar con Ken Burns (ya en AvatarBackdrop), primeros 5 min cargados.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SLUG = "agua-jamaica";
const FPS = 30;
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => {
  const t = norm(phrase).split(" ").filter(Boolean);
  const N = Math.min(t.length, 5);
  for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); }
  return null;
};
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

/* ── COMPONENTES a pantalla completa (cifras/listas/mitos/pasos/cierre) ── */
const compBeats = [
  ["seis beneficios que la evidencia", 6, "Checklist", { title: "Lo que vas a ver hoy", items: ["6 beneficios con evidencia real", "5 riesgos que casi nadie cuenta", "Verdades y mentiras del hibisco"] }],
  ["Por varios caminos a la vez", 6.5, "Checklist", { title: "Cómo el hibisco baja la presión", items: ["Efecto diurético: soltás líquido y sodio", "Antocianinas: arterias más flexibles", "Menos presión en tus 'cañerías'"] }],
  ["escudo contra ese daño", 4.5, "Highlight", { pre: "Frente a la oxidación, los antioxidantes son tu", highlight: "escudo", post: "." }],
  ["por tres frentes distintos", 6.5, "Checklist", { title: "3 frentes que descargan tu corazón", items: ["Baja la presión arterial", "Baja el colesterol y los triglicéridos", "Antioxidantes que protegen las arterias"] }],
  ["adelgaza sola", 6.5, "MythVsTruth", { myth: "El agua de Jamaica adelgaza sola, es quema grasa.", truth: "Ninguna infusión adelgaza por magia. Es una gran ALIADA (menos líquido, sin azúcar), pero el trabajo lo hacen tus hábitos." }],
  ["que cura enfermedades", 6.5, "MythVsTruth", { myth: "El agua de Jamaica cura enfermedades.", truth: "No cura hipertensión ni diabetes. Es un apoyo que ACOMPAÑA tu tratamiento — nunca lo reemplaza." }],
  ["cómo la preparás cambia", 4.5, "Highlight", { pre: "Con azúcar y mucho hervor,", highlight: "perdés medio beneficio", post: "." }],
  ["poné una cucharada de flores", 7.5, "Steps", { eyebrow: "Cómo prepararla bien", title: "Infusión perfecta, en 3 pasos", steps: [{ title: "1 cucharada de flor en agua caliente", sub: "apagá el fuego y recién ahí echala" }, { title: "Tapá y reposá 5 a 10 minutos", sub: "para que suelte color y antioxidantes" }, { title: "Colá y tomá, sin azúcar", sub: "1 o 2 tazas al día, fría o caliente" }] }],
  ["esta preparación con las cantidades exactas", 6, "CTACard", { eyebrow: "El plan completo", title: "La guía de infusiones", bullet: "Cantidades exactas, horarios y combinaciones para la presión, el azúcar y la inflamación.", cta: "EN LOS COMENTARIOS" }],
  ["La verdadera salud no viene", 6, "PullQuote", { quote: "La verdadera salud no viene de una sola bebida milagrosa: viene de los buenos hábitos, sostenidos." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

/* ── OVERLAYS (transparentes): lower-thirds por beneficio, keywords, iconrow, callouts de riesgo ── */
const ovBeats = [
  ["cordial saludo a todos", 5, "LowerThird", { accentText: "NATURÓPATA", title: "Agustín Landívar", sub: "Salud natural, con evidencia" }],
  ["asesino silencioso", 3, "KeywordPop", { word: "PRESIÓN ALTA", sub: "el asesino silencioso", pos: "center" }],
  ["Beneficio número uno", 5.5, "LowerThird", { accentText: "BENEFICIO 1", title: "Baja la presión arterial", sub: "el efecto más estudiado" }],
  ["Beneficio número dos", 5.5, "LowerThird", { accentText: "BENEFICIO 2", title: "Antioxidante potente", sub: "antiedad de adentro hacia afuera" }],
  ["los radicales libres", 3, "KeywordPop", { word: "RADICALES LIBRES", sub: "el óxido de tu cuerpo", pos: "bottom" }],
  ["de vitamina C y de otros polifenoles", 5, "IconRow", { items: [{ icon: "🌺", label: "Antocianinas" }, { icon: "🍋", label: "Vitamina C" }, { icon: "🛡️", label: "Polifenoles" }] }],
  ["Beneficio número 3", 5.5, "LowerThird", { accentText: "BENEFICIO 3", title: "Cuida el colesterol", sub: "menos grasa en las arterias" }],
  ["Beneficio número 4", 5.5, "LowerThird", { accentText: "BENEFICIO 4", title: "Regula el azúcar", sub: "mejor manejo de la insulina" }],
  ["Beneficio número 5", 5.5, "LowerThird", { accentText: "BENEFICIO 5", title: "Apoya el hígado", sub: "el gran filtro del cuerpo" }],
  ["Beneficio número 6", 5.5, "LowerThird", { accentText: "BENEFICIO 6", title: "Desinflama", sub: "menos retención de líquidos" }],
  ["Y eso incluye los", 4, "SectionTitle", { eyebrow: "ATENCIÓN", title: "5 riesgos que debés saber" }],
  ["Riesgo número uno", 5, "Callout", { icon: "💊", title: "Tomás medicación para la presión", sub: "puede sumarse y bajarla demasiado — consultá a tu médico", tone: "warn" }],
  ["Riesgo número dos", 5, "Callout", { icon: "🤰", title: "Embarazo o lactancia", sub: "evitala; consultá antes", tone: "warn" }],
  ["Riesgo número tres", 5, "Callout", { icon: "🩸", title: "Medicación para la diabetes", sub: "puede bajar el azúcar de más — controlate con tu médico", tone: "warn" }],
  ["Riesgo número cuatro", 5, "Callout", { icon: "⚗️", title: "Interacción con medicamentos", sub: "si tomás algo crónico, avisale a tu médico", tone: "warn" }],
  ["Y riesgo número cinco", 5, "Callout", { icon: "⚖️", title: "La dosis: más NO es mejor", sub: "1 o 2 tazas al día es suficiente", tone: "warn" }],
  ["no reemplaza jamás la consulta", 4.5, "Callout", { icon: "🩺", title: "No reemplaza a tu médico", sub: "es un aliado, coordinado con él", tone: "info" }],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (inComp(from)) { ovMiss.push(`${a} (en componente)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

/* ── B-ROLL denso (queries por FRASE en needstock; duraciones variadas hasta el próximo beat) ── */
const IMGMAP = JSON.parse(fs.existsSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`)) ? fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`), "utf8").replace(/^﻿/, "") : "{}");
const DROP = new Set((() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_drop.json`), "utf8")); } catch { return []; } })());
const stock = [];
for (const f of [`${SLUG}_needstock.json`]) { try { stock.push(...JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", f), "utf8").replace(/^﻿/, ""))); } catch {} }
const CAP_VID = sec(9), CAP_IMG = sec(6), MIN = sec(1.8);
const cands = [];
for (const it of stock) {
  if (DROP.has(it.name)) continue;
  const from = at(it.anchor); if (from == null) continue;
  const imgFile = IMGMAP[it.name];
  if (imgFile && fs.existsSync(path.join(ROOT, "public", "img", imgFile))) cands.push({ from, name: it.name, kind: "image", src: `img/${imgFile}`, cap: CAP_IMG });
  else { const vid = path.join(ROOT, "public", "broll", `${SLUG}_${it.name}.mp4`); if (fs.existsSync(vid)) cands.push({ from, name: it.name, kind: "video", src: `broll/${SLUG}_${it.name}.mp4`, cap: CAP_VID }); }
}
cands.sort((a, b) => a.from - b.from);
const uniq = []; for (const c of cands) if (!uniq.length || c.from - uniq[uniq.length - 1].from > sec(0.5)) uniq.push(c);
const broll = []; const brollMiss = [];
for (let i = 0; i < uniq.length; i++) {
  const c = uniq[i]; if (inComp(c.from)) { brollMiss.push(`${c.name} (en componente)`); continue; }
  const nextB = i + 1 < uniq.length ? uniq[i + 1].from : Infinity;
  const dur = Math.min(c.cap, nextB - c.from, nextCompStart(c.from) - c.from);
  if (dur < MIN) { brollMiss.push(`${c.name} (sliver)`); continue; }
  broll.push({ from: c.from, dur, kind: c.kind, src: c.src });
}

const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const total = components.length + overlays.length + broll.length;
console.log(`✓ componentes ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`✓ overlays ${overlays.length}/${ovBeats.length}${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} (video ${broll.filter(b => b.kind === "video").length}/img ${broll.filter(b => b.kind === "image").length}) ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}%${brollMiss.length ? "  · descartado: " + brollMiss.join(", ") : ""}`);
console.log(`✓ TOTAL ${total} beats en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
