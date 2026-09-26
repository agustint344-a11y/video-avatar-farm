/**
 * BUILD "nonna-ducha" (La Casa de la Nonna · video #1: ducha y bañera). Tema EARTH.
 * Audio master = Fish (voz nonna). Avatar = on-cam concatenado cortado DEL MISMO master (lip-sync exacto).
 * B-roll = imágenes Agnes por sección (_v3/nonna-pasta_plan.json) con Ken Burns variado.
 *   node scripts/build_nonna_ducha.mjs
 * Salidas: src/VideoEdit/data/cues_nonna-ducha.json + _v3/nonna-ducha_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "nonna-ducha";
const FPS = 30;
const T = "earth";
const QR = "img/qr_nonna.png";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
// captions por palabra (whisper puede pegar signos o partir palabras): aplanar a tokens
const toks = []; caps.forEach((w, i) => norm(w.text).split(" ").filter(Boolean).forEach((t) => toks.push({ t, i })));
const find = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let k = 0; k + N <= toks.length; k++) { let ok = 1; for (let j = 0; j < N; j++) if (toks[k + j].t !== t[j]) { ok = 0; break; } if (ok) return [toks[k].i, toks[k + N - 1].i]; } return null; };
const at = (p) => { const r = find(p); return r ? Math.round(caps[r[0]].startMs / 1000 * FPS) : null; };
const atEnd = (p, minF = 0) => { const t = norm(p).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let k = 0; k + N <= toks.length; k++) { if (caps[toks[k].i].startMs / 1000 * FPS < minF) continue; let ok = 1; for (let j = 0; j < N; j++) if (toks[k + j].t !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[toks[k + N - 1].i].endMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1.5);

// ---------- AVATAR on-camera (minoría ~22%) ----------
const MAXWIN = sec(40);
const avatarBeats = [
  ["mira la junta de tu ducha", "limpiando al reves"],                     // hook
  ["y te lo digo con carino", "durante anos"],                             // empatía
  ["hoy te voy a ensenar la", "lo que nadie te dice"],                     // promesa
  ["todo esto que te voy a", "empieza lo bueno"],                          // CTA1
  ["y ahora cara mia una advertencia", "escuches bien"],                   // advertencia
  ["pero te tengo que decir la", "en el mundo que lo"],                       // la verdad
  ["y ahora cara mia lo que", "despues de cada ducha"],                    // el secreto
  ["si quieres la lista completa", "en el primer comentario"],             // CTA3
  ["cuentame en los comentarios", "__END__"],                              // cierre
];
const avatarSegs = []; const avatarCuts = []; const avatarMiss = [];
let clip = 0;
for (const [aS, aE] of avatarBeats) {
  const from = at(aS); let end = aE === "__END__" ? durationInFrames - sec(0.5) : atEnd(aE, from);
  if (from == null || end == null || end <= from) { avatarMiss.push(`${aS} → ${aE}`); continue; }
  end = Math.min(end + sec(0.25), durationInFrames);
  let dur = Math.min(end - from, MAXWIN);
  if (dur < sec(2)) { avatarMiss.push(`${aS} (corto)`); continue; }
  avatarSegs.push({ from, dur, clip });
  avatarCuts.push({ startSec: +(from / FPS).toFixed(3), endSec: +((from + dur) / FPS).toFixed(3), durSec: +(dur / FPS).toFixed(3) });
  clip += dur;
}
const avatarRanges = avatarSegs.map((s) => [s.from, s.from + s.dur]);
const inAvatar = (f) => avatarRanges.some(([a, b]) => f >= a - sec(0.3) && f < b + sec(0.3));

// ---------- COMPONENTES full-screen ----------
const compBeats = [
  ["porque no es una sola", 9, "Steps", { theme: T, eyebrow: "No es una mugre, son tres", title: "Lo que estás limpiando", steps: [{ title: "La grasa", sub: "del cuerpo y del jabón · la línea gris" }, { title: "El sarro", sub: "el calcio del agua · manchas blancas" }, { title: "El moho", sub: "los puntitos negros" }] }],
  ["y aqui esta el error de", 8, "Compare", { theme: T, title: "Cada mugre pide lo contrario", left: { label: "Grasa", sub: "se va con bicarbonato (alcalino)" }, right: { label: "Sarro", sub: "se va con vinagre o limón (ácido)" } }],
  ["quita todo de la ducha", 7, "Checklist", { theme: T, title: "Paso 1 · En seco", items: ["Saca frascos y esponjas", "Quita la cortina", "Barre pelos y polvo", "Recién ahí, agua"] }],
  ["en un platito hondo pones", 8, "Steps", { theme: T, eyebrow: "Paso 3", title: "La pasta de la nonna", steps: [{ title: "½ taza de bicarbonato", sub: "en un platito hondo" }, { title: "Unas gotas de detergente", sub: "+ un chorrito de agua" }, { title: "Frota en círculos", sub: "con el lado verde de la esponja" }] }],
  ["y lo mas importante esperas", 7, "BigStat", { theme: T, eyebrow: "El vinagre funciona esperando", value: 10, suffix: " min", support: "como mínimo antes de frotar" }],
  ["ni en el mismo balde", 8, "MythVsTruth", { theme: T, mythLabel: "Nunca", truthLabel: "Siempre", myth: "Vinagre + cloro / lejía / blanqueador: sueltan un gas que quema los pulmones.", truth: "Una cosa por vez, enjuagando entre una y otra, con la ventana abierta." }],
  ["y otra cosa el vinagre no", 7, "Checklist", { theme: T, title: "El vinagre NO va en…", items: ["Mármol", "Granito y piedra natural", "Madera encerada"], stamp: "Agua tibia + jabón neutro" }],
  ["para las juntas grises las", 8, "Steps", { theme: T, eyebrow: "Paso 5", title: "Las juntas", steps: [{ title: "Pasta de bicarbonato", sub: "con un cepillo de dientes viejo" }, { title: "Un rociado de vinagre", sub: "hace espuma y levanta la mugre" }, { title: "Cepilla a lo largo y enjuaga", sub: "vuelve el color original" }] }],
  ["el sarro aparece cuando el", 8, "BigStat", { theme: T, eyebrow: "El secreto de la nonna", value: 1, suffix: " minuto", support: "secar después de cada ducha: adiós moho, sarro y grasa" }],
  ["en la casa de mi mama el", 7, "PullQuote", { theme: T, quote: "El último que se bañaba secaba el baño. Era la regla.", author: "La mamma de la Nonna Lucía" }],
  ["uno en seco primero", 12, "Checklist", { theme: T, title: "La ducha como la nonna", items: ["En seco primero", "Vapor 5 minutos", "Bicarbonato abajo (grasa)", "Vinagre arriba, 10 min (sarro)", "Regadera: bolsa con vinagre", "Juntas: cepillo · moho: agua oxigenada", "Secar después de cada ducha"], stamp: "¡Anótalo!" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS ----------
const QRP = { theme: T, corner: "bl", src: QR, eyebrow: "ESCANEA EL CÓDIGO", label: "El Cuaderno de la Nonna" };
const ovBeats = [
  ["cuando llegue a este continente", 5, "LowerThird", { theme: T, accentText: "LA CASA DE LA NONNA", title: "Nonna Lucía", sub: "la casa como la cuidaba mi mamma" }],
  ["paso 2 el agua caliente", 4.5, "SectionTitle", { theme: T, eyebrow: "PASO 2", title: "El vapor" }],
  ["paso 4 el vinagre para", 4.5, "SectionTitle", { theme: T, eyebrow: "PASO 4", title: "El vinagre para el sarro" }],
  ["le echas la cascara de un", 4, "KeywordPop", { theme: T, word: "CÁSCARA DE LIMÓN", sub: "el vinagre huele a limón", pos: "top" }],
  ["mientras esperas te cuento el", 4.5, "SectionTitle", { theme: T, eyebrow: "EL TRUCO", title: "La regadera" }],
  ["y la dejas toda la noche", 4, "KeywordPop", { theme: T, word: "TODA LA NOCHE", sub: "la bolsa con vinagre puro", pos: "top" }],
  ["paso cinco las juntas y", 4.5, "SectionTitle", { theme: T, eyebrow: "PASO 5", title: "Las juntas y el moho" }],
  ["la del frasquito marron de", 5, "Callout", { theme: T, icon: "⚠️", title: "Agua oxigenada al 3%", sub: "la común de farmacia · nunca en el mismo frasco que el vinagre", tone: "warn" }],
  ["y el otro secreto el aire", 4, "KeywordPop", { theme: T, word: "AIRE", sub: "puerta abierta · cortina estirada", pos: "top" }],
  // ---- QR: los 3 CTAs + 2 extra ----
  ["todo esto que te voy a", 8, "QRTag", QRP],
  ["y fijate que la tabla de", 8, "QRTag", QRP],
  ["si quieres la lista completa", 8, "QRTag", QRP],
  ["repasemos para que lo anotes", 7, "QRTag", QRP],
  ["paso 3 la pasta de la", 7, "QRTag", QRP],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

// ---------- B-ROLL por sección (imágenes Agnes, sin repetir dentro de la sección) ----------
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_plan.json`), "utf8"));
const secs = plan.map((s) => ({ sec: s.sec, from: at(s.anchor), imgs: s.p.map((_, i) => `${s.sec}${String(i + 1).padStart(2, "0")}`).map((k) => (process.env.PLAN || fs.existsSync(path.join(ROOT, "public", `broll/${SLUG}_v_${k}.mp4`))) ? `broll/${SLUG}_v_${k}.mp4` : `img/${SLUG}_${k}.png`)  .filter((f) => process.env.PLAN || fs.existsSync(path.join(ROOT, "public", f))), used: 0 }));
const secMiss = secs.filter((s) => s.from == null).map((s) => s.sec);
const secsOk = secs.filter((s) => s.from != null).sort((a, b) => a.from - b.from);
secsOk[0].from = 0;
const secAt = (f) => { let cur = secsOk[0]; for (const s of secsOk) if (s.from <= f) cur = s; return cur; };
const blocked = [...avatarRanges, ...compRanges].sort((a, b) => a[0] - b[0]);
const merged = [];
for (const r of blocked) { if (merged.length && r[0] <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]); else merged.push([r[0], r[1]]); }
const free = []; let cur = 0;
for (const [a, b] of merged) { if (a > cur) free.push([cur, a]); cur = Math.max(cur, b); }
if (cur < durationInFrames) free.push([cur, durationInFrames]);
const PACE = [sec(6.0), sec(5.4), sec(6.0), sec(5.7), sec(6.0)]; // clips Agnes de 6 s // variedad, no metrónomo
const MINB = sec(1.6);
const broll = []; let n = 0; const reuse = [];
for (const [a, b] of free) {
  let f = a;
  while (b - f >= MINB) {
    let d = Math.min(PACE[n % PACE.length], b - f);
    if ((b - f - d) > 0 && (b - f - d) < MINB) d = b - f;
    const s = secAt(f);
    let src;
    if (s.used < s.imgs.length) src = s.imgs[s.used++];
    else { // sección agotada: tomar la próxima sección con imágenes libres (vecina), si no, reciclar
      const alt = secsOk.find((x) => x.from > s.from && x.used < x.imgs.length) || secsOk.slice().reverse().find((x) => x.used < x.imgs.length);
      if (alt) src = alt.imgs[alt.used++]; else { src = s.imgs[(s.used++) % s.imgs.length]; reuse.push(src); }
    }
    broll.push({ from: f, dur: d, kind: src.endsWith(".mp4") ? "video" : "image", src, kb: n % 6, pip: false });
    n++; f += d;
  }
}

// diagnóstico: cuántas tomas cayeron en cada sección vs imágenes disponibles
const need = {}; broll.forEach((b) => { const s = secAt(b.from).sec; need[s] = (need[s] || 0) + 1; });
console.log("tomas/imgs por sección: " + secsOk.map((x) => x.sec + ":" + (need[x.sec] || 0) + "/" + x.imgs.length).join(" "));
const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, audioSrc: `${SLUG}.mp3`, avatarSrc: `${SLUG}_avatar.mp4`, avatarSegs, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
fs.writeFileSync(path.join(ROOT, "_v3", `${SLUG}_avatarcuts.json`), JSON.stringify(avatarCuts, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const avf = avatarSegs.reduce((s, a) => s + a.dur, 0);
const cf = components.reduce((s, c) => s + c.dur, 0);
console.log(`avatar ${avatarSegs.length}/${avatarBeats.length} segs ${Math.round(avf / FPS)}s = ${Math.round(avf / durationInFrames * 100)}%${avatarMiss.length ? " MISS: " + avatarMiss.join(" | ") : ""}`);
console.log(`componentes ${components.length}/${compBeats.length} ${Math.round(cf / FPS)}s${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`overlays ${overlays.length}/${ovBeats.length} (QR ${overlays.filter((o) => o.comp === "QRTag").length})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`b-roll ${broll.length} (videos ${broll.filter((b) => b.kind === "video").length}) ${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}% · únicas ${new Set(broll.map((b) => b.src)).size} · recicladas ${reuse.length}${secMiss.length ? " · SECCIONES SIN ANCLA: " + secMiss.join(",") : ""}`);
console.log(`TOTAL ${(durationInFrames / FPS / 60).toFixed(1)} min`);
