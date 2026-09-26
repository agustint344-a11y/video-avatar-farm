/**
 * BUILD "nonna-arroz" (La Nonna Cocina · video #2: el arroz). Tema EARTH.
 * Audio master = Fish (voz nonna). Avatar = on-cam concatenado cortado DEL MISMO master (lip-sync exacto).
 * B-roll = imágenes Agnes por sección (_v3/nonna-pasta_plan.json) con Ken Burns variado.
 *   node scripts/build_nonna_arroz.mjs
 * Salidas: src/VideoEdit/data/cues_nonna-arroz.json + _v3/nonna-arroz_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "nonna-arroz";
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

// ---------- AVATAR on-camera (~25%, habla casual) ----------
const MAXWIN = sec(40);
const avatarBeats = [
  ["a ver ven acercate un", "se agarraba la cabeza"],                    // hook
  ["bueno en el video pasado", "te arruinan la olla"],                    // promesa
  ["y aqui te quiero contar", "el que mas me gusta"],                     // CTA1
  ["bueno y ahora viene el", "yo tambien de joven"],                      // antes del error 5
  ["ya se ya se te dan", "si lo despiertas llora"],                       // bebé dormido
  ["el arroz no se apura", "lo mas bajito que tenga"],                    // fuego
  ["ay caramia por fuera crujiente", "que otros tiran"],                           // arancini remate
  ["si quieres todo esto escrito", "en el primer comentario"],            // CTA3
  ["y cuentame en los comentarios", "__END__"],                           // cierre
];
const avatarSegs = []; const avatarCuts = []; const avatarMiss = [];
let clip = 0;
for (const [aS, aE] of avatarBeats) {
  const from = at(aS); let end = aE === "__END__" ? durationInFrames - sec(0.5) : atEnd(aE, from);
  if (from == null || end == null || end <= from) { avatarMiss.push(`${aS} → ${aE}`); continue; }
  end = Math.min(end + sec(0.25), durationInFrames);
  let dur = Math.min(end - from, MAXWIN);
  if (dur < sec(2)) { avatarMiss.push(`${aS} (corto)`); continue; }
  const AVAF_LIM = process.env.AVAF_SEC ? Math.floor(+process.env.AVAF_SEC * FPS) - 2 : Infinity; // largo real del mp4 de avatar
  if (clip + dur > AVAF_LIM) dur = AVAF_LIM - clip;
  avatarSegs.push({ from, dur, clip });
  avatarCuts.push({ startSec: +(from / FPS).toFixed(3), endSec: +((from + dur) / FPS).toFixed(3), durSec: +(dur / FPS).toFixed(3) });
  clip += dur;
}
const avatarRanges = avatarSegs.map((s) => [s.from, s.from + s.dur]);
const inAvatar = (f) => avatarRanges.some(([a, b]) => f >= a - sec(0.3) && f < b + sec(0.3));

// ---------- COMPONENTES full-screen ----------
const compBeats = [
  ["ese arroz tiene un polvito", 7, "MythVsTruth", { theme: T, myth: "El arroz va directo del paquete a la olla.", truth: "Tiene un polvito de almidón que se hace engrudo. Lávalo hasta que el agua salga clarita." }],
  ["si vas a hacer un risotto", 7, "Compare", { theme: T, title: "¿Se lava o no se lava?", left: { label: "Arroz blanco suelto", sub: "sí: hasta que el agua salga clara" }, right: { label: "Risotto", sub: "nunca: queremos ese almidón" } }],
  ["para el arroz blanco comun", 8, "BigStat", { theme: T, eyebrow: "Por cada taza de arroz", value: 1.75, suffix: " tazas", support: "de agua · y mira siempre el paquete" }],
  ["y la sal una cucharadita", 5, "Checklist", { theme: T, title: "La medida de la nonna", items: ["1 taza de arroz", "1 ¾ tazas de agua", "1 cucharadita rasa de sal"] }],
  ["mi mama antes de echar", 9, "Steps", { theme: T, eyebrow: "Error 3", title: "Tostar antes del agua", steps: [{ title: "Un chorrito de aceite", sub: "poquito" }, { title: "Medio diente de ajo aplastado", sub: "en el aceite tibio" }, { title: "El arroz lavado, 2 minutos", sub: "revolviendo hasta que se ponga transparente" }] }],
  ["si ya tostaste el arroz", 7, "Compare", { theme: T, title: "El agua", left: { label: "Fría", sub: "se corta el hervor · queda harinoso" }, right: { label: "Caliente", sub: "sigue hirviendo · sale suelto" } }],
  ["cuando el agua hierve bajas", 7, "Timeline", { theme: T, eyebrow: "Error 5", title: "No se toca", steps: [{ when: "Hierve", text: "Fuego al mínimo y tapa" }, { when: "16-18 min", text: "Sin destapar ni revolver" }, { when: "Apagar", text: "5 minutos más tapado" }] }],
  ["y si tu tapa no cierra", 6, "Callout", { theme: T, icon: "⚠️", title: "Un trapo entre la olla y la tapa", sub: "con las puntas dobladas arriba, lejos del fuego", tone: "warn" }],
  ["y recien ahi destapas", 4, "BigStat", { theme: T, eyebrow: "El secreto", value: 5, suffix: " min", support: "de reposo tapado · y lo sueltas con un tenedor" }],
  ["mira el arroz frio del", 9, "Steps", { theme: T, eyebrow: "Con el arroz que sobra", title: "Los arancini de mi mamma", steps: [{ title: "Arroz frío + 1 huevo + queso", sub: "del día anterior" }, { title: "Bolita con queso adentro", sub: "con las manos mojadas" }, { title: "Huevo, pan rallado y a la sartén", sub: "hasta que se dore" }] }],
  ["el arroz que sobra no", 6, "Callout", { theme: T, icon: "🧊", title: "El arroz que sobra", sub: "apenas se enfría, tapado al refrigerador · no lo dejes horas afuera", tone: "warn" }],
  ["uno lava el arroz blanco", 12, "Checklist", { theme: T, title: "Los 7 errores del arroz", items: ["Lavarlo (menos el del risotto)", "1 taza de arroz · 1 ¾ de agua", "Tostarlo con aceite y ajo", "Agua caliente, nunca fría", "Tapa y no tocar: 16-18 min", "Fuego al mínimo", "5 min de reposo y tenedor"], stamp: "¡Anótalo!" }],
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
  ["me escribieron de mexico", 5, "LowerThird", { theme: T, accentText: "LA NONNA COCINA", title: "Nonna Lucía", sub: "hoy: el arroz" }],
  ["el error numero uno no", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 1", title: "No lavarlo" }],
  ["el error numero dos la", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 2", title: "La medida del agua" }],
  ["el error numero tres echar", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 3", title: "No tostarlo" }],
  ["senacara le decimos", 4, "KeywordPop", { theme: T, word: "SE NACARA", sub: "cada grano con su abriguito", pos: "top" }],
  ["el error numero cuatro el", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 4", title: "El agua fría" }],
  ["el error numero cinco destapar", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 5", title: "Destapar y revolver" }],
  ["el error numero seis el", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 6", title: "El fuego alto" }],
  ["el error numero siete servirlo", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 7", title: "Servirlo enseguida" }],
  ["lo metes y lo vas", 4, "KeywordPop", { theme: T, word: "CON TENEDOR", sub: "como si lo peinaras", pos: "top" }],
  // ---- QR: los 3 CTAs + 2 extra ----
  ["y aqui te quiero contar", 8, "QRTag", QRP],
  ["y fijate que esto del", 8, "QRTag", QRP],
  ["si quieres todo esto escrito", 8, "QRTag", QRP],
  ["repasemos que se que algunos", 7, "QRTag", QRP],
  ["porque en mi casa nada", 7, "QRTag", QRP],
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
