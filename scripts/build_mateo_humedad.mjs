/**
 * BUILD "mateo-humedad" (Canal Constructor · Mateo #2: la humedad que sube). Tema EARTH.
 * Estilo El Constructor Libre (análisis 2026-09-27): cada frase clave → UNA imagen realista que muestra exactamente eso,
 * sostenida hasta la frase siguiente (planos largos, Ken Burns casi quieto). Sin clips de video (Agnes metía errores físicos).
 * Audio master = Fish (voz mateo). Avatar = on-cam concatenado cortado DEL MISMO master (lip-sync exacto).
 *   node scripts/build_mateo_humedad.mjs        (PLAN=1 → no exige que existan las imágenes)
 * Salidas: src/VideoEdit/data/cues_mateo-humedad.json + _v3/mateo-humedad_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
import { SHOTS } from "../_v3/mateo-humedad_shots.mjs";
const ROOT = process.cwd();
const SLUG = "mateo-humedad";
const FPS = 30;
const T = "earth";
const QR = "img/qr_mateo.png";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const toks = []; caps.forEach((w, i) => norm(w.text).split(" ").filter(Boolean).forEach((t) => toks.push({ t, i })));
const find = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let k = 0; k + N <= toks.length; k++) { let ok = 1; for (let j = 0; j < N; j++) if (toks[k + j].t !== t[j]) { ok = 0; break; } if (ok) return [toks[k].i, toks[k + N - 1].i]; } return null; };
const at = (p) => { const r = find(p); return r ? Math.round(caps[r[0]].startMs / 1000 * FPS) : null; };
const atEnd = (p, minF = 0) => { const t = norm(p).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let k = 0; k + N <= toks.length; k++) { if (caps[toks[k].i].startMs / 1000 * FPS < minF) continue; let ok = 1; for (let j = 0; j < N; j++) if (toks[k + j].t !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[toks[k + N - 1].i].endMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1.5);
const IMG = (n) => `img/${SLUG}_s${String(n).padStart(2, "0")}.png`;

// ---------- AVATAR on-camera (~12-15%) ----------
const MAXWIN = sec(35);
const avatarBeats = [
  ["mira la parte de abajo", "a la altura del zocalo"],
  ["soy mateo esta semana estuve", "esa pared cuatro veces"],
  ["antes de seguir una cosa", "sigamos"],
  ["si es la numero uno", "sigue conmigo"],
  ["si quieres las medidas exactas", "en la descripcion"],
  ["y cuentame en los comentarios", "__END__"],
];
const avatarSegs = []; const avatarCuts = []; const avatarMiss = [];
let clip = 0;
for (const [aS, aE] of avatarBeats) {
  let from = at(aS); if (from != null && from < sec(0.5)) from = 0; let end = aE === "__END__" ? durationInFrames - sec(0.5) : atEnd(aE, from);
  if (from == null || end == null || end <= from) { avatarMiss.push(`${aS} → ${aE}`); continue; }
  end = Math.min(end + sec(0.25), durationInFrames);
  let dur = Math.min(end - from, MAXWIN);
  if (dur < sec(2)) { avatarMiss.push(`${aS} (corto)`); continue; }
  const AVAF_LIM = process.env.AVAF_SEC ? Math.floor(+process.env.AVAF_SEC * FPS) - 2 : Infinity;
  if (clip + dur > AVAF_LIM) dur = AVAF_LIM - clip;
  const L = avatarSegs[avatarSegs.length - 1];
  if (L && from - (L.from + L.dur) < sec(0.8)) { const add = from + dur - (L.from + L.dur); L.dur += add; clip += add; const C = avatarCuts[avatarCuts.length - 1]; C.endSec = +((L.from + L.dur) / FPS).toFixed(3); C.durSec = +(L.dur / FPS).toFixed(3); continue; }
  avatarSegs.push({ from, dur, clip });
  avatarCuts.push({ startSec: +(from / FPS).toFixed(3), endSec: +((from + dur) / FPS).toFixed(3), durSec: +(dur / FPS).toFixed(3) });
  clip += dur;
}
const avatarRanges = avatarSegs.map((s) => [s.from, s.from + s.dur]);
const inAvatar = (f) => avatarRanges.some(([a, b]) => f >= a - sec(0.3) && f < b + sec(0.3));

// ---------- COMPONENTES full-screen (tarjetas de frase oscuras + crema, como la referencia) ----------
const compBeats = [
  ["pintar encima no sirve", 5, "PhraseCard", { theme: T, src: IMG(6), eyebrow: "Lo primero que tienes que saber", phrase: "Pintar encima no sirve. Nunca sirvió.", accent: "no sirve" }],
  ["chupa agua del terreno y", 6, "BigStat", { theme: T, eyebrow: "Capilaridad", value: 1, suffix: " metro", support: "hasta ahí puede subir el agua del suelo por la pared" }],
  ["cuando llega a la superficie", 9, "Steps", { theme: T, eyebrow: "El polvo blanco", title: "De dónde sale el salitre", steps: [{ title: "El agua sube con sales de la tierra", sub: "disueltas, no se ven" }, { title: "Llega a la superficie y se evapora", sub: "la sal se queda ahí" }, { title: "La sal cristaliza y empuja", sub: "infla la pintura y rompe el revoque" }] }],
  ["el agua sigue subiendo igual", 8, "MythVsTruth", { theme: T, myth: "Una buena pintura antihumedad lo frena.", truth: "La pintura plástica le tapa la salida: el agua sigue subiendo, y más alto." }],
  ["mucha gente empeora su pared", 6, "PhraseCard", { theme: T, src: IMG(28), eyebrow: "El error más común", phrase: "Mucha gente empeora su pared tratando de arreglarla.", accent: "empeora" }],
  ["eso es vapor de la", 11, "Checklist", { theme: T, title: "¿Qué humedad tienes?", items: ["Mancha pareja abajo, borde como ola y salitre → sube del piso", "Un solo lugar que crece y está mojado → caño roto", "Moho negro arriba y en esquinas → condensación"] }],
  ["y es gratis", 7, "Checklist", { theme: T, title: "Mira afuera primero", items: ["Tierra o cantero apoyado contra la pared", "Patio o vereda más altos que el piso de adentro", "Canaleta que tira el agua al pie de la pared"], stamp: "¡Gratis!" }],
  ["no la atravieses", 10, "Steps", { theme: T, eyebrow: "La barrera", title: "Dónde van los agujeros", steps: [{ title: "Línea a 15 cm del piso", sub: "toda la pared con humedad y un poco más a cada lado" }, { title: "Mecha de 10-12 mm, cada 10-12 cm", sub: "sopla bien el polvo de cada agujero" }, { title: "Inclinados a 45° hacia abajo", sub: "profundos: 2/3 del ancho, sin atravesar" }] }],
  ["la pared no se seca", 4.5, "PhraseCard", { theme: T, src: IMG(56), eyebrow: "Lo que nadie te dice", phrase: "La pared no se seca al otro día.", accent: "no se seca" }],
  ["nunca mas un plastico que", 9, "Checklist", { theme: T, title: "Mientras la pared se seca", items: ["No pintes: paciencia", "Salitre con cepillo seco, nunca con agua", "Revoque podrido: rehacer a la cal", "Pintura a la cal o mineral, que respire"] }],
  ["hecho por ti es un", 7, "Compare", { theme: T, title: "La cuenta", left: { label: "Empresa con inyecciones", sub: "una fortuna" }, right: { label: "Hecho por ti", sub: "taladro prestado, silicato, botellas y paciencia" } }],
  ["repasemos los errores que empeoran", 13, "Checklist", { theme: T, title: "Los 5 errores que empeoran la pared", items: ["Pintar encima con pintura plástica", "Lavar el salitre con agua", "Tapar con cerámica", "No revisar si es un caño roto", "Pintar antes de que la pared se seque"], stamp: "¡Anótalo!" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } const nxA = avatarSegs.map((s) => s.from).filter((x) => x > from).sort((x, y) => x - y)[0]; const dd = Math.min(sec(d), nxA != null ? nxA - from : Infinity); components.push({ from, dur: dd, comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS ----------
const QRP = { theme: T, corner: "bl", src: QR, eyebrow: "ESCANEA EL CÓDIGO", label: "El Manual del Maestro" };
const ovBeats = [
  ["soy mateo esta semana estuve", 5, "LowerThird", { theme: T, accentText: "15 AÑOS DE OBRA", title: "Mateo", sub: "arreglos de la casa que duran" }],
  ["primero entiende que esta pasando", 4.5, "SectionTitle", { theme: T, eyebrow: "EL PROBLEMA", title: "El agua sube por la pared" }],
  ["eso se llama capilaridad", 4, "KeywordPop", { theme: T, word: "CAPILARIDAD", sub: "la pared chupa agua del suelo", pos: "top" }],
  ["hace esta prueba cierra todas", 7, "Callout", { theme: T, icon: "💧", title: "La prueba del medidor", sub: "cierra todas las canillas: si la ruedita gira, hay una pérdida", tone: "info" }],
  ["se usa silicato silicato de", 4.5, "SectionTitle", { theme: T, eyebrow: "LA SOLUCIÓN", title: "Una barrera de silicato" }],
  ["guantes y antiparras siempre", 6, "Callout", { theme: T, icon: "⚠️", title: "Guantes y antiparras", sub: "el silicato es alcalino: irrita la piel y es peligroso en los ojos", tone: "warn" }],
  ["un centimetro por mes", 5, "KeywordPop", { theme: T, word: "1 CM POR MES", sub: "la pared se seca de a poco", pos: "top" }],
  // ---- QR ----
  ["antes de seguir una cosa", 8, "QRTag", QRP],
  ["ahora la cuenta un tratamiento", 7, "QRTag", QRP],
  ["si quieres las medidas exactas", 8, "QRTag", QRP],
  ["repasemos los errores que empeoran", 7, "QRTag", QRP],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

// ---------- B-ROLL: una imagen por frase, sostenida hasta la frase siguiente ----------
const shots = SHOTS.map(([a], i) => ({ n: i + 1, a, from: at(a), src: IMG(i + 1) }))
  .filter((s) => process.env.PLAN || fs.existsSync(path.join(ROOT, "public", s.src)));
const shotMiss = shots.filter((s) => s.from == null).map((s) => s.n + ":" + s.a);
const seq = shots.filter((s) => s.from != null).sort((a, b) => a.from - b.from);
const blocked = [...avatarRanges, ...compRanges].sort((a, b) => a[0] - b[0]);
const merged = [];
for (const r of blocked) { if (merged.length && r[0] <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]); else merged.push([r[0], r[1]]); }
const free = []; let cur = 0;
for (const [a, b] of merged) { if (a > cur) free.push([cur, a]); cur = Math.max(cur, b); }
if (cur < durationInFrames) free.push([cur, durationInFrames]);
const MAXHOLD = sec(11), MINB = sec(1.6);
const broll = []; const used = new Set(); let n = 0;
for (const [a, b] of free) {
  if (b - a < sec(0.6)) { const pc = components.find((c) => c.from + c.dur === a); if (pc) { pc.dur += b - a; continue; } }
  // tomas cuyo ancla cae en esta ventana; si la ventana arranca antes del primer ancla, sigue la última imagen anterior o la próxima sin usar
  const inside = seq.filter((s) => s.from >= a && s.from < b);
  const before = seq.filter((s) => s.from < a);
  const cuts = inside.map((s) => ({ f: s.from, s }));
  if (!cuts.length || cuts[0].f - a >= MINB) {
    const prevUnused = before.slice().reverse().find((s) => !used.has(s.n));
    const lead = prevUnused || before[before.length - 1] || inside[0] || seq.find((s) => s.from >= b);
    if (lead) cuts.unshift({ f: a, s: lead });
  } else cuts[0].f = a;
  for (let i = 0; i < cuts.length; i++) {
    const f0 = cuts[i].f, f1 = i + 1 < cuts.length ? cuts[i + 1].f : b;
    if (f1 - f0 < MINB && broll.length && i > 0) { broll[broll.length - 1].dur += f1 - f0; continue; }
    let f = f0; let s = cuts[i].s;
    while (f1 - f >= 1) {
      let d = Math.min(f1 - f, MAXHOLD);
      if (f1 - f - d > 0 && f1 - f - d < MINB) d = f1 - f;
      broll.push({ from: f, dur: d, kind: "image", src: s.src, kb: n % 6, pip: false });
      used.add(s.n); n++; f += d;
      if (f1 - f >= 1) { const nx = seq.filter((x) => !used.has(x.n) && x.from < f && x.from > f - sec(30)).pop(); if (nx) s = nx; }
    }
  }
}

while (broll.length && broll[broll.length - 1].dur < sec(0.6)) broll.pop(); // cola final: mejor negro que un flash
const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, audioSrc: `${SLUG}.mp3`, avatarSrc: `${SLUG}_avatar.mp4`, avatarSegs, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
fs.writeFileSync(path.join(ROOT, "_v3", `${SLUG}_avatarcuts.json`), JSON.stringify(avatarCuts, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const avf = avatarSegs.reduce((s, a) => s + a.dur, 0);
const cf = components.reduce((s, c) => s + c.dur, 0);
const durs = broll.map((b) => b.dur / FPS);
console.log(`avatar ${avatarSegs.length}/${avatarBeats.length} segs ${Math.round(avf / FPS)}s = ${Math.round(avf / durationInFrames * 100)}%${avatarMiss.length ? " MISS: " + avatarMiss.join(" | ") : ""}`);
console.log(`componentes ${components.length}/${compBeats.length} ${Math.round(cf / FPS)}s${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`overlays ${overlays.length}/${ovBeats.length} (QR ${overlays.filter((o) => o.comp === "QRTag").length})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`b-roll ${broll.length} planos ${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}% · imágenes usadas ${used.size}/${SHOTS.length} · plano medio ${(durs.reduce((a, b) => a + b, 0) / durs.length).toFixed(1)}s (min ${Math.min(...durs).toFixed(1)} max ${Math.max(...durs).toFixed(1)})`);
if (shotMiss.length) console.log("TOMAS SIN ANCLA: " + shotMiss.join(" | "));
const unused = SHOTS.map((_, i) => i + 1).filter((k) => !used.has(k));
if (unused.length) console.log("no usadas: " + unused.join(","));
console.log(`TOTAL ${(durationInFrames / FPS / 60).toFixed(1)} min`);
