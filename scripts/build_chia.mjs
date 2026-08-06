/**
 * FASE 7 — BUILD del video "chia-colageno".
 *   node scripts/build_chia.mjs
 *
 * Ancla cada componente a la FRASE REAL de las captions (whisper), no a matemática.
 * Salida: src/VideoEdit/data/cues_chia-colageno.json  (lo consume VideoMain).
 *
 * Esta versión trae AVATAR + COMPONENTES. El b-roll (broll[]) se agrega en una 2ª pasada
 * cuando estén los clips de stock/fotos auditados.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SLUG = "chia-colageno";
const FPS = 30;
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));

const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const capNorm = caps.map((w) => norm(w.text));

/** Frame de la 1ª aparición del prefijo `phrase` en las captions (match por tokens). */
const at = (phrase) => {
  const toks = norm(phrase).split(" ").filter(Boolean);
  const N = Math.min(toks.length, 5); // usa hasta 5 tokens de prefijo
  for (let i = 0; i + N <= capNorm.length; i++) {
    let ok = true;
    for (let j = 0; j < N; j++) {
      if (capNorm[i + j] !== toks[j]) { ok = false; break; }
    }
    if (ok) return Math.round((caps[i].startMs / 1000) * FPS);
  }
  return null;
};

const sec = (n) => Math.round(n * FPS);

// [anchor, durSec, comp, props]
const beats = [
  ["Ninguna planta contiene colágeno", 7, "MythVsTruth", {
    myth: "La chía está llena de colágeno.",
    truth: "No tiene ni un gramo — pero le da a tu cuerpo los ladrillos y el escudo para fabricar el suyo.",
  }],
  ["De tres maneras", 7, "Checklist", {
    title: "Cómo la chía cuida tu colágeno",
    items: [
      "Proteína vegetal: los ladrillos del colágeno",
      "Omega-3: piel flexible e hidratada",
      "Antioxidantes: el escudo contra la oxidación",
    ],
  }],
  ["absorber entre 10 y 12 veces", 5, "BigStat", {
    eyebrow: "Su peso en agua",
    value: 12, suffix: "x",
    support: "Por eso, en el vaso, forma ese gel transparente.",
  }],
  ["Ese gel no es un truco", 4, "Highlight", {
    pre: "Ese gel no es un truco bonito.",
    highlight: "Es medicina",
    post: ".",
  }],
  ["más de 300 procesos", 5, "BigStat", {
    eyebrow: "El magnesio participa en",
    value: 300, prefix: "+",
    suffix: " procesos",
    support: "Relaja los músculos, mejora el descanso y regula tu ánimo.",
  }],
  ["La forma correcta", 7, "Steps", {
    eyebrow: "Cómo tomarla",
    title: "Hidratala siempre primero",
    steps: [
      { title: "1 o 2 cucharadas en un vaso de agua", sub: "o leche vegetal, bien revuelto" },
      { title: "Reposar 10 a 15 minutos", sub: "hasta que forme el gel" },
      { title: "Tomar el gel, con agua durante el día" },
    ],
  }],
  ["Nunca, jamás, te comas la chía seca", 6, "Compare", {
    title: "La regla de oro",
    left: { label: "Chía seca, tragada sola", sub: "se puede hinchar en la garganta o el esófago" },
    right: { label: "Hidratada primero", sub: "forma el gel: segura y digestiva" },
  }],
  ["Te voy a mostrar cinco compañeras", 8, "Checklist", {
    title: "Las 5 compañeras de la chía",
    items: [
      "Linaza (siempre molida)",
      "Semilla de calabaza (magnesio)",
      "Sésamo o ajonjolí (calcio)",
      "Girasol (vitamina E)",
      "Albahaca (forma gel como la chía)",
    ],
  }],
  ["Paso uno", 8, "Steps", {
    eyebrow: "La mezcla antiedad",
    title: "Tu frasco para la semana",
    steps: [
      { title: "Frasco: chía + linaza molida + sésamo", sub: "partes iguales, guardado en la heladera" },
      { title: "1 o 2 cucharadas en agua", sub: "reposar 10 a 15 minutos" },
      { title: "Tomarlo, con buena agua en el día" },
    ],
  }],
  ["Y si quieres esta mezcla con las proporciones exactas", 6, "CTACard", {
    eyebrow: "Las cantidades exactas",
    title: "La guía completa",
    bullet: "Proporciones exactas de cada semilla + combinaciones antiedad probadas con pacientes.",
    cta: "EN LOS COMENTARIOS",
  }],
  ["La verdadera juventud", 6, "PullQuote", {
    quote: "La verdadera juventud no viene de una sola cosa milagrosa: viene de los buenos hábitos, sostenidos.",
  }],
];

const components = [];
const misses = [];
for (const [anchor, durS, comp, props] of beats) {
  const from = at(anchor);
  if (from == null) { misses.push(anchor); continue; }
  components.push({ from, dur: sec(durS), comp, props });
}
components.sort((a, b) => a.from - b.from);

// ── B-ROLL: solo los clips que EXISTEN en public/broll (los rechazados se movieron a _rejected) ──
const CAP = sec(5.5); // techo por beat
const MIN = sec(1.5); // mínimo; menos que esto = sliver → se descarta
const inComponent = (f) => components.find((c) => f >= c.from && f < c.from + c.dur);
const nextComponentStart = (f) => {
  const later = components.filter((c) => c.from > f).map((c) => c.from);
  return later.length ? Math.min(...later) : Infinity;
};

let stock = [];
try {
  stock = JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_needstock.json`), "utf8").replace(/^﻿/, ""));
} catch { /* sin lista de stock → solo componentes */ }

// Imágenes de Flow que reemplazan/mejoran ciertos momentos (ganan sobre el stock).
const IMG = {
  s_cerebro: "chia_cerebro.jpg",
  s_calab: "chia_calabaza.jpg",
  s_giras: "chia_girasol.jpg",
  s_linaza: "chia_linaza.jpg",
  s_huesos: "chia_huesos.jpg",
  s_sesamo: "chia_sesamo.jpg",
};

const cands = [];
for (const it of stock) {
  const from = at(it.anchor);
  if (from == null) continue;
  const imgFile = IMG[it.name];
  if (imgFile && fs.existsSync(path.join(ROOT, "public", "img", imgFile))) {
    cands.push({ from, name: it.name, kind: "image", src: `img/${imgFile}` });
  } else {
    const vid = path.join(ROOT, "public", "broll", `${SLUG}_${it.name}.mp4`);
    if (fs.existsSync(vid)) cands.push({ from, name: it.name, kind: "video", src: `broll/${SLUG}_${it.name}.mp4` });
  }
}
cands.sort((a, b) => a.from - b.from);

const brollMiss = [];
const broll = [];
for (let i = 0; i < cands.length; i++) {
  const c = cands[i];
  if (inComponent(c.from)) { brollMiss.push(`${c.name} (cae dentro de un componente)`); continue; }
  const nextBroll = i + 1 < cands.length ? cands[i + 1].from : Infinity;
  let dur = Math.min(CAP, nextBroll - c.from, nextComponentStart(c.from) - c.from);
  if (dur < MIN) { brollMiss.push(`${c.name} (sliver ${dur}f)`); continue; }
  broll.push({ from: c.from, dur, kind: c.kind, src: c.src });
}

const durationInFrames = Math.round((caps[caps.length - 1].endMs / 1000) * FPS) + sec(1);

const cues = {
  slug: SLUG, fps: FPS, width: 1920, height: 1080,
  durationInFrames,
  broll,
  components,
};

const outFile = path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`);
fs.writeFileSync(outFile, JSON.stringify(cues, null, 2));

console.log(`✓ ${components.length}/${beats.length} componentes anclados`);
if (misses.length) console.log("✗ componentes NO encontrados:\n  - " + misses.join("\n  - "));
console.log(`✓ ${broll.length} beats de b-roll`);
if (brollMiss.length) console.log("· b-roll descartado:\n  - " + brollMiss.join("\n  - "));
console.log(`✓ durationInFrames = ${durationInFrames} (${(durationInFrames / FPS / 60).toFixed(1)} min)`);
console.log(`✓ ${path.relative(ROOT, outFile)}`);
const tipos = [...new Set(components.map((c) => c.comp))];
console.log(`✓ ${tipos.length} tipos distintos: ${tipos.join(", ")}`);
