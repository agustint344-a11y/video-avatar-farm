/**
 * FASE 7 — BUILD del video "chia-colageno" (EDICIÓN DENSA).
 *   node scripts/build_chia.mjs
 *
 * Anclado a las captions reales. Salida: src/VideoEdit/data/cues_chia-colageno.json.
 *  - B-ROLL denso: cada clip se extiende hasta el próximo beat (tope 13s video / 8s imagen),
 *    así cubre gran parte de las secciones explicativas (no destellos sueltos).
 *  - OVERLAYS (transparentes) sobre avatar/b-roll: lower-thirds, keywords, chips, íconos.
 *  - COMPONENTES a pantalla completa en cifras/listas/comparaciones/mito/cierre.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SLUG = "chia-colageno";
const FPS = 30;
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const capNorm = caps.map((w) => norm(w.text));
const at = (phrase) => {
  const toks = norm(phrase).split(" ").filter(Boolean);
  const N = Math.min(toks.length, 5);
  for (let i = 0; i + N <= capNorm.length; i++) {
    let ok = true;
    for (let j = 0; j < N; j++) if (capNorm[i + j] !== toks[j]) { ok = false; break; }
    if (ok) return Math.round((caps[i].startMs / 1000) * FPS);
  }
  return null;
};
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round((caps[caps.length - 1].endMs / 1000) * FPS) + sec(1);

/* ─────────────────────────── COMPONENTES (pantalla completa) ─────────────────────────── */
const compBeats = [
  ["Ninguna planta contiene colágeno", 7, "MythVsTruth", { myth: "La chía está llena de colágeno.", truth: "No tiene ni un gramo — pero le da a tu cuerpo los ladrillos y el escudo para fabricar el suyo." }],
  ["De tres maneras", 7, "Checklist", { title: "Cómo la chía cuida tu colágeno", items: ["Proteína vegetal: los ladrillos del colágeno", "Omega-3: piel flexible e hidratada", "Antioxidantes: el escudo contra la oxidación"] }],
  ["absorber entre 10 y 12 veces", 5, "BigStat", { eyebrow: "Su peso en agua", value: 12, suffix: "x", support: "Por eso, en el vaso, forma ese gel transparente." }],
  ["Ese gel no es un truco", 4, "Highlight", { pre: "Ese gel no es un truco bonito.", highlight: "Es medicina", post: "." }],
  ["más de 300 procesos", 5, "BigStat", { eyebrow: "El magnesio participa en", value: 300, prefix: "+", suffix: " procesos", support: "Relaja los músculos, mejora el descanso y regula tu ánimo." }],
  ["La forma correcta", 7, "Steps", { eyebrow: "Cómo tomarla", title: "Hidratala siempre primero", steps: [{ title: "1 o 2 cucharadas en un vaso de agua", sub: "o leche vegetal, bien revuelto" }, { title: "Reposar 10 a 15 minutos", sub: "hasta que forme el gel" }, { title: "Tomar el gel, con agua durante el día" }] }],
  ["Nunca, jamás, te comas la chía seca", 6, "Compare", { title: "La regla de oro", left: { label: "Chía seca, tragada sola", sub: "se puede hinchar en la garganta o el esófago" }, right: { label: "Hidratada primero", sub: "forma el gel: segura y digestiva" } }],
  ["Te voy a mostrar cinco compañeras", 8, "Checklist", { title: "Las 5 compañeras de la chía", items: ["Linaza (siempre molida)", "Semilla de calabaza (magnesio)", "Sésamo o ajonjolí (calcio)", "Girasol (vitamina E)", "Albahaca (forma gel como la chía)"] }],
  ["Paso uno", 8, "Steps", { eyebrow: "La mezcla antiedad", title: "Tu frasco para la semana", steps: [{ title: "Frasco: chía + linaza molida + sésamo", sub: "partes iguales, guardado en la heladera" }, { title: "1 o 2 cucharadas en agua", sub: "reposar 10 a 15 minutos" }, { title: "Tomarlo, con buena agua en el día" }] }],
  ["Y si quieres esta mezcla con las proporciones exactas", 6, "CTACard", { eyebrow: "Las cantidades exactas", title: "La guía completa", bullet: "Proporciones exactas de cada semilla + combinaciones antiedad probadas con pacientes.", cta: "EN LOS COMENTARIOS" }],
  ["La verdadera juventud", 6, "PullQuote", { quote: "La verdadera juventud no viene de una sola cosa milagrosa: viene de los buenos hábitos, sostenidos." }],
];
const components = [];
const compMiss = [];
for (const [anchor, durS, comp, props] of compBeats) {
  const from = at(anchor);
  if (from == null) { compMiss.push(anchor); continue; }
  components.push({ from, dur: sec(durS), comp, props });
}
components.sort((a, b) => a.from - b.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

/* ─────────────────────────── B-ROLL (denso: clips + imágenes) ─────────────────────────── */
const IMG = { s_cerebro: "chia_cerebro.jpg", s_calab: "chia_calabaza.jpg", s_giras: "chia_girasol.jpg", s_linaza: "chia_linaza.jpg", s_huesos: "chia_huesos.jpg", s_sesamo: "chia_sesamo.jpg" };
const DROP = new Set(["s_corazon", "s_albah", "s_oxid"]); // reemplazados por s_corazon2 / s_albah2 / piel

const stock = [];
for (const f of ["chia-colageno_needstock.json", "chia-colageno_needstock2.json"]) {
  try { stock.push(...JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", f), "utf8").replace(/^﻿/, ""))); } catch {}
}

const CAP_VID = sec(13), CAP_IMG = sec(8), MIN = sec(2);
const cands = [];
for (const it of stock) {
  if (DROP.has(it.name)) continue;
  const from = at(it.anchor);
  if (from == null) continue;
  const imgFile = IMG[it.name];
  if (imgFile && fs.existsSync(path.join(ROOT, "public", "img", imgFile))) {
    cands.push({ from, name: it.name, kind: "image", src: `img/${imgFile}`, cap: CAP_IMG });
  } else {
    const vid = path.join(ROOT, "public", "broll", `${SLUG}_${it.name}.mp4`);
    if (fs.existsSync(vid)) cands.push({ from, name: it.name, kind: "video", src: `broll/${SLUG}_${it.name}.mp4`, cap: CAP_VID });
  }
}
// dedup por from (si dos anclan al mismo frame, quedarse con el primero)
cands.sort((a, b) => a.from - b.from);
const uniq = [];
for (const c of cands) { if (!uniq.length || c.from - uniq[uniq.length - 1].from > sec(0.5)) uniq.push(c); }

const broll = [];
const brollMiss = [];
for (let i = 0; i < uniq.length; i++) {
  const c = uniq[i];
  if (inComp(c.from)) { brollMiss.push(`${c.name} (dentro de componente)`); continue; }
  const nextBroll = i + 1 < uniq.length ? uniq[i + 1].from : Infinity;
  let dur = Math.min(c.cap, nextBroll - c.from, nextCompStart(c.from) - c.from);
  if (dur < MIN) { brollMiss.push(`${c.name} (sliver ${dur}f)`); continue; }
  broll.push({ from: c.from, dur, kind: c.kind, src: c.src });
}

/* ─────────────────────────── OVERLAYS (transparentes, sobre avatar/b-roll) ─────────────────────────── */
const ovBeats = [
  ["Agustín Landívar", 5, "LowerThird", { accentText: "NATURÓPATA", title: "Agustín Landívar", sub: "Medicina natural, con evidencia" }],
  ["un enemigo silencioso", 3, "KeywordPop", { word: "OXIDACIÓN", sub: "el enemigo del colágeno", pos: "center" }],
  ["una piel más firme", 3, "KeywordPop", { word: "COLÁGENO", sub: "lo fabrica tu propio cuerpo", pos: "bottom" }],
  ["es una mina de calcio", 5, "IconRow", { items: [{ icon: "🦴", label: "Calcio" }, { icon: "🌙", label: "Magnesio" }, { icon: "⚡", label: "Fósforo" }] }],
  ["Tu cerebro está hecho", 4, "KeywordPop", { word: "OMEGA-3", sub: "alimento directo para tu cerebro", pos: "bottom" }],
  ["ponerme serio contigo", 4, "SectionTitle", { eyebrow: "ATENCIÓN", title: "Cómo tomarla sin riesgo" }],
  ["es la linaza", 6, "LowerThird", { accentText: "COMPAÑERA 1", title: "Linaza", sub: "Lignanos + omega-3 · siempre molida" }],
  ["semilla de calabaza", 6, "LowerThird", { accentText: "COMPAÑERA 2", title: "Calabaza", sub: "Magnesio, zinc y hierro" }],
  ["semilla de sésamo", 6, "LowerThird", { accentText: "COMPAÑERA 3", title: "Sésamo (ajonjolí)", sub: "Calcio para huesos y articulaciones" }],
  ["semilla de girasol", 6, "LowerThird", { accentText: "COMPAÑERA 4", title: "Girasol", sub: "Vitamina E antioxidante" }],
  ["semilla de albahaca", 6, "LowerThird", { accentText: "COMPAÑERA 5", title: "Albahaca", sub: "Forma gel, como la chía" }],
];
const overlays = [];
const ovMiss = [];
for (const [anchor, durS, comp, props] of ovBeats) {
  const from = at(anchor);
  if (from == null) { ovMiss.push(anchor); continue; }
  if (inComp(from)) { ovMiss.push(`${anchor} (dentro de componente)`); continue; }
  overlays.push({ from, dur: sec(durS), comp, props });
}
overlays.sort((a, b) => a.from - b.from);

/* ─────────────────────────── ESCRIBIR ─────────────────────────── */
const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, broll, overlays, components };
const outFile = path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`);
fs.writeFileSync(outFile, JSON.stringify(cues, null, 2));

// cobertura estimada de b-roll
const brollFrames = broll.reduce((s, b) => s + b.dur, 0);
console.log(`✓ componentes: ${components.length}/${compBeats.length}${compMiss.length ? " (miss: " + compMiss.join(", ") + ")" : ""}`);
console.log(`✓ b-roll: ${broll.length} beats  (video ${broll.filter(b => b.kind === "video").length} / img ${broll.filter(b => b.kind === "image").length})  ~${Math.round(brollFrames / FPS)}s = ${Math.round(brollFrames / durationInFrames * 100)}% del video`);
if (brollMiss.length) console.log("  · b-roll descartado: " + brollMiss.join(", "));
console.log(`✓ overlays: ${overlays.length}/${ovBeats.length}${ovMiss.length ? " (miss: " + ovMiss.join(", ") + ")" : ""}`);
console.log(`✓ ${(durationInFrames / FPS / 60).toFixed(1)} min → ${path.relative(ROOT, outFile)}`);
