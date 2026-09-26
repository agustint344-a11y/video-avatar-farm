/**
 * BUILD "mateo-azotea" (Canal Constructor · Mateo #1: la azotea). Tema EARTH.
 * Audio master = Fish (voz nonna). Avatar = on-cam concatenado cortado DEL MISMO master (lip-sync exacto).
 * B-roll = imágenes Agnes por sección (_v3/nonna-pasta_plan.json) con Ken Burns variado.
 *   node scripts/build_mateo_azotea.mjs
 * Salidas: src/VideoEdit/data/cues_mateo-azotea.json + _v3/mateo-azotea_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "mateo-azotea";
const FPS = 30;
const T = "earth";
const QR = "img/qr_mateo.png";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
// captions por palabra (whisper puede pegar signos o partir palabras): aplanar a tokens
const toks = []; caps.forEach((w, i) => norm(w.text).split(" ").filter(Boolean).forEach((t) => toks.push({ t, i })));
const find = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let k = 0; k + N <= toks.length; k++) { let ok = 1; for (let j = 0; j < N; j++) if (toks[k + j].t !== t[j]) { ok = 0; break; } if (ok) return [toks[k].i, toks[k + N - 1].i]; } return null; };
const at = (p) => { const r = find(p); return r ? Math.round(caps[r[0]].startMs / 1000 * FPS) : null; };
const atEnd = (p, minF = 0) => { const t = norm(p).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let k = 0; k + N <= toks.length; k++) { if (caps[toks[k].i].startMs / 1000 * FPS < minF) continue; let ok = 1; for (let j = 0; j < N; j++) if (toks[k + j].t !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[toks[k + N - 1].i].endMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1.5);

// ---------- AVATAR on-camera (~15%, como la referencia pero un poco más presente) ----------
const MAXWIN = sec(35);
const avatarBeats = [
  ["sube un segundo a tu", "tu cuarto ese rincon de"],                 // gancho inicial corto
  ["yo soy mateo trabajo de", "aprendi a los golpes"],               // presentación (si falla, sigue)
  ["pero te voy a decir", "con monedas"],                               // honestidad
  ["y esto que te voy a", "asi que quedate"],                           // retención
  ["antes de seguir una cosa", "sigamos"],                              // CTA1
  ["y por favor cuando trabajes", "vale una caida"],                    // seguridad
  ["si quieres las medidas exactas", "en la descripcion"],              // CTA final
  ["y cuentame en los comentarios", "__END__"],                         // cierre
];
const avatarSegs = []; const avatarCuts = []; const avatarMiss = [];
let clip = 0;
for (const [aS, aE] of avatarBeats) {
  const from = at(aS); let end = aE === "__END__" ? durationInFrames - sec(0.5) : atEnd(aE, from);
  if (from == null || end == null || end <= from) { avatarMiss.push(`${aS} → ${aE}`); continue; }
  end = Math.min(end + sec(0.25), durationInFrames);
  let dur = Math.min(end - from, MAXWIN);
  if (dur < sec(2)) { avatarMiss.push(`${aS} (corto)`); continue; }
  const AVAF_LIM = process.env.AVAF_SEC ? Math.floor(+process.env.AVAF_SEC * FPS) - 2 : Infinity;
  if (clip + dur > AVAF_LIM) dur = AVAF_LIM - clip;
  avatarSegs.push({ from, dur, clip });
  avatarCuts.push({ startSec: +(from / FPS).toFixed(3), endSec: +((from + dur) / FPS).toFixed(3), durSec: +(dur / FPS).toFixed(3) });
  clip += dur;
}
const avatarRanges = avatarSegs.map((s) => [s.from, s.from + s.dur]);
const inAvatar = (f) => avatarRanges.some(([a, b]) => f >= a - sec(0.3) && f < b + sec(0.3));

// ---------- COMPONENTES full-screen ----------
const compBeats = [
  ["y adentro de la losa", 8, "Steps", { theme: T, eyebrow: "Lo que no ves", title: "Cómo se rompe una losa", steps: [{ title: "El agua entra por los poros", sub: "cada vez que llueve" }, { title: "El hierro de adentro se oxida", sub: "y el óxido ocupa mucho más lugar" }, { title: "Empuja y rompe el cemento", sub: "grietas y hierro a la vista" }] }],
  ["por que falla la pintura", 7, "MythVsTruth", { theme: T, myth: "La pintura de la ferretería es mala.", truth: "Casi siempre se pone mal: sobre losa sucia o húmeda. El agua atrapada hace vapor, se infla y se pela." }],
  ["lo que hago yo primero", 9, "Checklist", { theme: T, title: "Preparar la azotea", items: ["Barrer todo", "Raspar el musgo", "Lavar con agua y detergente", "Secar 1-2 días de sol", "Tapar antes las grietas grandes"] }],
  ["las proporciones que uso yo", 9, "Steps", { theme: T, eyebrow: "La mezcla", title: "Para una tanda chica", steps: [{ title: "4 litros de agua + 1 litro de resina acrílica", sub: "al agua, transparente" }, { title: "Cemento blanco de a poco", sub: "unas 10 tazas: textura de pintura espesa" }, { title: "Una cucharada de detergente", sub: "ayuda a que entre en los poros" }] }],
  ["muy importante guantes y antiparras", 6, "Callout", { theme: T, icon: "⚠️", title: "Guantes y antiparras", sub: "el cemento es muy alcalino: quema la piel y los ojos", tone: "warn" }],
  ["y otra cosa prepara solo", 6, "BigStat", { theme: T, eyebrow: "Empieza a fraguar", value: 1, suffix: " hora", support: "prepara solo lo que vas a usar en la próxima hora" }],
  ["mojas apenas la losa con", 9, "Timeline", { theme: T, eyebrow: "La aplicación", title: "El horario importa", steps: [{ when: "Mañana temprano", text: "Losa fresca y apenas húmeda: 1ª mano con secador de goma y rodillo" }, { when: "Tarde", text: "2ª mano cruzada, cuando baja el sol" }, { when: "2-3 días", text: "Rocío de agua fina a la tarde: curar" }] }],
  ["un balde de impermeabilizante de", 7, "Compare", { theme: T, title: "La cuenta", left: { label: "Balde de marca", sub: "caro · hay que volver a ponerlo" }, right: { label: "Cemento + resina", sub: "mucho más barato · te sobra para retocar" } }],
  ["cuanto dura bien hecha", 8, "Checklist", { theme: T, title: "Lo que siempre me preguntan", items: ["¿Cuánto dura? Varios años: revísala 1 vez al año", "¿En chapa? No: solo cemento, ladrillo, revoque", "¿Color? Sí, con colorante; el blanco es el más fresco", "¿Pintura vieja? Sacar todo lo que se pela"] }],
  ["uno pintar sobre una losa", 10, "Checklist", { theme: T, title: "Los 5 errores que arruinan todo", items: ["Pintar sobre la losa sucia", "Pintar sobre la losa mojada", "Aplicar al mediodía con la losa caliente", "Preparar más mezcla de la que usas en 1 hora", "No curarla (secado de golpe)"], stamp: "¡Anótalo!" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS ----------
const QRP = { theme: T, corner: "bl", src: QR, eyebrow: "ESCANEA EL CÓDIGO", label: "El Manual del Maestro" };
const ovBeats = [
  ["yo soy mateo trabajo de", 5, "LowerThird", { theme: T, accentText: "15 AÑOS DE OBRA", title: "Mateo", sub: "arreglos de la casa que duran" }],
  ["el error que arruina todo", 4.5, "SectionTitle", { theme: T, eyebrow: "EL ERROR N°1", title: "No preparar la superficie" }],
  ["bueno ahora si la mezcla", 4.5, "SectionTitle", { theme: T, eyebrow: "LA MEZCLA", title: "Lechada reforzada" }],
  ["ahora como se aplica y", 4.5, "SectionTitle", { theme: T, eyebrow: "PASO A PASO", title: "Cómo se aplica" }],
  ["cuando esto esta bien curado", 4, "KeywordPop", { theme: T, word: "EL AGUA CORRE", sub: "ya no se queda en la losa", pos: "top" }],
  ["y por que no te la", 5, "Callout", { theme: T, icon: "💡", title: "¿Por qué no te la venden?", sub: "nadie gana vendiéndote cemento y resina para que los mezcles tú", tone: "info" }],
  // ---- QR ----
  ["antes de seguir una cosa", 8, "QRTag", QRP],
  ["un balde de impermeabilizante de", 7, "QRTag", QRP],
  ["si quieres las medidas exactas", 8, "QRTag", QRP],
  ["repasemos los errores que arruinan", 7, "QRTag", QRP],
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
